import Link from "next/link";
import { Search } from "lucide-react";
import { getMaternalPatients } from "@/lib/maternal-sql";

export default async function MaternalRecordsList() {
  const patients = await getMaternalPatients();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Maternal Records</h1>
          <p className="text-slate-500 mt-2">SQL-first maternal charting dashboard.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 glass-header">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-slate-700 placeholder-slate-400 glass-input transition-all duration-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="glass-header text-slate-700 text-sm">
                <th className="p-4 font-semibold">Patient Name</th>
                <th className="p-4 font-semibold">Admission #</th>
                <th className="p-4 font-semibold">Age</th>
                <th className="p-4 font-semibold">Physician</th>
                <th className="p-4 font-semibold">Date Admitted</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No maternal records found.
                  </td>
                </tr>
              ) : (
                patients.map((patient: any) => (
                  <tr key={patient.id as string} className="border-b border-white/40 hover:bg-white/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{patient.lastName as string}, {patient.firstName as string}</div>
                      <div className="text-xs text-slate-500">{patient.contactNumber as string}</div>
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-700">{patient.admissionNumber as string}</td>
                    <td className="p-4 text-slate-700">{patient.age as number}</td>
                    <td className="p-4 text-slate-700">{(patient.attendingPhysician as string) || "Unassigned"}</td>
                    <td className="p-4 text-slate-700">{new Date(patient.dateAdmitted as any).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${(patient.status as string) === "Active"
                            ? "bg-emerald-100/50 text-emerald-800 border-emerald-300/50"
                            : "bg-slate-100/50 text-slate-700 border-slate-300/50"
                          }`}
                      >
                        {patient.status as string}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/maternal/${patient.id as string}`}
                        className="inline-block border border-white/60 hover:border-blue-400 bg-white/40 hover:bg-white/80 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
                      >
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
