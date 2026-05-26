import { useState } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;
const TOTAL_CELLS = BOARD_COLS * BOARD_ROWS;

const COLORS = ["red", "blue", "green", "orange", "purple", "pink"];

/**
 * Pool de 90 celdas
 */
const createPool = () =>
  Array.from({ length: TOTAL_CELLS }, (_, i) => i);

/**
 * índice → coordenada
 */
const toGrid = (index) => ({
  row: Math.floor(index / BOARD_COLS),
  col: index % BOARD_COLS,
});

/**
 * vecinos 4-direcciones
 */
const getNeighbors = (idx, poolSet) => {
  const { row, col } = toGrid(idx);

  const candidates = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  return candidates
    .map(([r, c]) => r * BOARD_COLS + c)
    .filter((i) => poolSet.has(i));
};

/**
 * construye una pieza CONECTADA
 */
const buildConnectedPiece = (pool, size) => {
  const poolSet = new Set(pool);

  const used = [];

  const start =
    pool[Math.floor(Math.random() * pool.length)];

  used.push(start);
  poolSet.delete(start);

  while (used.length < size) {
    const candidates = [];

    for (const u of used) {
      candidates.push(...getNeighbors(u, poolSet));
    }

    if (candidates.length === 0) break;

    const next =
      candidates[Math.floor(Math.random() * candidates.length)];

    used.push(next);
    poolSet.delete(next);
  }

  return used;
};

/**
 * convierte celdas a matriz shape
 */
const buildShape = (cells) => {
  const coords = cells.map(toGrid);

  const minRow = Math.min(...coords.map(c => c.row));
  const minCol = Math.min(...coords.map(c => c.col));
  const maxRow = Math.max(...coords.map(c => c.row));
  const maxCol = Math.max(...coords.map(c => c.col));

  const shape = Array.from(
    { length: maxRow - minRow + 1 },
    () => Array(maxCol - minCol + 1).fill(0)
  );

  coords.forEach(({ row, col }) => {
    shape[row - minRow][col - minCol] = 1;
  });

  return shape;
};

/**
 * 🔥 GENERADOR FINAL (SIN ISLAS + SUMA EXACTA 90)
 */
const generatePieces = (count) => {
  const visited = Array.from({ length: BOARD_ROWS }, () =>
    Array(BOARD_COLS).fill(false)
  );

  const pieces = [];

  const getRandomFreeCell = () => {
    const free = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (!visited[r][c]) free.push([r, c]);
      }
    }
    return free.length
      ? free[Math.floor(Math.random() * free.length)]
      : null;
  };

  const getNeighbors = (r, c) => {
    const dirs = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    return dirs.filter(
      ([rr, cc]) =>
        rr >= 0 &&
        rr < BOARD_ROWS &&
        cc >= 0 &&
        cc < BOARD_COLS &&
        !visited[rr][cc]
    );
  };

  const buildRegion = (startR, startC, maxSize) => {
    const region = [[startR, startC]];
    visited[startR][startC] = true;

    while (region.length < maxSize) {
      const candidates = [];

      for (const [r, c] of region) {
        candidates.push(...getNeighbors(r, c));
      }

      if (!candidates.length) break;

      const [nr, nc] =
        candidates[Math.floor(Math.random() * candidates.length)];

      region.push([nr, nc]);
      visited[nr][nc] = true;
    }

    return region;
  };

  const buildShape = (cells) => {
    const minR = Math.min(...cells.map(([r]) => r));
    const minC = Math.min(...cells.map(([, c]) => c));
    const maxR = Math.max(...cells.map(([r]) => r));
    const maxC = Math.max(...cells.map(([, c]) => c));

    const shape = Array.from(
      { length: maxR - minR + 1 },
      () => Array(maxC - minC + 1).fill(0)
    );

    cells.forEach(([r, c]) => {
      shape[r - minR][c - minC] = 1;
    });

    return shape;
  };

  const TOTAL = BOARD_ROWS * BOARD_COLS;
  const targetPerPiece = Math.floor(TOTAL / count);

  for (let i = 0; i < count; i++) {
    const start = getRandomFreeCell();
    if (!start) break;

    const isLast = i === count - 1;

    const region = buildRegion(
      start[0],
      start[1],
      isLast ? TOTAL : targetPerPiece
    );

    pieces.push({
      id: i + 1,
      color: COLORS[i % COLORS.length],
      shape: buildShape(region),
      shapeMode: "square",
    });
  }

  return pieces;
};

export default function PuzzleRandom({
  onBack,
  piecesCount = 2,
}) {
  const [showVictory, setShowVictory] = useState(false);

  const [resetKey, setResetKey] = useState(0);

  const [pieces, setPieces] = useState(() =>
    generatePieces(piecesCount)
  );

  const checkVictory = () => {
    const board = document.querySelector(".board");
    if (!board) return;

    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(false)
    );

    const boardRect = board.getBoundingClientRect();
    const piecesDom = document.querySelectorAll(".piece");

    piecesDom.forEach((piece) => {
      const cells = piece.querySelectorAll(".piece-cell");

      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();

        const x = rect.left + rect.width / 2 - boardRect.left;
        const y = rect.top + rect.height / 2 - boardRect.top;

        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);

        if (
          row >= 0 &&
          row < BOARD_ROWS &&
          col >= 0 &&
          col < BOARD_COLS
        ) {
          grid[row][col] = true;
        }
      });
    });

    const win = grid.every((row) => row.every(Boolean));
    setShowVictory(win);
  };

  return (
    <PuzzleLayout
      title="Puzzle Random"
      onBack={onBack}
      onReset={() => {
        setShowVictory(false);
        setResetKey((k) => k + 1);
        setPieces(generatePieces(piecesCount));
      }}
    >
      {/* BOARD */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 140,
          height: "100%",
        }}
      >
<Board key={resetKey}>
  {pieces.map((p, index) => (
    <Piece
      key={p.id}
      id={p.id}
      color={p.color}
      shape={p.shape}
      initialX={(index % 4) * 30}
      initialY={Math.floor(index / 4) * 120 - (0.5 * 120) / 2}
      onDrop={checkVictory}
    />
  ))}
</Board>
      </div>
  
      {/* VICTORY */}
      {showVictory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              minWidth: 300,
              position: "relative",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <button
              onClick={() => setShowVictory(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
  
            <h2>VICTORIA</h2>
            <p>Has rellenado todo el tablero.</p>
  
            <button onClick={onBack}>
              Volver
            </button>
          </div>
        </div>
      )}
    </PuzzleLayout>
  );
}