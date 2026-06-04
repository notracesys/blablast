'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  Gift, 
  Sparkles, 
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DecorativeFlags } from '@/components/landing/DecorativeFlags';

export default function UpsellPage() {
  const kitItems = [
    "Convites Personalizados",
    "Bandeirinhas Decorativas",
    "Toppers para Doces",
    "Caixas de Pipoca",
    "Sacolinhas Surpresa",
    "Plaquinhas para Fotos",
    "Forminhas Especiais",
    "Tags e Rótulos"
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pb-20">
      <DecorativeFlags />
      
      {/* Progress Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-secondary/20 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Pedido Iniciado</span>
            <span className="text-orange-500">90% Concluído</span>
          </div>
          <Progress value={90} className="h-2 bg-slate-100" />
          <p className="text-center text-[11px] font-bold text-primary animate-pulse">
            ⚠️ NÃO FECHE ESTA PÁGINA! VOCÊ TEM UMA OFERTA ÚNICA.
          </p>
        </div>
      </div>

      <section className="pt-10 pb-12 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-black text-[10px] mb-6 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 fill-current" /> OPORTUNIDADE ÚNICA
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Seu painel já está garantido. <br/>
            <span className="text-primary">Agora complete sua decoração!</span>
          </h1>

          <p className="text-sm text-slate-600 mb-10 leading-relaxed font-medium">
            Complete sua festa com mais de 100 arquivos prontos para imprimir e transforme seu Arraiá em um evento profissional.
          </p>

          {/* Upsell Product Card */}
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden mb-10">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-500" />
            
            <div className="p-8">
              <div className="relative w-full aspect-square mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
                <Image 
                  src="/bonus.png" 
                  alt="Kit Festa Junina Completa" 
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-black text-[10px] shadow-lg animate-bounce">
                  +100 ARQUIVOS
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center justify-center gap-2">
                <PackageCheck className="w-6 h-6 text-primary" />
                O QUE VOCÊ VAI RECEBER:
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {kitItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-700 text-left leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              {/* Price Tag */}
              <div className="text-center mb-8">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">De <span className="line-through">R$ 47,00</span> por apenas</p>
                <div className="flex items-start justify-center gap-0.5">
                  <span className="text-xl font-black text-slate-300 mt-2">R$</span>
                  <span className="text-6xl font-black text-slate-800 tracking-tighter leading-none">14</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-black text-slate-800 mt-1">,90</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-black text-lg shadow-[0_15px_35px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all mb-4">
                SIM! QUERO A FESTA COMPLETA <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <button className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
                Não, obrigado. Quero apenas o painel.
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-5 opacity-50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Acesso Vitalício</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Entrega Imediata</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center">
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
          Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
