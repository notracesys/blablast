'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

    // 1) Validação do Nome Completo (Pelo menos Nome + Sobrenome)
    const nameTrimmed = fullName.trim();
    const nameParts = nameTrimmed.split(/\s+/);
    if (nameParts.length < 2 || nameParts[0].length < 2 || nameParts[1].length < 2) {
      toast({
        variant: "destructive",
        title: "Nome incompleto",
        description: "Por favor, digite seu nome e pelo menos um sobrenome.",
      });
      return;
    }

    // 2) Validação de Email com domínio completo (ex: @gmail.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Insira um e-mail válido com um domínio (ex: @gmail.com).",
      });
      return;
    }

    // 3) Validação do Telefone (DDD + Número: 10 ou 11 dígitos)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      toast({
        variant: "destructive",
        title: "Telefone incorreto",
        description: "Informe o DDD e o número completo (ex: 11999998888).",
      });
      return;
    }

    // 4) Validação da Senha (+6 caracteres)
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve conter no mínimo 6 caracteres.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas diferentes",
        description: "A confirmação da senha não coincide.",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userData = {
        fullName: nameTrimmed,
        phone: cleanPhone,
        email: email.toLowerCase(),
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      // Firestore mutation without await
      setDoc(userRef, userData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      
      router.push('/painel');
    } catch (error: any) {
      let msg = "Erro ao criar conta.";
      if (error.code === 'auth/email-already-in-use') msg = "Este e-mail já está cadastrado.";
      if (error.code === 'auth/invalid-email') msg = "Formato de e-mail inválido.";
      
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: msg,
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
        <div className="mb-6 relative animate-float">
          <Image 
            src="/blockcash.png" 
            alt="Block Cash Logo" 
            width={110} 
            height={40} 
            className="object-contain filter drop-shadow-[0_0_15px_rgba(123,97,255,0.4)]"
            priority
          />
        </div>

        <div className="w-full bg-[#0b1426] border border-white/5 rounded-[2rem] p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="mb-6">
            <h1 className="text-xl font-[900] text-white tracking-tight leading-none mb-2 uppercase">
              Crie sua conta
            </h1>
            <p className="text-white/50 text-[11px] font-medium leading-relaxed">
              Use dados reais para garantir seus futuros resgates via PIX.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <Input 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome e Sobrenome" 
              className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
            />

            <Input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail (ex: joao@gmail.com)" 
              className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
            />

            <Input 
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="DDD + Número (ex: 11999998888)" 
              className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
            />

            <div className="relative">
              <Input 
                required
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (mín. 6 dígitos)" 
                className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input 
                required
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Senha" 
                className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#7b61ff] to-[#5a42d8] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(123,97,255,0.3)] mt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'FINALIZAR CADASTRO'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-[11px] font-bold">
              Já tem conta? <Link href="/" className="text-cyan-400 font-black">ENTRAR</Link>
            </p>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 w-full flex justify-center gap-1 opacity-20 pointer-events-none">
        <div className="w-16 h-20 bg-purple-700/40 rounded-t-lg blur-[2px] translate-y-8"></div>
        <div className="w-16 h-24 bg-blue-700/40 rounded-t-lg blur-[2px] translate-y-4"></div>
        <div className="w-16 h-28 bg-cyan-700/40 rounded-t-lg blur-[2px]"></div>
        <div className="w-16 h-24 bg-emerald-700/40 rounded-t-lg blur-[2px] translate-y-12"></div>
      </div>
    </div>
  );
}
