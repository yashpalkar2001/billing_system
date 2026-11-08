import React from "react";
import { Menu } from "lucide-react";

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
    </header>
  );
}
