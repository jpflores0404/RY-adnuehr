"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X, Check, Baby, Stethoscope, Pencil } from "lucide-react";
import { addPostpartumRecord, deletePostpartumRecord } from "@/app/actions/subrecords";

interface PostpartumRecordData {
  id: string;
  assessmentTime: string;
  hoursLabel: string | null;
  rapidAssessment: string | null;
  bleeding: string | null;
  uterusFirmness: string | null;
  maternalBP: string | null;
  pulse: string | null;
  temperature: string | null;
  urineVoided: string | null;
  vulvaStatus: string | null;
  newbornBreathing: string | null;
  newbornWarmth: string | null;
  newbornAbnormalSigns: string | null;
  feedingObserved: string | null;
  comments: string | null;
  motherTreatments: string | null;
  newbornTreatments: string | null;
  ifReferred: string | null;
  ifDeath: string | null;
  adviseMotherChecklist: string | null;
  adviseBabyChecklist: string | null;
  preventiveMotherChecklist: string | null;
  preventiveBabyChecklist: string | null;
}

// Advise and Counsel checklist items
const ADVISE_MOTHER_ITEMS = [
  "Postpartum Care and Hygiene",
  "Nutrition",
  "Birth Spacing and Family Planning",
  "Danger Signs",
  "Follow-up Visits",
];

const ADVISE_BABY_ITEMS = [
  "Exclusive Breastfeeding",
  "Hygiene, Cord Care and Warmth",
  "Special Advice if Low Birth Weight",
  "Danger Signs",
  "Follow-up Visits",
];

// Preventive Measures checklist items
const PREVENTIVE_MOTHER_ITEMS = [
  "Oxytocin",
  "Paracetamol",
  "Ferrous Sulfate",
];

const PREVENTIVE_BABY_ITEMS = [
  "Risk of Bacterial Infection and Treatment",
  "BCG, OPV-0, HEP-0",
  "BPR Result and Treatment",
  "TB Result and Prophylaxis",
];

interface TreatmentRow {
  time: string;
  treatment: string;
}

