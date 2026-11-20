from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Local Wine Shop Billing API"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./wine_billing.db"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    TIMEZONE: str = "Asia/Kolkata"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def use_psycopg_driver_for_postgres(cls, value: str) -> str:
        # Supabase provides standard postgres:// or postgresql:// URLs, while
        # this backend uses psycopg 3 explicitly.
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
