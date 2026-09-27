'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, AlertCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Definições de peças portadas do arquivo config.js original
const SHAPE_DEFINITIONS = [
  { matrix: [[1]], complexity: 0 },
  { matrix: [[1, 1]], complexity: 1 },
  { matrix: [[1], [1]], complexity: 1 },
  { matrix: [[1, 0], [1, 1]], complexity: 2 },
  { matrix: [[0, 1], [1, 1]], complexity: 2 },
  { matrix: [[1, 1], [1, 0]], complexity: 2 },
  { matrix: [[1, 1], [0, 1]], complexity: 2 },
  { matrix: [[1, 1, 1]], complexity: 2 },
  { matrix: [[1], [1], [1]], complexity: 2 },
  { matrix: [[1, 1, 1], [0, 1, 0]], complexity: 3 },
  { matrix: [[0, 1, 0], [1, 1, 1]], complexity: 3 },
  { matrix: [[1, 0], [1, 1], [1, 0]], complexity: 3 },
  { matrix: [[0, 1], [1, 1], [0, 1]], complexity: 3 },
  { matrix: [[1, 1], [1, 1]], complexity: 3 },
  { matrix: [[1, 1, 1, 1]], complexity: 3 },
  { matrix: [[1], [1], [1], [1]], complexity: 3 },
  { matrix: [[1, 1, 0], [0, 1, 1]], complexity: 3 },
  { matrix: [[0, 1, 1], [1, 1, 0]], complexity: 3 }
];

