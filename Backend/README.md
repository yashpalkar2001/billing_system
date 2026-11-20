# Local Wine Shop Billing API

A small FastAPI backend for the billing project. It uses SQLite locally by default and can connect to PostgreSQL, including a Supabase project, through `DATABASE_URL`.

## Run on Windows

Open PowerShell in the `Backend` folder and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the interactive API at <http://127.0.0.1:8000/docs>. The database file `wine_billing.db` is created in this folder the first time the API starts. If an older local database is present, startup adds the barcode column automatically. Keep the terminal open while using the API; press `Ctrl+C` to stop it.

## Use Supabase Postgres

1. In the Supabase dashboard, open **Connect** and copy a PostgreSQL connection string. Use a direct connection when the host is reachable from your deployment; otherwise use Supabase's session pooler URL. Keep the password private.
2. In `Backend`, copy `.env.example` to `.env` and set `DATABASE_URL` to the copied URL. Include `?sslmode=require` if the dashboard URL does not already specify SSL. Standard `postgres://` and `postgresql://` URLs are supported.
3. Install requirements and start the API as above. On startup, the API creates its tables in the configured database.

The backend uses SQLAlchemy with psycopg 3 for PostgreSQL. Set the same `DATABASE_URL` as a secret environment variable in your hosting provider when deploying; do not commit `.env` or put the database password in the frontend. Supabase Auth and the Supabase client are not required for this server-side database connection. Existing data in the local SQLite file is not copied automatically.

## Available flow

- `GET /api/products` lists products.
- `POST /api/products` adds a product (including an optional unique barcode); `PUT` and `DELETE /api/products/{id}` edit or remove it.
- `GET /api/inventory` lists stock; `PATCH /api/inventory/{id}` sets a stock quantity.
- `GET /api/sales` lists bills; `POST /api/sales` records a bill using the current product price.
- `GET /api/reports/daily` returns today's completed sales.
- `GET /api/reports/range?from_date=2026-11-01&to_date=2026-11-08` returns daily totals for a date range.
- `GET /api/reports/export?from_date=2026-11-01&to_date=2026-11-08` downloads a CSV report that opens in Excel.

Sales validate stock and calculate the bill total on the server. Completed bills reduce stock together with the sale record; failed bills do not. Reports include completed bills only. The API is intended for local development and has no login or user permissions.
