import React from 'react';
import Image from 'next/image';
import { 
  Play, 
  UserPlus, 
  Gamepad2, 
  ArrowRight, 
  Star,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-white pb-20 bg-[#06122b]">
      {/* 1) HEADER FIXO EXATAMENTE COMO A REFERÊNCIA */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5 mobile-container">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-red-600 rounded-lg flex items-center justify-center font-black text-white italic text-xs shadow-md">
            BP
          </div>
          <span className="font-black tracking-tighter text-base uppercase italic bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            BLOCK PIX
          </span>
        </div>
        <div>
          <Button size="sm" className="bg-gradient-to-r from-secondary to-purple-600 text-white hover:opacity-90 px-5 h-9 font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_4px_15px_rgba(123,97,255,0.4)]">
            CRIAR CONTA
          </Button>
        </div>
      </header>

      <main className="pt-24 px-6 space-y-8">
        {/* 2) HERO SECTION CONFORME A FOTO */}
        <section className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a2046] border border-cyan-500/30 text-xs font-semibold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <strong className="text-white font-bold">2.860</strong> jogadores online agora
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase text-center leading-tight">
            ENCAIXE OS BLOCOS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black">
              E GANHE R$
            </span>
          </h1>

          {/* CARD PRINCIPAL IGUAL À TELA */}
          <div className="relative w-full aspect-square bg-[#0b1d3f] rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <Image 
              src="/painel.png" 
              alt="Encaixe os Blocos e Ganhe R$" 
              fill 
              className="object-cover"
              priority
              data-ai-hint="game screen block blast"
            />
            
            {/* Fallback caso a imagem não exista para ficar bonito */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none">
              <span className="text-[10px] text-white/40 uppercase tracking-widest bg-black/40 backdrop-blur-sm self-start px-3 py-1 rounded-full">
                Experiência visual demonstrativa
              </span>
            </div>
          </div>
        </section>

        {/* 3) BOTÕES DE AÇÃO PRINCIPAIS DA REFERÊNCIA */}
        <section className="space-y-4 pt-2">
          <Button className="w-full h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-base shadow-[0_8px_25px_rgba(52,245,154,0.4)] transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-wide">
            JOGAR GRÁTIS
          </Button>

          <Button className="w-full h-14 rounded-full bg-gradient-to-r from-secondary to-purple-600 hover:opacity-90 text-white font-black text-base shadow-[0_8px_25px_rgba(123,97,255,0.3)] transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-wide">
            CRIAR CONTA
          </Button>

          <div className="text-center pt-1">
            <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors text-xs font-medium tracking-wide">
              Já tenho conta &rarr;
            </a>
          </div>
        </section>

        {/* 4) CARDS DE ESTATÍSTICAS INTEGRADOS NO LAYOUT */}
        <section className="grid grid-cols-3 gap-2.5 pt-4">
          {[
            { label: 'JOGADORES NA ARENA', value: '1.933' },
            { label: 'PRÊMIOS HOJE', value: 'R$ 8.523' },
            { label: 'MAIOR PRÊMIO HOJE', value: 'R$ 987' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0b1d3f]/80 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center min-h-[75px]">
              <span className="text-sm font-black text-cyan-400 tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-bold text-white/40 uppercase tracking-tight mt-1 leading-tight">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* 5) SEÇÃO COMO JOGAR */}
        <section className="space-y-6 py-6 border-t border-white/5">
          <div className="text-center space-y-1">
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">COMO JOGAR</span>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              Aprenda a faturar em 4 passos
            </h2>
          </div>

          <div className="space-y-4">
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
              <Card key={step.step} className="bg-[#0b1d3f]/40 border-white/5 overflow-hidden rounded-2xl group">
                <div className="relative aspect-[16/9] w-full bg-slate-950">
                  <Image src={step.img} alt={step.title} fill className="object-cover opacity-80" />
                  <div className="absolute top-3 left-3 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
                    {step.step}
                  </div>
                </div>
                <CardContent className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">{step.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 6) SEÇÃO DE DEPOIMENTOS REALISTAS COM FOTO DE PERFIL */}
        <section className="space-y-6 py-4 border-t border-white/5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              QUEM JOGA, RECOMENDA!
            </h2>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Resultados reais de jogadores reais</p>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Rafael Martins',
                initials: 'RM',
                text: 'Comecei com R$ 10 e resgatei R$ 20 na primeira partida. O jogo é bom demais, muito fácil. O PIX caiu na hora!',
                role: 'Jogador há 2 meses'
              },
              {
                name: 'Camila Souza',
                initials: 'CS',
                text: 'Já era viciado em Block Blast de qualquer forma, agora ainda ganho dinheiro jogando. A tática é resgatar cedo e não ser ganancioso.',
                role: 'Mãe Festeira'
              },
              {
                name: 'Bruno Lima',
                initials: 'BL',
                text: 'Interface limpa, sem enrolação. Depositei, joguei e saquei no mesmo dia. Cada linha que explode é muito satisfatório.',
                role: 'Usuário Ativo'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-[#0b1d3f]/50 border-white/5 p-4 rounded-2xl">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-xs text-white/80 italic mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs border border-white/10 uppercase">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide leading-none">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7) SEÇÃO FINAL CTA */}
        <section className="py-8 px-4 bg-gradient-to-b from-transparent to-cyan-500/5 rounded-[2rem] text-center space-y-5 border border-white/5">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              Pronto para <br /> montar e ganhar?
            </h2>
            <p className="text-white/50 text-xs max-w-xs mx-auto">
              Crie sua conta grátis, deposite a partir de R$ 20 e comece agora mesmo.
            </p>
          </div>

          <Button className="w-full h-14 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-base shadow-[0_8px_25px_rgba(52,245,154,0.4)] transition-all uppercase tracking-wide">
            CRIAR CONTA GRÁTIS
          </Button>

          <div className="text-[9px] text-white/30 uppercase tracking-widest">
            Cadastro rápido • experiência demonstrativa
          </div>
        </section>
      </main>

      {/* 8) FOOTER */}
      <footer className="mt-8 px-6 py-6 border-t border-white/5 space-y-4 text-center">
        <div className="flex justify-center items-center gap-2 opacity-50">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-purple-500 rounded flex items-center justify-center font-black text-white italic text-[10px]">
            BP
          </div>
          <span className="font-black tracking-tighter text-xs uppercase italic text-white">Block Pix</span>
        </div>
        
        <p className="text-white/30 text-[9px] font-medium">
          &copy; 2026 Block Pix. Todos os direitos reservados.
        </p>
        
        <div className="text-white/20 text-[8px] font-bold uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
          Jogue com responsabilidade. Proibido para menores de 18 anos.
        </div>
      </footer>
    </div>
  );
}
