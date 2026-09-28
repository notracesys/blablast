
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  Zap, 
  Grid3X3, 
  Save, 
  Loader2,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SettingsAdmin() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !user) return;
    
    // Listener para o documento de configuração
    const settingsRef = doc(db, 'settings', 'game');
    
    const unsub = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setConfig(snap.data());
        setError(null);
      } else {
        // Se não existir, carrega valores padrão para o formulário
        setConfig({ 
          difficulty: 50, 
          gridSize: 8, 
          maxLinesPerMatch: 5, 
          antiFraudEnabled: true, 
          totalDeposited: 0 
        });
        setError(null);
      }
    }, (err) => {
      console.error("Erro ao ler configurações:", err);
      setError("O Firebase negou o acesso. Verifique se seu UID está como isAdmin: true (tipo Boolean) no banco.");
    });

    return () => unsub();
  }, [db, user]);

  const handleSave = async () => {
    if (!db || !config) return;
    setSaving(true);
    try {
      // Salva ou cria o documento
      await setDoc(doc(db, 'settings', 'game'), {
        ...config,
        lastUpdatedBy: user?.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast({ 
        title: "Sucesso!", 
        description: "Configurações do motor de jogo atualizadas." 
      });
      setError(null);
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Erro de Escrita", 
        description: "Você não tem permissão para alterar as configurações." 
      });
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase">Acesso Negado pelo Banco</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">{error}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-xl text-left font-mono text-[10px] text-white/60 border border-white/5">
          UID Atual: {user?.uid}
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-black uppercase text-[10px]">Tentar Novamente</Button>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={32} />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Conectando ao Motor...</span>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-10" id="admin-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Arquitetura do Jogo</h2>
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">Controle de retenção, dificuldade e regras técnicas globais.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="h-14 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase px-10 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={20} />}
          SALVAR CONFIGURAÇÕES
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Controle de Dificuldade */}
        <Card className="bg-[#111622] border-white/5 p-10 rounded-[3rem] space-y-10 shadow-2xl">
          <div className="flex items-center gap-4 text-cyan-400">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Motor de Retenção</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase">Algoritmo de Geração de Peças</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nível de Dificuldade Atual</span>
                <span className="text-xs text-white/60 font-bold max-w-xs">Define a probabilidade do sistema enviar peças que "travam" o tabuleiro.</span>
              </div>
              <span className="text-6xl font-black text-white tabular-nums">{config.difficulty}%</span>
            </div>
            
            <Slider 
              value={[config.difficulty]} 
              onValueChange={v => setConfig({...config, difficulty: v[0]})}
              max={100}
              step={1}
              className="py-6"
            />

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Fácil (Modo Loss)', val: 0, color: 'hover:bg-emerald-500/20' },
                { label: 'Equilibrado', val: 50, color: 'hover:bg-cyan-500/20' },
                { label: 'Máximo (Modo Dreno)', val: 100, color: 'hover:bg-rose-500/20' }
              ].map(item => (
                <button 
                  key={item.val}
                  onClick={() => setConfig({...config, difficulty: item.val})}
                  className={cn(
                    "py-4 rounded-2xl text-[10px] font-black uppercase border transition-all",
                    config.difficulty === item.val 
                      ? "bg-white text-black border-white shadow-lg" 
                      : "bg-black/20 border-white/5 text-white/40 " + item.color
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Parâmetros Técnicos */}
        <Card className="bg-[#111622] border-white/5 p-10 rounded-[3rem] space-y-10 shadow-2xl">
          <div className="flex items-center gap-4 text-purple-400">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Grid3X3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Grid & Gameplay</h3>
              <p className="text-[10px] text-white/30 font-bold uppercase">Limites técnicos da Arena</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Tamanho do Tabuleiro</label>
              <Input 
                type="number" 
                value={config.gridSize} 
                onChange={e => setConfig({...config, gridSize: parseInt(e.target.value)})}
                className="h-14 bg-black/40 border-white/5 rounded-2xl font-black text-lg focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Meta de Linhas (Geral)</label>
              <Input 
                type="number" 
                value={config.maxLinesPerMatch} 
                onChange={e => setConfig({...config, maxLinesPerMatch: parseInt(e.target.value)})}
                className="h-14 bg-black/40 border-white/5 rounded-2xl font-black text-lg focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-between bg-black/40 p-6 rounded-3xl border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-white uppercase tracking-tight">Filtro Antifraude Realtime</span>
                <span className="text-[10px] text-white/30 font-bold">Monitora a velocidade de encaixe das peças.</span>
              </div>
              <Switch 
                checked={config.antiFraudEnabled} 
                onCheckedChange={v => setConfig({...config, antiFraudEnabled: v})} 
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] flex items-start gap-6">
        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-base font-black text-rose-500 uppercase tracking-tight">Zona de Impacto Financeiro</h4>
          <p className="text-xs text-white/40 font-medium leading-relaxed mt-2 max-w-3xl">
            Alterações nestes parâmetros são aplicadas em tempo real para todos os jogadores na Arena. O aumento da dificuldade para níveis acima de 70% reduzirá drasticamente o faturamento dos prêmios, mas pode impactar a retenção de longo prazo (LTV). Monitore o lucro da banca no Dashboard após realizar mudanças.
          </p>
        </div>
      </div>
    </div>
  );
}
