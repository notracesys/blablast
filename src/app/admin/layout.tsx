'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
  const { user: authUser, role, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // GATEKEEPER: Bloqueia tudo até confirmar que é OWNER ou MANAGER
  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      setChecking(false);
      return;
    }

    // Se o token já tem a role correta, libera imediatamente
    if (role === 'owner' || role === 'manager') {
      setChecking(false);
      return;
    }

    // Fallback: Se a claim ainda não propagou, tenta olhar no Firestore UMA vez
    if (db) {
      getDoc(doc(db, 'users', authUser.uid)).then(snap => {
        if (snap.exists() && snap.data().isAdmin) {
          console.log("[ADMIN] Acesso concedido via espelho Firestore. Claims pendentes.");
          setChecking(false);
        } else {
          console.warn("[ADMIN] Acesso negado. Role insuficiente.");
          setChecking(false);
        }
      }).catch(() => setChecking(false));
    }
  }, [authUser, role, authLoading, db]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O useEffect acima cuidará do redirecionamento/liberação
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
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Validando Protocolos de Segurança...</span>
      </div>
    );
  }

  // Se não estiver logado ou não for admin (nem via claim nem via firestore fallback)
  const isAuthorized = role === 'owner' || role === 'manager';
  
  if (!authUser || !isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#08090d] p-6">
        <div className="w-full max-w-md space-y-8 rounded-[2.5rem] bg-[#111622] p-10 border border-white/5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
              <Terminal className="text-cyan-400" size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white italic">Terminal de Operações</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Autenticação Requerida</p>
          </div>

          {!authUser ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input placeholder="E-mail Operador" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-14 bg-black/40 border-white/5 rounded-2xl font-bold" />
              <Input placeholder="Chave de Segurança" type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-14 bg-black/40 border-white/5 rounded-2xl font-bold" />
              <Button disabled={loginLoading} className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase rounded-2xl shadow-xl">
                {loginLoading ? <Loader2 className="animate-spin" /> : "DESBLOQUEAR TERMINAL"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
              <ShieldAlert className="text-rose-500 mx-auto" size={48} />
              <div className="space-y-2">
                <h3 className="text-white font-black uppercase">Acesso Negado</h3>
                <p className="text-[11px] text-white/40 px-4">Seu UID não possui permissões administrativas ativas.</p>
              </div>
              <Button onClick={() => auth?.signOut()} variant="ghost" className="text-white/40 underline text-[10px] uppercase">Trocar Conta</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', roles: ['owner', 'manager'] },
    { label: 'Gerentes', icon: ShieldCheck, href: '/admin/gerentes', roles: ['owner'] },
    { label: 'Influenciadores', icon: UserCircle, href: '/admin/influenciadores', roles: ['owner', 'manager'] },
    { label: 'Config. Jogo', icon: Settings, href: '/admin/configuracoes', roles: ['owner'] },
  ].filter(item => item.roles.includes(role || 'manager'));

  return (
    <div className="min-h-screen bg-[#08090d] flex" id="admin-page">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#111622] border-r border-white/5 transition-transform md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Image src="/blockcash.png" alt="Logo" width={100} height={40} className="filter brightness-125" />
            <Button variant="ghost" size="icon" className="md:hidden text-white/40" onClick={() => setSidebarOpen(false)}><X size={20} /></Button>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                  pathname === item.href ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-white/40 hover:bg-white/5 hover:text-white"
                )}>
                  <item.icon size={18} />
                  {item.label}
                  {pathname === item.href && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </div>
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-white/5">
            <Button onClick={() => auth?.signOut().then(() => router.push('/'))} variant="ghost" className="w-full justify-start gap-3 text-rose-500 hover:bg-rose-500/10 rounded-xl">
              <LogOut size={18} /> Encerrar Sessão
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#111622]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={24} /></Button>
            <h1 className="text-sm font-black uppercase tracking-widest text-white/60">Terminal <span className="text-cyan-400 ml-2">/ {role === 'owner' ? 'MASTER' : 'GERENTE'}</span></h1>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase text-cyan-400">{authUser.email}</span>
            <span className="text-[8px] font-bold text-white/20">UID: {authUser.uid.substring(0,8)}...</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}