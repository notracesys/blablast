'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { LogOut, Wallet, Plus, Coins, Play } from 'lucide-react';
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

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }, (error) => {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
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
        description: "Digite um valor para depositar.",
      });
      return;
    }

    setIsDepositing(true);
    const userRef = doc(db, 'users', user.uid);
    const newBalance = (userData.balance || 0) + amount;

    updateDoc(userRef, { balance: newBalance })
      .then(() => {
        toast({
          title: "Saldo Adicionado!",
          description: `R$ ${amount.toFixed(2)} creditados com sucesso via PIX Simulado.`,
        });
        setShowDepositModal(false);
        setIsDepositing(false);
      })
      .catch(async (error) => {
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
    if (!userData || !user || !db) return;
    if ((userData.balance || 0) < selectedValue) {
      toast({
        variant: "destructive",
        title: "Saldo insuficiente",
        description: "Adicione saldo para entrar nesta partida.",
      });
      setShowDepositModal(true);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const newBalance = userData.balance - selectedValue;

    updateDoc(userRef, { balance: newBalance })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { balance: newBalance },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    router.push('/game');
  };

  if (authLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#060a17] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/40">Carregando painel...</p>
      </div>
    );
  }

  const minReward = selectedValue * 2;

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col p-4 relative overflow-hidden pb-10">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

      <header className="w-full flex items-center justify-between h-14 border-b border-white/5 bg-[#0b1426]/60 backdrop-blur-md rounded-2xl px-4 mb-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-black">
            {userData.fullName?.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider leading-none">{userData.fullName?.split(' ')[0]}</span>
            <span className="text-[8px] font-bold text-emerald-400 mt-0.5">Arena Ativa</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#060a17] border border-white/5 rounded-xl px-2.5 py-1 flex items-center gap-2 shadow-inner">
            <Wallet className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-black text-emerald-400">R$ {(userData.balance || 0).toFixed(2)}</span>
            <button 
              onClick={() => setShowDepositModal(true)}
              className="w-5 h-5 rounded-md bg-cyan-400 flex items-center justify-center text-slate-950 ml-1"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <button onClick={handleSignOut} className="p-2 text-white/40 hover:text-red-400 rounded-xl border border-white/5">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-[420px] mx-auto z-10">
        <div className="w-full bg-[#0b1426] border border-white/10 rounded-[2.5rem] p-5 shadow-2xl flex flex-col gap-6">
          <div className="relative w-full aspect-[1/0.9] bg-[#060a17] rounded-3xl border border-white/5 overflow-hidden">
            <Image 
              src="/hero.webp" 
              alt="Jogo Block Cash" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot"></span>
              <span className="text-[9px] font-black text-white/80 uppercase">883 JOGANDO AGORA</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest pl-1">VALOR DE ENTRADA</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setSelectedValue(val)}
                  className={`h-11 rounded-xl font-black text-xs transition-all border ${
                    selectedValue === val 
                      ? 'bg-white text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(38,217,255,0.2)]' 
                      : 'bg-[#060a17] text-white/60 border-white/5'
                  }`}
                >
                  R$ {val}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full bg-[#060a17] rounded-2xl border border-cyan-500/20 p-4 text-center">
            <span className="text-[9px] text-white/30 uppercase font-black tracking-widest block mb-1">Potencial de Ganho</span>
            <strong className="text-2xl font-[1000] text-amber-400">
              R$ {minReward.toFixed(2).replace('.', ',')}
            </strong>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] text-slate-950 font-[1000] text-base shadow-[0_0_20px_rgba(53,245,154,0.3)] uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            JOGAR AGORA
          </button>
        </div>
      </main>

      <div className={`fixed inset-0 ${showDepositModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/95 backdrop-blur-md z-[5000]`}>
        <div className="w-full max-w-xs p-6 border border-white/10 rounded-3xl bg-[#0b1426] shadow-2xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
            <Coins className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-base font-black text-white uppercase text-center mb-1">Simular Depósito PIX</h2>
          <p className="text-white/50 text-[10px] text-center mb-4">Adicione saldo fictício para testar a arena real.</p>

          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              {['20', '50', '100'].map((val) => (
                <button
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className={`flex-1 h-9 rounded-xl text-[10px] font-black transition-all ${
                    depositAmount === val ? 'bg-cyan-400 text-slate-950' : 'bg-[#060a17] text-white/60 border border-white/5'
                  }`}
                >
                  + R${val}
                </button>
              ))}
            </div>
            <Input 
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="h-12 bg-[#060a17] border-white/5 rounded-xl text-center text-sm font-bold text-white"
            />
          </div>

          <button
            onClick={handleAddBalance}
            disabled={isDepositing}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] text-slate-950 font-black text-xs uppercase tracking-wider"
          >
            {isDepositing ? 'PROCESSANDO...' : 'CONFIRMAR DEPÓSITO'}
          </button>

          <button
            onClick={() => setShowDepositModal(false)}
            className="w-full h-9 rounded-xl text-[10px] uppercase font-bold text-white/30 mt-2"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
}
