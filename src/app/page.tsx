import React from 'react';
import Image from 'next/image';
import { 
  Play, 
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-white bg-[#06122b] selection:bg-cyan-500/30">
      {/* 1) HEADER FIXO PREMIUM */}
      <header className="fixed top-0 max-w-[480px] w-full mx-auto left-0 right-0 z-[100] flex items-center justify-between px-5 h-16 bg-[#06122b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center font-black text-white italic text-[10px] shadow-lg shadow-orange-500/20">
            BP
          </div>
          <span className="font-black tracking-tighter text-[15px] uppercase italic bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            BLOCK PIX
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[11px] font-bold text-white/60 uppercase tracking-widest hover:text-white transition-colors py-1.5 px-3 rounded-lg border border-cyan-500/30 bg-transparent shadow-sm">
            ENTRAR
          </button>
          <Button size="sm" className="bg-gradient-to-r from-[#7b61ff] to-[#5a42d8] text-white hover:opacity-90 px-4 h-9 font-black text-[10px] uppercase tracking-wider rounded-full glow-purple">
            CRIAR CONTA
          </Button>
        </div>
      </header>

      <main className="flex-1 pt-20 px-6 pb-20 space-y-8 w-full">
        {/* 2) HERO SECTION */}
        <section className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a2046]/80 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-widest backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-white">3.083</span> jogadores online
            </div>
          </div>

          <h1 className="text-3xl font-[900] tracking-tight text-white uppercase text-center leading-[1.1]">
            ENCAIXE OS BLOCOS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#35f59a] to-[#26d9ff] font-black">
              E GANHE R$
            </span>
          </h1>

          {/* CARD DO JOGO (HERO BANNER) */}
          <div className="relative w-full aspect-[4/5] bg-[#0b1d3f] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-float group">
            <Image 
              src="https://picsum.photos/seed/gameplay/600/800" 
              alt="Block Blast Game" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              data-ai-hint="game screen block blast"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <div className="bg-black/40 backdrop-blur-md self-start px-3 py-1 rounded-full border border-white/5">
                <span className="text-[9px] text-white/60 uppercase tracking-[0.2em] font-bold">
                  Experiência visual demonstrativa
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3) BOTÕES DE AÇÃO */}
        <section className="space-y-4">
          <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] hover:opacity-90 text-slate-950 font-black text-base glow-green transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wide animate-shine flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 fill-current" />
              <div className="text-left">
                <div className="font-black text-sm tracking-wide">JOGAR GRÁTIS</div>
                <div className="text-[9px] opacity-70 font-medium">Abrir modo demonstração</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#7b61ff] to-[#6366f1] hover:opacity-90 text-white font-black text-base glow-purple transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wide flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">+</div>
              <div className="text-left">
                <div className="font-black text-sm tracking-wide">CRIAR CONTA</div>
                <div className="text-[9px] opacity-70 font-medium">Comece em poucos segundos</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="text-center pt-1">
            <a href="#" className="text-white/40 hover:text-cyan-400 transition-colors text-[11px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-1">
              Já tenho conta <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </section>

        {/* 4) CARDS DE ESTATÍSTICAS */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'JOGADORES NA ARENA', value: '1.933' },
            { label: 'PRÊMIOS HOJE', value: 'R$ 8.523' },
            { label: 'MAIOR PRÊMIO HOJE', value: 'R$ 987' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0b1d3f]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-cyan-400 tracking-tight">{stat.value}</span>
              <span className="text-[7px] font-black text-white/40 uppercase tracking-tight mt-1 leading-tight">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* 5) COMO JOGAR */}
        <section className="space-y-8 pt-4 border-t border-white/5">
          <div className="text-center space-y-1">
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">COMO JOGAR</span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
              Aprenda a faturar em <br/> 4 passos simples
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { 
                step: 1, 
                title: '1. Deposite via PIX', 
                desc: 'Adicione saldo à sua conta de forma rápida e segura para começar a jogar Block Blast.',
                img: 'https://picsum.photos/seed/pix1/500/300'
              },
              { 
                step: 2, 
                title: '2. Escolha sua entrada', 
                desc: 'Defina quanto quer apostar por partida. Quanto maior a entrada, maior a recompensa mínima.',
                img: 'https://picsum.photos/seed/entry1/500/300'
              },
              { 
                step: 3, 
                title: '3. Monte e exploda linhas', 
                desc: 'Encaixe as peças no tabuleiro 8x8. Cada linha ou coluna completa explode e acumula prêmios.',
                img: 'https://picsum.photos/seed/game1/500/300'
              },
              { 
                step: 4, 
                title: '4. Resgate e saque', 
                desc: 'Bateu a meta de 2x? Faça o cashout e retire seus ganhos via PIX na hora.',
                img: 'https://picsum.photos/seed/cashout1/500/300'
              }
            ].map((step) => (
              <Card key={step.step} className="bg-[#0b1d3f]/40 border-white/5 overflow-hidden rounded-[2rem] group border-t border-t-white/5">
                <div className="relative aspect-video w-full bg-slate-950">
                  <Image src={step.img} alt={step.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center font-black text-white text-xs shadow-xl">
                    {step.step}
                  </div>
                </div>
                <CardContent className="p-5 space-y-1">
                  <h3 className="text-xs font-black text-white uppercase tracking-wide">{step.title}</h3>
                  <p className="text-white/40 text-[11px] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 6) DEPOIMENTOS */}
        <section className="space-y-6 pt-4 border-t border-white/5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              QUEM JOGA, RECOMENDA!
            </h2>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.25em]">Resultados reais de jogadores reais</p>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Rafael Martins',
                initials: 'RM',
                text: 'Comecei com R$ 10 e resgatei R$ 20 na primeira partida. O jogo é bom demais, muito fácil. O PIX caiu na hora!',
                role: '✓ Usuário verificado'
              },
              {
                name: 'Camila Souza',
                initials: 'CS',
                text: 'Já era viciado em Block Blast de qualquer forma, agora ainda ganho dinheiro jogando. A tática é resgatar cedo e não ser ganancioso.',
                role: '✓ Usuário verificado'
              },
              {
                name: 'Bruno Lima',
                initials: 'BL',
                text: 'Interface limpa, sem enrolação. Depositei, joguei e saquei no mesmo dia. Cada linha que explode é muito satisfatório.',
                role: '✓ Usuário verificado'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-[#0b1d3f]/50 border-white/5 p-5 rounded-[2rem] border-l-2 border-l-cyan-500/50">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-[11px] text-white/70 italic mb-4 leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center font-black text-cyan-400 text-[10px] border border-white/10 uppercase">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wide leading-none">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7) CTA FINAL */}
        <section className="py-10 px-5 bg-gradient-to-b from-transparent to-cyan-500/5 rounded-[2.5rem] text-center space-y-5 border border-white/5">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase leading-tight">
              PRONTO PARA <br /> MONTAR E GANHAR?
            </h2>
            <p className="text-white/40 text-[11px] font-medium max-w-[240px] mx-auto leading-relaxed">
              Crie sua conta grátis, deposite a partir de R$ 20 e comece agora mesmo.
            </p>
          </div>

          <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#35f59a] to-[#26d9ff] text-slate-950 font-black text-sm shadow-xl glow-green transition-all uppercase tracking-widest animate-shine">
            CRIAR CONTA GRÁTIS
          </Button>

          <div className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-bold">
            Cadastro rápido • experiência demonstrativa
          </div>
        </section>
      </main>

      {/* 8) FOOTER */}
      <footer className="px-6 py-8 border-t border-white/5 space-y-4 text-center bg-black/20">
        <div className="flex justify-center items-center gap-2 opacity-50">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-600 rounded flex items-center justify-center font-black text-white italic text-[8px]">
            BP
          </div>
          <span className="font-black tracking-tighter text-[10px] uppercase italic text-white">Block Pix</span>
        </div>
        
        <div className="space-y-1">
          <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">
            &copy; 2026 Block Pix. Todos os direitos reservados.
          </p>
          <div className="text-white/10 text-[8px] font-black uppercase tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed">
            Jogue com responsabilidade. Proibido para menores de 18 anos.
          </div>
        </div>
      </footer>
    </div>
  );
}
