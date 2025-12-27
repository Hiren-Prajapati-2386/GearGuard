import db from "@/lib/db";
import KanbanBoard from "@/components/KanbanBoard";

export default async function KanbanPage() {
  // Fetch all requests with technician information
  const requests = await db.request.findMany({
    include: {
      equipment: true,
      team: true,
      technician: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Workflow Board</h1>
          <p className="text-slate-600 text-lg">Drag and drop cards to update request status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Requests</div>
            <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
          </div>
        </div>
      </div>
      
      {/* Render the client component with data */}
      <KanbanBoard initialData={requests} />
    </div>
  );
}