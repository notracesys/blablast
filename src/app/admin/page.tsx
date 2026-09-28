'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { 
  ArrowLeft,
  ShieldAlert,
  Wallet,
  TrendingUp,
  Users,
  Search,
  Lock,
  RefreshCw,
  Zap,
  Eye,
  EyeOff,
  Loader2,
  AlertOctagon
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Form de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Stats
  const [globalStats, setGlobalStats] = useState({
    totalBalance: 0,
    totalUsers: 0,
    activeDifficulty: 50,
    totalDeposited: 0
  });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Monitorar estado de autenticação
  useEffect(() => {
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        checkAdminStatus(u.uid);
      } else {
        setIsAdminVerified(false);
        setAccessDenied(false);
      }
    });
    return () => unsubAuth();
  }, [auth]);

  const checkAdminStatus = async (uid: string) => {
    if (!db) return;
    setIsVerifyingAdmin(true);
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().isAdmin === true) {
        setIsAdminVerified(true);
        setAccessDenied(false);
      } else {
        setIsAdminVerified(false);
        setAccessDenied(true);
      }
    } catch (err) {
      console.error("Erro ao verificar admin:", err);
      setAccessDenied(true);
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O useEffect do onAuthStateChanged cuidará da verificação
    } catch (error: any) {
      setLoginLoading(false);
      toast({ 
        variant: "destructive", 
        title: "Erro de Acesso", 
        description: "E-mail ou senha incorretos." 
      });
    }
  };

  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  // 2. Carregar dados do Dashboard se for Admin
  useEffect(() => {
    if (!isAdminVerified || !db) return;

    const settingsRef = doc(db, 'settings', 'game');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGlobalStats(prev => ({ 
          ...prev, 
          activeDifficulty: data.difficulty || 50,
          totalDeposited: data.totalDeposited || 0
        }));
      }
    }, (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: settingsRef.path,
        operation: 'get',
      }));
    });

    const usersCollRef = collection(db, 'users');
    const unsubUsers = onSnapshot(usersCollRef, (snap) => {
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
    }, (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: usersCollRef.path,
        operation: 'list',
      }));
    });

    return () => {
      unsubSettings();
      unsubUsers();
    };
  }, [isAdminVerified, db]);

  const handleUpdateDifficulty = (val: number[]) => {
    if (!db) return;
    const settingsRef = doc(db, 'settings', 'game');
    updateDoc(settingsRef, { difficulty: val[0] })
      .then(() => {
        toast({ title: "Sucesso", description: `Dificuldade ajustada para ${val[0]}%` });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: { difficulty: val[0] }
        }));
      });
  };

  // ESTADO DE CARREGAMENTO INICIAL
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060a17] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // TELA DE LOGIN (Se não estiver logado ou se o acesso foi negado)
  if (!user || accessDenied) {
    return (
      <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <main className="w-full max-w-[400px] z-10 flex flex-col items-center">
          <div className="mb-6 relative animate-float">
            <Image src="/blockcash.png" alt="Logo" width={110} height={40} className="object-contain" priority />
          </div>

          <div className="w-full bg-[#0b1426] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            {accessDenied ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-black uppercase text-white mb-2">Acesso Restrito</h1>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                    Sua conta ({user?.email}) não possui privilégios de administrador no banco de dados.
                  </p>
                </div>
                <Button onClick={handleLogout} className="w-full h-12 bg-white/5 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-colors">
                  TENTAR COM OUTRA CONTA
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-2">
                  <h1 className="text-xl font-black uppercase tracking-tight mb-1">Terminal Master</h1>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">Área de Controle Restrita</p>
                </div>

                <div className="space-y-4">
                  <Input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Admin" 
                    className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20"
                  />
                  <div className="relative">
                    <Input 
                      required
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha de Acesso" 
                      className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button disabled={loginLoading || isVerifyingAdmin} className="w-full h-14 bg-gradient-to-r from-amber-400 to-orange-600 hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                  {loginLoading || isVerifyingAdmin ? <Loader2 className="w-5 h-5 animate-spin" /> : 'AUTENTICAR TERMINAL'}
                </Button>
              </form>
            )}
          </div>
          
          <button onClick={() => router.push('/painel')} className="mt-8 text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-cyan-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Voltar para o Painel Jogador
          </button>
        </main>
      </div>
    );
  }

  // TELA DE CARREGAMENTO DOS DADOS (Se logado e verificado, mas dados ainda não chegaram)
  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-[#060a17] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/40">Sincronizando Banco...</p>
      </div>
    );
  }

  // DASHBOARD ADMIN COMPLETO
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
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Terminal Autenticado
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:opacity-80">SAIR</button>
          <Image src="/blockcash.png" alt="Logo" width={80} height={30} className="object-contain" />
        </div>
      </header>

      <main className="p-6 max-w-[1200px] mx-auto w-full space-y-8">
        {/* CARDS DE MÉTRICAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total em Carteiras</span>
            </div>
            <strong className="text-3xl font-[1000] text-white block">R$ {globalStats.totalBalance.toFixed(2).replace('.', ',')}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Saldo total dos jogadores</p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Depositado</span>
            </div>
            <strong className="text-3xl font-[1000] text-emerald-400 block">R$ {globalStats.totalDeposited.toFixed(2).replace('.', ',')}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Volume bruto de entradas</p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-2">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Base de Dados</span>
            </div>
            <strong className="text-3xl font-[1000] text-white block">{globalStats.totalUsers}</strong>
            <p className="text-[10px] text-white/40 font-bold uppercase">Usuários cadastrados</p>
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
                  <h2 className="text-xl font-[1000] uppercase tracking-tighter">Algoritmo de Dificuldade</h2>
                  <p className="text-xs text-white/40 font-medium italic">Define a probabilidade de peças complexas na Arena Real.</p>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-emerald-400">FÁCIL</span>
                  <span className="text-orange-500">EQUILIBRADO</span>
                  <span className="text-rose-600">IMPOSSÍVEL</span>
                </div>
                <Slider 
                  value={[globalStats.activeDifficulty]} 
                  max={100} 
                  step={1} 
                  onValueChange={(val) => setGlobalStats(prev => ({ ...prev, activeDifficulty: val[0] }))}
                  onValueCommit={handleUpdateDifficulty}
                  className="py-4"
                />
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/50 leading-relaxed">
                    <span className="text-rose-500 font-black">MODO DRENO:</span> Ao atingir 100%, o jogo passará a entregar apenas peças de 5 blocos, preenchendo o tabuleiro rapidamente e impedindo a conclusão de metas altas.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48 aspect-square rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 flex flex-col items-center justify-center shadow-xl">
               <span className="text-[10px] font-black text-white/20 uppercase mb-1">Nível Atual</span>
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
              <Users className="w-5 h-5 text-cyan-400" /> Base de Jogadores
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Buscar por nome, email ou tel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                        Visualizar
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