import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Transactions from "./components/Transactions";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import { initialTransactions, initialInventory } from "./data/initialData";
import { apiRequest } from "./utils/api";

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transactions, setTransactions] = useState(() =>
    readStore("cellar-transactions", initialTransactions),
  );
  const [inventory, setInventory] = useState(() =>
    readStore("cellar-inventory", initialInventory),
  );
  const [apiError, setApiError] = useState("");
  const [apiReady, setApiReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function loadBackend() {
      try {
        let products = await apiRequest("/api/products/");
        let sales = await apiRequest("/api/sales/");
        if (products.length === 0 && sales.length === 0) {
          const seedSales = transactions.length ? transactions : initialTransactions;
          const seedProducts = (inventory.length ? inventory : initialInventory).map((product) => ({
            ...product,
            stock: product.stock + seedSales.filter((sale) => sale.item === product.name && sale.status === "Completed").reduce((sum, sale) => sum + Number(sale.qty), 0),
          }));
          for (const sale of seedSales) {
            if (!seedProducts.some((product) => product.name === sale.item)) {
              seedProducts.push({ name: sale.item, category: "Other", size: "", stock: sale.status === "Completed" ? Number(sale.qty) : 0, price: Number(sale.amount) / Number(sale.qty), reorder: 0 });
            }
          }
          for (const product of seedProducts) {
            const { id, ...payload } = product;
            await apiRequest("/api/products/", { method: "POST", body: JSON.stringify(payload) });
          }
          products = await apiRequest("/api/products/");
          for (const sale of seedSales) {
            const product = products.find((entry) => entry.name === sale.item);
            if (product) await apiRequest("/api/sales/", { method: "POST", body: JSON.stringify({ product_id: product.id, date: sale.date, customer: sale.customer, qty: Number(sale.qty), method: sale.method, status: sale.status }) });
          }
          sales = await apiRequest("/api/sales/");
        }
        if (!cancelled) {
          setInventory(products);
          setTransactions(sales);
          setApiReady(true);
          setApiError("");
        }
      } catch (error) {
        if (!cancelled) setApiError(`Backend is unavailable: ${error.message}. Start it from the Backend folder.`);
      }
    }
    loadBackend();
    return () => { cancelled = true; };
  // Bootstrap once from the current browser data, then use the local API as the source of truth.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(
    () =>
      localStorage.setItem("cellar-transactions", JSON.stringify(transactions)),
    [transactions],
  );
  useEffect(
    () => localStorage.setItem("cellar-inventory", JSON.stringify(inventory)),
    [inventory],
  );
  const pageTitle = { transactions: "Transactions", inventory: "Inventory", reports: "Reports" }[activeTab];

  const saveProduct = async (product, id) => {
    const saved = await apiRequest(id ? `/api/products/${id}` : "/api/products/", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(product),
    });
    setInventory((current) => id ? current.map((item) => item.id === id ? saved : item) : [saved, ...current]);
    return saved;
  };
  const deleteProduct = async (id) => {
    await apiRequest(`/api/products/${id}`, { method: "DELETE" });
    setInventory((current) => current.filter((item) => item.id !== id));
  };
  const createSale = async (sale) => {
    const saved = await apiRequest("/api/sales/", {
      method: "POST",
      body: JSON.stringify({ product_id: sale.productId, date: sale.date, customer: sale.customer, qty: sale.qty, method: sale.method, status: sale.status }),
    });
    setTransactions((current) => [saved, ...current]);
    if (saved.status === "Completed") setInventory((current) => current.map((product) => product.id === saved.product_id ? { ...product, stock: product.stock - saved.qty } : product));
    return saved;
  };
  return (
    <div className="min-h-screen bg-cream lg:flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
        <div className="mx-auto max-w-[1440px]">
          <Topbar
            title={pageTitle}
            subtitle={
              activeTab === "transactions"
                ? "Create bills and review your shop sales."
                : activeTab === "inventory"
                  ? "Keep product quantities, pricing and stock alerts up to date."
                  : "Review daily sales totals and export a simple report."
            }
            onMenu={() => setMobileOpen(true)}
          />
          {apiError && <div role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{apiError}</div>}
          {activeTab === "transactions" ? (
            <Transactions
              transactions={transactions}
              inventory={inventory}
              onCreateSale={createSale}
            />
          ) : activeTab === "inventory" ? (
            <Inventory inventory={inventory} onSaveProduct={saveProduct} onDeleteProduct={deleteProduct} />
          ) : (
            <Reports transactions={transactions} />
          )}
          <footer className="mt-8 flex flex-col gap-1 border-t border-slate-200/70 pt-4 text-[11px] text-slate-400 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Cellar Shop Manager</span>
            <span>{apiReady ? "Connected to local database" : "Connecting to local database…"}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
