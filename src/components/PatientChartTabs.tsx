"use client";

import { useMemo, useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import DynamicVitalsTable from "./DynamicVitalsTable";
import DynamicMedicationTable from "./DynamicMedicationTable";
import DynamicPhysicianOrdersTable from "./DynamicPhysicianOrdersTable";
import DynamicNurseNotes from "./DynamicNurseNotes";
import DynamicLabTable from "./DynamicLabTable";
import DynamicUltrasoundTable from "./DynamicUltrasoundTable";

interface PatientChartTabsProps {
  patient: any;
}

type Adpie = {
  diagnosis: string;
  planning: string;
  intervention: string;
  evaluation: string;
};

type IntakeOutput = {
  oralIntakeMl: string;
  ivIntakeMl: string;
  urineOutputMl: string;
  stoolCount: string;
  notes: string;
};

const TABS = [
  "Patient Profile & Demographics",
  "Vital Signs Flowsheet",
  "Medications",
  "Doctor's Orders",
  "Nursing Notes (FDAR)",
  "Care Plan (ADPIE)",
  "Diagnostics / Procedures",
  "Intake & Output (I&O)",
  "INFOGRAPHICS",
] as const;

const CLINICAL_SEED: Record<string, { chiefComplaint: string; adpie: Adpie; io: IntakeOutput }> = {
  "ADM-2026-001": {
    chiefComplaint: "Lower abdominal pain and uterine contractions.",
    adpie: {
      diagnosis: "Risk for impaired maternal/fetal well-being.",
      planning: "Maintain maternal and fetal stability prior to operative delivery.",
      intervention: "Monitor VS/FHR, administer insulin as ordered, prep for OR and maintain NPO.",
      evaluation: "Stable prior to surgery.",
    },
    io: { oralIntakeMl: "500", ivIntakeMl: "1000", urineOutputMl: "1200", stoolCount: "0", notes: "Strict monitoring ongoing." },
  },
  "ADM-2026-002": {
    chiefComplaint: "Severe headache, elevated BP, contractions.",
    adpie: {
      diagnosis: "Risk for decreased maternal/fetal perfusion related to hypertension.",
      planning: "Maintain controlled BP and safe labor progression.",
      intervention: "BP monitoring, left lateral position, antihypertensives, strict I&O.",
      evaluation: "BP controlled, discharged stable.",
    },
    io: { oralIntakeMl: "1500", ivIntakeMl: "1000", urineOutputMl: "1500", stoolCount: "0", notes: "Urine output ranged 1400-1600 mL." },
  },
  "ADM-2026-003": {
    chiefComplaint: "Profuse vaginal bleeding post-delivery, dizziness.",
    adpie: {
      diagnosis: "Risk for hypovolemic shock.",
      planning: "Stop bleeding and maintain hemodynamic stability.",
      intervention: "Fundal massage, IV fluids, uterotonics, transfusion prep.",
      evaluation: "Bleeding controlled, VS stable.",
    },
    io: { oralIntakeMl: "300", ivIntakeMl: "1500", urineOutputMl: "900", stoolCount: "0", notes: "Close postpartum monitoring." },
  },
  "ADM-2026-004": {
    chiefComplaint: "Painless vaginal bleeding.",
    adpie: {
      diagnosis: "Risk for hemorrhage.",
      planning: "Prevent further bleeding while preparing for possible C-section.",
      intervention: "Strict bed rest, avoid vaginal exams, continuous FHR, OR prep.",
      evaluation: "No further bleeding.",
    },
    io: { oralIntakeMl: "800", ivIntakeMl: "1000", urineOutputMl: "1100", stoolCount: "0", notes: "Bleeding currently controlled." },
  },
};

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default function PatientChartTabs({ patient }: PatientChartTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Patient Profile & Demographics");

  const seeded = useMemo(() => {
    return CLINICAL_SEED[patient.admissionNumber] ?? {
      chiefComplaint: "",
      adpie: { diagnosis: "", planning: "", intervention: "", evaluation: "" },
      io: { oralIntakeMl: "", ivIntakeMl: "", urineOutputMl: "", stoolCount: "", notes: "" },
    };
  }, [patient.admissionNumber]);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    fullName: `${patient.firstName} ${patient.middleName || ""} ${patient.lastName}`.replace(/\s+/g, " ").trim(),
    ageSex: `${patient.age} y/o, ${patient.gender}`,
    dob: formatDate(patient.dateOfBirth),
    address: patient.address || "—",
    civilStatus: patient.civilStatus || "—",
    religion: patient.religion || "—",
    occupation: patient.occupation || "—",
    diet: patient.diet || "As Ordered",
    weight: patient.weight || "—",
    height: patient.height || "—",
    bloodType: [patient.bloodTypeABO, patient.bloodTypeRh].filter(Boolean).join(" ") || "—",
    diagnosis: patient.admittingDiagnosis || "—",
    attending: patient.attendingPhysician || "—",
    admitted: formatDate(patient.dateAdmitted),
    discharged: formatDate(patient.dateDischarged),
    chiefComplaint: seeded.chiefComplaint,
  });

  const [editingAdpie, setEditingAdpie] = useState(false);
  const [adpie, setAdpie] = useState<Adpie>(seeded.adpie);

  const [editingIo, setEditingIo] = useState(false);
  const [io, setIo] = useState<IntakeOutput>(seeded.io);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[620px]">
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-r border-slate-200 transition-colors ${
              activeTab === tab ? "bg-white text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "Patient Profile & Demographics" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Patient Profile</h3>
              <div className="flex gap-2">
                {!editingProfile ? (
                  <button onClick={() => setEditingProfile(true)} className="px-3 py-1.5 border rounded-lg text-sm text-blue-700 border-blue-200 bg-blue-50 flex items-center gap-1"><Edit3 size={14} />Edit</button>
                ) : (
                  <>
                    <button onClick={() => setEditingProfile(false)} className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1"><X size={14} />Cancel</button>
                    <button onClick={() => setEditingProfile(false)} className="px-3 py-1.5 border rounded-lg text-sm text-white bg-blue-600 border-blue-600 flex items-center gap-1"><Save size={14} />Save</button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile).map(([key, value]) => (
                <div key={key} className="border rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
                  {editingProfile ? (
                    <input
                      value={value}
                      onChange={(e) => setProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full border rounded-md px-2 py-1.5 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-slate-900">{value || "—"}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">Profile edits can be done directly in this tab.</p>
          </div>
        )}

        {activeTab === "Vital Signs Flowsheet" && <DynamicVitalsTable patientId={patient.id} initialVitals={patient.vitalSigns} />}
        {activeTab === "Medications" && <DynamicMedicationTable patientId={patient.id} initialMeds={patient.medications} />}
        {activeTab === "Doctor's Orders" && <DynamicPhysicianOrdersTable patientId={patient.id} initialOrders={patient.physicianOrders} />}
        {activeTab === "Nursing Notes (FDAR)" && <DynamicNurseNotes patientId={patient.id} initialNotes={patient.nurseNotes} />}

        {activeTab === "Care Plan (ADPIE)" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">ADPIE Care Plan</h3>
              <div className="flex gap-2">
                {!editingAdpie ? (
                  <button onClick={() => setEditingAdpie(true)} className="px-3 py-1.5 border rounded-lg text-sm text-blue-700 border-blue-200 bg-blue-50 flex items-center gap-1"><Edit3 size={14} />Edit</button>
                ) : (
                  <>
                    <button onClick={() => setEditingAdpie(false)} className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1"><X size={14} />Cancel</button>
                    <button onClick={() => setEditingAdpie(false)} className="px-3 py-1.5 border rounded-lg text-sm text-white bg-blue-600 border-blue-600 flex items-center gap-1"><Save size={14} />Save</button>
                  </>
                )}
              </div>
            </div>

            {(
              [
                ["Assessment / Diagnosis", "diagnosis"],
                ["Planning", "planning"],
                ["Intervention", "intervention"],
                ["Evaluation", "evaluation"],
              ] as const
            ).map(([label, field]) => (
              <div key={field} className="border rounded-xl p-3">
                <p className="text-xs uppercase text-slate-500">{label}</p>
                {editingAdpie ? (
                  <textarea
                    value={adpie[field]}
                    onChange={(e) => setAdpie((prev) => ({ ...prev, [field]: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full border rounded-md px-2 py-1.5 text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">{adpie[field] || "—"}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "Diagnostics / Procedures" && (
          <div className="space-y-8">
            <DynamicLabTable patientId={patient.id} initialLabs={patient.labResults || []} />
            <DynamicUltrasoundTable patientId={patient.id} initialUltrasounds={patient.ultrasoundResults || []} />
          </div>
        )}

        {activeTab === "Intake & Output (I&O)" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Intake & Output Summary</h3>
              <div className="flex gap-2">
                {!editingIo ? (
                  <button onClick={() => setEditingIo(true)} className="px-3 py-1.5 border rounded-lg text-sm text-blue-700 border-blue-200 bg-blue-50 flex items-center gap-1"><Edit3 size={14} />Edit</button>
                ) : (
                  <>
                    <button onClick={() => setEditingIo(false)} className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1"><X size={14} />Cancel</button>
                    <button onClick={() => setEditingIo(false)} className="px-3 py-1.5 border rounded-lg text-sm text-white bg-blue-600 border-blue-600 flex items-center gap-1"><Save size={14} />Save</button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(io).map(([key, value]) => (
                <div key={key} className="border rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
                  {editingIo ? (
                    <input
                      value={value}
                      onChange={(e) => setIo((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="mt-1 w-full border rounded-md px-2 py-1.5 text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-slate-900">{value || "—"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "INFOGRAPHICS" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Infographics</h3>
            <p className="text-sm text-slate-600">
              RR25 G1 MODULES 2 content is shown below. Scroll inside the viewer to read all pages.
            </p>
            <div className="h-[70vh] min-h-[520px] max-h-[900px] overflow-y-auto border border-slate-200 rounded-xl bg-slate-50">
              <iframe
                title="RR25 G1 MODULES 2"
                src="/rr25-g1-modules-2.pdf"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
