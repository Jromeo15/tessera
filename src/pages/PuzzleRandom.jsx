import { useState } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;
const TOTAL_CELLS = BOARD_COLS * BOARD_ROWS;

const COLORS = [
  "#FF6B6B", // coral rojo
  "#FFD93D", // amarillo vivo
  "#6BCB77", // verde fresco
  "#4D96FF", // azul brillante
  "#9D4EDD", // violeta
  "#FF8E3C", // naranja cálido
  "#2EC4B6", // turquesa
  "#845EC2", // púrpura profundo
  "#00C9A7", // aqua
  "#FF9671", // melocotón
  "#00B8D9", // cyan
  "#C34A36", // terracota
  "#3EC1D3", // azul agua
  "#F67280", // rosa coral
  "#8BC34A", // lima suave
  "#A66CFF", // lavanda intensa
];

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

const rotateMatrix = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }

  return rotated;
};

/**
 * 🔥 GENERADOR FINAL (SIN ISLAS + SUMA EXACTA 90)
 */
const generatePieces = (count) => {
  const grid = Array.from(
    { length: BOARD_ROWS },
    () => Array(BOARD_COLS).fill(null)
  );

  const pieces = [];

  // -------------------------
  // 1. crear semillas
  // -------------------------
  for (let i = 0; i < count; i++) {
    while (true) {
      const r = Math.floor(Math.random() * BOARD_ROWS);
      const c = Math.floor(Math.random() * BOARD_COLS);

      if (grid[r][c] === null) {
        grid[r][c] = i;

        pieces.push({
          id: i + 1,
          color: COLORS[i % COLORS.length],
          cells: [[r, c]],
        });

        break;
      }
    }
  }

  // -------------------------
  // 2. expandir piezas
  // -------------------------
  let remaining =
    BOARD_ROWS * BOARD_COLS - count;

  while (remaining > 0) {
    const expandable = pieces.filter((p) => {
      return p.cells.some(([r, c]) => {
        return (
          (r > 0 && grid[r - 1][c] === null) ||
          (r < BOARD_ROWS - 1 &&
            grid[r + 1][c] === null) ||
          (c > 0 && grid[r][c - 1] === null) ||
          (c < BOARD_COLS - 1 &&
            grid[r][c + 1] === null)
        );
      });
    });

    if (!expandable.length) break;

    const piece =
      expandable[
        Math.floor(Math.random() * expandable.length)
      ];

    const frontier = [];

    piece.cells.forEach(([r, c]) => {
      const neighbors = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      neighbors.forEach(([nr, nc]) => {
        if (
          nr >= 0 &&
          nr < BOARD_ROWS &&
          nc >= 0 &&
          nc < BOARD_COLS &&
          grid[nr][nc] === null
        ) {
          frontier.push([nr, nc]);
        }
      });
    });

    if (!frontier.length) continue;

    const [nr, nc] =
      frontier[
        Math.floor(Math.random() * frontier.length)
      ];

    grid[nr][nc] = piece.id - 1;

    piece.cells.push([nr, nc]);

    remaining--;
  }

  // -------------------------
  // 3. convertir a shapes
  // -------------------------
  return pieces.map((p) => {
    const minR = Math.min(...p.cells.map(([r]) => r));
    const minC = Math.min(...p.cells.map(([, c]) => c));

    const maxR = Math.max(...p.cells.map(([r]) => r));
    const maxC = Math.max(...p.cells.map(([, c]) => c));

    const shape = Array.from(
      { length: maxR - minR + 1 },
      () => Array(maxC - minC + 1).fill(0)
    );

    p.cells.forEach(([r, c]) => {
      shape[r - minR][c - minC] = 1;
    });

    let rotatedShape = shape;

    // 0, 1, 2 o 3 rotaciones (0º, 90º, 180º, 270º)
    const rotations = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < rotations; i++) {
      rotatedShape = rotateMatrix(rotatedShape);
    }
    
    return {
      id: p.id,
      color: p.color,
      shape: rotatedShape,
      shapeMode: "square",
    };
  });
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
  title="Puzzle 1"
  onBack={onBack}
  onReset={() => {
    setShowVictory(false);
    setResetKey((k) => k + 1);
  }}

  showVictory={showVictory}
  onCloseVictory={() => setShowVictory(false)}
>
{/* BOARD */}
<div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 100,
    width: "100%",
  }}
>
  <Board key={resetKey}>
    {pieces.map((p, index) => (
      <Piece
        key={p.id}
        id={p.id}
        color={p.color}
        shape={p.shape}
        initialX={
          (index % 4) * 65 - 45 +
          (index < pieces.length / 2 ? -8 : 8)
        }
        initialY={
          Math.floor(index / 4) * 140 - 60
        }
        onDrop={checkVictory}
      />
    ))}
  </Board>
</div>
  
    </PuzzleLayout>
  );
}