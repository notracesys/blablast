'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { 
  Users, 
  Search, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  UserCircle,
  Settings,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Lock,
  Percent,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function ManagersAdmin() {
  const db = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalInfluencers: 0,
    totalNetworkUsers: 0
  });

  useEffect(() => {
    if (!db || !authUser) return;

    console.log("[GERENTES] Iniciando escuta de dados da rede...");
    
    // Consulta específica para gerentes/admins
    // Como agora somos isAdmin no Layout, essa query deve ser aceita pelas rules
    const q = query(collection(db, 'users'), where('isAdmin', '==', true));
    
    const unsub = onSnapshot(q, (snap) => {
      console.log(`[GERENTES] Snapshot recebido: ${snap.size} documentos.`);
      const list: any[] = [];
      let activeCount = 0;
      snap.forEach(d => {
        const data = { id: d.id, ...d.data() };
        list.push(data);
        if (data.status === 'active') activeCount++;
      });
      
      setManagers(list);
      setStats(prev => ({ 
        ...prev, 
        total: list.length, 
        active: activeCount 
      }));
      setLoading(false);
    }, (error) => {
      console.error("[GERENTES] Falha ao listar gerentes:", error);
      const permissionError = new FirestorePermissionError({
        path: 'users',
        operation: 'list',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
      setLoading(false);
    });

    return () => unsub();
  }, [db, authUser]);

  const handleUpdateStatus = async (managerId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', managerId), { status: newStatus });
      toast({ title: "Status Atualizado", description: `O gerente agora está ${newStatus === 'active' ? 'ativo' : 'bloqueado'}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar status." });
    }
  };

  const handleUpdateCommission = async (managerId: string, rate: number) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', managerId), { managerCommissionRate: rate });
      toast({ title: "Comissão Alterada", description: `Nova taxa: ${rate}%` });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar comissão." });
    }
  };

  const handleTogglePermission = async (managerId: string, permission: string, value: boolean) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', managerId), {
        [`permissions.${permission}`]: value
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar permissão." });
    }
  };

  const filteredManagers = managers.filter(m => 
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id === searchTerm
  );

  return (
    <div className="p-8 md:p-12 space-y-8" id="admin-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">Corpo Administrativo</h2>
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">Gestão de Gerentes, Permissões e Performance de Rede.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <Input 
              placeholder="Buscar por Nome ou ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-12 bg-[#111622] border-white/5 pl-12 rounded-2xl text-sm font-bold"
            />
          </div>
          <Button className="h-12 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase rounded-2xl px-6">
            <UserPlus size={18} className="mr-2" /> NOVO GERENTE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Gerentes', val: stats.total, icon: Users, color: 'text-cyan-400' },
          { label: 'Em Atividade', val: stats.active, icon: Activity, color: 'text-emerald-400' },
          { label: 'Influenciadores na Rede', val: 12, icon: UserCircle, color: 'text-purple-400' },
          { label: 'Comissões Pagas', val: 'R$ 12.450', icon: DollarSign, color: 'text-amber-400' }
        ].map((s, i) => (
          <Card key={i} className="bg-[#111622] border-white/5 p-6 rounded-[2rem] flex items-center gap-5">
            <div className={cn("w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center", s.color)}>
              <s.icon size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block">{s.label}</span>
              <strong className="text-2xl font-black text-white">{s.val}</strong>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-[#111622] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">
                <th className="px-8 py-6">Gerente / Identificação</th>
                <th className="px-8 py-6">Comissão</th>
                <th className="px-8 py-6">Influenciadores Atribuídos</th>
                <th className="px-8 py-6">Status da Conta</th>
                <th className="px-8 py-6 text-right">Controle Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-cyan-500 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-white/10 font-black uppercase tracking-widest italic">Nenhum gerente encontrado</td>
                </tr>
              ) : filteredManagers.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center font-black text-cyan-400 border border-cyan-500/10 shadow-lg">
                        {m.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white uppercase tracking-tight">{m.fullName}</span>
                        <span className="text-[10px] font-bold text-white/20 mt-0.5">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Percent size={14} />
                      </div>
                      <span className="text-sm font-black text-white">{m.managerCommissionRate || 0}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white font-black">
                        {m.influencerCount || 0} Ativos
                      </Badge>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={cn(
                      "font-black uppercase text-[9px] px-3 py-1 rounded-full",
                      m.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {m.status === 'active' ? '● ONLINE' : '● BLOQUEADO'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button 
                      onClick={() => { setSelectedManager(m); setIsSheetOpen(true); }}
                      variant="ghost" 
                      className="bg-white/5 hover:bg-cyan-500 hover:text-black text-white/60 font-black text-[10px] uppercase rounded-xl"
                    >
                      GERENCIAR <ChevronRight size={14} className="ml-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-[#0d111c] border-white/5 p-0 overflow-hidden flex flex-col">
          {selectedManager && (
            <>
              <SheetHeader className="p-8 bg-[#111622] border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl font-black text-cyan-400 shadow-2xl">
                    {selectedManager.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <SheetTitle className="text-2xl font-black text-white uppercase tracking-tight italic">
                      {selectedManager.fullName}
                    </SheetTitle>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">ID: {selectedManager.id}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase">Gerente Nível 1</Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <TabsList className="bg-[#111622] border-b border-white/5 rounded-none h-14 px-8 justify-start gap-8">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Visão Geral</TabsTrigger>
                  <TabsTrigger value="influencers" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Influenciadores</TabsTrigger>
                  <TabsTrigger value="commissions" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Comissões</TabsTrigger>
                  <TabsTrigger value="permissions" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Permissões</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-8">
                  <TabsContent value="overview" className="m-0 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Volume da Rede</span>
                        <div className="text-2xl font-black text-white">R$ 45.200</div>
                        <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> +15% este mês</div>
                      </div>
                      <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Lucro Gerado</span>
                        <div className="text-2xl font-black text-emerald-400">R$ 18.080</div>
                        <span className="text-[9px] font-bold text-white/40 italic">Retenção de 40%</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="commissions" className="m-0 space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Percentual de Participação (%)</label>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="number" 
                          defaultValue={selectedManager.managerCommissionRate || 0}
                          onChange={e => handleUpdateCommission(selectedManager.id, parseInt(e.target.value))}
                          className="h-14 bg-black/40 border-white/5 rounded-2xl font-black text-xl text-emerald-400"
                        />
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                          <CheckCircle2 className="text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="permissions" className="m-0 space-y-6">
                    {[
                      { key: 'canViewGlobalRevenue', label: 'Ver Faturamento Global', desc: 'Permite que o gerente veja os números da banca inteira.' },
                      { key: 'canChangeDifficulty', label: 'Alterar Dificuldade do Jogo', desc: 'Acesso ao motor de retenção da arena.' },
                      { key: 'canModerateUsers', label: 'Moderar Usuários', desc: 'Capacidade de bloquear e analisar contas.' },
                      { key: 'canManageInfluencers', label: 'Gerenciar Influenciadores', desc: 'Vincular e desvincular novos afiliados.' }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-white uppercase">{p.label}</span>
                          <span className="text-[9px] text-white/30 font-medium">{p.desc}</span>
                        </div>
                        <Switch 
                          checked={selectedManager.permissions?.[p.key] || false}
                          onCheckedChange={v => handleTogglePermission(selectedManager.id, p.key, v)}
                        />
                      </div>
                    ))}
                  </TabsContent>
                </div>
              </Tabs>

              <div className="p-8 border-t border-white/5 bg-[#111622] flex gap-4">
                <Button 
                  onClick={() => handleUpdateStatus(selectedManager.id, selectedManager.status === 'active' ? 'blocked' : 'active')}
                  className={cn(
                    "flex-1 h-14 font-black uppercase rounded-2xl shadow-xl",
                    selectedManager.status === 'active' ? "bg-rose-500 text-white" : "bg-emerald-500 text-black"
                  )}
                >
                  {selectedManager.status === 'active' ? <Lock className="mr-2" /> : <CheckCircle2 className="mr-2" />}
                  {selectedManager.status === 'active' ? 'SUSPENDER ACESSO' : 'ATIVAR ACESSO'}
                </Button>
                <Button 
                  onClick={() => setIsSheetOpen(false)}
                  className="h-14 bg-white/5 text-white font-black uppercase px-8 rounded-2xl"
                >
                  FECHAR
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}