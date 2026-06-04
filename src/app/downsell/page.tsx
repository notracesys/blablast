'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function DownsellPage() {
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
      {/* Barra de Progresso Quase Final */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-3 px-6 sticky top-0 z-50">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <Progress value={95} className="h-1.5 bg-slate-100" />
          </div>
          <span className="text-[10px] font-black text-primary whitespace-nowrap uppercase tracking-tighter">
            95% CONCLUÍDO
          </span>
        </div>
      </div>

      <section className="pt-12 pb-12 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-black text-[10px] mb-6 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" /> ÚLTIMA CHANCE!
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Não quer o painel agora?
          </h1>

          <p className="text-sm text-slate-600 mb-10 leading-relaxed font-medium">
            Então pelo menos garanta as decorações essenciais para não deixar sua festa sem nada. <br/>
            Sua chance de ter o kit completo por um preço simbólico.
          </p>

          {/* Downsell Product Card */}
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden mb-10">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
            
            <div className="p-8">
              {/* Imagem do Kit2 */}
              <div className="relative w-full mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
                <Image 
                  src="/kit2.png" 
                  alt="Kit Festa Junina Completa Downsell" 
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-black text-[10px] shadow-lg animate-bounce">
                  SUPER OFERTA
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center justify-center gap-2">
                <PackageCheck className="w-6 h-6 text-primary" />
                KIT DECORAÇÃO COMPLETO
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {kitItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-700 text-left leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <p className="text-2xl font-black text-primary tracking-tighter italic">
                  E MUITO MAIS! 🌽🔥🎉
                </p>
              </div>

              {/* Price Tag */}
              <div className="text-center mb-8">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Oferta Especial de Despedida</p>
                <div className="flex items-start justify-center gap-0.5">
                  <span className="text-xl font-black text-slate-300 mt-2">R$</span>
                  <span className="text-6xl font-black text-slate-800 tracking-tighter leading-none">9</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-black text-slate-800 mt-1">,90</span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full h-20 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-95 transition-all mb-4">
                <a href="https://pay.kirvano.com/1c1540b5-4b70-401d-9e56-83ffb5eef988" className="flex items-center justify-center w-full h-full uppercase">
                  SIM! QUERO O KIT COMPLETO <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors py-2"
              >
                Não, prefiro ficar sem nada.
              </button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-5 opacity-50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Compra Segura</span>
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
