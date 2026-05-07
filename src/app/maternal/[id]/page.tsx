import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PatientChartTabs from "@/components/PatientChartTabs";
import { notFound } from "next/navigation";
import { getMaternalPatientChart } from "@/lib/maternal-sql";

export default async function MaternalChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getMaternalPatientChart(id);

  if (!patient) return notFound();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 glass-card p-6">
        <Link href="/maternal" className="p-2 hover:bg-white/40 rounded-full transition-all flex-shrink-0 border border-transparent hover:border-white/60">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {patient.lastName as string}, {patient.firstName as string} {(patient.middleName as string) || ""}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border ${(patient.status as string) === "Active" ? "bg-emerald-100/50 text-emerald-800 border-emerald-300/50" : "bg-slate-100/50 text-slate-700 border-slate-300/50"}`}>
              {patient.status as string}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-500">
            <p><span className="font-medium text-slate-700">ADM #:</span> {patient.admissionNumber as string}</p>
            <p><span className="font-medium text-slate-700">Admitted:</span> {new Date(patient.dateAdmitted as any).toLocaleDateString()}</p>
            <p><span className="font-medium text-slate-700">Attending MD:</span> {(patient.attendingPhysician as string) || "Unassigned"}</p>
            <p><span className="font-medium text-slate-700">Age:</span> {patient.age as number} yrs</p>
          </div>
        </div>
      </div>

      <PatientChartTabs patient={JSON.parse(JSON.stringify(patient))} />
    </div>
  );
}
