from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class SaleLineCreate(BaseModel):
    product_id: int
    qty: int = Field(gt=0)


class SaleLineOut(BaseModel):
    product_id: int
    item: str
    qty: int
    unit_price: float
    amount: float


class SaleCreate(BaseModel):
    date: date
    customer: str = Field(default="Walk-in customer", max_length=160)
    items: list[SaleLineCreate] | None = Field(default=None, min_length=1)
    # Keep the single-item form accepted for the initial browser demo import.
    product_id: int | None = None
    qty: int | None = Field(default=None, gt=0)
    method: str = Field(default="Cash", max_length=40)
    status: str = Field(default="Completed", pattern="^(Completed|Failed)$")


class SaleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str = Field(validation_alias="transaction_id")
    date: date
    customer: str
    product_id: int | None
    items: list[SaleLineOut] | None = None
    item: str
    qty: int
    unit_price: float
    amount: float
    method: str
    status: str
