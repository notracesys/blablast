
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

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;
    const clean = targetValue.replace(/\D/g, '');
    
    let formatted = clean;
    if (clean.length > 0) {
      if (clean.length <= 2) {
        formatted = `(${clean}`;
      } else if (clean.length <= 6) {
        formatted = `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
      } else if (clean.length <= 10) {
        formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
      } else {
        formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
      }
    }
    setPhone(formatted);
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
      setErrors(prev => ({ ...prev, general: 'Erro de conexão: Serviços do Firebase não inicializados.' }));
      return;
    }

    const currentErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      general: ''
    };
    
    let hasError = false;

    const nameTrimmed = fullName.trim();
    const nameParts = nameTrimmed.split(/\s+/);
    if (nameParts.length < 2 || nameParts[0].length < 2 || nameParts[1].length < 2) {
      currentErrors.fullName = 'Por favor, insira o nome completo com pelo menos um sobrenome.';
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      currentErrors.email = 'Insira um e-mail válido contendo o domínio completo (ex: @gmail.com).';
      hasError = true;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      currentErrors.phone = 'Informe o DDD (2 dígitos) mais o número do telefone completo.';
      hasError = true;
    }

    if (password.length < 6) {
      currentErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
      hasError = true;
    }

    if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'A confirmação da senha não coincide com a senha digitada.';
      hasError = true;
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setErrors(currentErrors);

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

      setDoc(userRef, userData)
        .then(() => {
          router.push('/painel');
        })
        .catch(async (error: any) => {
          setLoading(false);
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
          setErrors(prev => ({ ...prev, general: 'Erro de permissão no Firestore. Verifique as Regras (Rules) no console.' }));
        });

    } catch (error: any) {
      setLoading(false);
      console.error("Erro no registro:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({ ...prev, email: 'Este e-mail já está em uso por outro usuário.' }));
      } else if (error.code === 'auth/invalid-email') {
        setErrors(prev => ({ ...prev, email: 'Formato de e-mail inválido.' }));
      } else {
        setErrors(prev => ({ ...prev, general: `Erro ao criar conta: ${error.message}` }));
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
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
          <div className="mb-6">
            <h1 className="text-xl font-[900] text-white tracking-tight leading-none mb-2 uppercase">
              Crie sua conta
            </h1>
            <p className="text-white/50 text-[11px] font-medium leading-relaxed">
              Use dados reais para garantir seus futuros resgates via PIX.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input 
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors(prev => ({ ...prev, fullName: '' }));
                }}
                placeholder="Nome e Sobrenome" 
                className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
              />
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1 pl-2 font-medium">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Input 
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="E-mail (ex: joao@gmail.com)" 
                className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 pl-2 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <Input 
                required
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Telefone: (DD) 99999-9999" 
                className="h-12 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none"
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1 pl-2 font-medium">{errors.phone}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input 
                  required
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
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
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 pl-2 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input 
                  required
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
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
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1 pl-2 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.general && (
              <p className="text-xs text-red-400 text-center font-bold bg-red-400/10 p-2 rounded-xl border border-red-400/20">{errors.general}</p>
            )}

            <Button 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#7b61ff] to-[#5a42d8] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(123,97,255,0.3)] mt-2"
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
    </div>
  );
}
