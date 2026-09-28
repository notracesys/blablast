
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, TrendingUp, Users, Wallet, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalDeposited: 0,
    userCount: 0,
    difficulty: 50
  });
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u && db) {
        try {
          const userDocRef = doc(db, 'users', u.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists() && snap.data().isAdmin === true) {
            setIsAdmin(true);
            setUser(u);
          } else {
            setIsAdmin(false);
            setUser(u);
          }
        } catch (e) {
          console.error("Erro ao validar admin:", e);
          setIsAdmin(false);
          setUser(u);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsub();
  }, [auth, db]);

  useEffect(() => {
    if (!isAdmin || !db) return;

    // Listen to Global Settings
    const settingsRef = doc(db, 'settings', 'game');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStats(prev => ({ 
          ...prev, 
          difficulty: d.difficulty || 50, 
          totalDeposited: d.totalDeposited || 0 
        }));
      }
    }, async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: settingsRef.path,
        operation: 'get',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    // Listen to Users
    const usersCollRef = collection(db, 'users');
    const unsubUsers = onSnapshot(usersCollRef, (snap) => {
      const list: any[] = [];
      let balanceSum = 0;
      snap.forEach(d => {
        const data = d.data();
        list.push({ id: d.id, ...data });
        balanceSum += (data.balance || 0);
      });
      setUsersList(list);
      setStats(prev => ({ ...prev, userCount: list.length, totalBalance: balanceSum }));
    }, async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: usersCollRef.path,
        operation: 'list',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    return () => {
      unsubSettings();
      unsubUsers();
    };
  }, [isAdmin, db]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O useEffect do onAuthStateChanged cuidará do resto
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: "Credenciais inválidas." });
      setLoginLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div id="admin-page" className="flex h-screen w-full items-center justify-center bg-[#08090d]">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div id="admin-page" className="flex h-screen w-full items-center justify-center bg-[#08090d] p-6">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-[#111622] p-10 border border-white/5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Image src="/blockcash.png" alt="Logo" width={100} height={40} className="filter brightness-125" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Acesso Master</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">Identifique-se para continuar</p>
          </div>

          {user && !isAdmin ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-3">
              <ShieldAlert className="mx-auto text-rose-500" size={24} />
              <p className="text-xs font-bold text-rose-400 uppercase leading-relaxed">
                Sua conta ({user.email}) não possui privilégios de administrador no banco de dados.
              </p>
              <Button onClick={() => signOut(auth!)} variant="ghost" className="text-[10px] text-white/40 hover:text-white uppercase">Sair e tentar outro</Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Identificação</label>
                <Input 
                  placeholder="E-mail" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="h-12 bg-black/40 border-white/5 rounded-2xl text-sm" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Senha</label>
                <Input 
                  placeholder="Senha" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="h-12 bg-black/40 border-white/5 rounded-2xl text-sm" 
                  required 
                />
              </div>
              <Button disabled={loginLoading} className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_20px_rgba(6,182,212,0.2)]">
                {loginLoading ? <Loader2 className="animate-spin" /> : "AUTENTICAR"}
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="admin-page" className="min-h-screen w-full bg-[#08090d] text-white">
      <header className="flex h-20 items-center justify-between border-b border-white/5 bg-[#111622]/80 backdrop-blur-xl px-10 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Image src="/blockcash.png" alt="Logo" width={80} height={32} />
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 hidden md:block">Terminal Master</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[10px] font-black text-white/30 uppercase leading-none">Admin Logado</span>
            <span className="text-xs font-bold text-white/60">{user?.email}</span>
          </div>
          <button onClick={() => signOut(auth!)} className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-10 space-y-10">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-white/40">
              <Wallet size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Saldo em Custódia</span>
            </div>
            <div className="text-3xl font-black tracking-tight">R$ {stats.totalBalance.toFixed(2).replace('.', ',')}</div>
          </div>
          
          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-emerald-400/60">
              <TrendingUp size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Total Depositado</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-emerald-400">R$ {stats.totalDeposited.toFixed(2).replace('.', ',')}</div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-purple-400/60">
              <Users size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Jogadores Reais</span>
            </div>
            <div className="text-3xl font-black tracking-tight">{stats.userCount}</div>
          </div>

          <div className="rounded-[2rem] border border-cyan-500/20 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-cyan-400">
              <BarChart3 size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Lucratividade</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-cyan-400">
              {((stats.totalDeposited / stats.totalBalance) || 0).toFixed(1)}x
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-[2.5rem] border border-white/5 bg-[#111622] p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Dificuldade Global</h3>
                <p className="text-xs text-white/40 font-medium">Define a probabilidade de peças difíceis para todos.</p>
              </div>
              <div className="ml-auto text-2xl font-black text-orange-500">{stats.difficulty}%</div>
            </div>

            <div className="space-y-6">
              <Slider 
                value={[stats.difficulty]} 
                max={100} 
                step={1} 
                disabled 
                className="py-4 opacity-50 cursor-not-allowed"
              />
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1 text-white/20">
                <span>Fácil</span>
                <span>Impossível</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/5 bg-[#111622] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Gerenciamento de Contas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <th className="px-8 py-5">Nome</th>
                    <th className="px-8 py-5">E-mail</th>
                    <th className="px-8 py-5">Saldo</th>
                    <th className="px-8 py-5 text-center">Partidas</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 text-sm font-bold uppercase">{u.fullName}</td>
                      <td className="px-8 py-6 text-xs text-white/50">{u.email}</td>
                      <td className="px-8 py-6 text-sm font-black text-emerald-400">R$ {(u.balance || 0).toFixed(2).replace('.', ',')}</td>
                      <td className="px-8 py-6 text-center text-xs font-bold text-white/30">{u.gamesPlayed || 0}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${u.isAdmin ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : 'border-white/10 text-white/20'}`}>
                          {u.isAdmin ? 'ADMIN' : 'PLAYER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
