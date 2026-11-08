from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Product, Sale
from app.schemas.sale import SaleCreate, SaleOut

router = APIRouter()


@router.get("/", response_model=list[SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return db.scalars(select(Sale).order_by(Sale.date.desc(), Sale.id.desc())).all()


@router.post("/", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    product = db.scalar(select(Product).where(Product.id == payload.product_id))
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    if payload.status == "Completed" and product.stock < payload.qty:
        raise HTTPException(status_code=409, detail=f"Only {product.stock} units are available.")

    unit_price = product.price
    sale = Sale(
        transaction_id=f"TXN-{uuid4().hex[:12].upper()}",
        date=payload.date,
        customer=payload.customer.strip() or "Walk-in customer",
        product_id=product.id,
        item=product.name,
        qty=payload.qty,
        unit_price=unit_price,
        amount=unit_price * payload.qty,
        method=payload.method,
        status=payload.status,
    )
    if payload.status == "Completed":
        product.stock -= payload.qty
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale
