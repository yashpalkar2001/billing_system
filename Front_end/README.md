# Cellar — Local Wine Shop Billing

A simple React + Tailwind CSS billing app for one shop computer. It opens on **Transactions** and saves products and bills in the local SQLite backend. It does not use accounts, voice control, or cloud services.

## Features

### Transactions
- Today's sales, successful transaction count and average bill cards
- Search transactions by ID, customer, product or payment method
- Filter by status, payment method and date range
- Add a transaction with product, quantity, payment method and status
- Calculate bill totals from the product price and quantity
- Automatically deducts sold quantity from inventory only when the transaction is marked Completed
- Scan product barcodes with a USB scanner or a supported device camera during checkout
- Use voice input to choose a product and quantity, then review before saving
- Export the currently filtered transaction list as CSV (opens in Excel)

### Inventory
- Product catalogue with category filters and search
- Add, edit and remove products
- Assign each product a barcode by typing it or scanning its label
- Stock value and low-stock summary
- Reorder-level stock warnings

### Reports
- Daily completed sales and units sold for the last 7 or 30 days
- Export the report as CSV (opens in Excel)

### Data
- Demo records are included so the dashboard is populated on first run.
- The first run copies the demo records into the local backend database.
- SQLite is the source of truth; the browser keeps a local display cache.
- This local project does not include user login or cloud sync.
- Voice recognition requires browser support and microphone permission; the browser may use its speech service to recognize words.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm
- Python 3.11+

## Run on Windows

From the project root, start the backend in PowerShell:

   ```bash
   cd Backend
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

In a second PowerShell window from the project root, start the frontend:

   ```bash
   cd Front_end
   npm install
   npm run dev
   ```

Open the frontend URL printed in the terminal, normally `http://localhost:5173`. The API docs are at `http://127.0.0.1:8000/docs`. Keep both terminals open while using the app.

Keep both terminals open while using the app. Press `Ctrl + C` in each terminal to stop the servers.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  components/
    Inventory.jsx
    Modal.jsx
    Sidebar.jsx
    StatCard.jsx
    Topbar.jsx
    Transactions.jsx
  data/
    initialData.js
  utils/
    format.js
  App.jsx
  index.css
  main.jsx
```

## Local use

This is a local starter app without user accounts or cloud backup. Keep a backup copy of `Backend\wine_billing.db` if you need to preserve records.
