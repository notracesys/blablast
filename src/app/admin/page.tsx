'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  LogOut, 
  TrendingUp, 
  Users, 
  Wallet, 
  Zap, 
  ShieldAlert, 
  BarChart3, 
  Save, 
  UserPlus, 
  ShieldMinus,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

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
  const [tempDifficulty, setTempDifficulty] = useState(50);
  const [isUpdatingDiff, setIsUpdatingDiff] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 1. Monitorar estado de autenticação e verificar isAdmin
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
          console.error("Erro ao verificar privilégios:", e);
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

  // 2. Buscar dados apenas se for admin confirmado
  useEffect(() => {
    if (!isAdmin || !db) return;

    // Monitorar Configurações Globais
    const settingsRef = doc(db, 'settings', 'game');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const diff = d.difficulty ?? 50;
        setStats(prev => ({ 
          ...prev, 
          difficulty: diff, 
          totalDeposited: d.totalDeposited || 0 
        }));
        setTempDifficulty(diff);
      }
    }, (err) => {
      console.warn("Aguardando propagação de permissões para settings...");
    });

    // Monitorar Lista de Usuários
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
    }, (err) => {
      console.warn("Permissão de listagem negada ou aguardando regras.");
    });

    return () => {
      unsubSettings();
      unsubUsers();
    };
  }, [isAdmin, db]);

  const handleUpdateDifficulty = async () => {
    if (!db) return;
    setIsUpdatingDiff(true);
    try {
      const settingsRef = doc(db, 'settings', 'game');
      await updateDoc(settingsRef, { difficulty: tempDifficulty });
      toast({ title: "Sucesso!", description: `Dificuldade alterada para ${tempDifficulty}%` });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar. Certifique-se de que o documento settings/game existe." });
    } finally {
      setIsUpdatingDiff(false);
    }
  };

  const handleToggleAdminStatus = async (targetUserId: string, currentStatus: boolean, name: string) => {
    if (!db) return;
    
    // Evitar que o admin logado remova seus próprios privilégios por acidente
    if (targetUserId === user?.uid) {
      toast({ 
        variant: "destructive", 
        title: "Ação bloqueada", 
        description: "Por segurança, você não pode rebaixar a si mesmo através do terminal." 
      });
      return;
    }

    setActionLoadingId(targetUserId);
    try {
      const userRef = doc(db, 'users', targetUserId);
      await updateDoc(userRef, { isAdmin: !currentStatus });
      toast({ 
        title: currentStatus ? "Gerente Rebaixado" : "Gerente Promovido", 
        description: `${name} agora é ${currentStatus ? 'Player' : 'Master'}.` 
      });
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Erro de Permissão", 
        description: "Apenas Administradores Master podem alterar cargos." 
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

  // Tela de Login/Identificação
  if (!user || !isAdmin) {
    return (
      <div id="admin-page" className="flex h-screen w-full items-center justify-center bg-[#08090d] p-6">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-[#111622] p-10 border border-white/5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Image src="/blockcash.png" alt="Logo" width={100} height={40} className="filter brightness-125" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Acesso Master</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">Painel Restrito a Gerentes Autorizados</p>
          </div>

          {user && !isAdmin ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center space-y-4">
              <ShieldAlert className="mx-auto text-rose-500" size={32} />
              <div className="space-y-1">
                <p className="text-sm font-black text-rose-400 uppercase">Acesso Negado</p>
                <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed px-4">
                  Sua conta não possui privilégios de administrador no banco de dados.
                </p>
              </div>
              <Button onClick={() => signOut(auth!)} variant="ghost" className="w-full text-[10px] text-white/40 hover:text-white uppercase tracking-widest bg-white/5">Sair e tentar outra</Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Identificação</label>
                <Input 
                  placeholder="E-mail" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="h-12 bg-black/40 border-white/5 rounded-2xl text-sm placeholder:text-white/10" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Chave de Segurança</label>
                <Input 
                  placeholder="Senha" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="h-12 bg-black/40 border-white/5 rounded-2xl text-sm placeholder:text-white/10" 
                  required 
                />
              </div>
              <Button disabled={loginLoading} className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)]">
                {loginLoading ? <Loader2 className="animate-spin" /> : "ENTRAR NO TERMINAL"}
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Painel Administrativo Principal (Desktop)
  return (
    <div id="admin-page" className="min-h-screen w-full bg-[#08090d] text-white">
      <header className="flex h-20 items-center justify-between border-b border-white/5 bg-[#111622]/80 backdrop-blur-xl px-10 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Image src="/blockcash.png" alt="Logo" width={80} height={32} />
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Terminal Master</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black text-white/30 uppercase leading-none">Status: Online</span>
            <span className="text-xs font-bold text-white/60">{user?.email}</span>
          </div>
          <button onClick={() => signOut(auth!)} className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-10 space-y-10">
        {/* Métricas Rápidas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-white/40">
              <Wallet size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Saldo Total Jogadores</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-white">R$ {stats.totalBalance.toFixed(2).replace('.', ',')}</div>
          </div>
          
          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-emerald-400/60">
              <TrendingUp size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Faturamento Bruto</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-emerald-400">R$ {stats.totalDeposited.toFixed(2).replace('.', ',')}</div>
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-purple-400/60">
              <Users size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Jogadores Registrados</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-white">{stats.userCount}</div>
          </div>

          <div className="rounded-[2rem] border border-cyan-500/20 bg-[#111622] p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-cyan-400">
              <BarChart3 size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Saúde da Banca</span>
            </div>
            <div className="text-3xl font-black tracking-tight text-cyan-400">
              {stats.totalDeposited > 0 ? (stats.totalDeposited / (stats.totalBalance || 1)).toFixed(1) : 0}x
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controle de Dificuldade */}
          <div className="lg:col-span-4 rounded-[2.5rem] border border-white/5 bg-[#111622] p-10 space-y-8 shadow-2xl h-fit">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Dificuldade</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Mão do Jogo</p>
              </div>
              <div className="ml-auto text-2xl font-black text-orange-500">{tempDifficulty}%</div>
            </div>

            <div className="space-y-10">
              <Slider 
                value={[tempDifficulty]} 
                onValueChange={(val) => setTempDifficulty(val[0])}
                max={100} 
                step={1} 
                className="py-4"
              />
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                  <span>Modo Ganho</span>
                  <span>Modo Dreno</span>
                </div>
                <Button 
                  onClick={handleUpdateDifficulty} 
                  disabled={isUpdatingDiff || tempDifficulty === stats.difficulty}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-xs h-12 rounded-2xl transition-all"
                >
                  {isUpdatingDiff ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" size={14} /> SALVAR ALTERAÇÃO</>}
                </Button>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3 items-start">
              <AlertCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[9px] text-white/40 leading-relaxed font-medium">
                <strong>Atenção:</strong> Alterar a dificuldade acima de 80% fará com que os jogadores recebam apenas peças complexas, acelerando o preenchimento do tabuleiro e protegendo o caixa.
              </p>
            </div>
          </div>

          {/* Tabela de Gestão de Contas (Gerentes e Players) */}
          <div className="lg:col-span-8 rounded-[2.5rem] border border-white/5 bg-[#111622] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Gerenciamento de Gerentes</h3>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Promova players a gerentes para ajudarem na gestão</p>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{usersList.length} Usuários</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <th className="px-8 py-5">Usuário</th>
                    <th className="px-8 py-5">Saldo</th>
                    <th className="px-8 py-5 text-center">Partidas</th>
                    <th className="px-8 py-5 text-center">Cargo</th>
                    <th className="px-8 py-5 text-right">Gestão de Privilégios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map(u => {
                    const isSelf = u.id === user?.uid;
                    const isLoading = actionLoadingId === u.id;
                    
                    return (
                      <tr key={u.id} className={`hover:bg-white/[0.02] transition-colors group ${isSelf ? 'bg-cyan-500/[0.03]' : ''}`}>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase text-white/90">{u.fullName} {isSelf && <span className="text-[10px] text-cyan-400 ml-1 opacity-60">(VOCÊ)</span>}</span>
                            <span className="text-[10px] font-medium text-white/20">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-emerald-400">R$ {(u.balance || 0).toFixed(2).replace('.', ',')}</td>
                        <td className="px-8 py-6 text-center text-xs font-bold text-white/30">{u.gamesPlayed || 0}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full border transition-all ${u.isAdmin ? 'border-amber-500/50 text-amber-500 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'border-white/10 text-white/20'}`}>
                            {u.isAdmin ? 'MASTER' : 'PLAYER'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {u.isAdmin ? (
                              <button 
                                onClick={() => handleToggleAdminStatus(u.id, true, u.fullName)}
                                disabled={isSelf || isLoading}
                                className={`h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isSelf ? 'opacity-20 grayscale cursor-not-allowed' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white'}`}
                                title={isSelf ? "Você não pode rebaixar a si mesmo" : "Rebaixar para Player"}
                              >
                                {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <ShieldMinus size={14} />}
                                Rebaixar
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleToggleAdminStatus(u.id, false, u.fullName)}
                                disabled={isLoading}
                                className="h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white"
                              >
                                {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <UserPlus size={14} />}
                                Promover
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {usersList.length === 0 && (
                <div className="p-20 text-center space-y-4">
                  <Loader2 className="animate-spin text-white/10 mx-auto" size={40} />
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Sincronizando banco de gerentes...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
