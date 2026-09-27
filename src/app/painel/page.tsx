'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Wallet, Users, User, Gamepad2, ArrowUpRight, X, Ticket, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import Image from 'next/image';

export default function PainelPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [userData, setUserData] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<number>(10);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>('20');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [onlinePlayers, setOnlinePlayers] = useState<number>(803);

  const presets = [5, 10, 20, 30, 50, 100];

  const depositPresets = [
    { val: 20, tag: 'MÍNIMO', color: 'bg-[#00f19a] text-slate-950' },
    { val: 30, tag: 'BOM', color: 'bg-amber-500 text-slate-950' },
    { val: 40, tag: 'ÓTIMO', color: 'bg-orange-500 text-white' },
    { val: 50, tag: 'EXCELENTE', color: 'bg-rose-500 text-white' },
    { val: 100, tag: 'SUPER', color: 'bg-purple-500 text-white' },
    { val: 200, tag: 'MÁXIMO', color: 'bg-fuchsia-500 text-white' },
  ];

  useEffect(() => {
    setOnlinePlayers(Math.floor(Math.random() * (1500 - 500 + 1)) + 500);

    const interval = setInterval(() => {
      setOnlinePlayers((current) => {
        const change = Math.floor(Math.random() * 61) - 30;
        let nextValue = current + change;
        if (nextValue < 500) nextValue = 500 + Math.floor(Math.random() * 20);
        if (nextValue > 1500) nextValue = 1500 - Math.floor(Math.random() * 20);
        return nextValue;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    return () => unsubscribe();
  }, [user, authLoading, db, router]);

  const handleAddBalance = () => {
    if (!user || !db || !userData) return;
    
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount < 20) {
      toast({
        variant: "destructive",
        title: "Valor insuficiente",
        description: "O valor mínimo para depósito é de R$ 20,00.",
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
          description: `R$ ${amount.toFixed(2)} creditados com sucesso.`,
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
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleStartGame = () => {
    if (!userData || !user || !db) return;
    if ((userData.balance || 0) < selectedValue) {
      setShowInsufficientBalanceModal(true);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const newBalance = userData.balance - selectedValue;

    updateDoc(userRef, { balance: newBalance })
      .then(() => {
        router.push('/game');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { balance: newBalance },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (authLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/40">Carregando...</p>
      </div>
    );
  }

  const minReward = selectedValue * 5;

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white flex flex-col justify-between relative overflow-hidden pb-24">
      <div className="w-full flex flex-col p-4 flex-1">
        <header className="w-full flex items-center justify-between h-14 px-1 mb-4 z-10 shrink-0">
          <div className="flex items-center">
            <Image 
              src="/blockcash.png" 
              alt="Block Cash Logo" 
              width={75} 
              height={30} 
              className="object-contain filter drop-shadow-[0_2px_8px_rgba(38,217,255,0.3)]"
              priority
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">SALDO</span>
              <span className="text-sm font-black text-[#35f59a]">R$ {(userData.balance || 0).toFixed(2).replace('.', ',')}</span>
            </div>
            
            <button 
              onClick={() => setShowDepositModal(true)}
              className="relative w-8 h-8 rounded-full bg-[#7b61ff] flex items-center justify-center font-black text-xs text-white border border-white/10"
            >
              {userData.fullName?.substring(0,1).toUpperCase() || 'U'}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#35f59a] flex items-center justify-center text-slate-950 font-extrabold text-[10px]">
                +
              </div>
            </button>
          </div>
        </header>

        <main className="w-full max-w-[400px] mx-auto z-10 flex-1 flex flex-col justify-center">
          <div className="w-full bg-[#0d111c]/90 border border-white/5 rounded-[2rem] p-4 shadow-2xl space-y-4">
            <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/10">
              <Image 
                src="/hero.webp" 
                alt="Encaixe os blocks e ganhe" 
                fill 
                className="object-cover" 
                priority 
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#35f59a] rounded-full pulse-dot"></span>
                <span className="text-[9px] font-black text-white/90 uppercase tracking-wider">{onlinePlayers} online</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest pl-0.5">VALOR DE ENTRADA</label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedValue(val)}
                    className={`h-10 rounded-xl font-black text-xs transition-all border ${
                      selectedValue === val 
                        ? 'bg-[#e2f5ff] text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(38,217,255,0.25)]' 
                        : 'bg-[#131926] text-white/70 border-white/5'
                    }`}
                  >
                    R${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-[#131926] rounded-xl border border-white/5 h-12 flex items-center px-4">
              <span className="text-white/40 text-xs font-bold mr-2">R$</span>
              <Input 
                type="number" 
                value={selectedValue} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setSelectedValue(val);
                }} 
                className="bg-transparent border-0 h-full p-0 text-white font-black text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="w-full bg-[#131926]/40 rounded-xl border border-white/5 py-3 text-center">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest block mb-0.5">Recompensa mínima</span>
              <strong className="text-lg font-black text-[#ffbd1c]">R$ {minReward.toFixed(2).replace('.', ',')}</strong>
            </div>

            <button 
              onClick={handleStartGame} 
              className="w-full h-12 rounded-2xl bg-[#35f59a] text-slate-950 font-black text-sm shadow-[0_4px_15px_rgba(53,245,154,0.3)] uppercase tracking-wide transition-all active:scale-[0.98]"
            >
              Jogar
            </button>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 max-w-[480px] w-full mx-auto left-0 right-0 z-40 bg-[#0c0f17] border-t border-white/5 h-20 px-2 flex items-center justify-around shadow-xl">
        <button onClick={() => setShowDepositModal(true)} className="flex flex-col items-center justify-center flex-1 gap-1 text-white/40 hover:text-white transition-colors">
          <Wallet className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Depositar</span>
        </button>

        <button onClick={() => router.push('/game')} className="flex flex-col items-center justify-center flex-1 gap-1 text-white/40 hover:text-white transition-colors">
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Sacar</span>
        </button>

        <div className="flex flex-col items-center justify-center flex-1 -translate-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#35f59a] to-[#26d9ff] flex items-center justify-center shadow-[0_0_15px_rgba(38,217,255,0.45)]">
            <Gamepad2 className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-[9px] font-black text-[#35f59a] uppercase tracking-wider mt-1.5">Jogar</span>
        </div>

        <button onClick={() => router.push('/')} className="flex flex-col items-center justify-center flex-1 gap-1 text-white/40 hover:text-white transition-colors">
          <Users className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Indicar</span>
        </button>

        <button onClick={() => {
          if(auth) {
            auth.signOut().then(() => router.push('/'));
          }
        }} className="flex flex-col items-center justify-center flex-1 gap-1 text-white/40 hover:text-white transition-colors">
          <User className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Perfil</span>
        </button>
      </nav>

      {/* MODAL DE SALDO INSUFICIENTE */}
      <div className={`fixed inset-0 ${showInsufficientBalanceModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/95 backdrop-blur-md z-[6000]`}>
        <div className="w-full max-w-[340px] border border-white/5 rounded-[2rem] bg-[#111622] p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-wide text-white">Saldo Insuficiente</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Você precisa de saldo para entrar nesta partida.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-2 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-bold uppercase">Seu Saldo:</span>
              <span className="text-rose-400 font-black">R$ {(userData.balance || 0).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40 font-bold uppercase">Custo de Entrada:</span>
              <span className="text-cyan-400 font-black">R$ {selectedValue.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={() => {
                setShowInsufficientBalanceModal(false);
                setShowDepositModal(true);
              }}
              className="w-full h-11 rounded-xl bg-[#35f59a] text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(53,245,154,0.2)]"
            >
              Fazer Depósito
            </button>
            <button 
              onClick={() => setShowInsufficientBalanceModal(false)}
              className="w-full h-11 rounded-xl bg-[#182030] text-white/60 font-black text-xs uppercase tracking-wider border border-white/5"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE DEPÓSITO CUSTOMIZADO */}
      <div className={`fixed inset-0 ${showDepositModal ? 'flex' : 'hidden'} items-center justify-center p-4 bg-black/90 backdrop-blur-md z-[5000]`}>
        <div className="w-full max-w-[380px] border border-white/5 rounded-[2.5rem] bg-[#111622] shadow-2xl overflow-hidden flex flex-col relative">
          
          <div className="relative w-full aspect-[2.7/1] bg-slate-950/20">
            <Image 
              src="/card1.webp" 
              alt="Banner de Depósito" 
              fill 
              className="object-cover"
              priority
            />
            <button 
              onClick={() => setShowDepositModal(false)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#e73b29] flex items-center justify-center text-white shadow-md z-30 transition-transform active:scale-90"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          <div className="p-5 flex flex-col space-y-4">
            <div>
              <label className="text-[11px] font-black uppercase text-white/40 tracking-wider block mb-3">
                VALOR RÁPIDO (MÍNIMO R$ 20)
              </label>

              <div className="grid grid-cols-3 gap-x-2 gap-y-5 pt-2">
                {depositPresets.map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDepositAmount(String(item.val))}
                    className={`h-12 rounded-xl font-black text-sm relative transition-all border ${
                      depositAmount === String(item.val)
                        ? 'bg-[#182030] text-white border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-[#182030] text-white border-transparent'
                    }`}
                  >
                    <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wide leading-none ${item.color}`}>
                      {item.tag}
                    </span>
                    R${item.val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest pl-1">
                DIGITE O VALOR (MÍNIMO R$ 20,00)
              </label>
              <div className="relative bg-[#182030] rounded-xl border border-white/5 h-12 flex items-center px-4">
                <span className="text-white/40 text-xs font-bold mr-2">R$</span>
                <Input 
                  type="number" 
                  min="20"
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)} 
                  className="bg-transparent border-0 h-full p-0 text-white font-black text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <button 
              type="button" 
              className="flex items-center gap-1.5 text-[#ff4b72] text-[11px] font-bold uppercase tracking-wider self-start pl-1 py-1 hover:opacity-80"
            >
              <Ticket className="w-3.5 h-3.5 fill-current" />
              Tenho um cupom
            </button>

            <button 
              onClick={handleAddBalance} 
              disabled={isDepositing}
              className="w-full h-12 rounded-2xl bg-[#00e26f] text-slate-950 font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(0,226,111,0.25)] flex items-center justify-center"
            >
              {isDepositing ? 'PROCESSANDO...' : 'Gerar QR Code PIX'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
