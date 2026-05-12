"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addMedication, deleteMedication } from "@/app/actions/subrecords";

export default function DynamicMedicationTable({ patientId, initialMeds, isNewborn = false }: { patientId: string, initialMeds: any[], isNewborn?: boolean }) {
  const [meds, setMeds] = useState(initialMeds);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newMed = await addMedication(patientId, isNewborn, formData);
    setMeds([newMed, ...meds]);
    setIsAdding(false);
  }

  async function handleDelete(medId: string) {
    if (!confirm("Delete this medication entry?")) return;
    await deleteMedication(medId);
    setMeds(meds.filter(m => m.id !== medId));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Medication Chart</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-blue-200"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>

      {isAdding && (
        <form action={handleAdd} className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <input required name="medicationName" type="text" placeholder="Medication Name" className="p-2 rounded-lg border border-slate-300 text-sm col-span-2 md:col-span-1" />
            <input required name="dateGiven" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2 rounded-lg border border-slate-300 text-sm" />
            <input name="timeGiven" type="time" className="p-2 rounded-lg border border-slate-300 text-sm" />
            <select required name="route" className="p-2 rounded-lg border border-slate-300 text-sm bg-white">
              <option value="PO">PO (Per Orem)</option>
              <option value="IM">IM (Intramuscular)</option>
              <option value="IV">IV (Intravenous)</option>
              <option value="ID">ID (Intradermal)</option>
              <option value="Ophthalmic">Ophthalmic / Topical</option>
            </select>
            <input required name="givenBy" type="text" placeholder="Given By" className="p-2 rounded-lg border border-slate-300 text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-xs font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-xs font-medium flex items-center gap-1"><Save size={14} /> Save</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3 font-semibold">Medication Name</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Time</th>
              <th className="p-3 font-semibold">Route</th>
              <th className="p-3 font-semibold">Given By</th>
              <th className="p-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody>
            {meds.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400 font-medium">No medications recorded. Click &quot;Add Row&quot;.</td></tr>
            ) : (
              meds.map(m => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                  <td className="p-3 font-medium text-slate-900">{m.medicationName}</td>
                  <td className="p-3 text-slate-700">{m.dateGiven}</td>
                  <td className="p-3 text-slate-700">{m.timeGiven}</td>
                  <td className="p-3 text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-mono text-xs">{m.route}</span>
                  </td>
                  <td className="p-3 text-slate-500 italic">{m.givenBy}</td>
                  <td className="p-3">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                      <button type="button" className="text-blue-400 hover:text-blue-600" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="text-rose-400 hover:text-rose-600" title="Delete">
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
