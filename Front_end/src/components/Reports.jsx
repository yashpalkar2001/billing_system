import React, { useMemo, useState } from "react";
import { Download, BarChart3, Boxes, Receipt } from "lucide-react";
import StatCard from "./StatCard";
import { money, shortDate } from "../utils/format";

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Reports({ transactions }) {
  const [days, setDays] = useState(7);
  const report = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - Number(days) + 1);
    const startDate = localDate(start);
    const endDate = localDate(today);
    const sales = transactions.filter(
      (transaction) =>
        transaction.status === "Completed" &&
        transaction.date >= startDate &&
        transaction.date <= endDate,
    );
    const byDate = new Map();
    for (let offset = 0; offset < Number(days); offset += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      byDate.set(localDate(date), { date: localDate(date), bills: 0, units: 0, total: 0 });
    }
    sales.forEach((sale) => {
      const day = byDate.get(sale.date);
      if (!day) return;
      day.bills += 1;
      day.units += Number(sale.qty) || 0;
      day.total += Number(sale.amount) || 0;
    });
    return { sales, days: [...byDate.values()].reverse() };
  }, [transactions, days]);

  const total = report.sales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);
  const units = report.sales.reduce((sum, sale) => sum + (Number(sale.qty) || 0), 0);

  const exportReport = () => {
    const rows = [
      ["Date", "Completed bills", "Units sold", "Sales total"],
      ...report.days.map((day) => [day.date, day.bills, day.units, day.total]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales-report-${localDate(new Date())}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sales in period" value={money(total)} note="Completed bills only" icon={BarChart3} />
        <StatCard label="Completed bills" value={report.sales.length} note={`Across the last ${days} days`} icon={Receipt} tone="blue" />
        <StatCard label="Units sold" value={units} note="Items sold in completed bills" icon={Boxes} tone="amber" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Daily sales report</h2>
            <p className="mt-1 text-xs text-slate-400">A simple summary of completed bills by day</p>
          </div>
          <div className="flex gap-2">
            <select aria-label="Report period" value={days} onChange={(event) => setDays(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button onClick={exportReport} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>{["Date", "Completed bills", "Units sold", "Sales total"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.days.map((day) => (
                <tr key={day.date} className="hover:bg-emerald-50/30">
                  <td className="px-5 py-3 text-sm text-slate-600">{shortDate(day.date)}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{day.bills}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{day.units}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-700">{money(day.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">Failed bills are excluded from sales totals.</div>
      </section>
    </div>
  );
}
