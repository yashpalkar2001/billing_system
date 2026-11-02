import React from 'react'
import { X } from 'lucide-react'
export default function Modal({ title, onClose, children, wide = false }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl bg-white p-6 shadow-2xl`}>
      <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-800">{title}</h2><button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div>
      {children}
    </div>
  </div>
}
