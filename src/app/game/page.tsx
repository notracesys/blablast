'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coins, Trophy, Info, Volume2, VolumeX } from 'lucide-react';
import { GameAudio } from './audios';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMutedState, setIsMutedState] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    GameAudio.preload();
    GameAudio.playMusic();
    setIsMutedState(GameAudio.isMuted());

    const BOARD_SIZE = 8;
    const PREVIEW_CELL_SIZE = 20;
    const PREVIEW_MAX_SIZE = 76;
    const PIECE_SLOTS = 3;
    const BET_AMOUNT = 10;
    const MAX_WIN_AMOUNT = 50;
    const SCORE_TO_BRL_DIVISOR = 100;

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
      { matrix: [[0, 1, 1], [1, 1, 0]], complexity: 3 },
      { matrix: [[1, 0, 0], [1, 1, 1]], complexity: 3 },
      { matrix: [[0, 0, 1], [1, 1, 1]], complexity: 3 },
      { matrix: [[1, 1, 1], [1, 0, 0]], complexity: 3 },
      { matrix: [[1, 1, 1], [0, 0, 1]], complexity: 3 },
      { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], complexity: 4 },
      { matrix: [[1, 0, 1], [1, 1, 1]], complexity: 4 },
      { matrix: [[1, 1, 1], [1, 0, 1]], complexity: 4 },
      { matrix: [[1, 1, 0], [0, 1, 1], [0, 1, 0]], complexity: 4 },
      { matrix: [[0, 1, 1], [1, 1, 0], [0, 1, 0]], complexity: 4 },
      { matrix: [[1, 1], [1, 1], [1, 0]], complexity: 4 },
      { matrix: [[1, 1], [1, 1], [0, 1]], complexity: 4 },
      { matrix: [[1, 0, 0], [1, 1, 0], [0, 1, 1]], complexity: 4 },
      { matrix: [[0, 0, 1], [0, 1, 1], [1, 1, 0]], complexity: 4 },
      { matrix: [[1, 1, 1, 1], [0, 0, 1, 0]], complexity: 4 },
      { matrix: [[0, 0, 1, 0], [1, 1, 1, 1]], complexity: 4 },
      { matrix: [[0, 1, 1], [1, 1, 0], [1, 0, 0]], complexity: 4 },
      { matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 1]], complexity: 4 },
      { matrix: [[1, 1, 1], [1, 0, 0], [1, 1, 1]], complexity: 4 },
      { matrix: [[1, 1, 1], [0, 0, 1], [1, 1, 1]], complexity: 4 },
      { matrix: [[1, 1, 1, 1], [0, 0, 0, 1]], complexity: 4 },
      { matrix: [[1, 1, 1, 1], [1, 0, 0, 0]], complexity: 4 },
      { matrix: [[1, 0, 0, 0], [1, 1, 1, 1]], complexity: 4 },
      { matrix: [[0, 0, 0, 1], [1, 1, 1, 1]], complexity: 4 }
    ];

    const COLOR_PALETTES = [
      { h: 208, s: 95, l: 56 }, { h: 128, s: 68, l: 48 }, { h: 276, s: 88, l: 60 },
      { h: 45, s: 100, l: 55 }, { h: 2, s: 88, l: 56 }, { h: 190, s: 92, l: 50 },
      { h: 330, s: 88, l: 60 }, { h: 24, s: 96, l: 55 }, { h: 158, s: 78, l: 44 },
      { h: 250, s: 82, l: 62 }, { h: 98, s: 72, l: 48 }, { h: 348, s: 84, l: 62 }
    ];

    let CELL_SIZE = 36;
    const gameState = {
      board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
      shapes: [],
      score: 0,
      lines: 0,
      level: 1,
      isPaused: false,
      isGameOver: false,
      hintActive: false,
      dragging: null as any,
      clearingLines: {
        rows: [] as number[],
        cols: [] as number[],
        animationTime: 0,
        isAnimating: false
      }
    };

    let boardCanvas = document.getElementById('gameBoard') as HTMLCanvasElement | null;
    let boardCtx = boardCanvas ? boardCanvas.getContext('2d') : null;
    let dragGhost: HTMLDivElement | null = null;
    let dragRafId: number | null = null;
    let pendingPointerX = 0;
    let pendingPointerY = 0;

    function formatBRL(value: number) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }

    function generateColor() {
      const c = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      return {
        primary: `hsl(${c.h}, ${c.s}%, ${c.l}%)`,
        secondary: `hsl(${c.h}, ${c.s}%, ${c.l - 8}%)`,
        tertiary: `hsl(${c.h}, ${c.s}%, ${c.l - 15}%)`
      };
    }

    function getShapePivot(shape: any) {
      const matrix = shape.matrix;
      const rows = matrix.length;
      const cols = matrix[0].length;
      const centerRow = Math.ceil((rows - 1) / 2);
      const centerCol = Math.ceil((cols - 1) / 2);
      let closestRow = centerRow, closestCol = centerCol, minDistance = Infinity;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 1) {
            const d = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
            if (d < minDistance) {
              minDistance = d;
              closestRow = row;
              closestCol = col;
            }
          }
        }
      }
      return { row: closestRow, col: closestCol };
    }

    function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
      const r = Math.max(0, Math.min(radius, w / 2, h / 2));
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
        return;
      }
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function paintTile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, radius: number, color: any, glow: number) {
      ctx.shadowColor = color.primary;
      ctx.shadowBlur = glow;
      ctx.globalAlpha = 1;

      const body = ctx.createLinearGradient(x, y, x, y + size);
      body.addColorStop(0, color.primary);
      body.addColorStop(0.45, color.secondary);
      body.addColorStop(1, color.tertiary);
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.shadowBlur = 0;

      const gloss = ctx.createLinearGradient(x, y, x, y + size * 0.4);
      gloss.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gloss.addColorStop(1, 'rgba(255, 255, 255, 0)');
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.fillStyle = gloss;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.stroke();
    }

    function drawEmptyCell(ctx: CanvasRenderingContext2D, x: number, y: number, gradient: CanvasGradient) {
      const size = CELL_SIZE - 4;
      const radius = CELL_SIZE * 0.2;
      roundedRectPath(ctx, x + 2, y + 2, size, size, radius);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      roundedRectPath(ctx, x + 2, y + 2, size, size, radius);
      ctx.stroke();
    }

    function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: any) {
      const size = CELL_SIZE - 4;
      paintTile(ctx, x + 2, y + 2, size, CELL_SIZE * 0.2, color, 4);
    }

    function drawShape(ctx: CanvasRenderingContext2D, matrix: number[][], color: any, offsetX: number, offsetY: number, size: number) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const cellSize = size / Math.max(rows, cols);
      const pad = Math.min(2, cellSize * 0.1);
      const boxSize = cellSize - pad * 2;
      const radius = cellSize * 0.2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 1) {
            const x = offsetX + col * cellSize + pad;
            const y = offsetY + row * cellSize + pad;
            paintTile(ctx, x, y, boxSize, radius, color, 2);
          }
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function drawBreakingCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: any, progress: number) {
      const scale = 1 - progress * 0.5;
      const opacity = 1 - progress;

      ctx.save();
      ctx.translate(x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      const cellX = -CELL_SIZE / 2 + 2;
      const cellY = -CELL_SIZE / 2 + 2;
      const cellSize = CELL_SIZE - 4;
      const radius = CELL_SIZE * 0.2;
      
      roundedRectPath(ctx, cellX, cellY, cellSize, cellSize, radius);
      ctx.fillStyle = color.primary;
      ctx.fill();
      ctx.restore();
    }

    function canPlaceShape(shape: any, x: number, y: number) {
      const matrix = shape.matrix;
      const rows = matrix.length;
      const cols = matrix[0].length;

      if (x + cols > BOARD_SIZE || y + rows > BOARD_SIZE || x < 0 || y < 0) return false;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 1) {
            if (gameState.board[y + row][x + col] !== 0) return false;
          }
        }
      }
      return true;
    }

    function findLinesToClear() {
      const rowsToClear = [];
      const colsToClear = [];

      for (let row = 0; row < BOARD_SIZE; row++) {
        let isFull = true;
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (gameState.board[row][col] === 0) {
            isFull = false;
            break;
          }
        }
        if (isFull) rowsToClear.push(row);
      }

      for (let col = 0; col < BOARD_SIZE; col++) {
        let isFull = true;
        for (let row = 0; row < BOARD_SIZE; row++) {
          if (gameState.board[row][col] === 0) {
            isFull = false;
            break;
          }
        }
        if (isFull) colsToClear.push(col);
      }
      return { rowsToClear, colsToClear };
    }

    function clearLines() {
      const { rowsToClear, colsToClear } = findLinesToClear();
      const clearedCount = rowsToClear.length + colsToClear.length;

      if (clearedCount === 0) return 0;

      GameAudio.play('clear');

      gameState.clearingLines.rows = rowsToClear;
      gameState.clearingLines.cols = colsToClear;
      gameState.clearingLines.isAnimating = true;
      gameState.clearingLines.animationTime = 0;

      const duration = 300;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        gameState.clearingLines.animationTime = progress;
        render();
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          rowsToClear.forEach(row => {
            for (let col = 0; col < BOARD_SIZE; col++) gameState.board[row][col] = 0;
          });
          colsToClear.forEach(col => {
            for (let row = 0; row < BOARD_SIZE; row++) gameState.board[row][col] = 0;
          });
          gameState.lines += clearedCount;
          gameState.level = Math.floor(gameState.lines / 10) + 1;
          gameState.clearingLines.isAnimating = false;
          updateUI();
          render();
          checkGameOver();
        }
      }
      requestAnimationFrame(animate);
      return clearedCount;
    }

    function placeShape(shapeIndex: number, x: number, y: number) {
      const shape = gameState.shapes[shapeIndex] as any;
      if (!shape || !canPlaceShape(shape, x, y)) return;

      const blocksPlaced = shape.matrix.flat().filter((cell: number) => cell === 1).length;
      for (let row = 0; row < shape.matrix.length; row++) {
        for (let col = 0; col < shape.matrix[0].length; col++) {
          if (shape.matrix[row][col] === 1) {
            gameState.board[y + row][x + col] = { color: shape.color };
          }
        }
      }

      gameState.shapes.splice(shapeIndex, 1);
      
      GameAudio.play('encaixe');

      const linesCleared = clearLines();
      gameState.score += blocksPlaced * gameState.level * 10;
      if (linesCleared > 0) gameState.score += linesCleared * gameState.level * 100;

      if (gameState.shapes.length === 0) {
        generateShapes(PIECE_SLOTS);
      } else {
        renderShapes();
        if (linesCleared === 0) checkGameOver();
      }
      updateUI();
      render();
    }

    function checkGameOver() {
      if (gameState.shapes.length === 0) return;

      for (let i = 0; i < gameState.shapes.length; i++) {
        const shape = gameState.shapes[i] as any;
        for (let y = 0; y <= BOARD_SIZE - shape.matrix.length; y++) {
          for (let x = 0; x <= BOARD_SIZE - shape.matrix[0].length; x++) {
            if (canPlaceShape(shape, x, y)) return;
          }
        }
      }
      gameState.isGameOver = true;
      
      GameAudio.play('derrota');
      
      document.getElementById('gameOverModal')?.classList.add('show');
    }

    function generateShapes(count: number) {
      gameState.shapes = [] as any;
      for (let i = 0; i < count; i++) {
        const def = SHAPE_DEFINITIONS[Math.floor(Math.random() * SHAPE_DEFINITIONS.length)];
        gameState.shapes.push({ id: i, matrix: def.matrix, color: generateColor() } as any);
      }
      renderShapes();
    }

    function drawPlacementPreview(shape: any, x: number, y: number) {
      if (!boardCtx) return;
      const matrix = shape.matrix;
      const rows = matrix.length;
      const cols = matrix[0].length;
      const inside = x >= 0 && y >= 0 && x + cols <= BOARD_SIZE && y + rows <= BOARD_SIZE;
      const canFit = inside ? canPlaceShape(shape, x, y) : false;

      const theme = canFit ? {
        fillTop: 'rgba(38, 217, 255, 0.15)',
        fillBottom: 'rgba(53, 245, 154, 0.1)',
        edge: '#35f59a'
      } : {
        fillTop: 'rgba(231, 59, 41, 0.2)',
        fillBottom: 'rgba(169, 22, 25, 0.1)',
        edge: '#e73b29'
      };

      const pad = 2;
      const size = CELL_SIZE - pad * 2;
      const radius = CELL_SIZE * 0.2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] !== 1) continue;
          const boardCol = x + col;
          const boardRow = y + row;
          if (boardCol < 0 || boardRow < 0 || boardCol >= BOARD_SIZE || boardRow >= BOARD_SIZE) continue;

          const cellX = boardCol * CELL_SIZE;
          const cellY = boardRow * CELL_SIZE;

          boardCtx.fillStyle = theme.fillTop;
          roundedRectPath(boardCtx, cellX + pad, cellY + pad, size, size, radius);
          boardCtx.fill();

          boardCtx.strokeStyle = theme.edge;
          boardCtx.lineWidth = 1.5;
          roundedRectPath(boardCtx, cellX + pad, cellY + pad, size, size, radius);
          boardCtx.stroke();
        }
      }
    }

    function render() {
      if (!boardCtx || !boardCanvas) return;

      boardCtx.fillStyle = '#0a0f1d';
      boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

      const emptyTileGradient = boardCtx.createLinearGradient(0, 0, 0, CELL_SIZE);
      emptyTileGradient.addColorStop(0, '#121829');
      emptyTileGradient.addColorStop(1, '#0b0e1a');

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          boardCtx.save();
          boardCtx.translate(col * CELL_SIZE, row * CELL_SIZE);
          drawEmptyCell(boardCtx, 0, 0, emptyTileGradient);
          boardCtx.restore();
        }
      }

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = gameState.board[row][col];
          if (cell !== 0 && cell !== null) {
            const isClearing = gameState.clearingLines.rows.includes(row) || gameState.clearingLines.cols.includes(col);
            if (isClearing && gameState.clearingLines.isAnimating) {
              drawCell(boardCtx, col * CELL_SIZE, row * CELL_SIZE, cell.color);
            } else {
              drawCell(boardCtx, col * CELL_SIZE, row * CELL_SIZE, cell.color);
            }
          }
        }
      }
    }

    function renderShapes() {
      const shapesList = document.getElementById('shapesList');
      if (!shapesList) return;
      shapesList.innerHTML = '';

      for (let index = 0; index < PIECE_SLOTS; index++) {
        const shape = gameState.shapes[index] as any;
        const shapeItem = document.createElement('div');
        shapeItem.className = 'shape-item bg-[#121829]/60 border border-white/5 rounded-xl aspect-square flex items-center justify-center cursor-grab select-none relative overflow-hidden transition-transform duration-150 active:scale-95';
        shapeItem.dataset.shapeIndex = String(index);

        if (!shape) {
          shapeItem.classList.add('opacity-10');
          shapesList.appendChild(shapeItem);
          continue;
        }

        const canvas = document.createElement('canvas');
        canvas.className = 'shape-canvas pointer-events-none max-w-[80%] max-h-[80%]';
        const matrix = shape.matrix;
        const cols = matrix[0].length;
        const rows = matrix.length;
        const cellSize = Math.max(PREVIEW_CELL_SIZE, Math.floor(PREVIEW_MAX_SIZE / Math.max(rows, cols)));
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawShape(ctx, matrix, shape.color, 0, 0, Math.max(cols, rows) * cellSize);
        }

        shapeItem.appendChild(canvas);
        shapesList.appendChild(shapeItem);
        setupDragAndDrop(shapeItem, shape, index);
      }
    }

    function setupDragAndDrop(shapeItem: HTMLDivElement, shape: any, shapeIndex: number) {
      function startDrag(clientX: number, clientY: number) {
        if (gameState.isPaused || gameState.isGameOver) return;
        
        GameAudio.unlock();
        GameAudio.play('selection');
        
        gameState.dragging = { shape, shapeIndex, shapeItem };
        shapeItem.classList.add('opacity-30');
        createDragGhost(shape);
        updateDragGhost(clientX, clientY);
      }

      shapeItem.addEventListener('mousedown', (e) => {
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
      });

      shapeItem.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      });
    }

    function createDragGhost(shape: any) {
      if (dragGhost) dragGhost.remove();
      if (!boardCanvas) return;

      const rect = boardCanvas.getBoundingClientRect();
      const actualCellSize = rect.width / BOARD_SIZE;
      
      dragGhost = document.createElement('div');
      dragGhost.className = 'drag-ghost';
      dragGhost.style.cssText = 'display:block;position:fixed;left:0;top:0;pointer-events:none;z-index:2000;opacity:0.85;will-change:transform;';

      const canvas = document.createElement('canvas');
      const matrix = shape.matrix;
      const cols = matrix[0].length;
      const rows = matrix.length;
      const size = Math.max(cols, rows);

      canvas.width = size * actualCellSize;
      canvas.height = size * actualCellSize;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShape(ctx, matrix, shape.color, 0, 0, size * actualCellSize);
      }

      dragGhost.appendChild(canvas);
      document.body.appendChild(dragGhost);
    }

    function updateDragGhost(clientX: number, clientY: number) {
      if (!dragGhost || !gameState.dragging) return;
      const shape = gameState.dragging.shape;
      const pivot = getShapePivot(shape);
      if (!boardCanvas) return;
      const rect = boardCanvas.getBoundingClientRect();
      const actualCellSize = rect.width / BOARD_SIZE;
      const pivotOffsetX = pivot.col * actualCellSize + actualCellSize / 2;
      const pivotOffsetY = pivot.row * actualCellSize + actualCellSize / 2;
      
      dragGhost.style.display = 'block';
      dragGhost.style.transform = `translate(${clientX - pivotOffsetX}px, ${clientY - pivotOffsetY}px)`;
    }

    function onDragMove(clientX: number, clientY: number) {
      if (!gameState.dragging || !boardCanvas) return;
      pendingPointerX = clientX;
      pendingPointerY = clientY;

      if (dragRafId == null) {
        dragRafId = requestAnimationFrame(() => {
          dragRafId = null;
          if (!gameState.dragging || !boardCanvas) return;
          updateDragGhost(pendingPointerX, pendingPointerY);

          const rect = boardCanvas.getBoundingClientRect();
          const actualCellSize = rect.width / BOARD_SIZE;
          const mouseX = pendingPointerX - rect.left;
          const mouseY = pendingPointerY - rect.top;
          const x = Math.floor(mouseX / actualCellSize);
          const y = Math.floor(mouseY / actualCellSize);
          const shape = gameState.dragging.shape;
          const pivot = getShapePivot(shape);
          const placeX = x - pivot.col;
          const placeY = y - pivot.row;

          render();
          drawPlacementPreview(shape, placeX, placeY);
        });
      }
    }

    function onDragEnd(clientX: number, clientY: number) {
      if (!gameState.dragging || !boardCanvas) return;
      if (dragRafId != null) {
        cancelAnimationFrame(dragRafId);
        dragRafId = null;
      }

      const rect = boardCanvas.getBoundingClientRect();
      const actualCellSize = rect.width / BOARD_SIZE;
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      const cellX = Math.floor(mouseX / actualCellSize);
      const cellY = Math.floor(mouseY / actualCellSize);
      const shape = gameState.dragging.shape;
      const pivot = getShapePivot(shape);
      const placeX = cellX - pivot.col;
      const placeY = cellY - pivot.row;

      if (placeX >= 0 && placeY >= 0 && placeX <= BOARD_SIZE - shape.matrix[0].length && placeY <= BOARD_SIZE - shape.matrix.length && canPlaceShape(shape, placeX, placeY)) {
        placeShape(gameState.dragging.shapeIndex, placeX, placeY);
      } else {
        GameAudio.play('broken');
      }

      if (gameState.dragging.shapeItem) gameState.dragging.shapeItem.classList.remove('opacity-30');
      if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
      }
      gameState.dragging = null;
      render();
    }

    function updateUI() {
      const prizeEl = document.getElementById('prizeValue');
      const barEl = document.getElementById('winProgressBar');
      const prize = gameState.score / SCORE_TO_BRL_DIVISOR;

      if (prizeEl) prizeEl.textContent = formatBRL(prize);

      const progress = Math.min(100, (prize / MAX_WIN_AMOUNT) * 100);
      if (barEl) barEl.style.width = progress.toFixed(2) + '%';

      const betEl = document.getElementById('betValue');
      const maxWinEl = document.getElementById('maxWinValue');
      if (betEl) betEl.textContent = formatBRL(BET_AMOUNT);
      if (maxWinEl) maxWinEl.textContent = formatBRL(MAX_WIN_AMOUNT);
    }

    function resizeCanvas() {
      if (!boardCanvas) return;
      const container = boardCanvas.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const availableSize = Math.min(containerRect.width || 320, containerRect.height || 320);
      let cellSize = Math.floor(availableSize / BOARD_SIZE);
      if (cellSize < 20) cellSize = 20;
      CELL_SIZE = cellSize;

      const canvasSize = cellSize * BOARD_SIZE;
      boardCanvas.width = canvasSize;
      boardCanvas.height = canvasSize;
      boardCanvas.style.width = canvasSize + 'px';
      boardCanvas.style.height = canvasSize + 'px';
      render();
    }

    function restartGame() {
      GameAudio.unlock();
      GameAudio.play('swtch');

      if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
      }
      gameState.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
      gameState.shapes = [];
      gameState.score = 0;
      gameState.lines = 0;
      gameState.level = 1;
      gameState.isGameOver = false;

      generateShapes(PIECE_SLOTS);
      updateUI();
      document.getElementById('gameOverModal')?.classList.remove('show');
      render();
    }

    function setupEventListeners() {
      document.addEventListener('mousemove', (e) => {
        if (gameState.dragging) onDragMove(e.clientX, e.clientY);
      }, { passive: true });

      document.addEventListener('mouseup', (e) => {
        if (gameState.dragging) {
          onDragEnd(e.clientX, e.clientY);
          e.preventDefault();
        }
      });

      document.addEventListener('touchmove', (e) => {
        if (gameState.dragging && e.touches.length === 1) {
          onDragMove(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
        }
      }, { passive: false });

      document.addEventListener('touchend', (e) => {
        if (gameState.dragging && e.changedTouches?.length > 0) {
          onDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          e.preventDefault();
        }
      }, { passive: false });

      const restartBtn = document.getElementById('restartBtn');
      if (restartBtn) restartBtn.onclick = restartGame;
    }

    boardCanvas = document.getElementById('gameBoard') as HTMLCanvasElement | null;
    boardCtx = boardCanvas ? boardCanvas.getContext('2d') : null;
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    generateShapes(PIECE_SLOTS);
    setupEventListeners();
    updateUI();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (dragGhost) dragGhost.remove();
      GameAudio.stopMusic();
    };
  }, []);

  const toggleSound = () => {
    GameAudio.unlock();
    const currentMute = GameAudio.isMuted();
    GameAudio.setMuted(!currentMute);
    setIsMutedState(!currentMute);
    GameAudio.play('swtch');
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen text-white select-none flex flex-col justify-between p-4 bg-[#050814] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/fundo1.png')" }} onClick={() => GameAudio.unlock()} onTouchStart={() => GameAudio.unlock()}>
      <header className="w-full flex items-center justify-between h-14 max-w-[430px] mx-auto">
        <Link href="/" className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-[#0f1322]/80 backdrop-blur-sm text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <span className="text-base font-black tracking-widest text-white">
          BLOCK CASH
        </span>

        <div className="flex items-center gap-2">
          <button onClick={toggleSound} className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-[#0f1322]/80 backdrop-blur-sm text-white">
            {isMutedState ? <VolumeX className="w-5 h-5 opacity-50" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <span className="px-2 py-0.5 rounded-md border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 text-[9px] font-black tracking-wider uppercase">
            TESTE
          </span>
        </div>
      </header>

      <main className="w-full max-w-[430px] mx-auto flex flex-col gap-3 flex-1 justify-center">
        <section className="grid grid-cols-2 gap-2">
          <article className="p-3 rounded-xl border border-white/5 bg-[#0f1322]/70 backdrop-blur-sm flex flex-col gap-0.5">
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Aposta demo</span>
            <strong id="betValue" className="text-base font-bold text-white">R$ 10,00</strong>
          </article>

          <article className="p-3 rounded-xl border border-white/5 bg-[#0f1322]/70 backdrop-blur-sm flex flex-col gap-0.5">
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Prêmio máximo</span>
            <strong id="maxWinValue" className="text-base font-bold text-cyan-400">R$ 50,00</strong>
          </article>
        </section>

        <section className="text-center bg-[#0f1322]/70 backdrop-blur-sm border border-white/5 rounded-xl p-3 flex flex-col items-center">
          <small className="text-[9px] font-bold uppercase text-white/40 tracking-wider mb-0.5">Progresso da partida</small>
          <strong id="prizeValue" className="text-2xl font-black text-white tracking-tight mb-2">
            R$ 0,00
          </strong>
          <div id="winProgress" className="h-1.5 w-full bg-[#171c2c] rounded-full overflow-hidden">
            <div id="winProgressBar" className="h-full w-0 bg-cyan-400 rounded-full"></div>
          </div>
        </section>

        <section className="w-full aspect-square p-1.5 bg-[#0f1322]/40 backdrop-blur-sm border border-white/5 rounded-2xl flex items-center justify-center">
          <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-[#0a0f1d]/90">
            <canvas id="gameBoard" className="w-full h-full touch-none block" aria-label="Tabuleiro 8 por 8"></canvas>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2" id="shapesList" aria-label="Peças disponíveis"></section>
        
        <div className="flex items-center justify-center gap-1.5 max-w-[360px] mx-auto text-center">
          <Info className="w-3 h-3 text-white/30 shrink-0" />
          <p className="text-[10px] text-white/40 font-medium">Arraste uma peça para o tabuleiro e complete linhas.</p>
        </div>
      </main>

      <div className="modal-overlay fixed inset-0 hidden place-items-center p-4 bg-black/80 backdrop-blur-sm z-[3000]" id="gameOverModal">
        <div className="modal-content w-full max-w-xs p-6 text-center border border-white/10 rounded-2xl bg-[#0f1322]">
          <h2 className="text-xl font-black text-white uppercase tracking-wide mb-1">Fim de jogo</h2>
          <p className="text-white/60 text-xs mb-5">Não há mais encaixes disponíveis para as peças atuais.</p>
          <button id="restartBtn" className="w-full h-11 rounded-lg font-bold text-sm bg-cyan-400 text-slate-950 transition-transform mb-3">
            Jogar de novo
          </button>
          <Link href="/" className="w-full h-11 rounded-lg font-medium text-xs flex items-center justify-center border border-white/10 text-white">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
