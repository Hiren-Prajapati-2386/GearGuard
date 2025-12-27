import db from "@/lib/db";
import { Wrench, MapPin, Building2, User } from "lucide-react";

export default async function EquipmentPage() {
  // Fetch equipment from database
  const equipment = await db.equipment.findMany({
    include: { team: true }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-500">Track and manage all company assets</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span>+</span> Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed">
            <p className="text-gray-400">No equipment found. Add your first machine!</p>
          </div>
        ) : (
          equipment.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Building2 size={16} /> <span>{item.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} /> <span className="text-blue-600 font-medium">{item.team.name}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 text-center py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors">
                  View Details
                </button>
                <button className="px-3 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors">
                  <Wrench size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}