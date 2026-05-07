"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patient', href: '/maternal', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-sidebar flex-shrink-0 min-h-screen relative flex flex-col">
      <div className="p-6 border-b border-red-100/50">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          <span className="text-red-600">Kalusugan</span>PH
        </h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium
                    ${isActive 
                      ? 'bg-red-100/80 shadow-sm border border-red-200 text-slate-900' 
                      : 'text-slate-600 hover:bg-red-50 hover:text-slate-900 border border-transparent'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-red-600' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-all duration-300 border border-slate-200 hover:border-rose-200 text-sm font-semibold shadow-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
