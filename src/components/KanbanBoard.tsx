"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateRequestStatus } from "@/lib/actions";
import { Clock, AlertTriangle, CheckCircle2, XCircle, User, Calendar } from "lucide-react";

type Request = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  scheduledDate?: Date | string | null;
  createdAt: Date | string;
  equipment: { name: string };
  team: { name: string };
  technician?: { name: string; avatar?: string | null } | null;
};

const columns = [
  { id: "New", title: "To Do", icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { id: "In Progress", title: "In Progress", icon: Clock, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { id: "Repaired", title: "Completed", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { id: "Scrap", title: "Scrap", icon: XCircle, color: "text-red-500", bgColor: "bg-red-50", borderColor: "border-red-200" },
];

// Helper function to check if a request is overdue
function isOverdue(request: Request): boolean {
  if (request.status === "Repaired" || request.status === "Scrap") return false;
  if (!request.scheduledDate) return false;
  
  const scheduled = new Date(request.scheduledDate);
  const now = new Date();
  return scheduled < now;
}

// Helper function to get initials for avatar
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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
      <div className="flex gap-4 overflow-x-auto pb-10 h-[calc(100vh-150px)] px-1">
        {columns.map((col) => {
          const columnRequests = requests.filter(r => r.status === col.id);
          return (
            <div key={col.id} className="min-w-[340px] bg-gradient-to-b from-slate-50 to-white rounded-2xl flex flex-col max-h-full shadow-sm border border-slate-200">
              {/* Column Header */}
              <div className={`p-4 flex items-center gap-3 rounded-t-2xl ${col.bgColor} border-b-2 ${col.borderColor} sticky top-0 z-10`}>
                <div className={`p-2 rounded-lg bg-white shadow-sm ${col.color}`}>
                  <col.icon size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">{col.title}</h3>
                  <p className="text-xs text-slate-500">{columnRequests.length} items</p>
                </div>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                  {columnRequests.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-3 flex-1 overflow-y-auto space-y-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-slate-100/50' : ''
                    }`}
                  >
                    {columnRequests.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        No items
                      </div>
                    ) : (
                      columnRequests.map((req, index) => {
                        const overdue = isOverdue(req);
                        return (
                          <Draggable key={req.id} draggableId={req.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-xl shadow-sm border-2 group hover:shadow-lg transition-all cursor-grab active:cursor-grabbing ${
                                  overdue ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-blue-300'
                                } ${
                                  snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl ring-4 ring-blue-400/50 z-50 border-blue-400" : ""
                                }`}
                              >
                                {/* Overdue Indicator */}
                                {overdue && (
                                  <div className="mb-2 -mt-1 -mx-2">
                                    <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-b-lg text-center">
                                      ⚠ OVERDUE
                                    </div>
                                  </div>
                                )}

                                {/* Priority Badge */}
                                <div className="flex justify-between items-start mb-3">
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                    req.priority === 'High' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                    req.priority === 'Medium' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                                    'bg-green-100 text-green-700 border border-green-200'
                                  }`}>
                                    {req.priority}
                                  </span>
                                  {req.scheduledDate && (
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                      <Calendar size={12} />
                                      <span>{new Date(req.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Subject */}
                                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight line-clamp-2">
                                  {req.subject}
                                </h4>
                                
                                {/* Equipment */}
                                <p className="text-xs text-slate-600 mb-3 font-medium">{req.equipment.name}</p>

                                {/* Footer with Team and Technician */}
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                    {req.team.name}
                                  </span>
                                  
                                  {/* Technician Avatar */}
                                  {req.technician ? (
                                    <div className="flex items-center gap-1.5">
                                      {req.technician.avatar ? (
                                        <img 
                                          src={req.technician.avatar} 
                                          alt={req.technician.name}
                                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold">
                                          {getInitials(req.technician.name)}
                                        </div>
                                      )}
                                      <span className="text-[10px] font-medium text-slate-600 hidden group-hover:inline">
                                        {req.technician.name.split(' ')[0]}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                      <User size={12} />
                                      <span>Unassigned</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}