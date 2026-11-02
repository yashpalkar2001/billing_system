# Cellar — Wine Shop Dashboard

A React + Tailwind CSS starter dashboard inspired by the supplied reference image. The app opens on **Transactions** by default and includes an **Inventory** tab.

## Features

### Transactions
- Today's sales, successful transaction count and average bill cards
- Search transactions by ID, customer, product or payment method
- Filter by status, payment method and date range
- Add a transaction with product, quantity, payment method and status
- Automatically deducts sold quantity from inventory only when the transaction is marked Completed
- Export the currently filtered transaction list as CSV (opens in Excel)

### Inventory
- Product catalogue with category filters and search
- Add and edit products
- Stock value and low-stock summary
- Reorder-level stock warnings

### Data
- Demo records are included so the dashboard is populated on first run.
- Changes are persisted in browser `localStorage`.
- This is a front-end prototype. It does not yet have user login, a database, cloud sync, or server-side validation.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run on Windows

1. Extract `wine-shop-dashboard.zip`.
2. Open the extracted `wine-shop-dashboard` folder.
3. In File Explorer, click the address bar, type `cmd`, and press Enter.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal, normally `http://localhost:5173`.

Keep the terminal open while using the app. Press `Ctrl + C` to stop the development server.

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

## Important next step for real shop use

Before using this for actual business records, connect it to a backend and database (for example, Java/Quarkus + PostgreSQL or a small Node/Express API). Add authentication, backups, audit history, and server-side stock checks. The current browser-only storage can be cleared with browser data and is not shared between devices.
