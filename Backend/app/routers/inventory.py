from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Product
from app.schemas.product import ProductOut

router = APIRouter()


class StockUpdate(BaseModel):
    stock: int = Field(ge=0)


@router.get("/", response_model=list[ProductOut])
def get_inventory(db: Session = Depends(get_db)):
    return db.scalars(select(Product).order_by(Product.name)).all()


@router.patch("/{product_id}", response_model=ProductOut)
def update_stock(product_id: int, payload: StockUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.stock = payload.stock
    db.commit()
    db.refresh(product)
    return product
