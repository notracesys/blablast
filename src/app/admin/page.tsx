'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, TrendingUp, Users, Wallet, Zap } from 'lucide-react';

export default function AdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Login
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
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db!, 'users', u.uid));
        if (snap.exists() && snap.data().isAdmin === true) {
          setIsAdmin(true);
          setUser(u);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, db]);

  useEffect(() => {
    if (!isAdmin || !db) return;

    const unsubSettings = onSnapshot(doc(db, 'settings', 'game'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStats(prev => ({ ...prev, difficulty: d.difficulty || 50, totalDeposited: d.totalDeposited || 0 }));
      }
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const list: any[] = [];
      let balanceSum = 0;
      snap.forEach(d => {
        const data = d.data();
        list.push({ id: d.id, ...data });
        balanceSum += (data.balance || 0);
      });
      setUsers(list);
      setStats(prev => ({ ...prev, userCount: list.length, totalBalance: balanceSum }));
    });

    return () => { unsubSettings(); unsubUsers(); };
  }, [isAdmin, db]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: "Credenciais inválidas." });
    } finally {
      setLoginLoading(false);
    }
  };

  const updateDifficulty = (val: number[]) => {
    if (!db) return;
    updateDoc(doc(db, 'settings', 'game'), { difficulty: val[0] })
      .then(() => toast({ title: "Sucesso", description: "Dificuldade atualizada." }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#08090d] text-white"><Loader2 className="animate-spin" /></div>;

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#08090d] p-4 text-white">
        <div className="w-full max-w-sm space-y-6 rounded-2xl bg-[#111622] p-8 border border-white/5 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-tight">Admin Master</h1>
            <p className="text-xs text-white/40 mt-1">Apenas pessoal autorizado</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/20 border-white/10" required />
            <Input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black/20 border-white/10" required />
            <Button disabled={loginLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              {loginLoading ? <Loader2 className="animate-spin" /> : "ENTRAR NO TERMINAL"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#111622] px-8">
        <h2 className="text-lg font-black uppercase tracking-widest text-cyan-400">Master Control</h2>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-white/40">{user?.email}</span>
          <button onClick={() => signOut(auth!)} className="text-rose-500 hover:opacity-80"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/5 bg-[#111622] p-6">
            <div className="flex items-center gap-3 text-white/40 mb-2"><Wallet size={16} /><span className="text-[10px] font-black uppercase">Saldo total</span></div>
            <div className="text-3xl font-black">R$ {stats.totalBalance.toFixed(2)}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#111622] p-6">
            <div className="flex items-center gap-3 text-emerald-400/60 mb-2"><TrendingUp size={16} /><span className="text-[10px] font-black uppercase">Total Depositado</span></div>
            <div className="text-3xl font-black text-emerald-400">R$ {stats.totalDeposited.toFixed(2)}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#111622] p-6">
            <div className="flex items-center gap-3 text-purple-400/60 mb-2"><Users size={16} /><span className="text-[10px] font-black uppercase">Jogadores</span></div>
            <div className="text-3xl font-black">{stats.userCount}</div>
          </div>
        </div>

        {/* Difficulty Control */}
        <div className="rounded-2xl border border-white/5 bg-[#111622] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-orange-500" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest">Algoritmo de Dificuldade ({stats.difficulty}%)</h3>
          </div>
          <Slider value={[stats.difficulty]} max={100} step={1} onValueChange={v => setStats(s => ({...s, difficulty: v[0]}))} onValueCommit={updateDifficulty} />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-white/20">
            <span>FÁCIL (NORMAL)</span>
            <span className="text-rose-500">IMPOSSÍVEL (SÓ 5 BLOCOS)</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-white/5 bg-[#111622] overflow-hidden">
          <div className="p-6 border-b border-white/5"><h3 className="text-xs font-black uppercase tracking-widest">Lista de Jogadores</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black uppercase text-white/30">
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Saldo</th>
                  <th className="px-6 py-4">Indicados</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium">{u.fullName} <br/><span className="text-[10px] text-white/20">{u.email}</span></td>
                    <td className="px-6 py-4 font-black text-emerald-400">R$ {(u.balance || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-white/40">{u.referredCount || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${u.isAdmin ? 'border-amber-500/50 text-amber-500' : 'border-white/10 text-white/30'}`}>
                        {u.isAdmin ? 'ADMIN' : 'PLAYER'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
