import React, { useMemo, useState } from 'react'
import { Search, Plus, Package, AlertTriangle, Boxes, IndianRupee, Pencil, Trash2, Check } from 'lucide-react'
import StatCard from './StatCard'
import Modal from './Modal'
import BarcodeScanner from './BarcodeScanner'
import { money } from '../utils/format'

const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
const blank = { name:'', category:'Whisky', size:'750 ml', barcode:'', stock:0, price:'', reorder:5 }

export default function Inventory({ inventory, onSaveProduct, onDeleteProduct }) {
  const [search,setSearch] = useState('')
  const [category,setCategory] = useState('All categories')
  const [modal,setModal] = useState(false)
  const [editing,setEditing] = useState(null)
  const [form,setForm] = useState(blank)
  const [error,setError] = useState('')
  const low = inventory.filter(p => p.stock <= p.reorder).length
  const value = inventory.reduce((s,p)=>s + p.stock*p.price,0)
  const filtered = useMemo(()=>inventory.filter(p=>(category==='All categories'||p.category===category) && `${p.name} ${p.id} ${p.category} ${p.barcode || ''}`.toLowerCase().includes(search.toLowerCase())),[inventory,category,search])
  const save = async e => {
    e.preventDefault(); setError('')
    const stock = Number(form.stock), price = Number(form.price), reorder = Number(form.reorder)
    if (!form.name.trim() || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price <= 0 || !Number.isInteger(reorder) || reorder < 0) { setError('Enter a product name, a valid price, and whole-number stock levels.'); return }
    if (inventory.some(p => p.id !== editing && p.name.trim().toLowerCase() === form.name.trim().toLowerCase())) { setError('A product with this name already exists.'); return }
    const product = {...form, name:form.name.trim(), barcode:String(form.barcode || '').trim() || null, stock, price, reorder}
    try {
      await onSaveProduct(product, editing)
      setModal(false); setEditing(null); setForm(blank)
    } catch (saveError) {
      setError(saveError.message)
    }
  }
  const openEdit = p => { setEditing(p.id); setForm({...p}); setModal(true) }
  const removeProduct = async p => {
    if (window.confirm(`Remove ${p.name} from inventory? Existing sales history will be kept.`)) {
      setError('')
      try {
        await onDeleteProduct(p.id)
      } catch (deleteError) {
        setError(deleteError.message)
      }
    }
  }
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total products" value={inventory.length} note="Unique products in catalogue" icon={Package}/>
      <StatCard label="Units in stock" value={inventory.reduce((s,p)=>s+p.stock,0)} note="Across all product categories" icon={Boxes} tone="blue"/>
      <StatCard label="Stock value" value={money(value)} note="Based on listed selling price" icon={IndianRupee} tone="amber"/>
      <StatCard label="Low stock alerts" value={low} note="At or below reorder level" icon={AlertTriangle}/>
    </div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      {error && !modal && <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">{error}</p>}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-800">Inventory catalogue</h2><p className="mt-1 text-xs text-slate-400">Manage products, pricing and available stock</p></div><button onClick={()=>{setEditing(null);setForm(blank);setError('');setModal(true)}} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-800"><Plus size={16}/> Add product</button></div>
      <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row"><div className="relative flex-1 sm:max-w-xs"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className={`${field} pl-9`}/></div><select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"><option>All categories</option>{['Whisky','Rum','Vodka','Wine','Beer'].map(c=><option key={c}>{c}</option>)}</select><span className="self-center text-xs text-slate-400 sm:ml-auto">{filtered.length} products</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-400"><tr>{['Product','Category','Pack size','Available stock','Selling price','Stock status',''].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{filtered.map(p=><tr key={p.id} className="hover:bg-emerald-50/30"><td className="px-5 py-4"><div className="font-semibold text-sm text-slate-700">{p.name}</div><div className="mt-0.5 text-[11px] text-slate-400">{p.id}{p.barcode ? ` · ${p.barcode}` : ''}</div></td><td className="px-5 py-4 text-xs text-slate-500">{p.category}</td><td className="px-5 py-4 text-xs text-slate-500">{p.size}</td><td className="px-5 py-4"><span className="text-sm font-semibold text-slate-700">{p.stock}</span><span className="ml-1 text-xs text-slate-400">units</span></td><td className="px-5 py-4 text-sm font-semibold text-slate-700">{money(p.price)}</td><td className="px-5 py-4">{p.stock<=p.reorder?<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"><AlertTriangle size={12}/> Low stock</span>:<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"><Check size={12}/> In stock</span>}</td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={()=>openEdit(p)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" title="Edit product" aria-label={`Edit ${p.name}`}><Pencil size={14}/></button><button onClick={()=>removeProduct(p)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Remove product" aria-label={`Remove ${p.name}`}><Trash2 size={14}/></button></div></td></tr>)}
        {!filtered.length&&<tr><td colSpan="7" className="px-5 py-14 text-center text-sm text-slate-400">No products found.</td></tr>}</tbody></table></div>
      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">Low stock is triggered when available units are at or below the product’s reorder level.</div>
    </section>
    {modal&&<Modal title={editing?'Edit product':'Add inventory product'} onClose={()=>setModal(false)}>
      <form onSubmit={save} className="space-y-4">
        <label className="block text-xs font-semibold text-slate-600">Product name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Product name" className={`${field} mt-1.5`}/></label>
        <div className="space-y-2"><label className="block text-xs font-semibold text-slate-600">Assign barcode with a scanner or camera</label><BarcodeScanner placeholder="Scan barcode to assign" onCode={barcode=>setForm(current=>({...current,barcode}))}/><label className="block text-xs font-semibold text-slate-600">Barcode<input value={form.barcode || ''} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Optional product barcode" className={`${field} mt-1.5`}/></label></div>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={`${field} mt-1.5`}>{['Whisky','Rum','Vodka','Wine','Beer','Other'].map(c=><option key={c}>{c}</option>)}</select></label><label className="text-xs font-semibold text-slate-600">Pack size<input value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className={`${field} mt-1.5`}/></label></div>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Available stock<input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className={`${field} mt-1.5`}/></label><label className="text-xs font-semibold text-slate-600">Selling price (₹)<input type="number" min="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className={`${field} mt-1.5`}/></label></div>
        <label className="block text-xs font-semibold text-slate-600">Reorder alert level<input type="number" min="0" value={form.reorder} onChange={e=>setForm({...form,reorder:e.target.value})} className={`${field} mt-1.5`}/></label>
        {error&&<p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={()=>setModal(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button className="rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-800">{editing?'Save changes':'Add product'}</button></div>
      </form>
    </Modal>}
  </div>
}
