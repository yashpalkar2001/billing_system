import React from 'react'
export default function StatCard({ label, value, note, icon: Icon, tone = 'green' }) {
  const tones = { green: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700', amber: 'bg-amber-50 text-amber-700' }
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
    <div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}><Icon size={18}/></span></div>
    <div className="mt-3 text-2xl font-bold tracking-tight text-slate-800">{value}</div><p className="mt-1 text-xs text-slate-400">{note}</p>
  </div>
}
