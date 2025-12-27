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
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 shadow-md flex items-center gap-2"
      >
        <AlertCircle size={18} /> Report Issue
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-slate-800">New Maintenance Request</h2>
               <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form action={async (formData) => {
              await createRequest(formData);
              setIsOpen(false);
            }} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input name="subject" placeholder="e.g. Oil Leakage in Engine" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select name="type" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                      <option value="Corrective">Corrective (Breakdown)</option>
                      <option value="Preventive">Preventive (Checkup)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select name="priority" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Affected Equipment</label>
                <select 
                  name="equipmentId" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
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
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2 text-sm text-blue-800">
                  <span className="font-bold">Auto-Assigning to:</span>
                  <span>{selectedMachine.team?.name}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}