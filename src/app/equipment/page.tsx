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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Equipment Management</h1>
          <p className="text-slate-600 text-lg">Track and manage all company assets with comprehensive details</p>
        </div>
        <AddEquipmentModal teams={teams} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Equipment</div>
          <div className="text-2xl font-bold text-slate-900">{equipment.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {equipment.filter((e: any) => e.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Scrapped</div>
          <div className="text-2xl font-bold text-red-600">
            {equipment.filter((e: any) => e.status === 'Scrapped').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-blue-600">
            {equipment.reduce((sum: number, e: any) => sum + (e.requests?.length || 0), 0)}
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-sm">
            <Wrench className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-600 font-semibold text-lg mb-1">No equipment found</p>
            <p className="text-sm text-slate-400">Add your first piece of equipment to get started</p>
            <p className="text-xs text-slate-400 mt-2">Note: You must create a Team first</p>
          </div>
        ) : (
          equipment.map((item: any) => {
            const openRequests = item.requests?.filter((r: any) => r.status !== 'Repaired' && r.status !== 'Scrap').length || 0;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col group overflow-hidden">
                {/* Status Bar */}
                <div className={`h-1.5 ${
                  item.status === 'Active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}></div>
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{item.serialNumber}</p>
                    </div>
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      item.status === 'Active' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <Building2 size={14} className="text-slate-600" />
                      </div>
                      <span className="font-medium">{item.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <MapPin size={14} className="text-slate-600" />
                      </div>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-blue-600">{item.team?.name}</span>
                    </div>
                  </div>

                  {/* Smart Button Implementation */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link 
                      href={`/requests?equipmentId=${item.id}`}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-xl text-sm font-bold transition-all group/btn border border-blue-200/50"
                    >
                      <div className="flex items-center gap-2">
                        <ClipboardList size={18} className="text-blue-600" />
                        <span>Maintenance Requests</span>
                      </div>
                      {openRequests > 0 ? (
                        <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center">
                          {openRequests}
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center">
                          {item.requests?.length || 0}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}