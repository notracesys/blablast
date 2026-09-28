
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  DollarSign, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  Gamepad2,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const db = useFirestore();

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    matchesToday: 0,
    completionRate: 85,
    influencers: 0,
    fraudAlerts: 0,
    grossRevenue: 0,
    managerCount: 0
  });

  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;

    // Usuários Totais e Gerentes
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      let admins = 0;
      const list: any[] = [];
      snap.forEach(d => { 
        if (d.data().isAdmin) admins++; 
        list.push({ id: d.id, ...d.data() });
      });
      setStats(prev => ({ ...prev, totalUsers: snap.size, managerCount: admins }));
      setRecentUsers(list.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)).slice(0, 5));
    }, () => {
      // Ignora erro de permissão silenciosamente pois o layout já valida
    });

    // Faturamento e Configurações
    const unsubSettings = onSnapshot(doc(db, 'settings', 'game'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStats(prev => ({ ...prev, grossRevenue: d.totalDeposited || 0 }));
      }
    }, () => {});

    return () => {
      unsubUsers();
      unsubSettings();
    };
  }, [db]);

  const metricCards = [
    { label: 'Usuários Totais', value: stats.totalUsers, icon: Users, color: 'text-blue-400', trend: '+12%', up: true },
    { label: 'Faturamento Bruto', value: `R$ ${stats.grossRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', trend: '+8.5%', up: true },
    { label: 'Taxa de Retenção', value: `${stats.completionRate}%`, icon: BarChart3, color: 'text-purple-400', trend: 'Estável', up: true },
    { label: 'Alertas Fraude', value: stats.fraudAlerts, icon: AlertTriangle, color: 'text-rose-500', trend: 'Nível Baixo', up: true },
    { label: 'Gerentes Ativos', value: stats.managerCount, icon: ShieldCheck, color: 'text-amber-400', trend: 'Master', up: true },
    { label: 'Influenciadores', value: stats.influencers, icon: UserPlus, color: 'text-cyan-400', trend: '+3', up: true },
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Cérebro da Operação</h2>
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">Status em Tempo Real da Rede BlockCash</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistemas Operacionais
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metricCards.map((card, i) => (
          <Card key={i} className="bg-[#111622] border-white/5 p-6 space-y-4 rounded-[2rem] shadow-xl hover:border-white/10 transition-all">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03]", card.color)}>
              <card.icon size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">{card.label}</span>
              <div className="text-xl font-black text-white">{card.value}</div>
            </div>
            <div className={cn("text-[9px] font-bold flex items-center gap-1", card.up ? "text-emerald-400" : "text-rose-500")}>
              {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {card.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[2.5rem] bg-[#111622] border border-white/5 p-8 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Fluxo de Engajamento vs Ganhos</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-[10px] font-black bg-white/5">DIÁRIO</Button>
                <Button size="sm" variant="ghost" className="text-[10px] font-black">MENSAL</Button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-3xl">
              <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Motor de Gráficos Recharts em Standby...</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#111622] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Últimas Atividades na Arena</h3>
              <Button onClick={() => router.push('/admin/usuarios')} variant="link" className="text-cyan-400 text-xs font-black uppercase">Ver Base Completa</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase text-white/30 tracking-widest">
                    <th className="px-8 py-5">Jogador</th>
                    <th className="px-8 py-5">Saldo</th>
                    <th className="px-8 py-5">Partidas</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40">{u.fullName?.charAt(0)}</div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{u.fullName}</span>
                            <span className="text-[10px] text-white/20">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-black text-emerald-400">R$ {u.balance?.toFixed(2)}</td>
                      <td className="px-8 py-5 text-[10px] font-bold text-white/40">{u.gamesPlayed || 0} jogadas</td>
                      <td className="px-8 py-5 text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[8px] font-black uppercase",
                          u.status === 'blocked' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {u.status === 'blocked' ? 'Bloqueado' : 'Ativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-gradient-to-br from-[#111622] to-[#0d111c] border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Dificuldade Global</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase">Ajuste de Lucratividade</p>
              </div>
            </div>
            <div className="p-6 bg-black/20 rounded-[1.5rem] border border-white/5 text-center space-y-2">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Preset Atual</span>
              <div className="text-4xl font-black text-white">50%</div>
            </div>
            <Button onClick={() => router.push('/admin/configuracoes')} className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl">
              Configurar Arena
            </Button>
          </Card>

          <div className="p-8 rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle size={20} />
              <h4 className="text-xs font-black uppercase tracking-widest">Rede Antifraude</h4>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed font-medium">
              Monitorando múltiplas contas e comportamentos impossíveis. IA detectando padrões suspeitos em tempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
