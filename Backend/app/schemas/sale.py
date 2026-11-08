from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class SaleCreate(BaseModel):
    product_id: int
    date: date
    customer: str = Field(default="Walk-in customer", max_length=160)
    qty: int = Field(gt=0)
    method: str = Field(default="Cash", max_length=40)
    status: str = Field(default="Completed", pattern="^(Completed|Failed)$")


class SaleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str = Field(validation_alias="transaction_id")
    date: date
    customer: str
    product_id: int | None
    item: str
    qty: int
    unit_price: float
    amount: float
    method: str
    status: str
