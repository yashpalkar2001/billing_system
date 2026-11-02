import React from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";

export default function Topbar({ title, subtitle, onMenu }) {
  return (
    <header className="mb-7 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
        >
          <Menu size={19} />
        </button>
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">
            Grapes & Cheer / {title.toUpperCase()}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-forest-900">
            AD
          </span>{" "}
          Admin User <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
