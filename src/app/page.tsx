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
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <DecorativeFlags />
      
      {/* Hero Section - Ultra Mobile Optimized */}
      <section className="relative pt-2 pb-12 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-junino-yellow/10 border border-junino-yellow text-junino-yellow font-bold text-[10px] mb-3 uppercase tracking-wider">
            <Star className="w-3 h-3 fill-current" /> O maior painel do Brasil
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-junino-red leading-tight mb-4">
            Painel Gigante <span className="text-junino-orange">3 Metros</span> para seu Arraiá
          </h1>

          {/* Product Image - Top focus */}
          <div className="relative w-full max-w-sm aspect-[3/2.5] mb-6 animate-float group">
            <div className="absolute -inset-2 bg-junino-yellow rounded-2xl rotate-2 opacity-20 blur-xl" />
            <div className="relative border-4 border-white rounded-2xl overflow-hidden shadow-2xl h-full w-full">
              <Image 
                src={heroImg?.imageUrl || ''} 
                alt={heroImg?.description || 'Painel Gigante Festa Junina'} 
                fill 
                className="object-cover"
                data-ai-hint={heroImg?.imageHint}
                priority
              />
              <div className="absolute top-2 right-2 bg-junino-red text-white px-3 py-1 rounded-full font-bold text-[10px] shadow-lg">
                3.0m x 2.5m
              </div>
            </div>
          </div>

          <p className="text-base text-slate-600 max-w-xs mb-6 leading-relaxed">
            Monte uma decoração profissional em casa gastando 10x menos que um painel de lona.
          </p>

          <div className="w-full max-w-xs flex flex-col gap-3">
            <Button size="lg" className="w-full h-14 text-lg font-bold bg-junino-red hover:bg-junino-red/90 shadow-xl transition-all active:scale-95">
              🔥 QUERO MEU PAINEL AGORA
            </Button>
            <div className="flex items-center justify-center gap-3 text-[9px] text-slate-500 font-bold uppercase">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Envio Imediato</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Arquivo Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-6 bg-junino-yellow/5 border-y border-junino-yellow/10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
          <p className="text-junino-red font-bold text-xs uppercase tracking-widest">Oferta encerra em:</p>
          <UrgencyTimer />
        </div>
      </section>

      {/* Key Benefit Section */}
      <section className="py-12 px-4 bg-wood-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-junino-red mb-3 leading-tight">Decoração profissional que cabe no bolso</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-xs mx-auto">
            Receba o PDF e transforme qualquer parede no cenário mais elogiado do seu Arraiá.
          </p>
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-dashed border-junino-orange text-junino-orange font-bold text-[10px] inline-flex items-center gap-2">
            <Zap className="w-3 h-3 fill-current" /> PRONTO PARA IMPRIMIR EM FOLHA A4
          </div>
        </div>
      </section>

      {/* Scale Comparison */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-xl font-bold text-center text-junino-red mb-8">Veja o Tamanho Real</h2>
        <ScalePreview />
      </section>

      {/* Benefits Grid */}
      <section className="py-12 px-4 bg-junino-beige/10">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <BenefitCard 
            icon={<Layout className="w-5 h-5 text-junino-red" />}
            title="3.0m x 2.5m"
            desc="Dimensões que preenchem qualquer ambiente."
          />
          <BenefitCard 
            icon={<Printer className="w-5 h-5 text-junino-blue" />}
            title="Impressão Caseira"
            desc="Fatiado em folhas A4 comuns."
          />
          <BenefitCard 
            icon={<ShieldCheck className="w-5 h-5 text-green-500" />}
            title="Economia de 90%"
            desc="Gaste menos que um painel de lona."
          />
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 px-4 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-junino-red">Como Funciona</h2>
        </div>
        <div className="space-y-8 max-w-[280px] mx-auto relative">
          <div className="absolute left-5 top-0 w-0.5 h-full bg-junino-beige z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4 relative z-10 group">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-junino-red flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                <step.icon className="w-5 h-5 text-junino-red" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                <p className="text-slate-500 text-[10px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant */}
      <section className="py-12 px-4 bg-junino-beige/30">
        <div className="text-center mb-6 px-4">
           <h2 className="text-xl font-bold text-junino-red">Bônus Exclusivo</h2>
           <p className="text-slate-600 text-xs mt-2">Use nossa IA para planejar o resto da sua festa.</p>
        </div>
        <AIPlannerAssistant />
      </section>

      {/* Final Mobile CTA */}
      <section className="py-12 px-6 bg-junino-red text-center">
        <h2 className="text-2xl font-black text-white mb-6 leading-tight">Prepare o seu Arraiá hoje mesmo!</h2>
        <Button size="lg" className="w-full h-14 text-lg font-bold bg-junino-yellow text-junino-red hover:bg-white transition-all shadow-2xl">
           GARANTIR MEU ACESSO
        </Button>
        <p className="mt-4 text-white/70 text-[10px]">Acesso vitalício ao arquivo digital</p>
      </section>

      {/* Simple Footer */}
      <footer className="py-10 px-4 border-t border-junino-beige text-center space-y-4">
        <h3 className="text-lg font-bold text-junino-red">Arraiá Gigante</h3>
        <p className="text-slate-500 text-[9px] leading-relaxed max-w-xs mx-auto">
          © 2024 Festa Digital. Produto Digital. Suporte via WhatsApp.
        </p>
        <div className="flex justify-center gap-4 text-[9px] text-slate-400 font-bold uppercase">
             <a href="#">Termos</a>
             <a href="#">Privacidade</a>
             <a href="#">Ajuda</a>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-junino-beige/50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="space-y-0.5">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <p className="text-slate-500 text-[10px] leading-snug">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
