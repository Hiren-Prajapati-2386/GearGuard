import db from "@/lib/db";
import KanbanBoard from "@/components/KanbanBoard";

export default async function KanbanPage() {
  // Fetch all requests
  const requests = await db.request.findMany({
    include: {
      equipment: true,
      team: true
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Workflow Board</h1>
        <p className="text-slate-500">Drag and drop cards to update status.</p>
      </div>
      
      {/* Render the client component with data */}
      <KanbanBoard initialData={requests} />
    </div>
  );
}