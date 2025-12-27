import db from "@/lib/db";
import CreateRequestModal from "@/components/CreateRequestModal";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, FilterX, ClipboardList } from "lucide-react";

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
           <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{pageTitle}</h1>
           <div className="flex items-center gap-3">
             <p className="text-slate-600 text-lg">Manage breakdown tickets and work orders</p>
             
             {/* Show 'Clear Filter' button if a filter is active */}
             {equipmentId && (
               <Link 
                 href="/requests" 
                 className="flex items-center gap-2 text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors border border-red-200"
               >
                 <FilterX size={14} /> Clear Filter
               </Link>
             )}
           </div>
        </div>
        <CreateRequestModal equipmentList={equipmentList} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wide">Total Requests</div>
          <div className="text-3xl font-extrabold text-slate-900">{requests.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wide">High Priority</div>
          <div className="text-3xl font-extrabold text-red-600">
            {requests.filter(r => r.priority === 'High').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wide">Open Tickets</div>
           <div className="text-3xl font-extrabold text-orange-600">
             {requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length}
           </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Subject</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Equipment</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Team</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Priority</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Status</th>
                <th className="p-4 font-bold text-slate-700 text-sm uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-12 text-center">
                     <div className="flex flex-col items-center gap-3">
                       <ClipboardList className="text-slate-300" size={48} />
                       <div className="text-slate-400 font-medium">No requests found</div>
                       <div className="text-sm text-slate-400">Create your first maintenance request to get started</div>
                     </div>
                   </td>
                 </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 mb-1">{r.subject}</div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                        {r.type}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{r.equipment.name}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200">
                        {r.team.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        r.priority === 'High' ? 'text-red-700 bg-red-50 border-red-200' : 
                        r.priority === 'Medium' ? 'text-orange-700 bg-orange-50 border-orange-200' : 
                        'text-green-700 bg-green-50 border-green-200'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                         {r.status === 'New' && (
                           <span className="flex items-center gap-1.5 text-orange-600">
                             <AlertTriangle size={16} />
                             {r.status}
                           </span>
                         )}
                         {r.status === 'Repaired' && (
                           <span className="flex items-center gap-1.5 text-green-600">
                             <CheckCircle2 size={16} />
                             {r.status}
                           </span>
                         )}
                         {r.status === 'In Progress' && (
                           <span className="flex items-center gap-1.5 text-blue-600">
                             <Clock size={16} />
                             {r.status}
                           </span>
                         )}
                         {r.status === 'Scrap' && (
                           <span className="text-red-600 font-bold">Scrapped</span>
                         )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
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