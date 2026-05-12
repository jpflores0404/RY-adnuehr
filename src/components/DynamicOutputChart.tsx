"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addOutputChart, deleteOutputChart } from "@/app/actions/subrecords";

export default function DynamicOutputChart({ patientId, initialOutput, isNewborn = false }: { patientId: string, initialOutput: any[], isNewborn?: boolean }) {
  const [outputs, setOutputs] = useState(initialOutput);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newOut = await addOutputChart(patientId, isNewborn, formData);
    setOutputs([newOut, ...outputs]);
    setIsAdding(false);
  }

  async function handleDelete(outputId: string) {
    if (!confirm("Delete this output entry?")) return;
    await deleteOutputChart(outputId);
    setOutputs(outputs.filter(o => o.id !== outputId));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Output Chart (Stool & Urine)</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-blue-200"
        >
          <Plus size={16} /> Add Shift Data
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm text-center">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3 font-semibold text-left">Date and Time</th>
              <th className="p-3 font-semibold">Stool Count</th>
              <th className="p-3 font-semibold">Urine Count</th>
              <th className="p-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr className="bg-blue-50/50 border-b border-blue-100">
                <td colSpan={4} className="p-0">
                  <form action={handleAdd} className="flex flex-col md:flex-row w-full items-center p-2 gap-4">
                    <div className="flex gap-2 w-full md:w-auto">
                        <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        <select required name="shift" className="p-2 rounded border border-slate-300 text-sm bg-white">
                            <option value="AM">AM (7am-7pm)</option>
                            <option value="PM">PM (7pm-7am)</option>
                        </select>
                    </div>
                    <div className="flex gap-4 items-center w-full justify-around">
                        <input required name="stoolCount" type="number" min="0" placeholder="Stools" className="w-24 p-2 rounded border border-slate-300 text-sm text-center" />
                        <input required name="urineCount" type="number" min="0" placeholder="Urines" className="w-24 p-2 rounded border border-slate-300 text-sm text-center" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                       <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-medium text-xs">Cancel</button>
                       <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium text-xs flex gap-1 items-center"><Save size={14}/> Save</button>
                    </div>
                  </form>
                </td>
              </tr>
            )}
            
            {outputs.length === 0 && !isAdding ? (
              <tr><td colSpan={4} className="p-6 text-slate-400 font-medium">No output recorded yet.</td></tr>
            ) : (
              outputs.map(out => (
                <tr key={out.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-left font-medium text-slate-900 border-r border-slate-100">
                    <div>{out.date}</div>
                    <div className="text-xs text-slate-500">{out.shift === 'AM' ? '7 AM - 7 PM' : '7 PM - 7 AM'}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-700 text-lg">{out.stoolCount}</td>
                  <td className="p-3 font-mono font-bold text-yellow-600 text-lg border-l border-slate-100">{out.urineCount}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" className="text-blue-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(out.id)} className="text-rose-400 hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={14} />
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
  );
}
