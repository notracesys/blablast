import React from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Camera, 
  Layout, 
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DecorativeFlags } from '@/components/landing/DecorativeFlags';
import { ScalePreview } from '@/components/landing/ScalePreview';
import { AIPlannerAssistant } from '@/components/landing/AIPlannerAssistant';
import { UrgencyTimer } from '@/components/landing/UrgencyTimer';
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp';

export default function LandingPage() {
  const steps = [
    { id: 'step-1', title: 'Compre', desc: 'Acesso imediato.', icon: Zap },
    { id: 'step-2', title: 'Baixe', desc: 'PDF de alta qualidade.', icon: Download },
    { id: 'step-3', title: 'Imprima', desc: 'Folhas A4 comuns.', icon: Printer },
    { id: 'step-4', title: 'Monte', desc: 'Basta colar e fixar.', icon: Layout },
    { id: 'step-5', title: 'Celebre!', desc: 'Cenário perfeito.', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pb-20">
      <DecorativeFlags />
      
      {/* Hero Section - Ultra Mobile Focused */}
      <section className="relative pt-6 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-orange-600 font-black text-[10px] mb-6 uppercase tracking-wider">
            <Star className="w-3 h-3 fill-current" /> O MAIS VENDIDO DE 2024
          </div>
          
          <h1 className="text-3xl font-black text-primary leading-[1.1] mb-8 tracking-tight">
            Painel Gigante <span className="text-orange-500 underline decoration-wavy decoration-secondary">3 Metros</span> <br/>
            <span className="text-2xl text-slate-700">Para Seu Arraiá em Casa</span>
          </h1>

          {/* Product Image - High Impact & Enlarged */}
          <div className="relative w-full max-w-[400px] aspect-[1.2/1] mb-10 group px-2">
            {/* Subtle glow effect */}
            <div className="absolute -inset-4 bg-secondary/10 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex items-center justify-center bg-transparent transition-transform duration-500 hover:scale-[1.02]">
              <Image 
                src="/painel.png" 
                alt="Painel Gigante Festa Junina" 
                fill 
                className="object-contain"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-xl font-black text-xs shadow-2xl border border-white/20 z-10 animate-float">
                3.0m x 2.5m
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-[300px] mb-10 leading-relaxed font-medium">
            Receba o arquivo digital agora e imprima em qualquer impressora comum usando folhas A4.
          </p>

          <div className="w-full max-w-xs flex flex-col gap-5">
            <Button size="lg" className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 shadow-[0_12px_35px_rgba(215,38,56,0.35)] transition-all active:scale-95 rounded-2xl text-white">
              QUERO MEU PAINEL AGORA
            </Button>
            <div className="flex items-center justify-center gap-5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> PDF Imediato</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Montagem Fácil</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-10 bg-white/60 backdrop-blur-md border-y border-secondary/20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em]">Oferta especial termina em:</p>
          <UrgencyTimer />
        </div>
      </section>

      {/* Scale Comparison */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-black text-center text-primary mb-10 tracking-tight">Compare o Tamanho Real</h2>
        <ScalePreview />
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6 bg-secondary/5">
        <div className="grid grid-cols-1 gap-5 max-w-sm mx-auto">
          <BenefitCard 
            icon={<Layout className="w-7 h-7 text-primary" />}
            title="Cenário Imponente"
            desc="3 metros de largura. Ocupa a parede inteira do seu evento."
          />
          <BenefitCard 
            icon={<Printer className="w-7 h-7 text-accent" />}
            title="Impressão Caseira"
            desc="Fatiado em folhas A4. Imprima e monte como um quebra-cabeça."
          />
          <BenefitCard 
            icon={<ShieldCheck className="w-7 h-7 text-green-600" />}
            title="Preço Imbatível"
            desc="Menos de 10% do valor de um painel de lona tradicional."
          />
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-6 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-primary tracking-tight">Como funciona?</h2>
        </div>
        <div className="space-y-12 max-w-[280px] mx-auto relative">
          <div className="absolute left-6 top-0 w-[2px] h-full bg-slate-100 z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-lg shrink-0">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                <p className="text-slate-500 text-[11px] leading-tight mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant - Value Add */}
      <section className="py-20 px-6 bg-secondary/10">
        <div className="text-center mb-10">
           <div className="inline-block bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-4 shadow-sm">PRESENTE EXCLUSIVO</div>
           <h2 className="text-2xl font-black text-primary tracking-tight">Planejador de Festas IA</h2>
           <p className="text-slate-600 text-sm mt-3 max-w-[280px] mx-auto">Nossa inteligência ajuda você com músicas, comidas e muito mais!</p>
        </div>
        <AIPlannerAssistant />
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 bg-primary text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-wood-pattern pointer-events-none" />
        <h2 className="text-3xl font-black text-white mb-12 leading-tight relative z-10">Não deixe seu Arraiá sem decoração!</h2>
        <Button size="lg" className="w-full h-16 text-xl font-black bg-secondary text-slate-900 hover:bg-white transition-all shadow-2xl relative z-10 rounded-2xl">
           COMPRAR AGORA
        </Button>
        <p className="mt-8 text-white/80 text-[10px] font-bold uppercase tracking-widest relative z-10">Download imediato após o pagamento</p>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-100 bg-white text-center space-y-8">
        <h3 className="text-xl font-black text-primary tracking-tighter">Arraiá Gigante</h3>
        <p className="text-slate-400 text-[11px] leading-relaxed max-w-[260px] mx-auto font-medium">
          Transformamos sua casa no melhor cenário do mundo. Suporte humanizado via WhatsApp.
        </p>
        <div className="flex justify-center gap-10 text-[11px] text-slate-400 font-black uppercase tracking-widest">
             <a href="#" className="hover:text-primary transition-colors">Ajuda</a>
             <a href="#" className="hover:text-primary transition-colors">Termos</a>
             <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
          {icon}
        </div>
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
