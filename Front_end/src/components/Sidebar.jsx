import React from 'react'
import { Wine, ReceiptText, Package, BarChart3 } from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const links = [
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ]
  return <>
    {mobileOpen && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
    <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-forest-950 px-5 py-6 text-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0`}>
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300 text-forest-950"><Wine size={22} /></div>
        <div><div className="text-lg font-bold tracking-tight">Grapes & Cheers</div><div className="text-[10px] uppercase tracking-[.2em] text-emerald-100/55">Shop management</div></div>
      </div>
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/35">Workspace</div>
      <nav className="space-y-1">
        {links.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeTab === id ? 'bg-white/12 font-semibold text-white shadow-inner' : 'text-emerald-50/65 hover:bg-white/7 hover:text-white'}`}>
          <Icon size={18} strokeWidth={1.8} />{label}{activeTab === id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-300" />}
        </button>)}
      </nav>
      <div className="mt-auto border-t border-white/10 px-3 pt-5 text-xs leading-5 text-emerald-50/50">
        Your products and bills are saved in this browser.
      </div>
    </aside>
  </>
}
