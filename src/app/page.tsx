
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
  Sun,
  Star,
  ChevronRight,
  Send
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
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-panel');
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
      
      {/* Hero Section - Mobile Priority */}
      <section className="relative pt-2 pb-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-junino-yellow/10 border border-junino-yellow text-junino-yellow font-bold text-[10px] mb-4 uppercase tracking-wider">
            <Star className="w-3 h-3 fill-current" /> O maior painel do Brasil
          </div>
          
          <h1 className="text-3xl font-black text-junino-red leading-tight mb-6">
            Painel Gigante <span className="text-junino-orange">3 Metros</span> para seu Arraiá
          </h1>

          {/* Product Image - Fully Visible */}
          <div className="relative w-full max-w-[340px] aspect-[3/2.5] mb-8 animate-float">
            <div className="absolute -inset-4 bg-junino-yellow/10 rounded-full blur-3xl" />
            <div className="relative border-4 border-white rounded-2xl overflow-hidden shadow-2xl h-full w-full bg-white">
              <Image 
                src="/painel.png" 
                alt="Painel Gigante Festa Junina" 
                fill 
                className="object-contain p-1"
                priority
              />
              <div className="absolute bottom-2 right-2 bg-junino-red text-white px-3 py-1 rounded-lg font-bold text-[10px] shadow-xl border border-white z-10">
                3.0m x 2.5m
              </div>
            </div>
          </div>

          <p className="text-base text-slate-600 max-w-[300px] mb-8 leading-relaxed font-medium">
            Transforme sua parede no cenário mais elogiado do Arraiá com impressão caseira.
          </p>

          <div className="w-full max-w-xs flex flex-col gap-4">
            <Button size="lg" className="w-full h-16 text-xl font-black bg-junino-red hover:bg-junino-red/90 shadow-[0_10px_20px_rgba(215,38,56,0.3)] transition-all active:scale-95 rounded-2xl">
              QUERO MEU PAINEL AGORA
            </Button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Envio Imediato</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Arquivo Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-6 bg-white border-y border-junino-yellow/20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
          <p className="text-junino-red font-bold text-xs uppercase tracking-widest">A oferta expira em:</p>
          <UrgencyTimer />
        </div>
      </section>

      {/* Scale Comparison */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-xl font-black text-center text-junino-red mb-8">Veja o Tamanho Real</h2>
        <ScalePreview />
      </section>

      {/* Benefits Grid */}
      <section className="py-12 px-4 bg-junino-beige/10">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <BenefitCard 
            icon={<Layout className="w-6 h-6 text-junino-red" />}
            title="3.0m x 2.5m"
            desc="Ocupa a parede inteira, criando um cenário profissional."
          />
          <BenefitCard 
            icon={<Printer className="w-6 h-6 text-junino-blue" />}
            title="Impressão em Folha A4"
            desc="Você recebe o arquivo fatiado pronto para imprimir em casa."
          />
          <BenefitCard 
            icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
            title="Economia Real"
            desc="Gaste 10x menos que um painel de lona tradicional."
          />
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 px-4 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-junino-red">Passo a Passo</h2>
        </div>
        <div className="space-y-10 max-w-[280px] mx-auto relative">
          <div className="absolute left-5 top-0 w-[2px] h-full bg-junino-beige z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-5 relative z-10 group">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-junino-red flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6 text-junino-red" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-base">{step.title}</h3>
                <p className="text-slate-500 text-xs">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant */}
      <section className="py-12 px-4 bg-junino-beige/30">
        <div className="text-center mb-8 px-4">
           <h2 className="text-2xl font-black text-junino-red">Bônus Exclusivo</h2>
           <p className="text-slate-600 text-sm mt-2">Nossa IA planeja o resto da sua festa para você!</p>
        </div>
        <AIPlannerAssistant />
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-junino-red text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-wood-pattern pointer-events-none" />
        <h2 className="text-3xl font-black text-white mb-8 leading-tight relative z-10">Garanta o cenário perfeito!</h2>
        <Button size="lg" className="w-full h-16 text-xl font-black bg-junino-yellow text-junino-red hover:bg-white transition-all shadow-2xl relative z-10 rounded-2xl">
           COMPRAR AGORA
        </Button>
        <p className="mt-6 text-white/80 text-xs font-bold relative z-10">Acesso imediato ao arquivo digital PDF</p>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-junino-beige bg-white text-center space-y-6">
        <h3 className="text-xl font-black text-junino-red tracking-tight">Arraiá Gigante</h3>
        <p className="text-slate-500 text-[10px] leading-relaxed max-w-xs mx-auto font-medium">
          © 2024 Festa Digital. Transformamos sua casa em um verdadeiro arraial. Suporte via WhatsApp disponível.
        </p>
        <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             <a href="#" className="hover:text-junino-red transition-colors">Termos</a>
             <a href="#" className="hover:text-junino-red transition-colors">Privacidade</a>
             <a href="#" className="hover:text-junino-red transition-colors">Ajuda</a>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-junino-beige/50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
