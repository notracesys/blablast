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
    { id: 'step-1', title: 'Compre Agora', desc: 'Acesso imediato após confirmação.', icon: Zap },
    { id: 'step-2', title: 'Baixe o Arquivo', desc: 'Receba em PDF de alta qualidade.', icon: Download },
    { id: 'step-3', title: 'Imprima em Casa', desc: 'Ou em qualquer gráfica rápida.', icon: Printer },
    { id: 'step-4', title: 'Monte na Parede', desc: 'Basta colar as folhas A4.', icon: Layout },
    { id: 'step-5', title: 'Festa Incrível!', desc: 'Cenário perfeito para suas fotos.', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <DecorativeFlags />
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-junino-yellow/10 border border-junino-yellow text-junino-yellow font-bold text-sm">
              <Star className="w-4 h-4 fill-current" /> O MAIOR PAINEL DO BRASIL
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-junino-red leading-tight">
              Transforme Sua Festa Junina Com Um <span className="text-junino-orange">Painel Gigante</span> de 3 Metros
            </h1>
            <p className="text-xl text-slate-600 max-w-lg">
              Imprima folha por folha em casa e monte uma decoração profissional gastando 10x menos que um painel de lona.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-8 text-xl font-bold bg-junino-red hover:bg-junino-red/90 shadow-2xl transition-transform hover:scale-105 active:scale-95">
                🔥 QUERO RECEBER AGORA
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Entrega imediata</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Arquivo Digital</span>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-junino-yellow rounded-3xl rotate-3 opacity-20 blur-2xl" />
            <div className="relative border-8 border-white rounded-3xl overflow-hidden shadow-2xl aspect-[3/2.5]">
              <Image 
                src={heroImg?.imageUrl || ''} 
                alt={heroImg?.description || 'Giant Panel'} 
                fill 
                className="object-cover"
                data-ai-hint={heroImg?.imageHint}
                priority
              />
              <div className="absolute top-4 right-4 bg-junino-red text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                3.0m x 2.5m
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-wood-pattern border-y border-junino-beige/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-junino-red mb-6">Parece decoração profissional... Mas você imprime em casa!</h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Esqueça fretes caros e a espera dos correios. Receba o arquivo digital imediatamente e transforme qualquer parede vazia no cenário mais elogiado do seu Arraiá. Perfeito para escolas, festas em casa e creches.
          </p>
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-junino-orange rounded-full blur opacity-25" />
            <div className="bg-white px-8 py-4 rounded-full border-2 border-junino-orange font-bold text-junino-orange flex items-center gap-2">
              <Zap className="fill-current" /> ARQUIVO PDF PRONTO PARA IMPRESSÃO
            </div>
          </div>
        </div>
      </section>

      {/* Scale Preview Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-junino-red mb-4">Veja o Tamanho Real</h2>
          <p className="text-slate-600">Uma experiência visual que preenche todo o seu ambiente.</p>
        </div>
        <div className="max-w-5xl mx-auto">
          <ScalePreview />
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-4 bg-junino-beige/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Layout className="w-8 h-8 text-junino-red" />}
              title="Painel Gigante"
              desc="Dimensões impressionantes de 3 metros de largura por 2,5 metros de altura."
            />
            <BenefitCard 
              icon={<Zap className="w-8 h-8 text-junino-yellow" />}
              title="Entrega Imediata"
              desc="O link de download é enviado para seu e-mail logo após a confirmação do pagamento."
            />
            <BenefitCard 
              icon={<Printer className="w-8 h-8 text-junino-blue" />}
              title="Impressão Fácil"
              desc="Vem fatiado em folhas A4 padrão. Imprima em qualquer impressora comum."
            />
            <BenefitCard 
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title="Economia Real"
              desc="Pague apenas uma fração do custo de um painel de lona ou tecido tradicional."
            />
            <BenefitCard 
              icon={<Camera className="w-8 h-8 text-junino-orange" />}
              title="Fotos Incríveis"
              desc="Crie o 'Espaço Instagramável' perfeito para seus convidados registrarem o momento."
            />
            <BenefitCard 
              icon={<Download className="w-8 h-8 text-slate-700" />}
              title="Arquivo Vitalício"
              desc="O arquivo é seu para sempre. Imprima quantas vezes quiser em diferentes anos."
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-junino-red mb-4">Como Funciona o Seu Arraiá</h2>
            <div className="w-24 h-1 bg-junino-yellow mx-auto rounded-full" />
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-junino-beige -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-junino-red flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform bg-junino-beige/20">
                    <step.icon className="w-10 h-10 text-junino-red" />
                  </div>
                  <div className="bg-junino-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xl text-slate-800">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-24 px-4 bg-junino-beige/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-junino-yellow rounded-full text-white text-xs font-bold uppercase tracking-wider">
               Exclusivo
             </div>
             <h2 className="text-4xl font-bold text-junino-red mb-4">Bônus: Planejador Inteligente</h2>
             <p className="text-slate-600 max-w-2xl mx-auto">
               Além do painel, ganhe acesso ao nosso assistente de IA que cria sugestões personalizadas de músicas, comidas e decorações extras para o seu evento.
             </p>
          </div>
          <AIPlannerAssistant />
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="py-16 px-4 bg-junino-red relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <DecorativeFlags />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white">O São João Já Está Chegando!</h2>
          <p className="text-xl text-white/90">
            Não deixe para a última hora. Garanta agora o preço promocional antes que a oferta expire.
          </p>
          <UrgencyTimer />
          <Button size="lg" className="h-16 px-12 text-2xl font-black bg-junino-yellow hover:bg-junino-yellow/90 text-junino-red shadow-2xl transition-all hover:scale-105 active:scale-95">
             GARANTIR MEU ACESSO AGORA
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-junino-beige/10 border-4 border-dashed border-junino-beige p-12 lg:p-20 text-center space-y-8">
          <Sun className="w-16 h-16 text-junino-yellow mx-auto animate-pulse" />
          <h2 className="text-5xl font-bold text-junino-red">Sua Festa Merece Uma Decoração Inesquecível</h2>
          <p className="text-2xl text-slate-600">
            Crie memórias que vão durar para sempre. Transforme qualquer ambiente em um cenário digno de fotos profissionais.
          </p>
          <div className="space-y-4">
            <Button size="lg" className="w-full sm:w-auto h-20 px-12 text-2xl font-bold bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl shadow-xl flex items-center justify-center gap-4 group">
              <Send className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              RECEBER AGORA NO WHATSAPP
            </Button>
            <p className="text-sm text-slate-400">
              Pagamento 100% seguro • Recebimento instantâneo no e-mail
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-junino-beige">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-2xl font-bold text-junino-red">Arraiá Gigante</h3>
            <p className="text-slate-500 text-sm">
              © 2024 Festa Digital. Todos os direitos reservados.<br/>
              Produto digital. Envio imediato. Suporte ao cliente 24/7.
            </p>
          </div>
          <div className="flex justify-center md:justify-end gap-6 text-sm text-slate-500">
             <a href="#" className="hover:text-junino-red transition-colors">Termos de Uso</a>
             <a href="#" className="hover:text-junino-red transition-colors">Privacidade</a>
             <a href="#" className="hover:text-junino-red transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="border-2 border-white bg-white/50 backdrop-blur-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 rounded-3xl overflow-hidden group">
      <CardContent className="p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-junino-red">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}