export default function PostpartumMonitoringForm({
  patientId,
  patientName,
  initialRecords,
}: {
  patientId: string;
  patientName: string;
  initialRecords: PostpartumRecordData[];
}) {
  const [records, setRecords] = useState<PostpartumRecordData[]>(initialRecords);
  const [isAdding, setIsAdding] = useState(false);
  const [motherTreatments, setMotherTreatments] = useState<TreatmentRow[]>([{ time: "", treatment: "" }]);
  const [newbornTreatments, setNewbornTreatments] = useState<TreatmentRow[]>([{ time: "", treatment: "" }]);
  const [adviseMotherChecked, setAdviseMotherChecked] = useState<string[]>([]);
  const [adviseBabyChecked, setAdviseBabyChecked] = useState<string[]>([]);
  const [preventiveMotherChecked, setPreventiveMotherChecked] = useState<string[]>([]);
  const [preventiveBabyChecked, setPreventiveBabyChecked] = useState<string[]>([]);

  async function handleAdd(formData: FormData) {
    // Inject JSON treatment data
    formData.set("motherTreatments", JSON.stringify(motherTreatments.filter(t => t.time || t.treatment)));
    formData.set("newbornTreatments", JSON.stringify(newbornTreatments.filter(t => t.time || t.treatment)));
    // Inject checklist data
    formData.set("adviseMotherChecklist", JSON.stringify(adviseMotherChecked));
    formData.set("adviseBabyChecklist", JSON.stringify(adviseBabyChecked));
    formData.set("preventiveMotherChecklist", JSON.stringify(preventiveMotherChecked));
    formData.set("preventiveBabyChecklist", JSON.stringify(preventiveBabyChecked));

    const newRecord = await addPostpartumRecord(patientId, formData);
    setRecords([newRecord as unknown as PostpartumRecordData, ...records]);
    setIsAdding(false);
    setMotherTreatments([{ time: "", treatment: "" }]);
    setNewbornTreatments([{ time: "", treatment: "" }]);
    setAdviseMotherChecked([]);
    setAdviseBabyChecked([]);
    setPreventiveMotherChecked([]);
    setPreventiveBabyChecked([]);
  }

  async function handleDelete(recordId: string) {
    if (!confirm("Delete this postpartum assessment?")) return;
    await deletePostpartumRecord(recordId);
    setRecords(records.filter((r) => r.id !== recordId));
  }

  function parseTreatments(json: string | null): TreatmentRow[] {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  function parseChecklist(json: string | null): string[] {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  function toggleChecklist(item: string, checked: string[], setChecked: (v: string[]) => void) {
    if (checked.includes(item)) {
      setChecked(checked.filter(c => c !== item));
    } else {
      setChecked([...checked, item]);
    }
  }

  // Define assessment row config
  const ASSESSMENT_ROWS = [
    { key: "rapidAssessment", label: "RAPID ASSESSMENT (STABLE +/+)", shortLabel: "RAPID" },
    { key: "bleeding", label: "BLEEDING (+/-)", shortLabel: "BLEED" },
    { key: "uterusFirmness", label: "UTERUS HARD/ROUND?", shortLabel: "UTERUS" },
    { key: "maternalBP", label: "MATERNAL BLOOD PRESSURE", shortLabel: "BP" },
    { key: "pulse", label: "PULSE", shortLabel: "PULSE" },
    { key: "temperature", label: "TEMPERATURE", shortLabel: "TEMP" },
    { key: "urineVoided", label: "URINE VOIDED", shortLabel: "URINE" },
    { key: "vulvaStatus", label: "VULVA", shortLabel: "VULVA" },
    { key: "newbornBreathing", label: "NEWBORN BREATHING", shortLabel: "NB BREATH" },
    { key: "newbornWarmth", label: "WARMTH", shortLabel: "WARMTH" },
    { key: "newbornAbnormalSigns", label: "NEWBORN ABNORMAL SIGNS (LIST)", shortLabel: "NB SIGNS" },
    { key: "feedingObserved", label: "TIME FEEDING OBSERVED", shortLabel: "FEEDING" },
    { key: "comments", label: "COMMENTS", shortLabel: "COMMENTS" },
  ];

  // Time column labels for the standard postpartum form
  const TIME_COLUMNS = [
    "EVERY 5-15 MIN FOR 1ST HOUR",
    "2HR", "2HR", "4HR", "4HR", "8HR", "8HR",
    "12HR", "12HR", "16HR", "16HR", "20HR", "24HR"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-extrabold text-rose-900 uppercase tracking-widest flex items-center gap-2">
              <Stethoscope size={20} className="text-rose-600" />
              Postpartum Monitoring Form
            </h2>
            <p className="text-sm text-rose-700 mt-1 font-medium">
              Patient&apos;s Name: <span className="underline font-bold">{patientName}</span>
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus size={16} /> Add Assessment
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          action={handleAdd}
          className="bg-white border-2 border-rose-200 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-rose-50 border-b border-rose-200 p-4">
            <h3 className="font-bold text-rose-900 uppercase tracking-wider text-sm flex items-center gap-2">
              <Plus size={16} /> New Postpartum Assessment
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Row 1: Time + Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Assessment Time</label>
                <input required name="assessmentTime" type="time" className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Hours Label</label>
                <select name="hoursLabel" className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium">
                  <option value="">Select...</option>
                  <option value="Every 5-15 min">Every 5-15 min (1st hr)</option>
                  <option value="2HR">2 HR</option>
                  <option value="4HR">4 HR</option>
                  <option value="8HR">8 HR</option>
                  <option value="12HR">12 HR</option>
                  <option value="16HR">16 HR</option>
                  <option value="20HR">20 HR</option>
                  <option value="24HR">24 HR</option>
                </select>
              </div>
            </div>

            {/* Mother Assessment */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">Mother Assessment</h4>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Rapid Assessment</label>
                  <select name="rapidAssessment" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900">
                    <option value="">—</option>
                    <option value="STABLE">STABLE</option>
                    <option value="STABLE ++">STABLE ++</option>
                    <option value="UNSTABLE">UNSTABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Bleeding (+/-)</label>
                  <select name="bleeding" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900">
                    <option value="">—</option>
                    <option value="-">(-)</option>
                    <option value="+">+</option>
                    <option value="++">++</option>
                    <option value="+++">+++</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Uterus Hard/Round?</label>
                  <select name="uterusFirmness" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900">
                    <option value="">—</option>
                    <option value="YES">✓ Yes</option>
                    <option value="NO">✗ No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Maternal BP (mmHg)</label>
                  <input name="maternalBP" type="text" placeholder="120/80" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Pulse (bpm)</label>
                  <input name="pulse" type="text" placeholder="88" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Temperature</label>
                  <input name="temperature" type="text" placeholder="36.5" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Urine Voided</label>
                  <select name="urineVoided" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900">
                    <option value="">—</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Vulva</label>
                  <input name="vulvaStatus" type="text" placeholder="CLEAN" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
              </div>
            </div>

            {/* Newborn Assessment */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-pink-50 border-b border-pink-200 px-4 py-3">
                <h4 className="font-bold text-pink-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Baby size={14} /> Newborn Assessment
                </h4>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Newborn Breathing</label>
                  <input name="newbornBreathing" type="text" placeholder="REGULAR" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Warmth</label>
                  <input name="newbornWarmth" type="text" placeholder="WARM" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Abnormal Signs</label>
                  <input name="newbornAbnormalSigns" type="text" placeholder="NONE" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
                </div>
              </div>
            </div>

            {/* Feeding & Comments */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Time Feeding Observed</label>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-1 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="feedingObserved" value="FEEDING WELL" className="accent-rose-600" />
                    Feeding Well
                  </label>
                  <label className="flex items-center gap-1 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="feedingObserved" value="DIFFICULTY" className="accent-rose-600" />
                    Difficulty
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Comments</label>
                <textarea name="comments" rows={2} placeholder="E.g., Baby latches well, mother comfortable..." className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
              </div>
            </div>

            {/* Planned Treatment - Mother */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex justify-between items-center">
                <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Planned Treatment — Mother</h4>
                <button
                  type="button"
                  onClick={() => setMotherTreatments([...motherTreatments, { time: "", treatment: "" }])}
                  className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="p-4 space-y-2">
                {motherTreatments.map((t, i) => (
                  <div key={i} className="grid grid-cols-[150px_1fr_32px] gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Time"
                      value={t.time}
                      onChange={(e) => {
                        const updated = [...motherTreatments];
                        updated[i].time = e.target.value;
                        setMotherTreatments(updated);
                      }}
                      className="p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Treatment Given"
                      value={t.treatment}
                      onChange={(e) => {
                        const updated = [...motherTreatments];
                        updated[i].treatment = e.target.value;
                        setMotherTreatments(updated);
                      }}
                      className="p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                    />
                    {motherTreatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMotherTreatments(motherTreatments.filter((_, j) => j !== i))}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Planned Treatment - Newborn */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-violet-50 border-b border-violet-200 px-4 py-3 flex justify-between items-center">
                <h4 className="font-bold text-violet-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Baby size={14} /> Planned Treatment — Newborn
                </h4>
                <button
                  type="button"
                  onClick={() => setNewbornTreatments([...newbornTreatments, { time: "", treatment: "" }])}
                  className="text-violet-600 hover:text-violet-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="p-4 space-y-2">
                {newbornTreatments.map((t, i) => (
                  <div key={i} className="grid grid-cols-[150px_1fr_32px] gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Time"
                      value={t.time}
                      onChange={(e) => {
                        const updated = [...newbornTreatments];
                        updated[i].time = e.target.value;
                        setNewbornTreatments(updated);
                      }}
                      className="p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Treatment Given"
                      value={t.treatment}
                      onChange={(e) => {
                        const updated = [...newbornTreatments];
                        updated[i].treatment = e.target.value;
                        setNewbornTreatments(updated);
                      }}
                      className="p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                    />
                    {newbornTreatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewbornTreatments(newbornTreatments.filter((_, j) => j !== i))}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Advise and Counsel */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-100 border-b border-rose-300 px-4 py-3">
                <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider">Advise and Counsel</h4>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mother */}
                <div>
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Mother</h5>
                  <div className="space-y-2">
                    {ADVISE_MOTHER_ITEMS.map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={adviseMotherChecked.includes(item)}
                          onChange={() => toggleChecklist(item, adviseMotherChecked, setAdviseMotherChecked)}
                          className="accent-rose-600 w-4 h-4 rounded"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Baby */}
                <div>
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-1"><Baby size={12} /> Baby</h5>
                  <div className="space-y-2">
                    {ADVISE_BABY_ITEMS.map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={adviseBabyChecked.includes(item)}
                          onChange={() => toggleChecklist(item, adviseBabyChecked, setAdviseBabyChecked)}
                          className="accent-rose-600 w-4 h-4 rounded"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preventive Measures */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-100 border-b border-rose-300 px-4 py-3">
                <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider">Preventive Measures</h4>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* For Mother */}
                <div>
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">For Mother</h5>
                  <div className="space-y-2">
                    {PREVENTIVE_MOTHER_ITEMS.map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={preventiveMotherChecked.includes(item)}
                          onChange={() => toggleChecklist(item, preventiveMotherChecked, setPreventiveMotherChecked)}
                          className="accent-rose-600 w-4 h-4 rounded"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                {/* For Baby */}
                <div>
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-1"><Baby size={12} /> For Baby</h5>
                  <div className="space-y-2">
                    {PREVENTIVE_BABY_ITEMS.map(item => (
                      <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={preventiveBabyChecked.includes(item)}
                          onChange={() => toggleChecklist(item, preventiveBabyChecked, setPreventiveBabyChecked)}
                          className="accent-rose-600 w-4 h-4 rounded"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Referral & Death Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">If Referred (Mother of Newborn), Record Time and Explain</label>
                <textarea name="ifReferred" rows={2} placeholder="Not referred. Both mother and baby stable" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">If Death (Mother or Newborn), Date, Time and Cause</label>
                <textarea name="ifDeath" rows={2} placeholder="Not applicable" className="w-full p-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setMotherTreatments([{ time: "", treatment: "" }]);
                setNewbornTreatments([{ time: "", treatment: "" }]);
                setAdviseMotherChecked([]);
                setAdviseBabyChecked([]);
                setPreventiveMotherChecked([]);
                setPreventiveBabyChecked([]);
              }}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-sm font-semibold transition-colors flex items-center gap-2 shadow-md"
            >
              <Save size={16} /> Save Assessment
            </button>
          </div>
        </form>
      )}

      {/* Postpartum Record Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-4">
          <h3 className="font-bold text-rose-900 uppercase tracking-widest text-sm">Postpartum Record</h3>
          <p className="text-xs text-rose-600 mt-0.5">Time-series assessments for mother and newborn</p>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-medium">
            <Stethoscope size={40} className="mx-auto mb-3 text-slate-300" />
            <p>No postpartum assessments recorded yet.</p>
            <p className="text-xs mt-1">Click &quot;Add Assessment&quot; to begin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-3 font-bold text-xs uppercase tracking-wider sticky left-0 bg-slate-800 z-10 min-w-[180px]">Assessment</th>
                  {records.map((r) => (
                    <th key={r.id} className="p-3 font-semibold text-center min-w-[100px]">
                      <div className="text-xs">{r.hoursLabel || "—"}</div>
                      <div className="text-[10px] font-normal text-slate-300">{r.assessmentTime}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASSESSMENT_ROWS.map((row, rowIdx) => (
                  <tr key={row.key} className={`border-b border-slate-100 ${rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"} ${
                    row.key === "newbornBreathing" ? "border-t-2 border-t-pink-200" : ""
                  }`}>
                    <td className="p-3 font-bold text-slate-700 text-[11px] uppercase tracking-wider sticky left-0 bg-inherit z-10">
                      {row.key === "newbornBreathing" && (
                        <span className="text-pink-600 text-[9px] block mb-0.5">▸ NEWBORN</span>
                      )}
                      {row.label}
                    </td>
                    {records.map((r) => {
                      const val = (r as any)[row.key];
                      let cellClass = "p-3 text-center text-slate-700 font-medium";
                      
                      if (row.key === "uterusFirmness") {
                        if (val === "YES") cellClass += " text-emerald-600";
                        if (val === "NO") cellClass += " text-rose-600";
                      }
                      if (row.key === "bleeding") {
                        if (val === "-") cellClass += " text-emerald-600";
                        if (val && val !== "-") cellClass += " text-rose-600 font-bold";
                      }

                      return (
                        <td key={r.id} className={cellClass}>
                          {row.key === "uterusFirmness" && val === "YES" ? (
                            <Check size={16} className="mx-auto text-emerald-600" />
                          ) : row.key === "uterusFirmness" && val === "NO" ? (
                            <X size={16} className="mx-auto text-rose-500" />
                          ) : (
                            val || "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Delete row */}
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td className="p-3 font-bold text-slate-500 text-[11px] uppercase tracking-wider sticky left-0 bg-slate-50 z-10">Actions</td>
                  {records.map((r) => (
                    <td key={r.id} className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          title="Edit assessment"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-rose-400 hover:text-rose-600 transition-colors"
                          title="Delete assessment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Planned Treatment Tables */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mother Treatment Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-4">
              <h3 className="font-bold text-emerald-900 uppercase tracking-widest text-xs">Planned Treatment — Mother</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Planned Treatment</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Time</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Treatment Given</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const treatments = parseTreatments(r.motherTreatments);
                    if (treatments.length === 0) return null;
                    return treatments.map((t, i) => (
                      <tr key={`${r.id}-m-${i}`} className="border-b border-slate-100 hover:bg-slate-50">
                        {i === 0 && (
                          <td rowSpan={treatments.length} className="p-3 text-slate-500 text-xs font-medium align-top border-r border-slate-100">
                            MOTHER
                          </td>
                        )}
                        <td className="p-3 text-slate-700 font-mono text-xs">{t.time || "—"}</td>
                        <td className="p-3 text-slate-900 font-medium text-xs">{t.treatment || "—"}</td>
                      </tr>
                    ));
                  })}
                  {records.every(r => !parseTreatments(r.motherTreatments).length) && (
                    <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-xs">No treatments recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Newborn Treatment Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-violet-50 border-b border-violet-200 px-6 py-4">
              <h3 className="font-bold text-violet-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <Baby size={14} /> Planned Treatment — Newborn
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Planned Treatment</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Time</th>
                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase">Treatment Given</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const treatments = parseTreatments(r.newbornTreatments);
                    if (treatments.length === 0) return null;
                    return treatments.map((t, i) => (
                      <tr key={`${r.id}-nb-${i}`} className="border-b border-slate-100 hover:bg-slate-50">
                        {i === 0 && (
                          <td rowSpan={treatments.length} className="p-3 text-slate-500 text-xs font-medium align-top border-r border-slate-100">
                            NEWBORN
                          </td>
                        )}
                        <td className="p-3 text-slate-700 font-mono text-xs">{t.time || "—"}</td>
                        <td className="p-3 text-slate-900 font-medium text-xs">{t.treatment || "—"}</td>
                      </tr>
                    ));
                  })}
                  {records.every(r => !parseTreatments(r.newbornTreatments).length) && (
                    <tr><td colSpan={3} className="p-4 text-center text-slate-400 text-xs">No treatments recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Advise and Counsel Display */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advise and Counsel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-rose-100 border-b border-rose-300 px-6 py-4">
              <h3 className="font-bold text-rose-900 uppercase tracking-widest text-xs">Advise and Counsel</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Mother */}
              <div>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Mother</h4>
                <div className="space-y-1.5">
                  {ADVISE_MOTHER_ITEMS.map(item => {
                    const isChecked = records.some(r => parseChecklist(r.adviseMotherChecklist).includes(item));
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        {isChecked ? (
                          <Check size={14} className="text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0" />
                        )}
                        <span className={isChecked ? "text-slate-900 font-medium" : "text-slate-400"}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Baby */}
              <div>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2 flex items-center gap-1"><Baby size={12} /> Baby</h4>
                <div className="space-y-1.5">
                  {ADVISE_BABY_ITEMS.map(item => {
                    const isChecked = records.some(r => parseChecklist(r.adviseBabyChecklist).includes(item));
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        {isChecked ? (
                          <Check size={14} className="text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0" />
                        )}
                        <span className={isChecked ? "text-slate-900 font-medium" : "text-slate-400"}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-rose-100 border-b border-rose-300 px-6 py-4">
              <h3 className="font-bold text-rose-900 uppercase tracking-widest text-xs">Preventive Measures</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* For Mother */}
              <div>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">For Mother</h4>
                <div className="space-y-1.5">
                  {PREVENTIVE_MOTHER_ITEMS.map(item => {
                    const isChecked = records.some(r => parseChecklist(r.preventiveMotherChecklist).includes(item));
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        {isChecked ? (
                          <Check size={14} className="text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0" />
                        )}
                        <span className={isChecked ? "text-slate-900 font-medium" : "text-slate-400"}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* For Baby */}
              <div>
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2 flex items-center gap-1"><Baby size={12} /> For Baby</h4>
                <div className="space-y-1.5">
                  {PREVENTIVE_BABY_ITEMS.map(item => {
                    const isChecked = records.some(r => parseChecklist(r.preventiveBabyChecklist).includes(item));
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        {isChecked ? (
                          <Check size={14} className="text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-slate-300 rounded flex-shrink-0" />
                        )}
                        <span className={isChecked ? "text-slate-900 font-medium" : "text-slate-400"}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral & Death Info */}
      {records.length > 0 && records.some(r => r.ifReferred || r.ifDeath) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">Referral & Death Information</h3>
          </div>
          <div className="p-6">
            <table className="w-full text-left text-sm">
              <tbody>
                {records.filter(r => r.ifReferred).map(r => (
                  <tr key={`ref-${r.id}`} className="border-b border-slate-100">
                    <td className="p-3 font-bold text-slate-500 text-xs uppercase w-1/3">If Referred (Mother of Newborn), Record Time and Explain</td>
                    <td className="p-3 text-slate-900">{r.ifReferred}</td>
                  </tr>
                ))}
                {records.filter(r => r.ifDeath).map(r => (
                  <tr key={`death-${r.id}`} className="border-b border-slate-100">
                    <td className="p-3 font-bold text-slate-500 text-xs uppercase w-1/3">If Death (Mother or Newborn), Date, Time and Cause</td>
                    <td className="p-3 text-slate-900">{r.ifDeath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
