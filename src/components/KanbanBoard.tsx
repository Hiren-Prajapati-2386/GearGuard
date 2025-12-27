"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateRequestStatus } from "@/lib/actions";
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type Request = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  equipment: { name: string };
  team: { name: string };
};

const columns = [
  { id: "New", title: "To Do", icon: AlertTriangle, color: "text-orange-500" },
  { id: "In Progress", title: "In Progress", icon: Clock, color: "text-blue-500" },
  { id: "Repaired", title: "Completed", icon: CheckCircle2, color: "text-green-500" },
  { id: "Scrap", title: "Scrap", icon: XCircle, color: "text-red-500" },
];

export default function KanbanBoard({ initialData }: { initialData: Request[] }) {
  const [requests, setRequests] = useState(initialData);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // 1. Optimistic Update (Update UI immediately)
    const updatedRequests = requests.map(req => 
      req.id === draggableId ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);

    // 2. Server Update (Save to DB)
    await updateRequestStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-10 h-[calc(100vh-150px)]">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[320px] bg-slate-100 rounded-xl flex flex-col max-h-full">
            {/* Column Header */}
            <div className="p-4 flex items-center gap-2 border-b border-slate-200 bg-white rounded-t-xl sticky top-0 z-10">
              <col.icon className={col.color} size={20} />
              <h3 className="font-bold text-slate-700">{col.title}</h3>
              <span className="ml-auto bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold text-slate-500">
                {requests.filter(r => r.status === col.id).length}
              </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-3 flex-1 overflow-y-auto space-y-3"
                >
                  {requests
                    .filter((req) => req.status === col.id)
                    .map((req, index) => (
                      <Draggable key={req.id} draggableId={req.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 group hover:shadow-md transition-all ${
                              snapshot.isDragging ? "rotate-2 scale-105 shadow-xl ring-2 ring-blue-400 z-50" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                req.priority === 'High' ? 'bg-red-50 text-red-600' : 
                                req.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 
                                'bg-green-50 text-green-600'
                              }`}>
                                {req.priority}
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">
                              {req.subject}
                            </h4>
                            <p className="text-xs text-slate-500 mb-3">{req.equipment.name}</p>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-2">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {req.team.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}