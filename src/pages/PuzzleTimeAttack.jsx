import { useState, useEffect } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";
import { TimerOff } from "lucide-react";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;
const TOTAL_CELLS = BOARD_COLS * BOARD_ROWS;

const MAX_PIECES = 45;
const START_PIECES = 3;
const TIME_LIMIT = 10;

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#9D4EDD", "#FF8E3C", "#2EC4B6", "#845EC2",
  "#00C9A7", "#FF9671", "#00B8D9", "#C34A36",
  "#3EC1D3", "#F67280", "#8BC34A", "#A66CFF",
];

// -------------------- GENERADOR (COPIA DE RANDOM) --------------------

const toGrid = (index) => ({
  row: Math.floor(index / BOARD_COLS),
  col: index % BOARD_COLS,
});

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

const generatePieces = (count) => {
  const grid = Array.from({ length: BOARD_ROWS }, () =>
    Array(BOARD_COLS).fill(null)
  );

  const pieces = [];

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

  let remaining = BOARD_ROWS * BOARD_COLS - count;

  while (remaining > 0) {
    const expandable = pieces.filter((p) =>
      p.cells.some(([r, c]) =>
        (r > 0 && grid[r - 1][c] === null) ||
        (r < BOARD_ROWS - 1 && grid[r + 1][c] === null) ||
        (c > 0 && grid[r][c - 1] === null) ||
        (c < BOARD_ROWS - 1 && grid[r][c + 1] === null)
      )
    );

    if (!expandable.length) break;

    const piece =
      expandable[Math.floor(Math.random() * expandable.length)];

    const frontier = [];

    piece.cells.forEach(([r, c]) => {
      [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ].forEach(([nr, nc]) => {
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
      frontier[Math.floor(Math.random() * frontier.length)];

    grid[nr][nc] = piece.id - 1;
    piece.cells.push([nr, nc]);
    remaining--;
  }

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
    const rotations = Math.floor(Math.random() * 4);

    for (let i = 0; i < rotations; i++) {
      rotatedShape = rotateMatrix(rotatedShape);
    }

    return {
      id: p.id,
      color: p.color,
      shape: rotatedShape,
    };
  });
};

// -------------------- GAME --------------------

export default function PuzzleTimeAttack({ onBack }) {
  const [piecesCount, setPiecesCount] = useState(START_PIECES);
  const [pieces, setPieces] = useState(() =>
    generatePieces(START_PIECES)
  );

  const [resetKey, setResetKey] = useState(0);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, gameOver]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const checkVictory = () => {
    const board = document.querySelector(".board");
    if (!board) return;

    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(false)
    );

    const rect = board.getBoundingClientRect();
    const piecesDom = document.querySelectorAll(".piece");

    piecesDom.forEach((piece) => {
      const cells = piece.querySelectorAll(".piece-cell");

      cells.forEach((cell) => {
        const r = cell.getBoundingClientRect();

        const x = r.left + r.width / 2 - rect.left;
        const y = r.top + r.height / 2 - rect.top;

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

    const win = grid.every((r) => r.every(Boolean));
    if (!win) return;

    const next = Math.min(piecesCount + 1, MAX_PIECES);

    setScore((s) => s + 1);
    setPiecesCount(next);
    setPieces(generatePieces(next));
    setResetKey((k) => k + 1);
  };

  const reset = () => setResetKey((k) => k + 1);

  if (gameOver) {
    return (
      <PuzzleLayout title="Contrarreloj" onBack={onBack} onReset={reset} hideInternalTimer={true}>
        <div className="defeatOverlay">
          <div className="defeatPopup">
  
          <div className="defeatIcon">
            <TimerOff size={34} strokeWidth={2.2} />
          </div>
  
            <h2 className="defeatTitle">
              TIEMPO AGOTADO
            </h2>
  
            <div className="defeatLine" />
  
            <p className="defeatText">
              Has completado <b>{score}</b> puzzles
            </p>
  
            <p className="defeatSubtext">
              Inténtalo de nuevo y supera tu marca
            </p>
  
            <button onClick={onBack} className="defeatButton">
              Volver al menú
            </button>
  
          </div>
        </div>
      </PuzzleLayout>
    );
  }

  return (
    <PuzzleLayout
      title={`Contrarreloj`}
      onBack={onBack}
      onReset={reset}
      hideInternalTimer={true}   
    >

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
        <Board key={resetKey}>
          {pieces.map((p, i) => (
            <Piece
              key={p.id}
              id={p.id}
              color={p.color}
              shape={p.shape}
              initialX={(i % 4) * 65}
              initialY={Math.floor(i / 4) * 140}
              onDrop={checkVictory}
            />
          ))}
        </Board>
      </div>
      <div className="timeAttackHud">
  ⏱ {formatTime(timeLeft)} · ⭐ {score}
        </div>
    </PuzzleLayout>
  );
}