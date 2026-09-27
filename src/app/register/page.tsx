'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, User, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#060a17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

      <main className="w-full max-w-[400px] z-10 flex flex-col items-center">
        {/* Logo */}
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

        {/* Registration Card */}
        <div className="w-full bg-[#0b1426] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          {/* Top Shine */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="mb-8">
            <h1 className="text-2xl font-[900] text-white tracking-tight leading-none mb-2">
              Crie sua conta grátis
            </h1>
            <p className="text-white/50 text-xs font-medium leading-relaxed">
              Cadastre-se para montar, explodir linhas e ganhar dinheiro real.
            </p>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  placeholder="Nome completo" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  placeholder="Telefone com DDD (ex: 11 99999-0000)" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Create Password */}
            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  type={showPass ? "text" : "password"}
                  placeholder="Crie uma senha" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <div className="relative group">
                <Input 
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirme sua senha" 
                  className="h-14 bg-[#060a17] border-white/5 rounded-2xl px-5 pr-12 text-sm placeholder:text-white/20 focus:border-purple-500/50 transition-all outline-none ring-0 focus-visible:ring-0"
                />
                <button 
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full h-14 bg-gradient-to-r from-[#7b61ff] to-[#5a42d8] hover:opacity-95 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(123,97,255,0.3)] mt-4 animate-shine border border-purple-400/20">
              CRIAR CONTA
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-[11px] font-bold">
              Já tem uma conta? <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Entrar</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Decorative Blocks */}
      <div className="absolute bottom-0 w-full flex justify-center gap-1 opacity-60">
        <div className="w-20 h-24 bg-purple-700/40 rounded-t-lg blur-[2px] translate-y-8"></div>
        <div className="w-20 h-32 bg-blue-700/40 rounded-t-lg blur-[2px] translate-y-4"></div>
        <div className="w-20 h-40 bg-cyan-700/40 rounded-t-lg blur-[2px]"></div>
        <div className="w-20 h-28 bg-emerald-700/40 rounded-t-lg blur-[2px] translate-y-12"></div>
      </div>
    </div>
  );
}
