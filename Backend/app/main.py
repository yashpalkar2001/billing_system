from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401 - register models before creating tables
from app.routers import health, products, inventory, sales, reports

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="Local API for products, inventory, sales, and reports.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(sales.router, prefix="/api/sales", tags=["Sales"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.on_event("startup")
def create_local_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Health"])
def root():
    return {"message": "Local Wine Shop Billing API", "docs": "/docs"}
