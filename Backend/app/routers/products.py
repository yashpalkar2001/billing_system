from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Product
from app.schemas.product import ProductInput, ProductOut

router = APIRouter()


@router.get("/", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.scalars(select(Product).order_by(Product.name)).all()


@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductInput, db: Session = Depends(get_db)):
    values = payload.model_dump()
    values["barcode"] = values["barcode"].strip() or None if values["barcode"] else None
    if values["barcode"] and db.scalar(select(Product).where(Product.barcode == values["barcode"])):
        raise HTTPException(status_code=409, detail="A product with this barcode already exists.")
    product = Product(**values)
    db.add(product)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="A product with this name or barcode already exists.") from exc
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductInput, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    values = payload.model_dump()
    values["barcode"] = values["barcode"].strip() or None if values["barcode"] else None
    if values["barcode"] and db.scalar(select(Product).where(Product.barcode == values["barcode"], Product.id != product_id)):
        raise HTTPException(status_code=409, detail="A product with this barcode already exists.")
    for key, value in values.items():
        setattr(product, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="A product with this name or barcode already exists.") from exc
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
