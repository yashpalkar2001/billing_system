from pydantic import BaseModel, ConfigDict, Field


class ProductInput(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    category: str = Field(default="Other", max_length=60)
    size: str = Field(default="", max_length=60)
    stock: int = Field(default=0, ge=0)
    price: float = Field(gt=0)
    reorder: int = Field(default=0, ge=0)


class ProductOut(ProductInput):
    model_config = ConfigDict(from_attributes=True)
    id: int
