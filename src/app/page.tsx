import db from "@/lib/db";
import Link from "next/link";
import { 
  ArrowRight, Wrench, Users, ClipboardList, Activity, 
  PlusCircle, Calendar, AlertTriangle, CheckCircle2 
} from "lucide-react";

export default async function Dashboard() {
  // 1. Fetch all data in parallel for speed
  const [
    equipmentCount,
    teamCount,
    totalRequests,
    activeRequests,
    recentRequests,
    overdueRequests
  ] = await Promise.all([
    db.equipment.count(),
    db.team.count(),
    db.request.count(),
    db.request.count({ where: { status: { not: "Repaired" } } }),
    db.request.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' },
      include: { equipment: true } 
    }),
    db.request.count({ 
      where: { 
        status: { not: "Repaired" },
        priority: "High" 
      } 
    })
  ]);

  // Mock data for the "System Health" charts (since we don't have real historical data yet)
  const healthStats = [
    { label: "Equipment Uptime", value: 98.5, color: "bg-emerald-500" },
    { label: "Response Time", value: 85, color: "bg-blue-500" },
    { label: "Team Utilization", value: 62, color: "bg-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
           <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Maintenance Management System</h1>
           <p className="text-slate-500 max-w-2xl text-lg">
             Streamline your maintenance operations with comprehensive equipment tracking, team management, and request handling in one unified platform.
           </p>
        </div>
        {/* Decorative Background Pattern */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wrench size={24} /></div>
             <span className="text-xs font-bold text-slate-400 uppercase">Total Assets</span>
           </div>
           <div className="text-3xl font-extrabold text-slate-900 mb-1">{equipmentCount}</div>
           <div className="text-sm text-green-600 font-medium">+2 this month</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Activity size={24} /></div>
             <span className="text-xs font-bold text-slate-400 uppercase">Active Requests</span>
           </div>
           <div className="text-3xl font-extrabold text-slate-900 mb-1">{activeRequests}</div>
           <div className="text-sm text-orange-600 font-medium">+5 this week</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
             <span className="text-xs font-bold text-slate-400 uppercase">Teams Available</span>
           </div>
           <div className="text-3xl font-extrabold text-slate-900 mb-1">{teamCount}</div>
           <div className="text-sm text-slate-500 font-medium">All active</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
             <span className="text-xs font-bold text-slate-400 uppercase">High Priority</span>
           </div>
           <div className="text-3xl font-extrabold text-slate-900 mb-1">{overdueRequests}</div>
           <div className="text-sm text-red-600 font-medium">Needs attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & System Health */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/requests" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Create New Request</div>
                  <div className="text-xs text-slate-500">Report equipment issues</div>
                </div>
                <ArrowRight className="ml-auto text-slate-300 group-hover:text-blue-500" size={18} />
              </Link>
              
              <Link href="/equipment" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-all group">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Wrench size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Add Equipment</div>
                  <div className="text-xs text-slate-500">Register new assets</div>
                </div>
                <ArrowRight className="ml-auto text-slate-300 group-hover:text-green-500" size={18} />
              </Link>

              <Link href="/calendar" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Schedule Maintenance</div>
                  <div className="text-xs text-slate-500">Plan preventive work</div>
                </div>
                <ArrowRight className="ml-auto text-slate-300 group-hover:text-orange-500" size={18} />
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 text-lg">System Health</h3>
             <div className="space-y-6">
               {healthStats.map((stat) => (
                 <div key={stat.label}>
                   <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                     <span>{stat.label}</span>
                     <span className="text-slate-500">{stat.value}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.value}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800 text-lg">Recent Activity</h3>
             <Link href="/requests" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
           </div>

           <div className="space-y-0">
             {recentRequests.length === 0 ? (
               <div className="text-center py-20 text-slate-400">
                 No activity yet. Start by creating a request!
               </div>
             ) : (
               recentRequests.map((req, idx) => (
                 <div key={req.id} className="flex gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-lg">
                   <div className="mt-1">
                     <div className={`w-2 h-2 rounded-full ${req.status === 'New' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                   </div>
                   <div>
                     <div className="font-bold text-slate-800 text-sm">{req.subject}</div>
                     <div className="text-xs text-slate-500 mt-0.5">
                       {req.type} request for <span className="font-medium text-slate-700">{req.equipment.name}</span>
                     </div>
                     <div className="flex gap-2 mt-2">
                       <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                         {new Date(req.createdAt).toLocaleDateString()}
                       </span>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                         req.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {req.priority} Priority
                       </span>
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>

      </div>

      {/* Bottom Navigation Cards (Shortcuts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Link href="/equipment" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all text-center group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
               <Wrench />
            </div>
            <h3 className="font-bold text-slate-900">Equipment Tracking</h3>
            <p className="text-sm text-slate-500 mt-2">Comprehensive asset management with detailed tracking.</p>
         </Link>
         <Link href="/teams" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-green-400 transition-all text-center group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
               <Users />
            </div>
            <h3 className="font-bold text-slate-900">Team Management</h3>
            <p className="text-sm text-slate-500 mt-2">Organize specialized maintenance teams and workload.</p>
         </Link>
         <Link href="/kanban" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-orange-400 transition-all text-center group">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
               <ClipboardList />
            </div>
            <h3 className="font-bold text-slate-900">Workflow Management</h3>
            <p className="text-sm text-slate-500 mt-2">Visual kanban boards for efficient request tracking.</p>
         </Link>
      </div>

    </div>
  );
}