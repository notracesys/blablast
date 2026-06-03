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
      
      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-4 pb-12 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-junino-yellow/10 border border-junino-yellow text-junino-yellow font-bold text-[10px] mb-4 uppercase tracking-wider">
            <Star className="w-3 h-3 fill-current" /> O maior painel do Brasil
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-junino-red leading-tight mb-6">
            Transforme sua festa com um <span className="text-junino-orange">Painel Gigante</span> de 3 metros
          </h1>

          {/* Product Image - Top placement for Mobile */}
          <div className="relative w-full max-w-sm aspect-[3/2.5] mb-8 animate-float group">
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

          <p className="text-base sm:text-lg text-slate-600 max-w-md mb-8 px-2 leading-relaxed">
            Imprima folha por folha em casa e monte uma decoração profissional gastando 10x menos que um painel de lona.
          </p>

          <div className="w-full flex flex-col gap-4">
            <Button size="lg" className="w-full h-16 text-xl font-bold bg-junino-red hover:bg-junino-red/90 shadow-xl transition-all active:scale-95">
              🔥 QUERO MEU PAINEL AGORA
            </Button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Envio Imediato</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Arquivo Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-8 bg-junino-yellow/5 border-y border-junino-yellow/10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <p className="text-junino-red font-bold text-sm uppercase">Oferta por tempo limitado:</p>
          <UrgencyTimer />
        </div>
      </section>

      {/* Key Benefit Section */}
      <section className="py-16 px-4 bg-wood-pattern">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-junino-red mb-4">Decoração profissional que cabe no seu bolso</h2>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">
            Esqueça fretes caros. Receba o PDF e transforme qualquer parede vazia no cenário mais elogiado do seu Arraiá.
          </p>
          <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-junino-orange text-junino-orange font-bold text-xs inline-flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current" /> PRONTO PARA IMPRIMIR EM FOLHA A4
          </div>
        </div>
      </section>

      {/* Scale Comparison - Vertical Focus for Mobile */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-2xl font-bold text-center text-junino-red mb-10">Veja o Tamanho Real</h2>
        <ScalePreview />
      </section>

      {/* Benefits Grid - Mobile Cards */}
      <section className="py-16 px-4 bg-junino-beige/10">
        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
          <BenefitCard 
            icon={<Layout className="w-6 h-6 text-junino-red" />}
            title="3.0m x 2.5m"
            desc="Dimensões impressionantes que preenchem qualquer ambiente."
          />
          <BenefitCard 
            icon={<Printer className="w-6 h-6 text-junino-blue" />}
            title="Impressão Caseira"
            desc="Fatiado em folhas A4. Use sua impressora comum."
          />
          <BenefitCard 
            icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
            title="Economia de 90%"
            desc="Gaste muito menos que um painel de lona tradicional."
          />
        </div>
      </section>

      {/* Steps Section - Simplified for Mobile */}
      <section className="py-16 px-4 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-junino-red">Como Funciona</h2>
        </div>
        <div className="space-y-12 max-w-xs mx-auto relative">
          <div className="absolute left-6 top-0 w-0.5 h-full bg-junino-beige z-0" />
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-6 relative z-10 group">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-junino-red flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6 text-junino-red" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-xs">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant - Mobile Card */}
      <section className="py-16 px-4 bg-junino-beige/30">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-junino-red">Bônus Exclusivo</h2>
           <p className="text-slate-600 text-sm mt-2">Use nossa IA para planejar o resto da sua festa.</p>
        </div>
        <AIPlannerAssistant />
      </section>

      {/* Final Mobile CTA */}
      <section className="py-16 px-4 bg-junino-red text-center">
        <h2 className="text-3xl font-black text-white mb-6 leading-tight">Prepare o seu Arraiá hoje mesmo!</h2>
        <Button size="lg" className="w-full h-16 text-xl font-bold bg-junino-yellow text-junino-red hover:bg-white transition-all shadow-2xl">
           GARANTIR MEU ACESSO
        </Button>
        <p className="mt-4 text-white/70 text-xs">Acesso vitalício ao arquivo digital</p>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-4 border-t border-junino-beige text-center space-y-4">
        <h3 className="text-xl font-bold text-junino-red">Arraiá Gigante</h3>
        <p className="text-slate-500 text-[10px] leading-relaxed">
          © 2024 Festa Digital. Produto Digital. Suporte 24h via WhatsApp.
        </p>
        <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-bold uppercase">
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
    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-junino-beige/50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
