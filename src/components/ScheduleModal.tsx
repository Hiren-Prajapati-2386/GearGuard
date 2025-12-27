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
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CalendarPlus className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Schedule Maintenance</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form action={async (formData) => {
              await scheduleMaintenance(formData);
              setIsOpen(false);
            }} className="p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input 
                    name="subject" 
                    placeholder="e.g. Monthly AC Check" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                    required 
                  />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Equipment</label>
                   <select 
                     name="equipmentId" 
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                     required
                   >
                     <option value="">Select Equipment...</option>
                     {equipmentList.map(eq => (
                       <option key={eq.id} value={eq.id}>{eq.name}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none" 
                  placeholder="Detailed instructions..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select name="type" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all">
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                    <select name="priority" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Est. Hours</label>
                    <input 
                      name="estimatedHours" 
                      type="number" 
                      step="0.5" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                      defaultValue="2.0" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                   <input 
                     name="date" 
                     type="date" 
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                     required 
                   />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                   <input 
                     name="time" 
                     type="time" 
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                     required 
                   />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl transition-all"
                >
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