import db from "@/lib/db";
import Link from "next/link";
// 1. Added ClipboardList to imports for the icon
import { Wrench, MapPin, Building2, Users, ClipboardList } from "lucide-react";
import AddEquipmentModal from "@/components/AddEquipmentModal";

export default async function EquipmentPage() {
  // Fetch both equipment and teams
  const [equipment, teams] = await Promise.all([
    db.equipment.findMany({ 
      include: { 
        team: true,
        requests: true // 2. IMPORTANT: Fetch requests so we can count them
      } 
    }),
    db.team.findMany()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-500">Track and manage all company assets</p>
        </div>
        <AddEquipmentModal teams={teams} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed">
            <p className="text-gray-400 font-medium">No equipment found. Add your first machine!</p>
            <p className="text-sm text-gray-400">Note: You must create a Team first.</p>
          </div>
        ) : (
          equipment.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm p-5 hover:border-blue-300 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                {/* Dynamic Status Color based on Scrap Logic */}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6 flex-1">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" /> <span>{item.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" /> <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" /> 
                  <span className="text-blue-600 font-semibold">{item.team?.name}</span>
                </div>
              </div>

              {/* 3. NEW SECTION: Smart Button Implementation */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link 
                  href={`/requests?equipmentId=${item.id}`} // This creates the filter link
                  className="flex-1 text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ClipboardList size={16} />
                  {/* Shows the count of requests for this specific machine */}
                  {item.requests?.length || 0} Requests 
                </Link>
                
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