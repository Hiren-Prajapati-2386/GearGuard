"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, Users, ClipboardList, Kanban, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
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
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600 italic">GearGuard</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={twMerge(
              "flex items-center space-x-3 p-3 rounded-lg text-gray-600 transition-colors",
              pathname === item.href ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}