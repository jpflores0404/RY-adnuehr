"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { addLabResult, deleteLabResult } from "@/app/actions/subrecords";

export default function DynamicLabTable({ patientId, initialLabs }: { patientId: string, initialLabs: any[] }) {
  const [labs, setLabs] = useState(initialLabs || []);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    const newLab = await addLabResult(patientId, formData);
    setLabs([newLab, ...labs]);
    setIsAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this laboratory result?")) return;
    await deleteLabResult(id);
    setLabs(labs.filter(l => l.id !== id));
  }

  const InputField = ({ label, name, placeholder }: { label: string, name: string, placeholder?: string }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
      <input type="text" name={name} placeholder={placeholder} className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 bg-white text-sm" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex gap-2 items-center">
            Laboratory Test Results
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-blue-200"
        >
          <Plus size={16} /> Add Lab Record
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <form action={handleAdd} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 shadow-sm space-y-8">
             <div>
                <label className="text-sm font-bold text-blue-900 uppercase">Date Performed</label>
                <input required name="datePerformed" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2.5 rounded-lg border border-blue-300 bg-white text-slate-900 text-sm mt-1 mb-3 block w-48 shadow-sm" />
             </div>

             {/* Hematology */}
             <div>
                <h4 className="font-bold text-blue-800 uppercase border-b border-blue-200 pb-2 mb-4 text-sm">Hematology (CBC)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputField label="Hemoglobin" name="hemoglobin" placeholder="g/dL" />
                  <InputField label="Hematocrit" name="hematocrit" placeholder="%" />
                  <InputField label="WBC Count" name="wbcCount" placeholder="x10^9/L" />
                  <InputField label="RBC Count" name="rbcCount" placeholder="x10^12/L" />
                  <InputField label="Platelet Count" name="plateletCount" placeholder="x10^9/L" />
                  <InputField label="MCV" name="mcv" />
                  <InputField label="MCH" name="mch" />
                  <InputField label="MCHC" name="mchc" />
                  <InputField label="Neutrophils" name="neutrophils" placeholder="%" />
                  <InputField label="Lymphocytes" name="lymphocytes" placeholder="%" />
                  <InputField label="Monocytes" name="monocytes" placeholder="%" />
                  <InputField label="Eosinophils" name="eosinophils" placeholder="%" />
                  <InputField label="Basophils" name="basophils" placeholder="%" />
                </div>
             </div>

             {/* Urinalysis */}
             <div>
                <h4 className="font-bold text-blue-800 uppercase border-b border-blue-200 pb-2 mb-4 text-sm">Urinalysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputField label="Color" name="urineColor" placeholder="Yellow" />
                  <InputField label="Transparency" name="urineTransparency" placeholder="Clear" />
                  <InputField label="Reaction" name="urineReaction" />
                  <InputField label="pH" name="urinePH" placeholder="6.0" />
                  <InputField label="Specific Gravity" name="urineSpecificGravity" placeholder="1.020" />
                  <InputField label="Glucose" name="urineGlucose" placeholder="Negative" />
                  <InputField label="Protein" name="urineProtein" placeholder="Negative" />
                  <InputField label="WBC" name="urineWBC" placeholder="/HPF" />
                  <InputField label="RBC" name="urineRBC" placeholder="/HPF" />
                  <InputField label="Epithelial Cells" name="urineEpithelialCells" placeholder="Few/Moderate" />
                  <InputField label="Other / Microscopic" name="urineMicroscopicOther" />
                </div>
             </div>

             {/* Blood Typing */}
             <div>
                <h4 className="font-bold text-blue-800 uppercase border-b border-blue-200 pb-2 mb-4 text-sm">Blood Typing</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <InputField label="ABO" name="bloodTypeABO" placeholder="A, B, AB, O" />
                  <InputField label="Rh" name="bloodTypeRh" placeholder="Positive/Negative" />
                  <InputField label="Anti-A" name="antiA" />
                  <InputField label="Anti-B" name="antiB" />
                  <InputField label="Anti-D" name="antiD" />
                </div>
             </div>

             {/* Remarks */}
             <div>
                <label className="text-sm font-bold text-blue-900 uppercase">Additional Remarks</label>
                <textarea name="remarks" rows={2} placeholder="Any other findings..." className="w-full p-3 rounded-xl border border-blue-300 bg-white text-slate-900 text-sm mt-1 shadow-sm"></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 bg-white text-slate-700 rounded-xl hover:bg-slate-50 border border-slate-300 text-sm font-bold flex items-center gap-2"><X size={16}/> Cancel</button>
                 <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex gap-2 items-center text-sm font-bold shadow-md"><Save size={16}/> Save Full Record</button>
             </div>
          </form>
        )}

        <div className="space-y-4">
            {labs.length === 0 && !isAdding ? (
              <div className="p-8 text-center text-slate-500 italic bg-white border border-dashed border-slate-300 rounded-2xl">
                No laboratory results recorded yet. Click "Add Lab Record" above to document a CBC, Urinalysis, or Blood Type.
              </div>
            ) : (
                labs.map(result => {
                    const isExpanded = expandedId === result.id;
                    const dateDisplay = result.datePerformed || "Unknown Date";
                    const bloodType = result.bloodTypeABO ? `${result.bloodTypeABO} ${result.bloodTypeRh || ""}` : null;
                    const hgb = result.hemoglobin ? `Hgb: ${result.hemoglobin}` : null;
                    
                    return (
                        <div key={result.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                            {/* Header */}
                            <div 
                              onClick={() => setExpandedId(isExpanded ? null : result.id)}
                              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-sm">{dateDisplay}</div>
                                    <div className="flex gap-2 text-sm">
                                        {bloodType && <span className="bg-red-50 text-red-700 font-semibold px-2 py-0.5 rounded border border-red-100">{bloodType}</span>}
                                        {hgb && <span className="bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">{hgb}</span>}
                                        {result.urineColor && <span className="bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">Urine: {result.urineColor}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={(e) => e.stopPropagation()} className="text-blue-400 hover:text-blue-600 p-1 bg-white rounded-full transition-colors" title="Edit">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(result.id); }} className="text-slate-400 hover:text-rose-500 p-1 bg-white rounded-full transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="text-slate-400 bg-slate-50 p-1 rounded-full">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        
                                        {/* Col 1: Hematology */}
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <h5 className="font-bold text-slate-800 uppercase text-xs mb-3 border-b pb-2">Hematology</h5>
                                            <dl className="space-y-2 text-sm">
                                                <div className="flex justify-between"><dt className="text-slate-500">Hemoglobin</dt><dd className="font-mono font-medium">{result.hemoglobin || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Hematocrit</dt><dd className="font-mono font-medium">{result.hematocrit || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">WBC Count</dt><dd className="font-mono font-medium">{result.wbcCount || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">RBC Count</dt><dd className="font-mono font-medium">{result.rbcCount || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Platelet Count</dt><dd className="font-mono font-medium">{result.plateletCount || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">MCV / MCH / MCHC</dt><dd className="font-mono font-medium">{result.mcv||"—"} / {result.mch||"—"} / {result.mchc||"—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Neutrophils</dt><dd className="font-mono font-medium">{result.neutrophils || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Lymphocytes</dt><dd className="font-mono font-medium">{result.lymphocytes || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Monocytes</dt><dd className="font-mono font-medium">{result.monocytes || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Eos / Baso</dt><dd className="font-mono font-medium">{result.eosinophils||"—"} / {result.basophils||"—"}</dd></div>
                                            </dl>
                                        </div>

                                        {/* Col 2: Urinalysis */}
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <h5 className="font-bold text-slate-800 uppercase text-xs mb-3 border-b pb-2">Urinalysis</h5>
                                            <dl className="space-y-2 text-sm">
                                                <div className="flex justify-between"><dt className="text-slate-500">Color</dt><dd className="font-medium">{result.urineColor || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Transparency</dt><dd className="font-medium">{result.urineTransparency || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Reaction</dt><dd className="font-medium">{result.urineReaction || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">pH / Sp.Gr</dt><dd className="font-mono font-medium">{result.urinePH||"—"} / {result.urineSpecificGravity||"—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Glucose</dt><dd className="font-medium">{result.urineGlucose || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Protein</dt><dd className="font-medium">{result.urineProtein || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">WBC</dt><dd className="font-mono font-medium">{result.urineWBC || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">RBC</dt><dd className="font-mono font-medium">{result.urineRBC || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Epithelial</dt><dd className="font-medium">{result.urineEpithelialCells || "—"}</dd></div>
                                                <div className="flex justify-between"><dt className="text-slate-500">Other</dt><dd className="font-medium">{result.urineMicroscopicOther || "—"}</dd></div>
                                            </dl>
                                        </div>

                                        {/* Col 3: Blood Typing & Remarks */}
                                        <div className="space-y-4">
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                                <h5 className="font-bold text-slate-800 uppercase text-xs mb-3 border-b pb-2">Blood Typing</h5>
                                                <dl className="space-y-2 text-sm">
                                                    <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd className="font-medium text-red-600">{result.bloodTypeABO || "—"} {result.bloodTypeRh || ""}</dd></div>
                                                    <div className="flex justify-between"><dt className="text-slate-500">Anti-A</dt><dd className="font-medium">{result.antiA || "—"}</dd></div>
                                                    <div className="flex justify-between"><dt className="text-slate-500">Anti-B</dt><dd className="font-medium">{result.antiB || "—"}</dd></div>
                                                    <div className="flex justify-between"><dt className="text-slate-500">Anti-D</dt><dd className="font-medium">{result.antiD || "—"}</dd></div>
                                                </dl>
                                            </div>
                                            
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-full">
                                                <h5 className="font-bold text-slate-800 uppercase text-xs mb-3 border-b pb-2">Remarks</h5>
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{result.remarks || <span className="italic text-slate-400">No additional remarks.</span>}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
}
