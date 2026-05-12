"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addUltrasoundResult, deleteUltrasoundResult } from "@/app/actions/subrecords";

export default function DynamicUltrasoundTable({ patientId, initialUltrasounds }: { patientId: string, initialUltrasounds: any[] }) {
  const [ultrasounds, setUltrasounds] = useState(initialUltrasounds || []);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newUltrasound = await addUltrasoundResult(patientId, formData);
    setUltrasounds([newUltrasound, ...ultrasounds]);
    setIsAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ultrasound result?")) return;
    await deleteUltrasoundResult(id);
    setUltrasounds(ultrasounds.filter(u => u.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex gap-2 items-center">
            Ultrasound Results
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white/40 text-blue-700 hover:bg-white/80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-1 border border-white/60"
        >
          <Plus size={16} /> Add Result
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <form action={handleAdd} className="bg-white/30 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm space-y-4">
             <div>
                <label className="text-xs font-bold text-blue-900 uppercase">Date Performed</label>
                <input required name="datePerformed" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2 rounded-lg glass-input text-slate-900 text-sm mt-1 mb-3 block w-48" />
                
                <label className="text-xs font-bold text-blue-900 uppercase">Impression / Result</label>
                <textarea required name="impression" rows={5} placeholder="Add ultrasound text or impression..." className="w-full p-2.5 rounded-lg glass-input text-slate-900 font-mono text-sm mt-1"></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-white/40 text-slate-700 rounded-xl hover:bg-white/70 border border-white/60 text-sm font-semibold backdrop-blur-sm transition-all shadow-sm">Cancel</button>
                 <button type="submit" className="glass-button-primary px-4 py-2 rounded-xl flex gap-2 items-center text-sm font-semibold transition-all shadow-md"><Save size={16}/> Save Result</button>
             </div>
          </form>
        )}

        <div className="glass-card shadow-sm border border-white/50 overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
            <thead>
                <tr className="glass-header text-slate-700 font-bold uppercase tracking-wider text-xs">
                <th className="p-4 w-32 border-r border-white/30">Date</th>
                <th className="p-4">Impression</th>
                <th className="p-4 w-16 text-center"></th>
                </tr>
            </thead>
            <tbody>
                {ultrasounds.length === 0 ? (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 italic border-t border-white/30 border-dashed">
                    No ultrasound results recorded yet. Click "Add Result" above to begin tracking.
                    </td>
                </tr>
                ) : (
                ultrasounds.map(result => (
                    <tr key={result.id} className="border-b border-white/40 hover:bg-white/30 transition-colors">
                    <td className="p-4 align-top font-bold text-slate-700 border-r border-white/30">{result.datePerformed || "—"}</td>
                    <td className="p-4 align-top whitespace-pre-wrap font-mono text-sm break-words text-slate-800">{result.impression}</td>
                    <td className="p-4 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" className="text-blue-400 hover:text-blue-600 transition-colors p-1" title="Edit Result">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(result.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Delete Result">
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
