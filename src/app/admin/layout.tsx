
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  UserCircle, 
  Settings, 
  AlertOctagon, 
  BarChart4, 
  FileText, 
  History, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Loader2,
  ShieldAlert,
  Terminal,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [adminData, setAdminData] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      setChecking(false);
      return;
    }

    if (!db) return;

    // Escuta o perfil do admin em tempo real para mudanças de cargo/permissão
    const unsub = onSnapshot(doc(db, 'users', authUser.uid), (snap) => {
      if (snap.exists() && snap.data().isAdmin) {
        setAdminData({ id: snap.id, ...snap.data() });
      } else {
        setAdminData(null);
      }
      setChecking(false);
    }, (err) => {
      console.error("[ADMIN] Falha na validação de permissão:", err);
      setChecking(false);
    });

    return () => unsub();
  }, [authUser, db, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro de Acesso", description: "Credenciais inválidas." });
    } finally {
      setLoginLoading(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#08090d]">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={32} />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Validando Acesso Master...</span>
      </div>
    );
  }

  if (!authUser || !adminData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#08090d] p-6">
        <div className="w-full max-w-md space-y-8 rounded-[2.5rem] bg-[#111622] p-10 border border-white/5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
              <Terminal className="text-cyan-400" size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white italic italic">Terminal de Operações</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Autenticação Master Requerida</p>
          </div>

          {!authUser ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                placeholder="E-mail Administrativo" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="h-14 bg-black/40 border-white/5 rounded-2xl font-bold" 
              />
              <Input 
                placeholder="Chave de Segurança" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="h-14 bg-black/40 border-white/5 rounded-2xl font-bold" 
              />
              <Button disabled={loginLoading} className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl">
                {loginLoading ? <Loader2 className="animate-spin" /> : "DESBLOQUEAR ACESSO"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20">
                <ShieldAlert size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-black uppercase tracking-tight">Acesso Não Autorizado</h3>
                <p className="text-[11px] text-white/40 leading-relaxed px-4">Seu UID não possui a flag <code className="text-cyan-400">isAdmin: true</code> ativa no banco de dados.</p>
                <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/5 text-left">
                  <span className="text-[8px] font-black text-white/30 uppercase block mb-1">Seu UID para suporte:</span>
                  <code className="text-[10px] text-cyan-400 font-mono break-all">{authUser.uid}</code>
                </div>
              </div>
              <Button onClick={() => auth?.signOut()} variant="ghost" className="text-white/40 hover:text-white font-bold text-[10px] uppercase underline">Trocar de Conta</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Define o menu com base no cargo (Dono ou Gerente)
  const isOwner = adminData.role === 'owner';
  
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', roles: ['owner', 'manager'] },
    { label: 'Gerentes', icon: ShieldCheck, href: '/admin/gerentes', roles: ['owner'] },
    { label: 'Influenciadores', icon: UserCircle, href: '/admin/influenciadores', roles: ['owner', 'manager'] },
    { label: 'Usuários', icon: Users, href: '/admin/usuarios', roles: ['owner'] },
    { label: 'Config. Jogo', icon: Settings, href: '/admin/configuracoes', roles: ['owner'] },
    { label: 'Antifraude', icon: AlertOctagon, href: '/admin/antifraude', roles: ['owner'] },
    { label: 'Comissões', icon: BarChart4, href: '/admin/comissoes', roles: ['owner', 'manager'] },
    { label: 'Relatórios', icon: FileText, href: '/admin/relatorios', roles: ['owner', 'manager'] },
    { label: 'Logs Auditoria', icon: History, href: '/admin/logs', roles: ['owner'] },
  ].filter(item => item.roles.includes(adminData.role || 'manager'));

  return (
    <div className="min-h-screen bg-[#08090d] flex" id="admin-page">
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
              Sair do Terminal
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-[#111622]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </Button>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              Terminal <span className="text-cyan-400 ml-2">/ {adminData.role === 'owner' ? 'MASTER' : 'GERÊNCIA'}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-4">
              <span className={cn(
                "text-[10px] font-black uppercase",
                isOwner ? "text-amber-500" : "text-cyan-400"
              )}>
                {adminData.role === 'owner' ? 'OPERADOR MASTER' : 'OPERADOR GERENTE'}
              </span>
              <span className="text-xs font-bold text-white/30 truncate max-w-[150px]">{authUser?.email}</span>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center font-black",
              isOwner ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
            )}>
              {authUser?.email?.charAt(0).toUpperCase()}
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
