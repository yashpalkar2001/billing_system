from uuid import uuid4
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Product, Sale
from app.schemas.sale import SaleCreate, SaleLineCreate, SaleOut, SaleUpdate

router = APIRouter()


@router.get("/", response_model=list[SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return db.scalars(select(Sale).order_by(Sale.date.desc(), Sale.id.desc())).all()


@router.post("/", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    requested = payload.items or (
        [SaleLineCreate(product_id=payload.product_id, qty=payload.qty)]
        if payload.product_id and payload.qty
        else []
    )
    if not requested:
        raise HTTPException(status_code=422, detail="Add at least one product to the bill.")

    quantities = {}
    for line in requested:
        quantities[line.product_id] = quantities.get(line.product_id, 0) + line.qty
    products = {
        product.id: product
        for product in db.scalars(select(Product).where(Product.id.in_(quantities))).all()
    }
    missing = set(quantities) - set(products)
    if missing:
        raise HTTPException(status_code=404, detail="One or more products were not found.")
    for product_id, qty in quantities.items():
        product = products[product_id]
        if payload.status == "Completed" and product.stock < qty:
            raise HTTPException(status_code=409, detail=f"Only {product.stock} units of {product.name} are available.")

    lines = []
    total = Decimal("0.00")
    for product_id, qty in quantities.items():
        product = products[product_id]
        unit_price = Decimal(str(product.price))
        line_total = unit_price * qty
        total += line_total
        lines.append({
            "product_id": product.id,
            "item": product.name,
            "qty": qty,
            "unit_price": float(unit_price),
            "amount": float(line_total),
        })

    sale = Sale(
        transaction_id=f"TXN-{uuid4().hex[:12].upper()}",
        date=payload.date,
        customer=payload.customer.strip() or "Walk-in customer",
        product_id=lines[0]["product_id"] if len(lines) == 1 else None,
        items=lines,
        item=", ".join(f"{line['item']} × {line['qty']}" for line in lines),
        qty=sum(line["qty"] for line in lines),
        unit_price=lines[0]["unit_price"] if len(lines) == 1 else 0,
        amount=total,
        method=payload.method,
        status=payload.status,
    )
    if payload.status == "Completed":
        for product_id, qty in quantities.items():
            products[product_id].stock -= qty
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


def sale_quantities(sale: Sale) -> dict[int, int]:
    if sale.items:
        quantities = {}
        for line in sale.items:
            product_id = line.get("product_id")
            if product_id is not None:
                quantities[product_id] = quantities.get(product_id, 0) + int(line["qty"])
        return quantities
    if sale.product_id is not None:
        return {sale.product_id: sale.qty}
    return {}


@router.put("/{transaction_id}", response_model=SaleOut)
def update_sale(transaction_id: str, payload: SaleUpdate, db: Session = Depends(get_db)):
    sale = db.scalar(select(Sale).where(Sale.transaction_id == transaction_id))
    if sale is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    quantities = sale_quantities(sale)
    products = {
        product.id: product
        for product in db.scalars(select(Product).where(Product.id.in_(quantities))).all()
    } if quantities else {}

    if sale.status == "Completed" and payload.status != "Completed":
        for product_id, qty in quantities.items():
            if product_id in products:
                products[product_id].stock += qty
    elif sale.status != "Completed" and payload.status == "Completed":
        for product_id, qty in quantities.items():
            product = products.get(product_id)
            if product is None:
                raise HTTPException(status_code=404, detail="A transaction product was not found.")
            if product.stock < qty:
                raise HTTPException(status_code=409, detail=f"Only {product.stock} units of {product.name} are available.")
        for product_id, qty in quantities.items():
            products[product_id].stock -= qty

    sale.date = payload.date
    sale.customer = payload.customer.strip() or "Walk-in customer"
    sale.method = payload.method
    sale.status = payload.status
    db.commit()
    db.refresh(sale)
    return sale


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(transaction_id: str, db: Session = Depends(get_db)):
    sale = db.scalar(select(Sale).where(Sale.transaction_id == transaction_id))
    if sale is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    if sale.status == "Completed":
        quantities = sale_quantities(sale)
        if quantities:
            products = {
                product.id: product
                for product in db.scalars(select(Product).where(Product.id.in_(quantities))).all()
            }
            for product_id, qty in quantities.items():
                if product_id in products:
                    products[product_id].stock += qty
    db.delete(sale)
    db.commit()
