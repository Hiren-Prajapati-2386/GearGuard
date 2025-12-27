"use client";
import { useState } from "react";
import { createRequest } from "@/lib/actions";
import { AlertCircle } from "lucide-react";

export default function CreateRequestModal({ equipmentList }: { equipmentList: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState<string>("");

  // Helper to find the team name for the selected machine
  const selectedMachine = equipmentList.find(e => e.id === selectedEq);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <AlertCircle size={18} /> Report Issue
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">New Maintenance Request</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form action={async (formData) => {
              await createRequest(formData);
              setIsOpen(false);
            }} className="p-6 space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input 
                  name="subject" 
                  placeholder="e.g. Oil Leakage in Engine" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Provide additional details about the issue..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select name="type" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all">
                      <option value="Corrective">Corrective (Breakdown)</option>
                      <option value="Preventive">Preventive (Checkup)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                    <select name="priority" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Affected Equipment</label>
                <select 
                  name="equipmentId" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  onChange={(e) => setSelectedEq(e.target.value)}
                  required
                >
                  <option value="">Select Machine...</option>
                  {equipmentList.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.serialNumber})</option>
                  ))}
                </select>
              </div>

              {/* Smart Auto-fill Feedback */}
              {selectedMachine && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border-2 border-blue-200 flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <AlertCircle className="text-white" size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">Auto-Assigning</div>
                    <div className="text-sm font-semibold text-blue-800">{selectedMachine.team?.name}</div>
                  </div>
                </div>
              )}

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
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}