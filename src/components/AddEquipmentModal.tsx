"use client";
import { useState } from "react";
import { createEquipment } from "@/lib/actions";

export default function AddEquipmentModal({ teams }: { teams: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
      >
        + Add Equipment
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Register New Asset</h2>
            <form action={async (formData) => {
              await createEquipment(formData);
              setIsOpen(false);
            }} className="space-y-4">
              <input name="name" placeholder="Equipment Name (e.g. CNC Machine)" className="w-full p-2 border rounded" required />
              <input name="serialNumber" placeholder="Serial Number" className="w-full p-2 border rounded" required />
              <input name="department" placeholder="Department (e.g. Production)" className="w-full p-2 border rounded" required />
              <input name="location" placeholder="Physical Location" className="w-full p-2 border rounded" required />
              
              <select name="teamId" className="w-full p-2 border rounded" required>
                <option value="">Select Maintenance Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Equipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}