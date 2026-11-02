import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  ArrowUpRight,
  CreditCard,
  Wallet,
  Receipt,
  CalendarDays,
} from "lucide-react";
import StatCard from "./StatCard";
import Modal from "./Modal";
import { money, shortDate } from "../utils/format";

const blank = {
  date: new Date().toISOString().slice(0, 10),
  customer: "Walk-in customer",
  item: "",
  qty: 1,
  amount: "",
  method: "UPI",
  status: "Completed",
};
const field =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function Transactions({
  transactions,
  setTransactions,
  inventory,
  setInventory,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [method, setMethod] = useState("All methods");
  const [range, setRange] = useState("All dates");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch = [t.id, t.customer, t.item, t.method].some((v) =>
          String(v).toLowerCase().includes(q),
        );
        const matchStatus = status === "All statuses" || t.status === status;
        const matchMethod = method === "All methods" || t.method === method;
        const today = new Date().toISOString().slice(0, 10);
        const matchRange =
          range === "All dates" ||
          (range === "Today"
            ? t.date === today
            : range === "Last 7 days"
              ? (new Date(today) - new Date(t.date)) / 86400000 <= 7
              : t.date.slice(0, 7) === today.slice(0, 7));
        return matchSearch && matchStatus && matchMethod && matchRange;
      }),
    [transactions, search, status, method, range],
  );
  const today = new Date().toISOString().slice(0, 10);
  const todays = transactions.filter(
    (t) => t.date === today && t.status === "Completed",
  );
  const total = todays.reduce((sum, t) => sum + Number(t.amount), 0);
  const count = todays.length;
  const avg = count ? total / count : 0;

  const exportCsv = () => {
    const rows = [
      [
        "Transaction ID",
        "Date",
        "Customer",
        "Item",
        "Quantity",
        "Payment Method",
        "Amount",
        "Status",
      ],
      ...filtered.map((t) => [
        t.id,
        t.date,
        t.customer,
        t.item,
        t.qty,
        t.method,
        t.amount,
        t.status,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const addTransaction = (e) => {
    e.preventDefault();
    setError("");
    const item = inventory.find((p) => p.name === form.item);
    if (
      !form.item ||
      !form.amount ||
      Number(form.amount) <= 0 ||
      Number(form.qty) < 1
    ) {
      setError("Select an item and enter a valid quantity and amount.");
      return;
    }
    if (item && item.stock < Number(form.qty)) {
      setError(`Only ${item.stock} units are available in inventory.`);
      return;
    }
    const tx = {
      ...form,
      id: `TXN-${Date.now().toString().slice(-6)}`,
      qty: Number(form.qty),
      amount: Number(form.amount),
    };
    setTransactions((prev) => [tx, ...prev]);
    if (item && tx.status === "Completed")
      setInventory((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, stock: p.stock - Number(form.qty) } : p,
        ),
      );
    setForm(blank);
    setShowModal(false);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's sales"
          value={money(total)}
          note="Completed transactions today"
          icon={Wallet}
        />
        <StatCard
          label="Transactions today"
          value={count}
          note="Successful sales"
          icon={Receipt}
          tone="blue"
        />
        <StatCard
          label="Average transaction"
          value={money(avg)}
          note="Average bill value today"
          icon={ArrowUpRight}
          tone="amber"
        />
        <StatCard
          label="All-time records"
          value={transactions.length}
          note="Sales recorded in this dashboard"
          icon={CreditCard}
        />
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Transaction history</h2>
            <p className="mt-1 text-xs text-slate-400">
              Review, filter and export your shop sales
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-56">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className={`${field} pl-9`}
              />
            </div>
            <button
              onClick={() => {
                setForm(blank);
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
            >
              <Plus size={16} /> Add transaction
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <SlidersHorizontal size={15} className="mr-1 text-slate-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
          >
            <option>All statuses</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
          >
            <option>All methods</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Credit Card</option>
          </select>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
          >
            <option>All dates</option>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>This month</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">
              {filtered.length} records
            </span>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                {[
                  "Date",
                  "Transaction ID",
                  "Customer / item",
                  "Payment method",
                  "Qty",
                  "Amount",
                  "Status",
                ].map((h) => (
                  <th key={h} className="px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="transition hover:bg-emerald-50/30">
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                    {shortDate(t.date)}
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                    {t.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-700">
                      {t.customer}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {t.item}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {t.method}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-600">{t.qty}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {money(t.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${t.status === "Completed" ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-14 text-center text-sm text-slate-400"
                  >
                    No transactions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filtered.length} of {transactions.length} transactions
          </span>
          <span>Amounts shown in INR (₹)</span>
        </div>
      </section>
      {showModal && (
        <Modal title="Add new transaction" onClose={() => setShowModal(false)}>
          <form onSubmit={addTransaction} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`${field} mt-1.5`}
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Customer
                <input
                  value={form.customer}
                  onChange={(e) =>
                    setForm({ ...form, customer: e.target.value })
                  }
                  className={`${field} mt-1.5`}
                />
              </label>
            </div>
            <label className="block text-xs font-semibold text-slate-600">
              Product
              <select
                value={form.item}
                onChange={(e) => {
                  const p = inventory.find((x) => x.name === e.target.value);
                  setForm({
                    ...form,
                    item: e.target.value,
                    amount: p ? p.price : form.amount,
                  });
                }}
                className={`${field} mt-1.5`}
              >
                <option value="">Choose inventory item</option>
                {inventory.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} — {p.stock} in stock
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Quantity
                <input
                  type="number"
                  min="1"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  className={`${field} mt-1.5`}
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Total amount (₹)
                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter bill amount"
                  className={`${field} mt-1.5`}
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Payment method
                <select
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                  className={`${field} mt-1.5`}
                >
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={`${field} mt-1.5`}
                >
                  <option>Completed</option>
                  <option>Failed</option>
                </select>
              </label>
            </div>
            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-800">
                Save transaction
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
