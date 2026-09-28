
'use client';

import React from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  UserCircle, 
  Gamepad2, 
  Settings, 
  AlertOctagon, 
  BarChart4, 
  FileText, 
  History, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Usuários', icon: Users, href: '/admin/usuarios' },
    { label: 'Gerentes', icon: ShieldCheck, href: '/admin/gerentes' },
    { label: 'Influenciadores', icon: UserCircle, href: '/admin/influenciadores' },
    { label: 'Partidas', icon: Gamepad2, href: '/admin/partidas' },
    { label: 'Config. Jogo', icon: Settings, href: '/admin/configuracoes' },
    { label: 'Antifraude', icon: AlertOctagon, href: '/admin/antifraude' },
    { label: 'Comissões', icon: BarChart4, href: '/admin/comissoes' },
    { label: 'Relatórios', icon: FileText, href: '/admin/relatorios' },
    { label: 'Logs Auditoria', icon: History, href: '/admin/logs' },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#08090d] flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#111622] border-r border-white/5 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Image src="/blockcash.png" alt="Logo" width={100} height={40} className="filter brightness-125" />
            <Button variant="ghost" size="icon" className="md:hidden text-white/40" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </Button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}>
                    <item.icon size={18} className={cn(isActive ? "text-cyan-400" : "text-white/20 group-hover:text-white")} />
                    {item.label}
                    {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
            <Button 
              onClick={() => auth?.signOut().then(() => router.push('/'))}
              variant="ghost" 
              className="w-full flex items-center justify-start gap-3 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl"
            >
              <LogOut size={18} />
              Finalizar Sessão
            </Button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-[#111622]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </Button>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              Terminal Master <span className="text-cyan-400 ml-2">/ {menuItems.find(m => m.href === pathname)?.label || 'Dashboard'}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-4">
              <span className="text-[10px] font-black text-emerald-400 uppercase">Sistema Online</span>
              <span className="text-xs font-bold text-white/30 truncate max-w-[150px]">{user?.email}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#08090d]">
          {children}
        </main>
      </div>
    </div>
  );
}
