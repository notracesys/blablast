
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
      <section className="relative pt-4 pb-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary text-junino-orange font-black text-[10px] mb-4 uppercase tracking-tighter">
            <Star className="w-3 h-3 fill-current" /> O MAIS VENDIDO DE 2024
          </div>
          
          <h1 className="text-3xl font-black text-primary leading-[1.1] mb-6 tracking-tight">
            Painel Gigante <span className="text-junino-orange">3 Metros</span> <br/>
            <span className="text-2xl text-slate-700">Para Seu Arraiá em Casa</span>
          </h1>

          {/* Product Image - High Impact */}
          <div className="relative w-full max-w-[320px] aspect-[3/2.5] mb-8 group">
            {/* Subtle glow effect instead of hard white box */}
            <div className="absolute -inset-2 bg-junino-yellow/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center bg-transparent">
              <Image 
                src="/painel.png" 
                alt="Painel Gigante Festa Junina" 
                fill 
                className="object-contain"
                priority
              />
              <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1.5 rounded-lg font-black text-[11px] shadow-xl border border-white/20 z-10">
                3.0m x 2.5m
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-[280px] mb-8 leading-relaxed font-semibold">
            Receba o arquivo digital agora e imprima em qualquer impressora comum (Folha A4).
          </p>

          <div className="w-full max-w-xs flex flex-col gap-4">
            <Button size="lg" className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 shadow-[0_10px_30px_rgba(215,38,56,0.4)] transition-all active:scale-95 rounded-2xl text-white">
              QUERO MEU PAINEL AGORA
            </Button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> PDF Imediato</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Montagem Fácil</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-junino-yellow/30">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em]">Promoção termina em:</p>
          <UrgencyTimer />
        </div>
      </section>

      {/* Scale Comparison */}
      <section className="py-12 px-6 bg-white">
        <h2 className="text-xl font-black text-center text-primary mb-8 tracking-tight">Compare o Tamanho Real</h2>
        <ScalePreview />
      </section>

      {/* Benefits Grid */}
      <section className="py-12 px-6 bg-secondary/5">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <BenefitCard 
            icon={<Layout className="w-6 h-6 text-primary" />}
            title="Cenário Imponente"
            desc="3 metros de largura. Ocupa a parede inteira do seu evento."
          />
          <BenefitCard 
            icon={<Printer className="w-6 h-6 text-accent" />}
            title="Impressão Caseira"
            desc="Fatiado em folhas A4. Imprima e monte como um quebra-cabeça."
          />
          <BenefitCard 
            icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
            title="Preço Imbatível"
            desc="Menos de 10% do valor de um painel de lona tradicional."
          />
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-primary tracking-tight">Como funciona?</h2>
        </div>
        <div className="space-y-12 max-w-[260px] mx-auto relative">
          <div className="absolute left-6 top-0 w-[2px] h-full bg-slate-100 z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-md shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                <p className="text-slate-500 text-[11px] leading-tight">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant - Value Add */}
      <section className="py-16 px-6 bg-secondary/10">
        <div className="text-center mb-8">
           <div className="inline-block bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full mb-3">PRESENTE EXCLUSIVO</div>
           <h2 className="text-2xl font-black text-primary tracking-tight">Planejador de Festas IA</h2>
           <p className="text-slate-600 text-sm mt-2 max-w-[250px] mx-auto">Nossa inteligência ajuda você com músicas, comidas e mais!</p>
        </div>
        <AIPlannerAssistant />
      </section>

      {/* Final CTA */}
      <section className="py-20 px-8 bg-primary text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-wood-pattern pointer-events-none" />
        <h2 className="text-3xl font-black text-white mb-10 leading-tight relative z-10">Não deixe seu Arraiá sem decoração!</h2>
        <Button size="lg" className="w-full h-16 text-xl font-black bg-secondary text-slate-900 hover:bg-white transition-all shadow-2xl relative z-10 rounded-2xl">
           COMPRAR AGORA
        </Button>
        <p className="mt-6 text-white/70 text-[10px] font-bold uppercase tracking-widest relative z-10">Download imediato após o pagamento</p>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white text-center space-y-6">
        <h3 className="text-lg font-black text-primary tracking-tighter">Arraiá Gigante</h3>
        <p className="text-slate-400 text-[10px] leading-relaxed max-w-[240px] mx-auto font-medium">
          Transformamos sua casa no melhor cenário do mundo. Suporte humanizado via WhatsApp.
        </p>
        <div className="flex justify-center gap-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
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
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
