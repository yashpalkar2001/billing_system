import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Transactions from "./components/Transactions";
import Inventory from "./components/Inventory";
import { initialTransactions, initialInventory } from "./data/initialData";

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
  useEffect(
    () =>
      localStorage.setItem("cellar-transactions", JSON.stringify(transactions)),
    [transactions],
  );
  useEffect(
    () => localStorage.setItem("cellar-inventory", JSON.stringify(inventory)),
    [inventory],
  );
  const isTransactions = activeTab === "transactions";
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
            title={isTransactions ? "Transactions" : "Inventory"}
            subtitle={
              isTransactions
                ? "A clear view of your shop sales and payment activity."
                : "Keep product quantities, pricing and stock alerts up to date."
            }
            onMenu={() => setMobileOpen(true)}
          />
          {isTransactions ? (
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
              inventory={inventory}
              setInventory={setInventory}
            />
          ) : (
            <Inventory inventory={inventory} setInventory={setInventory} />
          )}
          <footer className="mt-8 flex flex-col gap-1 border-t border-slate-200/70 pt-4 text-[11px] text-slate-400 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Cellar Shop Manager</span>
            <span>Demo dashboard · Data is saved in this browser</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
