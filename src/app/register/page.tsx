
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro nas senhas",
        description: "As senhas não coincidem.",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userData = {
        fullName,
        phone,
        email,
        balance: 0,
        createdAt: serverTimestamp(),
      };

      setDoc(userRef, userData).catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push('/game');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

      <main className="w-full max-w-[400px] z-10 flex flex-col items-center">
        <div className="mb-8 relative animate-float">
          <Image 
            src="/blockcash.png" 
            alt="Block Cash Logo" 
            width={120} 
            height={120} 
            className="object-contain filter drop-shadow-[0_0_15px_rgba(123,97,255,0.4)]"
            priority
          />
        </div>

        <div className="w-full bg-[#0b1426] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="mb-8">
            <h1 className="text-2xl font-[900] text-white tracking-tight leading-none mb-2">
              Crie sua conta grátis
            </h1>
            <p className="text-white/50 text-xs font-medium leading-relaxed">
              Cadastre-se para montar, explodir linhas e ganhar dinheiro real.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Input 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome completo" 
                className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail" 
                className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Input 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone (DDD)" 
                className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  required
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  required
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#7b61ff] to-[#5a42d8] hover:opacity-95 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(123,97,255,0.3)] mt-4 animate-shine border border-purple-400/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CRIAR CONTA'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-[11px] font-bold">
              Já tem uma conta? <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Entrar</Link>
            </p>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 w-full flex justify-center gap-1 opacity-60">
        <div className="w-20 h-24 bg-purple-700/40 rounded-t-lg blur-[2px] translate-y-8"></div>
        <div className="w-20 h-32 bg-blue-700/40 rounded-t-lg blur-[2px] translate-y-4"></div>
        <div className="w-20 h-40 bg-cyan-700/40 rounded-t-lg blur-[2px]"></div>
        <div className="w-20 h-28 bg-emerald-700/40 rounded-t-lg blur-[2px] translate-y-12"></div>
      </div>
    </div>
  );
}
