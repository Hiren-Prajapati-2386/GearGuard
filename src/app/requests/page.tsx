import db from "@/lib/db";
import CreateRequestModal from "@/components/CreateRequestModal";
import Link from "next/link"; // Needed for the "Clear Filter" button
import { AlertTriangle, CheckCircle2, Clock, FilterX } from "lucide-react";

// Define the type for URL parameters
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function RequestsPage({ searchParams }: Props) {
  // 1. Get equipmentId from the URL (if it exists)
  const equipmentId = typeof searchParams.equipmentId === 'string' ? searchParams.equipmentId : undefined;

  // 2. Create the filter condition
  const whereCondition = equipmentId ? { equipmentId } : {};

  // 3. Fetch requests (applying the filter if needed)
  const requests = await db.request.findMany({
    where: whereCondition,
    include: {
      equipment: true,
      team: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const equipmentList = await db.equipment.findMany({
    include: { team: true }
  });

  // 4. Get the equipment name to show a nice title
  let pageTitle = "Maintenance Requests";
  if (equipmentId) {
    const eq = await db.equipment.findUnique({ where: { id: equipmentId } });
    if (eq) pageTitle = `History for: ${eq.name}`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-extrabold text-slate-900">{pageTitle}</h1>
           <div className="flex items-center gap-3 mt-1">
             <p className="text-slate-500">Manage breakdown tickets and work orders.</p>
             
             {/* Show 'Clear Filter' button if a filter is active */}
             {equipmentId && (
               <Link 
                 href="/requests" 
                 className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
               >
                 <FilterX size={12} /> Clear Filter
               </Link>
             )}
           </div>
        </div>
        <CreateRequestModal equipmentList={equipmentList} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-medium mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-slate-900">{requests.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 font-medium mb-1">High Priority</div>
          <div className="text-3xl font-bold text-red-600">
            {requests.filter(r => r.priority === 'High').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="text-slate-500 font-medium mb-1">Open Tickets</div>
           <div className="text-3xl font-bold text-orange-600">
             {requests.filter(r => r.status !== 'Repaired').length}
           </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm">Subject</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Equipment</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Team</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Priority</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-slate-400">No requests found.</td>
               </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{r.subject}</div>
                    <div className="text-xs text-slate-400">{r.type}</div>
                  </td>
                  <td className="p-4 text-slate-600">{r.equipment.name}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                      {r.team.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      r.priority === 'High' ? 'text-red-600 bg-red-50' : 
                      r.priority === 'Medium' ? 'text-orange-600 bg-orange-50' : 
                      'text-green-600 bg-green-50'
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                       {r.status === 'New' && <AlertTriangle size={16} className="text-orange-500" />}
                       {r.status === 'Repaired' && <CheckCircle2 size={16} className="text-green-500" />}
                       {r.status === 'In Progress' && <Clock size={16} className="text-blue-500" />}
                       {r.status === 'Scrap' && <span className="text-red-500">Scrapped</span>}
                       {r.status !== 'Scrap' && r.status}
                    </span>
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