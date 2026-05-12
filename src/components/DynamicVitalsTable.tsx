"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addVitalSign, deleteVitalSign } from "@/app/actions/subrecords";

export default function DynamicVitalsTable({ patientId, initialVitals, isNewborn = false }: { patientId: string, initialVitals: any[], isNewborn?: boolean }) {
  const [vitals, setVitals] = useState(initialVitals);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newVital = await addVitalSign(patientId, isNewborn, formData);
    setVitals([newVital, ...vitals]);
    setIsAdding(false);
  }

  async function handleDelete(vitalId: string) {
    if (!confirm("Delete this vital sign entry?")) return;
    await deleteVitalSign(vitalId);
    setVitals(vitals.filter(v => v.id !== vitalId));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Vital Signs Monitoring Sheet</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-white/40 text-blue-700 hover:bg-white/80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-1 border border-white/60"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>

      {isAdding && (
        <form action={handleAdd} className="mb-4 p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input required name="time" type="time" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input name="bloodPressure" type="text" placeholder="BP (120/80)" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input required name="pulseRate" type="text" placeholder="PR (bpm)" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input required name="respiratoryRate" type="text" placeholder="RR (cpm)" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input required name="temperature" type="text" placeholder="Temp (°C)" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
            <input required name="signature" type="text" placeholder="Signature" className="p-2 rounded-lg glass-input text-slate-900 text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-white/40 text-slate-700 rounded-lg hover:bg-white/70 border border-white/60 text-xs font-semibold backdrop-blur-sm transition-all shadow-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500/90 text-white rounded-lg hover:bg-emerald-600 border border-emerald-400/50 text-xs font-semibold flex items-center gap-1 shadow-md transition-all"><Save size={14} /> Save</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/40 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="glass-header text-slate-700">
            <tr>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Time</th>
              <th className="p-3 font-semibold">BP</th>
              <th className="p-3 font-semibold">PR (bpm)</th>
              <th className="p-3 font-semibold">RR (cpm)</th>
              <th className="p-3 font-semibold">Temp (°C)</th>
              <th className="p-3 font-semibold">Signature</th>
              <th className="p-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody>
            {vitals.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center text-slate-500 font-medium">No vital signs recorded. Click &quot;Add Row&quot;.</td></tr>
            ) : (
              vitals.map(v => (
                <tr key={v.id} className="border-b border-white/30 hover:bg-white/30 transition-colors group">
                  <td className="p-3 text-slate-800 font-medium">{v.date}</td>
                  <td className="p-3 text-slate-700">{v.time}</td>
                  <td className="p-3 font-mono font-medium text-blue-900">{v.bloodPressure || "—"}</td>
                  <td className="p-3 text-slate-700">{v.pulseRate}</td>
                  <td className="p-3 text-slate-700">{v.respiratoryRate}</td>
                  <td className="p-3 text-slate-700">{v.temperature}</td>
                  <td className="p-3 text-slate-500 italic">{v.signature}</td>
                  <td className="p-3">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                      <button type="button" className="text-blue-400 hover:text-blue-600" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="text-rose-400 hover:text-rose-600" title="Delete">
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
