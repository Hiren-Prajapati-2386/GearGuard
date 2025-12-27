"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, Users, ClipboardList, Kanban, Calendar, ShieldCheck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const menuItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Requests', href: '/requests', icon: ClipboardList },
  { name: 'Kanban', href: '/kanban', icon: Kanban },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">GearGuard</h1>
            <p className="text-xs text-slate-400 font-medium">Maintenance Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30" 
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <item.icon 
                size={20} 
                className={twMerge(
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"
                )} 
              />
              <span className="font-semibold text-sm">{item.name}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <p className="text-xs text-slate-400 font-medium text-center">
            © 2024 GearGuard
          </p>
        </div>
      </div>
    </div>
  );
}