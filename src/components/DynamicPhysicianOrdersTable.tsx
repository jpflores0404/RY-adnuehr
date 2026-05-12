"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addPhysicianOrder, deletePhysicianOrder } from "@/app/actions/subrecords";

export default function DynamicPhysicianOrdersTable({ patientId, initialOrders, isNewborn = false }: { patientId: string, initialOrders: any[], isNewborn?: boolean }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newOrder = await addPhysicianOrder(patientId, isNewborn, formData);
    setOrders([newOrder, ...orders]);
    setIsAdding(false);
  }

  async function handleDelete(orderId: string) {
    if (!confirm("Delete this physician order?")) return;
    await deletePhysicianOrder(orderId);
    setOrders(orders.filter(o => o.id !== orderId));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex gap-2 items-center">
            Physician&apos;s Order Sheet
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-blue-200"
        >
          <Plus size={16} /> Add Order
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <form action={handleAdd} className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 shadow-sm space-y-4">
             <div>
                <label className="text-xs font-bold text-blue-900 uppercase">Date</label>
                <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2 rounded border border-slate-300 bg-white text-slate-900 text-sm mt-1 mb-3 block w-48" />
                
                <label className="text-xs font-bold text-blue-900 uppercase">Notes / Orders</label>
                <textarea required name="notes" rows={5} placeholder="Add text..." className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono text-sm mt-1"></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex gap-2 items-center text-sm font-medium"><Save size={16}/> Save Order</button>
             </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <th className="p-4 w-32 border-r border-slate-200">Date</th>
                <th className="p-4">Notes</th>
                <th className="p-4 w-16 text-center"></th>
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 italic bg-white border-dashed border-t border-slate-200">
                    No physician orders recorded yet. click "Add Order" above to begin tracking.
                    </td>
                </tr>
                ) : (
                orders.map(order => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 align-top font-bold text-slate-700 border-r border-slate-100">{order.date}</td>
                    <td className="p-4 align-top whitespace-pre-wrap font-mono text-sm">{order.notes}</td>
                    <td className="p-4 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" className="text-blue-400 hover:text-blue-600 transition-colors p-1" title="Edit Order">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(order.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Delete Order">
                            <Trash2 size={16} />
                          </button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
