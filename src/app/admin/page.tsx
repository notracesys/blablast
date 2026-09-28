
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, onSnapshot, doc, query, where, limit, getDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { 
  DollarSign, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  UserCircle,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const db = useFirestore();
  const { user: authUser } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<'owner' | 'manager' | null>(null);
  const [stats, setStats] = useState({
    grossRevenue: 0,
    managerCount: 0,
    fraudAlerts: 0,
    retentionRate: 85,
    houseBalance: 0,
    activeInfluencers: 0
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!db || !authUser) return;

    // 1. Descobrir o cargo
    getDoc(doc(db, 'users', authUser.uid)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role || 'manager');
        
        // 2. Se for Dono, vê o faturamento global
        if (data.role === 'owner') {
          onSnapshot(doc(db, 'settings', 'game'), (s) => {
            if (s.exists()) {
              setStats(prev => ({ 
                ...prev, 
                grossRevenue: s.data().totalDeposited || 0,
                houseBalance: (s.data().totalDeposited || 0) * 0.4 
              }));
            }
          });

          // Dono vê auditoria total
          onSnapshot(query(collection(db, 'logs'), limit(5)), (s) => {
            const list: any[] = [];
            s.forEach(d => list.push({ id: d.id, ...d.data() }));
            setAuditLogs(list);
          });
        } 
        // 3. Se for Gerente, vê apenas os ganhos de rede dele
        else {
          setStats(prev => ({ ...prev, grossRevenue: data.commissionBalance || 0, houseBalance: data.totalCommissionEarned || 0 }));
          
          // Gerente vê logs das suas promoções
          onSnapshot(query(collection(db, 'logs'), where('actorId', '==', authUser.uid), limit(5)), (s) => {
            const list: any[] = [];
            s.forEach(d => list.push({ id: d.id, ...d.data() }));
            setAuditLogs(list);
          });
        }
      }
    });

  }, [db, authUser]);

  const isOwner = role === 'owner';

  const metricCards = [
    { 
      label: isOwner ? 'Faturamento Bruto' : 'Minhas Comissões', 
      value: `R$ ${stats.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: 'text-emerald-400', 
      trend: '+12%', 
      up: true 
    },
    { 
      label: isOwner ? 'Lucro da Banca' : 'Total Recebido', 
      value: `R$ ${stats.houseBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: BarChart3, 
      color: 'text-cyan-400', 
      trend: '+8.5%', 
      up: true 
    },
    { label: 'Gerentes Ativos', value: stats.managerCount, icon: ShieldCheck, color: 'text-amber-400', trend: 'Equipe', up: true, hidden: !isOwner },
    { label: 'Alertas Antifraude', value: stats.fraudAlerts, icon: AlertTriangle, color: 'text-rose-500', trend: 'Nível Seguro', up: true, hidden: !isOwner },
    { label: 'Retenção Global', value: `${stats.retentionRate}%`, icon: Activity, color: 'text-purple-400', trend: 'Otimizado', up: true, hidden: !isOwner },
    { label: 'Influenciadores', value: stats.activeInfluencers, icon: UserCircle, color: 'text-blue-400', trend: 'Expandindo', up: true },
  ].filter(c => !c.hidden);

  return (
    <div className="p-8 md:p-12 space-y-10" id="admin-page">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight italic italic">Painel de Operações</h2>
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">
            {isOwner ? 'Visão Macro da Banca BlockCash' : 'Minha Performance de Rede'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Arena Sincronizada
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Lucratividade em Tempo Real</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl space-y-4">
              <div className="text-5xl font-black text-white">R$ {stats.grossRevenue.toFixed(0)}</div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Volume Processado</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#111622] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Minha Atividade (Recente)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black uppercase text-white/30 tracking-widest">
                    <th className="px-8 py-5">Horário</th>
                    <th className="px-8 py-5">Ação</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-10 text-center text-white/10 font-black uppercase text-[10px] tracking-widest italic">Nenhuma ação recente</td>
                    </tr>
                  ) : auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 text-[10px] font-bold text-white/40">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recente'}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{log.action}</span>
                          <span className="text-[10px] text-white/20 truncate max-w-[200px]">{log.details}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase">Registrado</span>
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
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white italic italic">Ações Rápidas</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase">Gestão da Operação</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={() => router.push('/admin/influenciadores')} className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-widest text-xs rounded-2xl">
                Novo Influenciador
              </Button>
              {isOwner && (
                <Button onClick={() => router.push('/admin/configuracoes')} className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl">
                  Ajustar Dificuldade
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
