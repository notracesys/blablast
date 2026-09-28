
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { 
  ArrowLeft,
  ShieldAlert,
  Wallet,
  TrendingUp,
  Users,
  Search,
  Lock,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [userData, setUserData] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState({
    totalBalance: 0,
    totalUsers: 0,
    activeDifficulty: 50,
    totalDeposited: 0
  });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchTerm, setSearchType] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!db) return;

    // 1. Verificar Perfil do Admin
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, 
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (!data.isAdmin) {
            setAccessDenied(true);
            setTimeout(() => router.push('/painel'), 3000);
            return;
          }
          setUserData(data);
        }
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // 2. Stats Globais (Configurações)
    const settingsRef = doc(db, 'settings', 'game');
    const unsubSettings = onSnapshot(settingsRef, 
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setGlobalStats(prev => ({ 
            ...prev, 
            activeDifficulty: data.difficulty || 50,
            totalDeposited: data.totalDeposited || 0
          }));
        }
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // 3. Lista de Usuários (Apenas Admin pode listar a coleção inteira)
    const usersCollRef = collection(db, 'users');
    const unsubUsers = onSnapshot(usersCollRef, 
      (snap) => {
        const list: any[] = [];
        let balanceSum = 0;
        snap.forEach(doc => {
          const d = doc.data();
          list.push({ id: doc.id, ...d });
          balanceSum += (d.balance || 0);
        });
        setUsersList(list);
        setGlobalStats(prev => ({ 
          ...prev, 
          totalUsers: list.length,
          totalBalance: balanceSum
        }));
      }, 
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: usersCollRef.path,
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        // Não bloqueamos a UI imediatamente aqui para permitir que o erro contextual apareça
      }
    );

    return () => {
      unsubUser();
      unsubSettings();
      unsubUsers();
    };
  }, [user, authLoading, db, router]);

  const handleUpdateDifficulty = (val: number[]) => {
    if (!db) return;
    setIsUpdating(true);
    const settingsRef = doc(db, 'settings', 'game');
    updateDoc(settingsRef, { difficulty: val[0] })
      .then(() => {
        toast({ title: "Configuração Salva", description: `Dificuldade ajustada para ${val[0]}%` });
        setIsUpdating(false);
      })
      .catch(async (serverError) => {
        setIsUpdating(false);
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: { difficulty: val[0] }
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#060a17] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
          <Lock className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-black uppercase mb-2">Acesso Restrito</h1>
        <p className="text-white/40 text-sm max-w-xs">Você não possui permissão para acessar este terminal. Redirecionando...</p>
      </div>
    );
  }

  if (authLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#060a17] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col pb-10">
      <header className="w-full bg-[#0b1426] border-b border-white/5 h-20 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/painel')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter">Master Control</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Protegido
            </p>
          </div>
        </div>
        <Image src="/blockcash.png" alt="Logo" width={80} height={30} className="object-contain" />
      </header>

      <main className="p-6 max-w-[1200px] mx-auto w-full space-y-8">
        {/* CARDS DE MÉTRICAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Custódia</span>
            </div>
            <strong className="text-3xl font-[1000] text-white block">R$ {globalStats.totalBalance.toFixed(2).replace('.', ',')}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Soma de todos os saldos de usuários</p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Volume Entradas</span>
            </div>
            <strong className="text-3xl font-[1000] text-emerald-400 block">R$ {globalStats.totalDeposited.toFixed(2).replace('.', ',')}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Volume total processado no sistema</p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Base Ativa</span>
            </div>
            <strong className="text-3xl font-[1000] text-white block">{globalStats.totalUsers}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Jogadores registrados no banco</p>
          </div>
        </section>

        {/* CONTROLE DE DIFICULDADE */}
        <section className="bg-slate-900/80 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-40 h-40" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-[1000] uppercase tracking-tighter">Dificuldade da Arena</h2>
                  <p className="text-xs text-white/40 font-medium italic">Ajuste o algoritmo de entrega de peças em tempo real.</p>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-emerald-400">0% (LUCRO PARA O USER)</span>
                  <span className="text-orange-500">50% (EQUILIBRADO)</span>
                  <span className="text-rose-600">100% (MODO DRENO)</span>
                </div>
                <Slider 
                  defaultValue={[globalStats.activeDifficulty]} 
                  max={100} 
                  step={1} 
                  onValueCommit={handleUpdateDifficulty}
                  className="py-4"
                />
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/50 leading-relaxed">
                    <span className="text-rose-500 font-black">IMPORTANTE:</span> Acima de 80%, o sistema enviará prioritariamente peças de 5 blocos, tornando quase impossível completar linhas sem lotar o tabuleiro.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48 aspect-square rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 flex flex-col items-center justify-center shadow-xl">
               <span className="text-[10px] font-black text-white/20 uppercase mb-1">Status Atual</span>
               <strong className={`text-5xl font-[1000] ${globalStats.activeDifficulty > 70 ? 'text-rose-500' : 'text-cyan-400'}`}>
                 {globalStats.activeDifficulty}%
               </strong>
            </div>
          </div>
        </section>

        {/* LISTA DE USUÁRIOS */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
              <Users className="w-5 h-5 text-cyan-400" /> Gerenciar Jogadores
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Buscar por nome, email ou tel..." 
                value={searchTerm}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-black/20 border-white/5 h-12 pl-11 rounded-2xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest">
                  <th className="pb-4 pl-2">Usuário</th>
                  <th className="pb-4">Saldo Real</th>
                  <th className="pb-4">Comissão</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right pr-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{u.fullName}</span>
                        <span className="text-[10px] text-white/40">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-black text-emerald-400">R$ {(u.balance || 0).toFixed(2)}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-black text-cyan-400">R$ {(u.commissionBalance || 0).toFixed(2)}</span>
                    </td>
                    <td className="py-4">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase ${u.isAdmin ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/40'}`}>
                        {u.isAdmin ? 'Administrador' : 'Jogador'}
                      </div>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button className="h-8 px-4 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition-colors">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
