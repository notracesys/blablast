'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { GameAudio } from './audios';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    GameAudio.preload();
    GameAudio.playMusic();

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

      const gloss = ctx.createLinearGradient(x, y, x, y + size * 0.55);
      gloss.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      gloss.addColorStop(0.55, 'rgba(255, 255, 255, 0.07)');
      gloss.addColorStop(1, 'rgba(255, 255, 255, 0)');
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.fillStyle = gloss;
      ctx.fill();

      const shade = ctx.createLinearGradient(x, y + size * 0.6, x, y + size);
      shade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shade.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.fillStyle = shade;
      ctx.fill();

      ctx.strokeStyle = color.primary;
      ctx.lineWidth = Math.max(1, size * 0.05);
      roundedRectPath(ctx, x, y, size, size, radius);
      ctx.stroke();
    }

    function drawEmptyCell(ctx: CanvasRenderingContext2D, x: number, y: number, gradient: CanvasGradient) {
      const size = CELL_SIZE - 4;
      const radius = CELL_SIZE * 0.24;
      roundedRectPath(ctx, x + 2, y + 2, size, size, radius);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(41, 210, 255, 0.24)';
      ctx.lineWidth = 1;
      roundedRectPath(ctx, x + 2, y + 2, size, size, radius);
      ctx.stroke();
    }

    function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: any) {
      const size = CELL_SIZE - 4;
      paintTile(ctx, x + 2, y + 2, size, CELL_SIZE * 0.24, color, 8);
    }

    function drawShape(ctx: CanvasRenderingContext2D, matrix: number[][], color: any, offsetX: number, offsetY: number, size: number) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const cellSize = size / Math.max(rows, cols);
      const pad = Math.min(2, cellSize * 0.1);
      const boxSize = cellSize - pad * 2;
      const radius = cellSize * 0.24;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] === 1) {
            const x = offsetX + col * cellSize + pad;
            const y = offsetY + row * cellSize + pad;
            paintTile(ctx, x, y, boxSize, radius, color, 6);
          }
        }
      }
    }

    function drawBreakingCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: any, progress: number) {
      const shakeIntensity = Math.sin(progress * Math.PI * 8) * (1 - progress) * 8;
      const offsetX = (Math.random() - 0.5) * shakeIntensity * 2;
      const offsetY = (Math.random() - 0.5) * shakeIntensity * 2;
      const scale = 1 - progress * 0.3;
      const opacity = 1 - progress;

      ctx.save();
      ctx.translate(x + CELL_SIZE / 2 + offsetX, y + CELL_SIZE / 2 + offsetY);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      const cellX = -CELL_SIZE / 2 + 2;
      const cellY = -CELL_SIZE / 2 + 2;
      const cellSize = CELL_SIZE - 4;
      const radius = CELL_SIZE * 0.24;
      const gradient = ctx.createLinearGradient(cellX, cellY, cellX, cellY + cellSize);
      gradient.addColorStop(0, color.primary);
      gradient.addColorStop(0.5, color.secondary);
      gradient.addColorStop(1, color.tertiary);
      roundedRectPath(ctx, cellX, cellY, cellSize, cellSize, radius);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = color.primary;
      ctx.lineWidth = 2 + progress * 3;
      roundedRectPath(ctx, cellX, cellY, cellSize, cellSize, radius);
      ctx.stroke();
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

      const boardContainer = document.querySelector('.boardWrap');
      boardContainer?.classList.add('shake');

      const duration = 600;
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
          boardContainer?.classList.remove('shake');
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
        fillTop: 'rgba(156, 250, 196, 0.32)',
        fillBottom: 'rgba(72, 220, 144, 0.22)',
        edge: 'rgba(126, 246, 178, 0.88)'
      } : {
        fillTop: 'rgba(255, 140, 134, 0.24)',
        fillBottom: 'rgba(224, 74, 72, 0.18)',
        edge: 'rgba(255, 124, 118, 0.82)'
      };

      const pad = 2;
      const size = CELL_SIZE - pad * 2;
      const radius = CELL_SIZE * 0.24;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (matrix[row][col] !== 1) continue;
          const boardCol = x + col;
          const boardRow = y + row;
          if (boardCol < 0 || boardRow < 0 || boardCol >= BOARD_SIZE || boardRow >= BOARD_SIZE) continue;

          const cellX = boardCol * CELL_SIZE;
          const cellY = boardRow * CELL_SIZE;

          const fill = boardCtx.createLinearGradient(cellX, cellY, cellX, cellY + CELL_SIZE);
          fill.addColorStop(0, theme.fillTop);
          fill.addColorStop(1, theme.fillBottom);
          boardCtx.fillStyle = fill;
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

      boardCtx.fillStyle = '#020916';
      boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

      const emptyTileGradient = boardCtx.createLinearGradient(0, 0, 0, CELL_SIZE - 4);
      emptyTileGradient.addColorStop(0, 'rgba(18, 72, 133, 0.98)');
      emptyTileGradient.addColorStop(0.48, 'rgba(9, 43, 88, 0.98)');
      emptyTileGradient.addColorStop(1, 'rgba(3, 18, 42, 0.99)');

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
              drawBreakingCell(boardCtx, col * CELL_SIZE, row * CELL_SIZE, cell.color, gameState.clearingLines.animationTime);
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
        shapeItem.className = 'shape-item';
        shapeItem.dataset.shapeIndex = String(index);

        if (!shape) {
          shapeItem.classList.add('shape-item--empty');
          shapesList.appendChild(shapeItem);
          continue;
        }

        const canvas = document.createElement('canvas');
        canvas.className = 'shape-canvas';
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
        shapeItem.classList.add('dragging');
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
      dragGhost.style.cssText = 'display:block;position:fixed;left:0;top:0;pointer-events:none;z-index:1000;opacity:0.8;will-change:transform;';

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

      if (gameState.dragging.shapeItem) gameState.dragging.shapeItem.classList.remove('dragging');
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
      const trackEl = document.getElementById('winProgress');
      const prize = gameState.score / SCORE_TO_BRL_DIVISOR;

      if (prizeEl) prizeEl.textContent = formatBRL(prize);

      const progress = Math.min(100, (prize / MAX_WIN_AMOUNT) * 100);
      if (barEl) barEl.style.width = progress.toFixed(2) + '%';
      if (trackEl) trackEl.setAttribute('aria-valuenow', String(Math.floor(progress)));

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
      document.querySelector('.boardWrap')?.classList.remove('shake');
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

      const soundBtn = document.getElementById('soundBtn');
      if (soundBtn) {
        let soundEnabled = !GameAudio.isMuted();
        soundBtn.setAttribute('aria-pressed', String(soundEnabled));
        soundBtn.classList.toggle('is-muted', !soundEnabled);
        
        soundBtn.onclick = () => {
          GameAudio.unlock();
          const newState = !GameAudio.isMuted();
          GameAudio.setMuted(newState);
          soundBtn.setAttribute('aria-pressed', String(!newState));
          soundBtn.classList.toggle('is-muted', newState);
          GameAudio.play('swtch');
        };
      }
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
    };
  }, []);

  return (
    <div ref={containerRef} className="gameplay-page w-full min-h-screen text-white select-none relative overflow-x-hidden flex flex-col justify-between" onClick={() => GameAudio.unlock()} onTouchStart={() => GameAudio.unlock()}>
      <style dangerouslySetInnerHTML={{ __html: `
        .gameplay-page {
          background-color: #020817;
          background:
            radial-gradient(circle at 50% 8%, rgba(0, 213, 255, .34), transparent 23rem),
            radial-gradient(circle at 12% 72%, rgba(38, 255, 113, .2), transparent 16rem),
            radial-gradient(circle at 90% 73%, rgba(0, 119, 255, .24), transparent 18rem),
            linear-gradient(rgba(0, 23, 67, .5), rgba(0, 7, 24, .72));
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }
        .game-shell {
          width: min(430px, calc(100vw - 24px));
          margin: auto;
          padding: 12px 0 max(24px, env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .game-head {
          height: 56px;
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 10px;
        }
        .back {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 2px solid rgba(35, 230, 255, .88);
          border-radius: 12px;
          background: radial-gradient(circle at 50% 25%, #0b3e75, #02122f);
          color: #9af9ff;
          text-decoration: none;
          font-size: 1.3rem;
          box-shadow: inset 0 1px rgba(255, 255, 255, .22), 0 0 14px rgba(35, 230, 255, .42);
        }
        .game-head img {
          width: 105px;
          margin: auto;
          filter: drop-shadow(0 0 12px rgba(0, 222, 255, .58)) drop-shadow(0 6px 10px rgba(0, 5, 20, .72));
        }
        .demo {
          padding: 6px 9px;
          border: 1px solid rgba(35, 230, 255, .58);
          border-radius: 99px;
          background: linear-gradient(145deg, rgba(4, 38, 83, .92), rgba(1, 15, 42, .96));
          color: #9af9ff;
          font-size: .65rem;
          font-weight: 900;
          text-transform: uppercase;
          box-shadow: inset 0 1px rgba(255, 255, 255, .1), 0 0 11px rgba(35, 230, 255, .18);
        }
        .stake-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }
        .stake-row article {
          position: relative;
          overflow: hidden;
          padding: 11px 12px;
          border: 2px solid rgba(35, 230, 255, .84);
          background:
            radial-gradient(circle at 20% 0, rgba(8, 125, 255, .36), transparent 55%),
            linear-gradient(145deg, rgba(4, 40, 91, .98), rgba(1, 12, 39, .99));
          border-radius: 15px;
          box-shadow: inset 0 1px rgba(255, 255, 255, .2), inset 0 -8px 18px rgba(0, 0, 20, .42), 0 0 15px rgba(35, 230, 255, .34), 0 9px 20px rgba(0, 4, 20, .45);
        }
        .stake-row article:nth-child(2) {
          border-color: rgba(55, 250, 164, .82);
          background:
            radial-gradient(circle at 20% 0, rgba(27, 230, 105, .26), transparent 55%),
            linear-gradient(145deg, rgba(2, 54, 78, .98), rgba(1, 15, 41, .99));
          box-shadow: inset 0 1px rgba(255, 255, 255, .2), inset 0 -8px 18px rgba(0, 0, 20, .42), 0 0 15px rgba(46, 255, 157, .3), 0 9px 20px rgba(0, 4, 20, .45);
        }
        .stake-row small, .prize small {
          display: block;
          margin-bottom: 3px;
          color: #cbe7f8;
          font-size: .63rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .stake-row strong {
          color: #f8fbff;
          font-size: 1rem;
          text-shadow: 0 0 12px rgba(35, 230, 255, .35);
        }
        .stake-row article:nth-child(2) strong {
          color: #c8ff6b;
          text-shadow: 0 0 12px rgba(83, 242, 95, .38);
        }
        .prize {
          text-align: center;
          padding: 2px 0;
        }
        .prize strong {
          display: block;
          margin: 1px 0 8px;
          font-size: 1.9rem;
          line-height: 1;
          background: linear-gradient(180deg, #ffffff 5%, #8efcff 38%, #4fff61 68%, #baff49 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 12px rgba(49, 238, 255, .34));
        }
        #winProgress {
          height: 11px;
          border: 2px solid #23e6ff;
          background: #021329;
          border-radius: 99px;
          overflow: hidden;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, .82), 0 0 12px rgba(35, 230, 255, .52);
        }
        #winProgressBar {
          display: block;
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #28d548, #8cff62, #d3ff59);
          box-shadow: 0 0 12px rgba(74, 255, 95, .85);
          transition: width 0.2s ease;
        }
        .boardWrap {
          width: 100%;
          aspect-ratio: 1;
          padding: 9px;
          border: 3px solid #23e6ff;
          border-radius: 24px;
          background: linear-gradient(145deg, #07517d, #04183e 46%, #03222e);
          box-shadow: inset 0 0 0 2px rgba(130, 250, 255, .42), inset 0 0 30px rgba(0, 110, 255, .32), 0 0 18px rgba(35, 230, 255, .76), 0 0 42px rgba(24, 255, 164, .24), 0 18px 38px rgba(0, 3, 18, .68);
          animation: cyanBreath 3.2s ease-in-out infinite;
        }
        @keyframes cyanBreath {
          0%, 100% { box-shadow: inset 0 0 0 2px rgba(130, 250, 255, .42), inset 0 0 30px rgba(0, 110, 255, .32), 0 0 16px rgba(35, 230, 255, .62), 0 0 38px rgba(24, 255, 164, .2), 0 18px 38px rgba(0, 3, 18, .68); }
          50% { box-shadow: inset 0 0 0 2px rgba(130, 250, 255, .58), inset 0 0 34px rgba(0, 110, 255, .4), 0 0 23px rgba(35, 230, 255, .82), 0 0 48px rgba(24, 255, 164, .28), 0 18px 38px rgba(0, 3, 18, .68); }
        }
        .boardGrid {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          padding: 7px;
          border: 2px solid rgba(44, 228, 255, .74);
          border-radius: 17px;
          background: radial-gradient(circle at 50% 0, #103d72, #020817 72%);
          overflow: hidden;
          box-shadow: inset 0 0 32px rgba(0, 0, 15, .9), 0 0 10px rgba(35, 230, 255, .24);
        }
        .boardGrid canvas {
          display: block;
          border-radius: 10px;
        }
        .pieces {
          display: flex;
          gap: 9px;
        }
        .shape-item {
          flex: 1;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border: 2px solid rgba(63, 243, 255, .9);
          border-radius: 17px;
          background: radial-gradient(circle at 50% 20%, rgba(5, 111, 184, .5), transparent 62%), linear-gradient(145deg, #061c43, #02091e);
          box-shadow: inset 0 0 22px rgba(0, 8, 30, .88), inset 0 1px rgba(255, 255, 255, .16), 0 0 13px rgba(35, 230, 255, .55), 0 0 24px rgba(46, 255, 145, .16);
          touch-action: none;
          cursor: grab;
        }
        .shape-item:hover { border-color: #a2fbff; }
        .shape-item canvas {
          max-width: 84%;
          max-height: 84%;
          pointer-events: none;
        }
        .shape-item.dragging { opacity: .4; }
        .shape-item--empty { opacity: .35; }
        .help {
          margin: 0;
          text-align: center;
          color: #c6e7f3;
          font-size: .74rem;
          text-shadow: 0 1px 4px #00142b;
        }
        .sound {
          position: fixed;
          right: 14px;
          bottom: 14px;
          width: 42px;
          height: 42px;
          border: 2px solid #23e6ff;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 25%, #0b4b85, #021431 70%);
          color: #fff;
          font-size: 1.2rem;
          box-shadow: inset 0 1px rgba(255, 255, 255, .2), 0 0 16px rgba(35, 230, 255, .62);
          z-index: 99;
          cursor: pointer;
        }
        .sound.is-muted {
            opacity: 0.5;
            filter: grayscale(1);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          display: none;
          place-items: center;
          padding: 22px;
          background: rgba(0, 6, 25, .86);
          backdrop-filter: blur(7px);
          z-index: 2000;
        }
        .modal-overlay.show { display: grid; }
        .modal-content {
          width: min(320px, 100%);
          padding: 25px;
          text-align: center;
          border: 2px solid #23e6ff;
          border-radius: 22px;
          background: linear-gradient(145deg, #07386a, #020b25);
          box-shadow: 0 0 24px rgba(35, 230, 255, .45);
        }
        .modal-content h2 { margin: 0 0 8px; color: #9af9ff; }
        .modal-content p { color: #b9d8ed; }
        .modal-content button, .modal-content a {
          width: 100%;
          min-height: 44px;
          display: grid;
          place-items: center;
          margin-top: 9px;
          border-radius: 12px;
          font: inherit;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }
        .modal-content button {
          border: 0;
          background: linear-gradient(180deg, #8dff73, #26cf53);
          color: #022215;
        }
        .modal-content a {
          border: 1px solid rgba(35, 230, 255, .48);
          color: #fff;
        }
      ` }} />

      <main className="game-shell">
        <header className="game-head">
          <Link href="/" className="back" aria-label="Voltar para a página inicial">←</Link>
          <img src="/blockcash.png" alt="BlockCash" />
          <span className="demo">Modo teste</span>
        </header>

        <section className="stake-row" aria-label="Informações demonstrativas">
          <article>
            <small>Aposta demo</small>
            <strong id="betValue">R$ 10,00</strong>
          </article>
          <article>
            <small>Prêmio máximo</small>
            <strong id="maxWinValue">R$ 50,00</strong>
          </article>
        </section>

        <section className="prize">
          <small>Progresso da partida</small>
          <strong id="prizeValue">R$ 0,00</strong>
          <div id="winProgress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <i id="winProgressBar"></i>
          </div>
        </section>

        <section className="boardWrap">
          <div className="boardGrid">
            <canvas id="gameBoard" aria-label="Tabuleiro 8 por 8"></canvas>
          </div>
        </section>

        <section className="pieces" id="shapesList" aria-label="Peças disponíveis"></section>
        
        <p className="help">Arraste uma peça para o tabuleiro e complete linhas.</p>
      </main>

      <button className="sound" id="soundBtn" aria-label="Desativar som" aria-pressed="true">♪</button>

      <div className="modal-overlay" id="gameOverModal">
        <div className="modal-content">
          <h2>Fim de jogo!</h2>
          <p>Não há mais encaixes disponíveis.</p>
          <button id="restartBtn">Jogar de novo</button>
          <Link href="/">Voltar para a página</Link>
        </div>
      </div>
    </div>
  );
}
