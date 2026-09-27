'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { LogOut, Wallet, Plus, Coins, Play, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PainelPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [userData, setUserData] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<number>(10);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>('20');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const presets = [5, 10, 20, 30, 50, 100];

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/register');
      return;
    }

    if (!db) return;

    // Listener em tempo real para o saldo do usuário
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }, (error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

    return () => unsubscribe();
  }, [user, authLoading, db, router]);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut().then(() => router.push('/'));
    }
  };

  const handleAddBalance = () => {
    if (!user || !db || !userData) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Digite um valor maior que zero para depositar.",
      });
      return;
    }

    setIsDepositing(true);

    const userRef = doc(db, 'users', user.uid);
    const newBalance = (userData.balance || 0) + amount;

    // Atualiza no Firestore sem travar o fluxo local
    updateDoc(userRef, { balance: newBalance })
      .then(() => {
        toast({
          title: "Depósito Concluído!",
          description: `R$ ${amount.toFixed(2)} adicionados com sucesso via PIX simulado.`,
        });
        setShowDepositModal(false);
        setIsDepositing(false);
      })
      .catch((error) => {
        setIsDepositing(false);
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { balance: newBalance },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleStartGame = () => {
    if (!userData) return;
    if ((userData.balance || 0) < selectedValue) {
      toast({
        variant: "destructive",
        title: "Saldo Insuficiente",
        description: "Adicione saldo via PIX para conseguir entrar com este valor.",
      });
      setShowDepositModal(true);
      return;
    }

    // Deduz taxa de entrada
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, { balance: userData.balance - selectedValue }).catch(() => {});
    }

    router.push('/game');
  };

  if (authLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#060a17] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-white/50 uppercase tracking-widest">Carregando painel real...</p>
      </div>
    );
  }

  const minReward = selectedValue * 5;

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col p-4 relative overflow-hidden pb-10">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

      {/* TOPBAR PREMIUM */}
      <header className="w-full flex items-center justify-between h-14 border-b border-white/5 bg-[#0b1426]/60 backdrop-blur-md rounded-2xl px-4 mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black shadow-lg">
            {userData.fullName ? userData.fullName.substring(0,2).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/90 leading-none">{userData.fullName?.split(' ')[0]}</span>
            <span className="text-[8px] font-bold text-emerald-400 mt-0.5">Conta Ativa</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BANCO / SALDO */}
          <div className="bg-[#060a17] border border-white/5 rounded-xl px-3 py-1 flex items-center gap-2 h-9 shadow-inner">
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-bold text-white/40 uppercase leading-none">SALDO DISPONÍVEL</span>
              <span className="text-xs font-black text-emerald-400 mt-0.5">R$ {(userData.balance || 0).toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setShowDepositModal(true)}
              className="w-5 h-5 rounded-md bg-cyan-400 hover:bg-cyan-500 transition-colors flex items-center justify-center ml-1 text-slate-950 shadow-md"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <button onClick={handleSignOut} className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-xl border border-white/5 bg-white/5">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PAINEL CENTRAL DE ENTRADA DO JOGO */}
      <main className="w-full max-w-[420px] mx-auto z-10 flex flex-col items-center">
        
        <div className="w-full bg-[#0b1426] border border-white/10 rounded-[2.5rem] p-5 shadow-2xl relative overflow-hidden flex flex-col gap-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>

          {/* ARTWORK CARD COMPACTO */}
          <div className="relative w-full aspect-[1/0.95] bg-[#060a17] rounded-3xl border border-white/5 overflow-hidden shadow-inner group">
            <Image 
              src="/hero.webp" 
              alt="Encaixe os Blocos e Ganhe" 
              fill 
              className="object-cover"
              priority
              data-ai-hint="game puzzle screens"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot"></span>
              <span className="text-[9px] font-bold tracking-wider text-white/80 uppercase">883 ONLINE</span>
            </div>
          </div>

          {/* SELETOR DE VALOR DE ENTRADA */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-white/40 tracking-widest block pl-1">
              VALOR DE ENTRADA
            </label>
            
            {/* GRID DE PRESETS */}
            <div className="grid grid-cols-3 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelectedValue(val)}
                  className={`h-11 rounded-xl font-black text-xs transition-all uppercase tracking-wider border ${
                    selectedValue === val 
                      ? 'bg-gradient-to-r from-white to-cyan-100 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(38,217,255,0.25)] scale-[1.02]' 
                      : 'bg-[#060a17]/80 hover:bg-[#060a17] text-white/80 border-white/5'
                  }`}
                >
                  R${val}
                </button>
              ))}
            </div>

            {/* CONTROL INPUT MOCK EXPUESTO */}
            <div className="w-full h-12 bg-[#060a17] border border-white/5 rounded-xl px-4 flex items-center justify-between text-sm shadow-inner mt-2">
              <span className="text-white/30 font-bold uppercase text-[10px] tracking-wider">Valor selecionado:</span>
              <span className="font-black text-cyan-400 text-sm">R$ {selectedValue}</span>
            </div>
          </div>

          {/* BOX DE PREVISÃO DE RECOMPENSA */}
          <div className="w-full bg-[#060a17]/90 rounded-2xl border border-cyan-500/20 p-4 text-center space-y-1 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block">Recompensa mínima</span>
            <strong className="text-2xl font-[1000] text-amber-400 drop-shadow-[0_2px_10px_rgba(247,181,0,0.3)]">
              R$ {minReward.toFixed(2).replace('.', ',')}
            </strong>
          </div>

          {/* BOTÃO JOGAR PRINCIPAL */}
          <button
            onClick={handleStartGame}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] hover:opacity-95 text-slate-950 font-[1000] text-base shadow-[0_0_25px_rgba(53,245,154,0.35)] transition-all active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-300/20"
          >
            <Play className="w-4 h-4 fill-current text-slate-950" />
            Jogar Partida
          </button>
        </div>
      </main>

      {/* MODAL DE DEPÓSITO SIMULADO PIX */}
      <div className={`fixed inset-0 ${showDepositModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/95 backdrop-blur-md z-[5000]`}>
        <div className="w-full max-w-xs p-6 border border-white/10 rounded-3xl bg-[#0b1426] shadow-2xl relative">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
            <Coins className="w-5 h-5 text-cyan-400" />
          </div>
          
          <h2 className="text-base font-black text-white uppercase tracking-wide text-center mb-1">Adicionar Saldo Instantâneo</h2>
          <p className="text-white/50 text-[11px] text-center mb-4 leading-relaxed">
            Simule um depósito via PIX para testar o jogo com entradas maiores na arena real.
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              {['20', '50', '100'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDepositAmount(val)}
                  className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${
                    depositAmount === val 
                      ? 'bg-cyan-400 text-slate-950 font-black' 
                      : 'bg-[#060a17] text-white/60 border border-white/5'
                  }`}
                >
                  + R${val}
                </button>
              ))}
            </div>

            <Input 
              type="number"
              placeholder="Outro valor (R$)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="h-12 bg-[#060a17] border-white/5 rounded-xl px-4 text-center text-sm font-bold text-white focus:border-cyan-400/50"
            />
          </div>

          <button
            onClick={handleAddBalance}
            disabled={isDepositing}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
          >
            {isDepositing ? 'Processando PIX...' : 'CONFIRMAR DEPÓSITO PIX'}
          </button>

          <button
            onClick={() => setShowDepositModal(false)}
            className="w-full h-9 rounded-xl text-[10px] uppercase font-bold text-white/40 tracking-wider hover:text-white/60 mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
