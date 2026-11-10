from sqlalchemy import Index, Integer, Numeric, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(60), default="Other")
    size: Mapped[str] = mapped_column(String(60), default="")
    barcode: Mapped[str | None] = mapped_column(String(64), nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    price: Mapped[float] = mapped_column(Numeric(12, 2))
    reorder: Mapped[int] = mapped_column(Integer, default=0)

    __table_args__ = (
        Index("ix_products_barcode_unique", "barcode", unique=True, sqlite_where=text("barcode IS NOT NULL")),
    )
