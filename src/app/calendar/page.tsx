import db from "@/lib/db";
import CalendarView from "@/components/CalendarView";
import ScheduleModal from "@/components/ScheduleModal";

export default async function CalendarPage() {
  // 1. Fetch data
  const requests = await db.request.findMany({
    where: {
      scheduledDate: { not: null } // Only get scheduled items
    },
    include: { equipment: true }
  });

  const equipmentList = await db.equipment.findMany();

  // 2. Calculate Stats
  const now = new Date();
  const thisMonthRequests = requests.filter(r => {
    const d = new Date(r.scheduledDate!);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  const preventiveCount = thisMonthRequests.filter(r => r.type === 'Preventive').length;
  const correctiveCount = thisMonthRequests.filter(r => r.type === 'Corrective').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
           <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Maintenance Schedule</h1>
           <p className="text-slate-600 text-lg">Plan and track team workload</p>
        </div>
        <ScheduleModal equipmentList={equipmentList} />
      </div>

      {/* Main Interactive Calendar */}
      <CalendarView requests={requests} />

      {/* Bottom Dashboard (Stats & Legend) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upcoming List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Upcoming This Month</h3>
          <div className="space-y-3">
             {thisMonthRequests.slice(0, 3).map(req => (
               <div key={req.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                  <div className={`w-2 h-12 rounded-full ${req.type === 'Preventive' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className="font-bold text-slate-800">{req.subject}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(req.scheduledDate!).toLocaleDateString()} • {req.equipment.name}
                    </div>
                  </div>
               </div>
             ))}
             {thisMonthRequests.length === 0 && <p className="text-slate-400 italic">No upcoming tasks.</p>}
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
           <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                 <div className="text-2xl font-bold text-blue-600">{preventiveCount}</div>
                 <div className="text-xs font-bold text-slate-500 uppercase">Preventive</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                 <div className="text-2xl font-bold text-orange-600">{correctiveCount}</div>
                 <div className="text-xs font-bold text-slate-500 uppercase">Corrective</div>
              </div>
           </div>

           <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded bg-blue-500"></span> Preventive Maintenance
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded bg-orange-500"></span> Corrective Maintenance
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> Today
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}