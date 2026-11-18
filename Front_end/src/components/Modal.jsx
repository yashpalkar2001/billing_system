import React from 'react'
import { X } from 'lucide-react'
export default function Modal({ title, onClose, children, wide = false }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className={`flex max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-2xl`}>
      <div className="mb-5 flex shrink-0 items-center justify-between"><h2 className="text-lg font-bold text-slate-800">{title}</h2><button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close dialog"><X size={19}/></button></div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">{children}</div>
    </div>
  </div>
}
