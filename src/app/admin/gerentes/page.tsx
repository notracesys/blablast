'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, getDocs, limit, addDoc } from 'firebase/firestore';
import { 
  Users, 
  Search, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  UserCircle,
  Loader2,
  CheckCircle2,
  Lock,
  Percent,
  Activity,
  ChevronRight,
  X,
  ShieldCheck,
  SearchCode
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ManagersAdmin() {
  const db = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Add Manager State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [newManagerData, setNewManagerData] = useState({
    commission: 10,
    permissions: {
      canViewGlobalRevenue: true,
      canChangeDifficulty: false,
      canModerateUsers: true,
      canManageInfluencers: true
    }
  });

  useEffect(() => {
    if (!db || !authUser) return;

    // Busca usuários que são gerentes ou donos
    const q = query(collection(db, 'users'), where('isAdmin', '==', true));
    
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() });
      });
      setManagers(list);
      setLoading(false);
    }, (error) => {
      console.warn("[GERENTES] Aguardando permissão ou dados vazios...");
      setLoading(false);
    });

    return () => unsub();
  }, [db, authUser]);

  const handleSearchUser = async () => {
    if (!db || !searchQuery) return;
    setIsSearching(true);
    setFoundUser(null);
    try {
      // Tenta buscar por e-mail exato
      const q = query(collection(db, 'users'), where('email', '==', searchQuery.toLowerCase().trim()), limit(1));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setFoundUser({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        toast({ variant: "destructive", title: "Usuário não encontrado", description: "Verifique se o e-mail está correto." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na busca", description: "Falha ao consultar base de dados." });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePromoteToManager = async () => {
    if (!db || !foundUser || !authUser) return;
    setIsPromoting(true);
    try {
      const userRef = doc(db, 'users', foundUser.id);
      const updatePayload = {
        isAdmin: true,
        role: 'manager',
        managerCommissionRate: newManagerData.commission,
        permissions: newManagerData.permissions,
        lastPromotedAt: new Date().toISOString(),
        promotedBy: authUser.uid
      };

      await updateDoc(userRef, updatePayload);

      // Log de Auditoria
      await addDoc(collection(db, 'logs'), {
        action: 'PROMOÇÃO_GERENTE',
        details: `Usuário ${foundUser.email} promovido a Gerente com ${newManagerData.commission}% de comissão.`,
        actorId: authUser.uid,
        targetId: foundUser.id,
        timestamp: new Date().toISOString()
      });

      toast({ title: "GERENTE ADICIONADO!", description: `${foundUser.fullName} agora tem acesso ao painel.` });
      setIsAddModalOpen(false);
      setFoundUser(null);
      setSearchQuery('');
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao promover", description: "Não foi possível salvar as alterações." });
    } finally {
      setIsPromoting(false);
    }
  };

  const handleUpdateStatus = async (managerId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', managerId), { status: newStatus });
      toast({ title: "Status Atualizado", description: `O gerente agora está ${newStatus === 'active' ? 'ativo' : 'bloqueado'}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar status." });
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
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">Gestão de Gerentes e Performance de Rede.</p>
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
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase rounded-2xl px-6 shadow-[0_10px_20px_rgba(6,182,212,0.2)]"
          >
            <UserPlus size={18} className="mr-2" /> NOVO GERENTE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Gerentes', val: managers.length, icon: Users, color: 'text-cyan-400' },
          { label: 'Em Atividade', val: managers.filter(m => m.status === 'active').length, icon: Activity, color: 'text-emerald-400' },
          { label: 'Influenciadores', val: '0', icon: UserCircle, color: 'text-purple-400' },
          { label: 'Rede Total', val: '0', icon: TrendingUp, color: 'text-amber-400' }
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
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-cyan-500 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-white/10 font-black uppercase tracking-widest italic">Nenhum gerente encontrado</td>
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

      {/* NOVO GERENTE MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#0d111c] border-white/10 p-0 overflow-hidden max-w-xl">
          <DialogHeader className="p-8 bg-[#111622] border-b border-white/5">
            <DialogTitle className="text-2xl font-black text-white uppercase italic italic">Vincular Novo Gerente</DialogTitle>
            <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Promova um usuário da base para o corpo administrativo.</DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            {!foundUser ? (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">E-mail do Usuário</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchCode className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <Input 
                      placeholder="usuario@email.com" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="h-14 bg-black/40 border-white/5 pl-12 rounded-2xl font-bold"
                    />
                  </div>
                  <Button 
                    onClick={handleSearchUser}
                    disabled={isSearching}
                    className="h-14 bg-white/5 hover:bg-white/10 text-white font-black px-6 rounded-2xl"
                  >
                    {isSearching ? <Loader2 className="animate-spin" /> : "BUSCAR"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-3xl flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black font-black text-xl">
                    {foundUser.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-white uppercase">{foundUser.fullName}</h4>
                    <p className="text-xs text-white/40 font-medium">{foundUser.email}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setFoundUser(null)} className="text-rose-500 hover:bg-rose-500/10 font-black text-[10px] uppercase">Trocar</Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Percentual de Comissão (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                      <Input 
                        type="number"
                        value={newManagerData.commission}
                        onChange={e => setNewManagerData({...newManagerData, commission: parseInt(e.target.value)})}
                        className="h-14 bg-black/40 border-white/5 pl-12 rounded-2xl font-black text-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Permissões Iniciais</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { key: 'canViewGlobalRevenue', label: 'Ver Faturamento Global' },
                        { key: 'canChangeDifficulty', label: 'Alterar Dificuldade' },
                        { key: 'canModerateUsers', label: 'Moderar Usuários' },
                      ].map((p) => (
                        <div key={p.key} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                          <span className="text-xs font-bold text-white/70 uppercase">{p.label}</span>
                          <Switch 
                            checked={(newManagerData.permissions as any)[p.key]} 
                            onCheckedChange={v => setNewManagerData({
                              ...newManagerData, 
                              permissions: { ...newManagerData.permissions, [p.key]: v }
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePromoteToManager}
                  disabled={isPromoting}
                  className="w-full h-16 bg-cyan-500 hover:bg-cyan-600 text-black font-black text-lg uppercase rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  {isPromoting ? <Loader2 className="animate-spin" /> : <ShieldCheck className="mr-2" />}
                  CONFIRMAR PROMOÇÃO
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* GERENCIAR GERENTE (SHEET) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-[#0d111c] border-white/5 p-0 overflow-hidden flex flex-col">
          {selectedManager && (
            <>
              <SheetHeader className="p-8 bg-[#111622] border-b border-white/5 relative">
                <button onClick={() => setIsSheetOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl font-black text-cyan-400 shadow-2xl">
                    {selectedManager.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-2xl font-black text-white uppercase tracking-tight italic">
                        {selectedManager.fullName}
                      </SheetTitle>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">ID: {selectedManager.id}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase">Gerente Ativo</Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <TabsList className="bg-[#111622] border-b border-white/5 rounded-none h-14 px-8 justify-start gap-8">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Visão Geral</TabsTrigger>
                  <TabsTrigger value="commissions" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Comissões</TabsTrigger>
                  <TabsTrigger value="permissions" className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-full px-0 font-black text-[10px] uppercase tracking-widest">Permissões</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-8">
                  <TabsContent value="overview" className="m-0 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Volume da Rede</span>
                        <div className="text-2xl font-black text-white">R$ 0,00</div>
                        <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> +0% este mês</div>
                      </div>
                      <div className="bg-black/20 p-6 rounded-3xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Lucro Gerado</span>
                        <div className="text-2xl font-black text-emerald-400">R$ 0,00</div>
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
                      { key: 'canViewGlobalRevenue', label: 'Ver Faturamento Global', desc: 'Permite ver os números da banca inteira.' },
                      { key: 'canChangeDifficulty', label: 'Alterar Dificuldade do Jogo', desc: 'Acesso ao motor de retenção da arena.' },
                      { key: 'canModerateUsers', label: 'Moderar Usuários', desc: 'Capacidade de bloquear e analisar contas.' },
                      { key: 'canManageInfluencers', label: 'Gerenciar Influenciadores', desc: 'Vincular novos afiliados.' }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-white uppercase">{p.label}</span>
                          <span className="text-[9px] text-white/30 font-medium">{p.desc}</span>
                        </div>
                        <Switch checked={selectedManager.permissions?.[p.key] || false} />
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
                  {selectedManager.status === 'active' ? <Lock className="mr-2" size={18} /> : <CheckCircle2 className="mr-2" size={18} />}
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