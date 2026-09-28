
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
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
  const { toast } = useToast();
  
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!db) return;
    
    // Listener para o documento de configuração
    const unsub = onSnapshot(doc(db, 'settings', 'game'), (snap) => {
      if (snap.exists()) {
        setConfig(snap.data());
        setError(false);
      } else {
        // Se não existir, oferece para criar
        setConfig({ difficulty: 50, gridSize: 8, maxLinesPerMatch: 5, antiFraudEnabled: true, totalDeposited: 0 });
      }
    }, (err) => {
      console.error("Erro nas regras de configurações:", err);
      setError(true);
    });

    return () => unsub();
  }, [db]);

  const handleSave = async () => {
    if (!db || !config) return;
    setSaving(true);
    try {
      // Usa setDoc com merge para garantir que o documento exista
      await setDoc(doc(db, 'settings', 'game'), config, { merge: true });
      toast({ title: "Configurações Master Salvas", description: "O motor do jogo foi atualizado com sucesso." });
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Erro de Permissão", 
        description: "Você precisa ser Admin para salvar estas alterações." 
      });
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-10 text-center space-y-4">
        <AlertCircle className="text-rose-500" size={48} />
        <h2 className="text-xl font-black text-white uppercase">Erro de Acesso ao Banco</h2>
        <p className="text-white/40 text-sm max-w-md">O Firebase negou a leitura das configurações. Verifique se você é Admin e se as Regras de Segurança foram publicadas.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-black uppercase text-[10px]">Tentar Novamente</Button>
      </div>
    );
  }

  if (!config) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-cyan-500" /></div>;

  return (
    <div className="p-8 md:p-10 space-y-10" id="admin-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Arquitetura da Arena</h2>
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-1">Parâmetros técnicos e regras de lucratividade do motor de jogo.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="h-12 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase px-8 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={18} />}
          SALVAR ALTERAÇÕES
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controle de Dificuldade */}
        <Card className="bg-[#111622] border-white/5 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-4 text-cyan-400">
            <Zap size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Motor de Dificuldade</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nível de Retenção</span>
                <span className="text-xs text-white/60 font-bold">Define a raridade de peças favoráveis.</span>
              </div>
              <span className="text-4xl font-black text-white">{config.difficulty}%</span>
            </div>
            
            <Slider 
              value={[config.difficulty]} 
              onValueChange={v => setConfig({...config, difficulty: v[0]})}
              max={100}
              step={1}
              className="py-4"
            />

            <div className="grid grid-cols-3 gap-2">
              {[0, 50, 100].map(v => (
                <button 
                  key={v}
                  onClick={() => setConfig({...config, difficulty: v})}
                  className={cn(
                    "py-2 rounded-xl text-[9px] font-black uppercase border transition-all",
                    config.difficulty === v ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-black/20 border-white/5 text-white/30"
                  )}
                >
                  {v === 0 ? 'Fácil (Loss)' : v === 50 ? 'Equilibrado' : 'Máximo (Win)'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Parâmetros do Grid */}
        <Card className="bg-[#111622] border-white/5 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-4 text-purple-400">
            <Grid3X3 size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Dimensões & Regras</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Tamanho do Tabuleiro</label>
              <Input 
                type="number" 
                value={config.gridSize} 
                onChange={e => setConfig({...config, gridSize: parseInt(e.target.value)})}
                className="h-12 bg-black/40 border-white/5 rounded-2xl font-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Meta de Linhas (Geral)</label>
              <Input 
                type="number" 
                value={config.maxLinesPerMatch} 
                onChange={e => setConfig({...config, maxLinesPerMatch: parseInt(e.target.value)})}
                className="h-12 bg-black/40 border-white/5 rounded-2xl font-black"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-white uppercase tracking-tight">Filtro Antifraude Master</span>
              <span className="text-[10px] text-white/30 font-bold">Bloqueia movimentos impossíveis automaticamente.</span>
            </div>
            <Switch 
              checked={config.antiFraudEnabled} 
              onCheckedChange={v => setConfig({...config, antiFraudEnabled: v})} 
            />
          </div>
        </Card>
      </div>

      <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="text-rose-500 shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-sm font-black text-rose-500 uppercase tracking-tight">Zona de Perigo</h4>
          <p className="text-[11px] text-white/40 font-medium leading-relaxed mt-1">
            Alterações nestes parâmetros afetam imediatamente todas as partidas em curso. O uso de dificuldades acima de 80% pode causar evasão de jogadores. Recomenda-se manter o preset equilibrado para maior tempo de vida útil (LTV).
          </p>
        </div>
      </div>
    </div>
  );
}