const COLOR_PALETTES = [
  { h: 208, s: 95, l: 56 }, // Azul
  { h: 128, s: 68, l: 48 }, // Verde dinheiro
  { h: 276, s: 88, l: 60 }, // Roxo
  { h: 45, s: 100, l: 55 }, // Ouro
  { h: 2, s: 88, l: 56 },  // Vermelho
  { h: 190, s: 92, l: 50 }  // Ciano
];

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Estados do Jogo
  const [board, setBoard] = useState<any[][]>(Array(8).fill(null).map(() => Array(8).fill(0)));
  const [shapes, setShapes] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hintActive, setHintActive] = useState<boolean>(false);
  
  // Estado de Arrastar (Mobile e Desktop)
  const [draggingShapeIndex, setDraggingShapeIndex] = useState<number | null>(null);

  // Inicializar formas se estiver vazio
  useEffect(() => {
    if (shapes.length === 0 && !isGameOver) {
      generateNewNewShapes();
    }
  }, [shapes, isGameOver]);

  // Desenhar Tabuleiro no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / 8;

    // Fundo limpo azul escuro portado do design original
    ctx.fillStyle = '#020817';
    ctx.fillRect(0, 0, size, size);

    // Desenhar Grid de Fundo Glossy
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        
        ctx.strokeStyle = 'rgba(35, 230, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

        const currentCell = board[r][c];
        if (currentCell !== 0 && currentCell !== null) {
          // Bloco preenchido com gradiente e brilho gel
          const grad = ctx.createLinearGradient(x, y, x, y + cellSize);
          grad.addColorStop(0, currentCell.primary || '#23e6ff');
          grad.addColorStop(1, currentCell.tertiary || '#03183f');
          
          ctx.fillStyle = grad;
          ctx.fillRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
          
          // Brilho de reflexo premium no topo do bloco
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(x + 3, y + 3, cellSize - 6, (cellSize - 6) * 0.4);
        }
      }
    }

    // Desenhar sugestão de dica (Hint) se ativado
    if (hintActive && shapes.length > 0) {
      const firstShape = shapes[0];
      let found = false;
      for (let r = 0; r <= 8 - firstShape.matrix.length && !found; r++) {
        for (let c = 0; c <= 8 - firstShape.matrix[0].length && !found; c++) {
          if (canPlaceShape(firstShape, c, r, board)) {
            // Desenha um quadrado de preview ciano brilhante
            ctx.strokeStyle = '#23e6ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(c * cellSize + 4, r * cellSize + 4, firstShape.matrix[0].length * cellSize - 8, firstShape.matrix.length * cellSize - 8);
            found = true;
          }
        }
      }
    }

  }, [board, hintActive, shapes]);

  // Função auxiliar de cores
  const generateColor = () => {
    const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    return {
      primary: `hsl(${palette.h}, ${palette.s}%, ${palette.l}%)`,
      secondary: `hsl(${palette.h}, ${palette.s}%, ${palette.l - 8}%)`,
      tertiary: `hsl(${palette.h}, ${palette.s}%, ${palette.l - 15}%)`
    };
  };

  const generateNewNewShapes = () => {
    const newShapes = [];
    for (let i = 0; i < 3; i++) {
      const randomDef = SHAPE_DEFINITIONS[Math.floor(Math.random() * SHAPE_DEFINITIONS.length)];
      newShapes.push({
        matrix: randomDef.matrix,
        color: generateColor()
      });
    }
    setShapes(newShapes);
    checkGameOverState(newShapes, board);
  };

  const canPlaceShape = (shape: any, startX: number, startY: number, currentBoard: any[][]) => {
    const matrix = shape.matrix;
    if (startY + matrix.length > 8 || startX + matrix[0].length > 8) return false;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[0].length; c++) {
        if (matrix[r][c] === 1) {
          if (currentBoard[startY + r][startX + c] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const checkGameOverState = (currentShapes: any[], currentBoard: any[][]) => {
    if (currentShapes.length === 0) return;
    
    for (let i = 0; i < currentShapes.length; i++) {
      const shape = currentShapes[i];
      for (let r = 0; r <= 8 - shape.matrix.length; r++) {
        for (let c = 0; c <= 8 - shape.matrix[0].length; c++) {
          if (canPlaceShape(shape, c, r, currentBoard)) {
            return; // Encontrou lugar válido
          }
        }
      }
    }
    setIsGameOver(true);
  };

  // Simular colocação ao clicar na coluna/linha ou via clique direto simulado
  const handleCellClick = (clickX: number, clickY: number) => {
    if (draggingShapeIndex === null || isGameOver) return;
    const currentShape = shapes[draggingShapeIndex];

    if (canPlaceShape(currentShape, clickX, clickY, board)) {
      const newBoard = board.map(row => [...row]);
      
      // Aplicar shape no board
      for (let r = 0; r < currentShape.matrix.length; r++) {
        for (let c = 0; c < currentShape.matrix[0].length; c++) {
          if (currentShape.matrix[r][c] === 1) {
            newBoard[startY + r === undefined ? clickY + r : startY + r][startX + c === undefined ? clickX + c : startX + c] = currentShape.color;
          }
        }
      }

      // Validar linhas e colunas completas para explodir
      let rowsToClear: number[] = [];
      let colsToClear: number[] = [];

      for (let r = 0; r < 8; r++) {
        if (newBoard[r].every(cell => cell !== 0)) rowsToClear.push(r);
      }
      for (let c = 0; c < 8; c++) {
        let colFull = true;
        for (let r = 0; r < 8; r++) {
          if (newBoard[r][c] === 0) colFull = false;
        }
        if (colFull) colsToClear.push(c);
      }

      // Limpar blocos explodidos
      rowsToClear.forEach(r => {
        for (let c = 0; c < 8; c++) newBoard[r][c] = 0;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < 8; r++) newBoard[r][c] = 0;
      });

      const clearedCount = rowsToClear.length + colsToClear.length;
      const points = (currentShape.matrix.flat().filter(b => b === 1).length * 10) + (clearedCount * 100);
      
      setScore(prev => prev + points);
      setLines(prev => prev + clearedCount);
      setLevel(prev => Math.floor((lines + clearedCount) / 10) + 1);
      setBoard(newBoard);

      // Remover peça usada
      const nextShapes = shapes.filter((_, idx) => idx !== draggingShapeIndex);
      setShapes(nextShapes);
      setDraggingShapeIndex(null);
      setHintActive(false);

      // Checar game over com as próximas peças
      if (nextShapes.length > 0) {
        checkGameOverState(nextShapes, newBoard);
      }
    }
  };

  const restartGame = () => {
    setBoard(Array(8).fill(null).map(() => Array(8).fill(0)));
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setDraggingShapeIndex(null);
    setShapes([]);
  };

  // Cálculo fictício de prêmio em BRL baseado no divisor de score (100 pontos = R$ 1,00)
  const currentPrizeBRL = (score / 100);
  const maxWinBRL = 50.00;
  const progressPercent = Math.min(100, (currentPrizeBRL / maxWinBRL) * 100);

  return (
    <div className="flex flex-col min-h-screen text-white bg-[#06122b] px-4 py-6 justify-between select-none">
      
      {/* HEADER DA ARENA */}
      <header className="flex items-center justify-between h-14 border-b border-white/5">
        <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-1.5 bg-[#0a2046] px-3 py-1 rounded-full border border-cyan-500/20 text-xs font-bold text-cyan-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Modo Demonstrativo Teste
        </div>

        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-white/40" />}
        </button>
      </header>

      {/* METRICAS DE APOSTA / SALDO */}
      <section className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-[#0b1d3f] border border-white/10 p-3 rounded-2xl shadow-xl text-center">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Aposta Fixa Demo</span>
          <strong className="text-white text-lg font-black tracking-tight">R$ 10,00</strong>
        </div>
        <div className="bg-[#0b1d3f] border border-emerald-500/20 p-3 rounded-2xl shadow-xl text-center">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Prêmio Máximo</span>
          <strong className="text-emerald-400 text-lg font-black tracking-tight">R$ 50,00</strong>
        </div>
      </section>

      {/* MEDIDOR DE PREMIAÇÃO PROGRESIVO */}
      <section className="bg-[#0b1d3f]/60 border border-white/5 rounded-2xl p-4 mt-4 text-center space-y-2 shadow-2xl">
        <span className="text-xs font-bold text-white/60 uppercase tracking-widest block">Progresso Acumulado</span>
        <div className="text-3xl font-[1000] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_2px_10px_rgba(52,245,154,0.3)]">
          R$ {currentPrizeBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-3 bg-slate-950 rounded-full border border-white/10 overflow-hidden p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_8px_#35f59a] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-white/40 font-bold uppercase">
          <span>Score: {score}</span>
          <span>Nível {level}</span>
        </div>
      </section>

      {/* TABULEIRO DO JOGO (CANVAS 8X8) */}
      <section className="flex justify-center my-6">
        <div className="p-3 bg-gradient-to-b from-[#0b1d3f] to-[#040d21] rounded-[2rem] border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(35,230,255,0.2)]">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <canvas 
              ref={canvasRef} 
              className="block cursor-pointer max-w-full"
              onClick={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cellSize = rect.width / 8;
                const cellX = Math.floor(x / cellSize);
                const cellY = Math.floor(y / cellSize);
                handleCellClick(cellX, cellY);
              }}
            />
          </div>
        </div>
      </section>

      {/* DETALHE DE APOIO */}
      <div className="text-center text-[11px] text-white/40 font-medium mb-2">
        {draggingShapeIndex !== null ? (
          <span className="text-cyan-400 font-bold animate-pulse">Clique em um quadrado no tabuleiro para encaixar a peça selecionada</span>
        ) : (
          <span>Selecione uma das 3 peças abaixo clicando nela e clique no tabuleiro</span>
        )}
      </div>

      {/* BANCO DE PEÇAS DISPONÍVEIS */}
      <section className="grid grid-cols-3 gap-3 bg-slate-950/40 border border-white/5 p-3 rounded-2xl">
        {shapes.map((shape, idx) => (
          <button 
            key={idx}
            onClick={() => setDraggingShapeIndex(idx)}
            className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 relative transition-all ${
              draggingShapeIndex === idx 
                ? 'bg-cyan-500/10 border-cyan-400 glow-cyan scale-105' 
                : 'bg-[#0b1d3f]/40 border-white/10 hover:border-white/20'
            }`}
          >
            {/* Visualização simplificada da matriz da peça */}
            <div className="flex flex-col gap-1">
              {shape.matrix.map((row: number[], rIdx: number) => (
                <div key={rIdx} className="flex gap-1 justify-center">
                  {row.map((cell: number, cIdx: number) => (
                    <div 
                      key={cIdx} 
                      className={`w-3 h-3 rounded-sm ${cell === 1 ? 'shadow-md' : 'opacity-0'}`}
                      style={{ 
                        background: cell === 1 ? `linear-gradient(135deg, ${shape.color.primary}, ${shape.color.tertiary})` : 'transparent' 
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </button>
        ))}
        {shapes.length === 0 && (
          <div className="col-span-3 text-center text-xs py-4 text-white/30 font-bold uppercase tracking-wider">
            Gerando novos blocos...
          </div>
        )}
      </section>

      {/* BOTÕES AUXILIARES */}
      <footer className="grid grid-cols-2 gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setHintActive(!hintActive)}
          className="rounded-xl border-white/10 bg-white/5 font-bold uppercase tracking-wider text-xs h-10 text-cyan-400"
        >
          💡 {hintActive ? 'Ocultar Dica' : 'Usar Dica'}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={restartGame}
          className="rounded-xl border-white/10 bg-white/5 font-bold uppercase tracking-wider text-xs h-10"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar
        </Button>
      </footer>

      {/* MODAL GAME OVER */}
      {isGameOver && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1d3f] border border-cyan-400/40 rounded-[2rem] p-6 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30 text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-[1000] text-white uppercase tracking-tight">Fim de Jogo!</h2>
              <p className="text-white/60 text-xs">Não há mais encaixes disponíveis para as peças atuais no tabuleiro.</p>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl space-y-2 border border-white/5">
              <div className="flex justify-between text-xs text-white/50">
                <span>Score Máximo:</span>
                <span className="font-bold text-white">{score} pts</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Linhas Explodidas:</span>
                <span className="font-bold text-white">{lines}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/5 text-emerald-400 font-bold">
                <span>Prêmio Demo Alcançado:</span>
                <span>R$ {currentPrizeBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Button 
                onClick={restartGame}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 font-black text-slate-950 uppercase tracking-wide text-xs"
              >
                Jogar de Novo
              </Button>
              <Link href="/" className="block">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-bold uppercase tracking-wider text-xs text-white/80"
                >
                  Voltar para a Página Inicial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
