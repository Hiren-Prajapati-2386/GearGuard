import db from "@/lib/db";
import { Users, CheckCircle2, Clock, Wrench, Zap, Monitor } from "lucide-react";

// Helper function to pick an icon based on team name
const getTeamIcon = (name: string) => {
  if (name.toLowerCase().includes("mechanic")) return <Wrench className="text-orange-500" size={24} />;
  if (name.toLowerCase().includes("electric")) return <Zap className="text-blue-500" size={24} />;
  if (name.toLowerCase().includes("it")) return <Monitor className="text-purple-500" size={24} />;
  return <Users className="text-gray-500" size={24} />;
};

// Helper for background colors
const getTeamColor = (name: string) => {
  if (name.toLowerCase().includes("mechanic")) return "bg-orange-50 border-orange-200";
  if (name.toLowerCase().includes("electric")) return "bg-blue-50 border-blue-200";
  if (name.toLowerCase().includes("it")) return "bg-purple-50 border-purple-200";
  return "bg-gray-50 border-gray-200";
};

export default async function TeamsPage() {
  // 1. Fetch teams with their members and requests to calculate stats
  const teams = await db.team.findMany({
    include: {
      technicians: true,
      requests: true,
    
    }
  });

  // 2. Global Stats Calculation
  const totalTechs = teams.reduce((acc, team) => acc + team.technicians.length, 0);
  const activeRequests = teams.reduce((acc, team) => 
    acc + team.requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length, 0
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Maintenance Teams</h1>
          <p className="text-slate-600 text-lg">Manage specialized maintenance teams and technicians</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
          <Users size={20} />
          Add Team Member
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm"><Users size={24} /></div>
          <div>
             <div className="text-2xl font-extrabold text-slate-900">{teams.length}</div>
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Teams</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl shadow-sm"><Users size={24} /></div>
          <div>
             <div className="text-2xl font-extrabold text-slate-900">{totalTechs}</div>
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Technicians</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shadow-sm"><Clock size={24} /></div>
          <div>
             <div className="text-2xl font-extrabold text-slate-900">{activeRequests}</div>
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Requests</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shadow-sm"><Clock size={24} /></div>
          <div>
             <div className="text-2xl font-extrabold text-slate-900">2.4h</div>
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {teams.map((team) => {
          // Calculate stats per team
          const teamActive = team.requests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length;
          const teamCompleted = team.requests.filter(r => r.status === 'Repaired').length;

          return (
            <div key={team.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              
              {/* Card Header with Color Strip */}
              <div className={`p-6 border-b-2 ${getTeamColor(team.name).split(' ')[1]} flex items-start gap-4 ${getTeamColor(team.name).split(' ')[0]}`}>
                <div className={`p-3 rounded-xl bg-white shadow-md group-hover:scale-110 transition-transform`}>
                  {getTeamIcon(team.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">{team.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {team.description || "Specialized maintenance team."}
                  </p>
                </div>
              </div>

              {/* Technicians List */}
              <div className="p-6 flex-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Team Members</h4>
                <div className="space-y-3">
                  {team.technicians.length === 0 ? (
                    <p className="text-sm text-slate-400 italic text-center py-4">No members assigned.</p>
                  ) : (
                    team.technicians.map((tech) => (
                      <div key={tech.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {tech.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800">{tech.name}</div>
                          <div className="text-xs text-slate-500">{tech.jobTitle || tech.role}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 grid grid-cols-3 divide-x divide-slate-200 border-t-2 border-slate-200">
                <div className="text-center px-2">
                  <div className="text-xl font-extrabold text-slate-900">{teamActive}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Active</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-xl font-extrabold text-slate-900">{teamCompleted}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Completed</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-xl font-extrabold text-slate-900">2.5h</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Avg Time</div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}