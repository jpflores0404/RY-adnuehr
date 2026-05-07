import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPatientRecord } from "@/app/actions/patient-sql";

export default function NewPatientPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/maternal" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Patient</h1>
          <p className="text-slate-500 mt-1">Create a customizable patient chart record.</p>
        </div>
      </div>

      <form action={createPatientRecord} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">Profile & Demographics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="firstName" placeholder="First Name" className="p-2.5 rounded-lg border" />
            <input required name="lastName" placeholder="Last Name" className="p-2.5 rounded-lg border" />
            <input name="middleName" placeholder="Middle Name" className="p-2.5 rounded-lg border" />
            <input required type="number" name="age" placeholder="Age" className="p-2.5 rounded-lg border" />
            <input name="gender" defaultValue="Female" placeholder="Gender" className="p-2.5 rounded-lg border" />
            <input name="civilStatus" defaultValue="Married" placeholder="Civil Status" className="p-2.5 rounded-lg border" />
            <input required type="date" name="dateOfBirth" className="p-2.5 rounded-lg border" />
            <input name="religion" placeholder="Religion" className="p-2.5 rounded-lg border" />
            <input required name="address" placeholder="Address" className="p-2.5 rounded-lg border md:col-span-2" />
            <input name="occupation" placeholder="Occupation" className="p-2.5 rounded-lg border" />
            <input name="contactNumber" placeholder="Contact Number" className="p-2.5 rounded-lg border" />
            <input type="date" name="dateAdmitted" defaultValue={new Date().toISOString().split("T")[0]} className="p-2.5 rounded-lg border" />
            <input name="attendingPhysician" placeholder="Attending Physician" className="p-2.5 rounded-lg border" />
            <input name="bloodTypeABO" placeholder="Blood Type ABO" className="p-2.5 rounded-lg border" />
            <input name="bloodTypeRh" placeholder="Rh (+/-)" className="p-2.5 rounded-lg border" />
            <input name="aog" placeholder="AOG" className="p-2.5 rounded-lg border" />
            <input name="preExistingIllness" placeholder="Pre-existing Illness" className="p-2.5 rounded-lg border" />
            <textarea name="admittingDiagnosis" placeholder="Admitting Diagnosis" className="p-2.5 rounded-lg border md:col-span-2" rows={2} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">Care Plan (ADPIE)</h2>
          <div className="grid grid-cols-1 gap-4">
            <textarea name="adpieDiagnosis" placeholder="Diagnosis" className="p-2.5 rounded-lg border" rows={2} />
            <textarea name="adpiePlanning" placeholder="Planning" className="p-2.5 rounded-lg border" rows={2} />
            <textarea name="adpieIntervention" placeholder="Intervention" className="p-2.5 rounded-lg border" rows={2} />
            <textarea name="adpieEvaluation" placeholder="Evaluation" className="p-2.5 rounded-lg border" rows={2} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">Intake & Output</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="oralIntakeMl" placeholder="Oral Intake (mL)" className="p-2.5 rounded-lg border" />
            <input name="ivIntakeMl" placeholder="IV Intake (mL)" className="p-2.5 rounded-lg border" />
            <input name="urineOutputMl" placeholder="Urine Output (mL)" className="p-2.5 rounded-lg border" />
            <input name="stoolCount" placeholder="Stool Count" className="p-2.5 rounded-lg border" />
            <textarea name="ioNotes" placeholder="I&O notes" className="p-2.5 rounded-lg border md:col-span-2" rows={2} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/maternal" className="px-4 py-2.5 rounded-lg border">Cancel</Link>
          <button type="submit" className="px-4 py-2.5 rounded-lg bg-blue-600 text-white flex items-center gap-2">
            <Save size={16} /> Save New Patient
          </button>
        </div>
      </form>
    </div>
  );
}
