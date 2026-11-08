# Local Wine Shop Billing API

A small FastAPI backend for the local billing project. It uses SQLite, creates its database automatically, and does not need Docker, PostgreSQL, cloud services, or voice control.

## Run on Windows

Open PowerShell in the `Backend` folder and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the interactive API at <http://127.0.0.1:8000/docs>. The database file `wine_billing.db` is created in this folder the first time the API starts. Keep the terminal open while using the API; press `Ctrl+C` to stop it.

## Available flow

- `GET /api/products` lists products.
- `POST /api/products` adds a product; `PUT` and `DELETE /api/products/{id}` edit or remove it.
- `GET /api/inventory` lists stock; `PATCH /api/inventory/{id}` sets a stock quantity.
- `GET /api/sales` lists bills; `POST /api/sales` records a bill using the current product price.
- `GET /api/reports/daily` returns today's completed sales.
- `GET /api/reports/range?from_date=2026-11-01&to_date=2026-11-08` returns daily totals for a date range.
- `GET /api/reports/export?from_date=2026-11-01&to_date=2026-11-08` downloads a CSV report that opens in Excel.

Sales validate stock and calculate the bill total on the server. Completed bills reduce stock together with the sale record; failed bills do not. Reports include completed bills only. The API is intended for local development and has no login or user permissions.
