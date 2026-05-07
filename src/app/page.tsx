import Link from "next/link";
import { Users, Activity, AlertCircle } from "lucide-react";
import { getDashboardData } from "@/lib/maternal-sql";

export default async function Dashboard() {
  const { totalMaternal, activeMaternal, recentAdmissions } = await getDashboardData();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of active patients and recent admissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Maternal Records" value={totalMaternal} icon={Users} color="bg-red-500" />
        <StatCard title="Active Admissions" value={activeMaternal} icon={Activity} color="bg-red-600" />
        <StatCard title="Critical Alerts" value={0} icon={AlertCircle} color="bg-slate-400" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 glass-header flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Recent Admissions</h2>
          <Link href="/maternal" className="glass-button-primary px-4 py-2 rounded-xl font-medium transition-all text-sm">
            View Patient Charts
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="glass-header text-slate-700 text-sm">
                <th className="p-4 font-semibold">Patient Name</th>
                <th className="p-4 font-semibold">Admission #</th>
                <th className="p-4 font-semibold">Date Admitted</th>
                <th className="p-4 font-semibold">Diagnosis</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No recent admissions found.</td>
                </tr>
              ) : (
                recentAdmissions.map((patient: any) => (
                  <tr key={patient.id as string} className="border-b border-white/40 hover:bg-white/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{patient.lastName as string}, {patient.firstName as string}</td>
                    <td className="p-4 text-slate-700">{patient.admissionNumber as string}</td>
                    <td className="p-4 text-slate-700">{new Date(patient.dateAdmitted as string).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-700 truncate max-w-xs">{patient.admittingDiagnosis as string}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm ${(patient.status as string) === "Active" ? "bg-emerald-100/50 text-emerald-800 border-emerald-300/50" : "bg-slate-100/50 text-slate-700 border-slate-300/50"}`}>
                        {patient.status as string}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/maternal/${patient.id as string}`} className="text-red-700 hover:text-red-900 bg-white/40 hover:bg-white/80 px-3 py-1.5 rounded-lg border border-white/60 text-sm font-semibold shadow-sm transition-all">
                        View Chart
                      </Link>
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

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <div className="glass-card p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg backdrop-blur-md bg-opacity-90`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
