"use client";
import { useState } from "react";
import { scheduleMaintenance } from "@/lib/actions";
import { CalendarPlus, X } from "lucide-react";

export default function ScheduleModal({ equipmentList }: { equipmentList: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
      >
        <CalendarPlus size={18} /> Schedule Maintenance
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Schedule Maintenance</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form action={async (formData) => {
              await scheduleMaintenance(formData);
              setIsOpen(false);
            }} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <input name="subject" placeholder="e.g. Monthly AC Check" className="w-full p-2 border rounded-lg" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Equipment</label>
                   <select name="equipmentId" className="w-full p-2 border rounded-lg" required>
                     <option value="">Select Equipment...</option>
                     {equipmentList.map(eq => (
                       <option key={eq.id} value={eq.id}>{eq.name}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3} className="w-full p-2 border rounded-lg" placeholder="Detailed instructions..."></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                    <select name="type" className="w-full p-2 border rounded-lg">
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                    <select name="priority" className="w-full p-2 border rounded-lg">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Est. Hours</label>
                    <input name="estimatedHours" type="number" step="0.5" className="w-full p-2 border rounded-lg" defaultValue="2.0" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                   <input name="date" type="date" className="w-full p-2 border rounded-lg" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                   <input name="time" type="time" className="w-full p-2 border rounded-lg" required />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 shadow-md">
                  Schedule Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}