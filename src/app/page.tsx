import React from 'react';
import Image from 'next/image';
import { 
  Play, 
  UserPlus, 
  Gamepad2, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Zap,
  TrendingUp,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-white pb-20">
      {/* 1) HEADER FIXO */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5 mobile-container">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-black text-white italic">
            BB
          </div>
          <span className="ml-2 font-black tracking-tighter text-lg uppercase italic">Block Blast</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="text-white border border-primary/20 hover:bg-primary/10 px-4 h-9 font-semibold text-xs rounded-full">
            Entrar
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-secondary to-blue-600 text-white hover:opacity-90 px-4 h-9 font-semibold text-xs rounded-full glow-purple">
            Criar conta
          </Button>
        </div>
      </header>

      <main className="pt-24 px-6 space-y-12">
        {/* 2) HERO SECTION */}
        <section className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b1d3f] border border-primary/30 text-[10px] font-bold tracking-wider text-primary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
              3.083 jogadores online agora
            </div>
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tighter uppercase italic">
            ENCAIXE OS BLOCOS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">E GANHE R$</span>
          </h1>

          <div className="relative w-full aspect-[4/5] bg-card rounded-[2rem] border border-primary/20 overflow-hidden glow-cyan animate-float">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80 z-10" />
            
            {/* Placeholder para imagem principal */}
            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black italic text-2xl uppercase tracking-widest text-center px-10">
              <Image 
                src="/painel.png" 
                alt="Banner Principal" 
                fill 
                className="object-cover opacity-80"
                data-ai-hint="game screen"
              />
              <span className="relative z-20">Preview da Jogabilidade</span>
            </div>

            <div className="absolute bottom-6 left-6 z-20">
              <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-white/10 text-[8px] uppercase tracking-widest px-3 py-1 text-white/60 rounded-full">
                Experiência visual demonstrativa
              </Badge>
            </div>
          </div>
        </section>

        {/* 3) BOTÕES PRINCIPAIS */}
        <section className="space-y-4">
          <Button className="w-full h-20 rounded-2xl bg-gradient-to-r from-accent to-primary text-background font-black text-xl shadow-[0_15px_35px_rgba(38,217,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 animate-shine z-0" />
            <div className="flex flex-col items-center justify-center gap-0 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                  <Play className="w-3 h-3 fill-accent text-accent ml-0.5" />
                </div>
                JOGAR GRÁTIS
              </div>
              <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Abrir modo demonstração</span>
            </div>
            <ArrowRight className="absolute right-6 opacity-40 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button className="w-full h-20 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xl shadow-[0_15px_35px_rgba(123,97,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative">
            <div className="flex flex-col items-center justify-center gap-0 relative z-10">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                CRIAR CONTA
              </div>
              <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Comece em poucos segundos</span>
            </div>
          </Button>

          <div className="text-center pt-2">
            <a href="#" className="text-white/40 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 group">
              Já tenho conta <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

        {/* 4) CARDS DE ESTATÍSTICAS */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'JOGADORES NA ARENA', value: '1.933', icon: Gamepad2 },
            { label: 'PRÊMIOS HOJE', value: 'R$ 8.523', icon: TrendingUp },
            { label: 'MAIOR PRÊMIO HOJE', value: 'R$ 987', icon: Zap }
          ].map((stat, i) => (stat.label === 'MAIOR PRÊMIO HOJE' && i === 2) ? (
            <div key={i} className="bg-card/50 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center space-y-1">
              <stat.icon className="w-4 h-4 text-accent mb-1" />
              <span className="text-sm font-black text-primary italic leading-none">{stat.value}</span>
              <span className="text-[7px] font-bold text-white/40 uppercase tracking-tight">{stat.label}</span>
            </div>
          ) : (
            <div key={i} className="bg-card/50 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center space-y-1">
              <stat.icon className="w-4 h-4 text-primary mb-1" />
              <span className="text-sm font-black text-primary italic leading-none">{stat.value}</span>
              <span className="text-[7px] font-bold text-white/40 uppercase tracking-tight">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* 5) SEÇÃO COMO JOGAR */}
        <section className="space-y-8 py-10">
          <div className="text-center space-y-2">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">COMO JOGAR</span>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              Aprenda a faturar com <br/> Block Blast em 4 passos
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { 
                step: 1, 
                title: '1. Deposite via PIX', 
                desc: 'Adicione saldo à sua conta de forma rápida e segura para começar a jogar Block Blast.',
                img: 'https://picsum.photos/seed/pix/400/250'
              },
              { 
                step: 2, 
                title: '2. Escolha sua entrada', 
                desc: 'Defina quanto quer apostar por partida. Quanto maior a entrada, maior a recompensa mínima.',
                img: 'https://picsum.photos/seed/entry/400/250'
              },
              { 
                step: 3, 
                title: '3. Monte e exploda linhas', 
                desc: 'Encaixe as peças no tabuleiro 8x8. Cada linha ou coluna completa explode e acumula prêmios.',
                img: 'https://picsum.photos/seed/game/400/250'
              },
              { 
                step: 4, 
                title: '4. Resgate e saque', 
                desc: 'Bateu a meta de 2x? Faça o cashout e retire seus ganhos via PIX na hora.',
                img: 'https://picsum.photos/seed/cashout/400/250'
              }
            ].map((step) => (
              <Card key={step.step} className="bg-card/40 border-white/5 overflow-hidden rounded-[1.5rem] group hover:border-primary/20 transition-all">
                <div className="relative aspect-[16/10]">
                  <Image src={step.img} alt={step.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black text-background text-lg shadow-xl z-20">
                    {step.step}
                  </div>
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-lg font-black italic uppercase italic leading-none">{step.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 6) SEÇÃO DE DEPOIMENTOS */}
        <section className="space-y-8 pb-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              QUEM JOGA, RECOMENDA!
            </h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Resultados reais de jogadores reais</p>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Rafael Martins',
                initials: 'RM',
                text: 'Comecei com R$ 10 e resgatei R$ 20 na primeira partida. O jogo é bom demais, muito fácil. O PIX caiu na hora!',
                verified: true
              },
              {
                name: 'Camila Souza',
                initials: 'CS',
                text: 'Já era viciado em Block Blast de qualquer forma, agora ainda ganho dinheiro jogando. A tática é resgatar cedo e não ser ganancioso.',
                verified: true
              },
              {
                name: 'Bruno Lima',
                initials: 'BL',
                text: 'Interface limpa, sem enrolação. Depositei, joguei e saquei no mesmo dia. Cada linha que explode é muito satisfatório.',
                verified: true
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-[#0b1d3f]/60 border-white/5 p-6 rounded-[1.5rem]">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-white/70 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border border-white/5 uppercase">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic uppercase leading-none">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3 text-accent" />
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest">Usuário verificado</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7) SEÇÃO FINAL CTA */}
        <section className="py-12 px-2 bg-gradient-to-b from-transparent to-primary/5 rounded-[3rem] text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Pronto para <br /> montar e ganhar?
            </h2>
            <p className="text-white/50 text-xs font-medium px-10">
              Crie sua conta grátis, deposite a partir de R$ 20 e comece agora.
            </p>
          </div>

          <Button className="w-full h-20 rounded-2xl bg-gradient-to-r from-accent to-primary text-background font-black text-xl shadow-[0_15px_35px_rgba(38,217,255,0.25)] hover:scale-[1.05] transition-all relative overflow-hidden group">
            <div className="absolute inset-0 animate-shine z-0" />
            <span className="relative z-10 flex items-center gap-2">
              CRIAR CONTA GRÁTIS
              <Zap className="w-5 h-5 fill-background" />
            </span>
          </Button>

          <div className="flex items-center justify-center gap-4 text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
            <span>Cadastro rápido</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>experiência demonstrativa</span>
          </div>
        </section>
      </main>

      {/* 8) FOOTER */}
      <footer className="mt-12 px-6 py-10 border-t border-white/5 space-y-6 text-center">
        <div className="flex justify-center items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary/50 to-secondary/50 rounded flex items-center justify-center font-black text-white italic text-xs">
            BB
          </div>
          <span className="ml-2 font-black tracking-tighter text-sm uppercase italic opacity-50">Block Blast</span>
        </div>
        
        <p className="text-white/30 text-[10px] font-medium leading-relaxed">
          &copy; 2026 Block Blast. Todos os direitos reservados.
        </p>
        
        <div className="pt-2">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-widest px-8">
            Jogue com responsabilidade. Proibido para menores de 18 anos.
          </p>
        </div>
      </footer>
    </div>
  );
}