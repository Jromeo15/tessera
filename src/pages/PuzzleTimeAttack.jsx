import { useState, useEffect, useRef } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";
import { TimerOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { saveTimeAttackScore } from "../lib/timeAttackScores";
import { createPortal } from "react-dom";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

const MAX_PIECES = 45;
const START_PIECES = 3;
const TIME_LIMIT = 300;

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#9D4EDD", "#FF8E3C", "#2EC4B6", "#845EC2",
  "#00C9A7", "#FF9671", "#00B8D9", "#C34A36",
  "#3EC1D3", "#F67280", "#8BC34A", "#A66CFF",
];

// -------------------- GENERADOR ORIGINAL (NO TOCADO) --------------------

const rotateCellType = (value) => {
  switch (value) {
    case 3: return 5;
    case 5: return 6;
    case 6: return 4;
    case 4: return 3;
    default: return value;
  }
};

const rotateMatrix = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] =
        rotateCellType(matrix[r][c]);
    }
  }

  return rotated;
};

const createSquareShape = (piece) => {
  const minR = Math.min(...piece.cells.map(([r]) => r));
  const minC = Math.min(...piece.cells.map(([, c]) => c));
  const maxR = Math.max(...piece.cells.map(([r]) => r));
  const maxC = Math.max(...piece.cells.map(([, c]) => c));

  const shape = Array.from(
    { length: maxR - minR + 1 },
    () => Array(maxC - minC + 1).fill(0)
  );

  piece.cells.forEach(([r, c]) => {
    shape[r - minR][c - minC] = 1;
  });

  return shape;
};

const addDiagonalBorders = (shapes, pieces, grid) => {

  const result = shapes.map(shape =>
    shape.map(row => [...row])
  );

  const hasCell = (matrix, r, c) => {
    return (
      r >= 0 &&
      r < matrix.length &&
      c >= 0 &&
      c < matrix[0].length &&
      matrix[r][c] === 1
    );
  };

  const hasValue = (matrix, r, c, values) => {
    return (
      r >= 0 &&
      r < matrix.length &&
      c >= 0 &&
      c < matrix[0].length &&
      values.includes(matrix[r][c])
    );
  };

  // ============================================
  // COMPROBACIONES DE APOYO
  // ============================================
// 3:
// izquierda + abajo
const canPlace3 = (matrix, r, c) => {

  const left = hasValue(matrix, r, c - 1, [1, 4]);
  const down = hasValue(matrix, r + 1, c, [1, 5]);

  return (
    left &&
    down &&
    (hasCell(matrix, r, c - 1) || hasCell(matrix, r + 1, c)) &&
    !hasCell(matrix, r - 1, c) &&
    !hasCell(matrix, r, c + 1)
  );

};

// 6:
// arriba + derecha
const canPlace6 = (matrix, r, c) => {

  const up = hasValue(matrix, r - 1, c, [1, 4]);
  const right = hasValue(matrix, r, c + 1, [1, 5]);

  return (
    up &&
    right &&
    (hasCell(matrix, r - 1, c) || hasCell(matrix, r, c + 1)) &&
    !hasCell(matrix, r + 1, c) &&
    !hasCell(matrix, r, c - 1)
  );

};

// 4:
// abajo + derecha
const canPlace4 = (matrix, r, c) => {

  const down = hasValue(matrix, r + 1, c, [1, 5]);
  const right = hasValue(matrix, r, c + 1, [1, 6]);

  return (
    down &&
    right &&
    (hasCell(matrix, r + 1, c) || hasCell(matrix, r, c + 1)) &&
    !hasCell(matrix, r - 1, c) &&
    !hasCell(matrix, r, c - 1)
  );

};

// 5:
// izquierda + arriba
const canPlace5 = (matrix, r, c) => {

  const left = hasValue(matrix, r, c - 1, [1, 3]);
  const up = hasValue(matrix, r - 1, c, [1, 6]);

  return (
    left &&
    up &&
    (hasCell(matrix, r, c - 1) || hasCell(matrix, r - 1, c)) &&
    !hasCell(matrix, r + 1, c) &&
    !hasCell(matrix, r, c + 1)
  );

};

  pieces.forEach((piece, index) => {
    const minRow = Math.min(...piece.cells.map(([r]) => r));
    const minCol = Math.min(...piece.cells.map(([, c]) => c));
    piece.cells.forEach(([r, c]) => {
      let sr = r - minRow;
      let sc = c - minCol;

      // =================================================
      // BORDE DERECHO
      // 3 -> 6
      // =================================================
      if (
        c < BOARD_COLS - 1 &&
        grid[r][c + 1] !== grid[r][c]
      ) {

          const neighbourId = grid[r][c + 1];
          const neighbour = pieces[neighbourId];
          const nMinRow =
            Math.min(...neighbour.cells.map(([rr]) => rr));

          const nMinCol =
            Math.min(...neighbour.cells.map(([, cc]) => cc));

          const nr = r - nMinRow;
          const nc = (c + 1) - nMinCol;

          // ampliar columna si hace falta
          if (sc + 1 >= result[index][0].length) {

            result[index].forEach(row =>
              row.push(0)
            );
          }

          // comprobar las DOS piezas antes de tocar nada

          if (
            canPlace3(result[index], sr, sc + 1) &&
            canPlace6(result[neighbourId], nr, nc)
          ) {

            result[index][sr][sc + 1] = 3;
            result[neighbourId][nr][nc] = 6;
          }
        
      }

      // =================================================
      // BORDE SUPERIOR
      // 4 -> 5
      // =================================================
      if (
        r > 0 &&
        grid[r - 1][c] !== grid[r][c]
      ) {
        if (Math.random() < 0.5) {
          const neighbourId = grid[r - 1][c];
          const neighbour = pieces[neighbourId];
          const nMinRow =
            Math.min(...neighbour.cells.map(([rr]) => rr));
          const nMinCol =
            Math.min(...neighbour.cells.map(([, cc]) => cc));
          const nr = (r - 1) - nMinRow;
          const nc = c - nMinCol;
          // ampliar fila arriba si hace falta
          if (sr === 0) {

            result[index].unshift(
              Array(result[index][0].length).fill(0)
            );
            sr++;
          }

          if (
            canPlace4(result[index], sr - 1, sc) &&
            canPlace5(result[neighbourId], nr, nc)
          ) {
            result[index][sr - 1][sc] = 4;

            result[neighbourId][nr][nc] = 5;

          }
        }
      }
    });

  });
  console.log("========== RESULTADO ANTES RETURN ==========");
  result.forEach((shape, index) => {
    console.log("PIEZA", index + 1);
    console.table(shape);
  });
  // detectar 1s aislados
  result.forEach((shape, index) => {
    shape.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value !== 1) return;
        const neighbours = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ];
        const hasNeighbour = neighbours.some(([nr, nc]) => {
          return (
            nr >= 0 &&
            nr < shape.length &&
            nc >= 0 &&
            nc < shape[0].length &&
            (
              shape[nr][nc] === 1 ||
              shape[nr][nc] === 3 ||
              shape[nr][nc] === 4 ||
              shape[nr][nc] === 5 ||
              shape[nr][nc] === 6
            )
          );
        });
        if (!hasNeighbour) {
          console.warn(
            "⚠️ 1 AISLADO EN PIEZA",
            index + 1,
            "fila:",
            r,
            "columna:",
            c
          );
          console.table(shape);
        }
      });
    });
  });
  return result;
};

const generatePieces = (count, difficulty) => {
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
        (c < BOARD_COLS - 1 && grid[r][c + 1] === null)
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

  // --------------------------------------------
  // Crear shapes
  // --------------------------------------------
  const shapes = pieces.map(createSquareShape);

  // Añadir diagonales solo en medium
  const finalShapes =
    difficulty === "medium"
      ? addDiagonalBorders(shapes, pieces, grid)
      : shapes;

  // Rotar piezas aleatoriamente
  return pieces.map((p, i) => {
    let rotatedShape = finalShapes[i];

    const rotations = Math.floor(Math.random() * 4);

    for (let j = 0; j < rotations; j++) {
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

export default function PuzzleTimeAttack({ onBack, config }) {
  const { user } = useAuth();
  const difficulty = config?.difficulty ?? "easy";

  const [piecesCount, setPiecesCount] = useState(START_PIECES);
  const [pieces, setPieces] = useState(() =>
    generatePieces(START_PIECES, difficulty)
  );

  const [resetKey, setResetKey] = useState(0);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [gameOver, setGameOver] = useState(false);

  const savedRef = useRef(false);
  const advancingRef = useRef(false);

  // TIMER
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

  // SAVE SCORE
  useEffect(() => {
    async function save() {
      if (!gameOver || !user || savedRef.current) return;

      savedRef.current = true;

      await saveTimeAttackScore({
        userId: user.id,
        score,
        difficulty,
      });
    }

    save();
  }, [gameOver, user, score]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const checkVictory = () => {
    const board = document.querySelector(".board");
    if (!board) return;
    if (advancingRef.current) return;

    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(false)
    );

    const rect = board.getBoundingClientRect();
    const zoom =
      parseFloat(getComputedStyle(document.body).getPropertyValue("--zoom")) || 1;

    document.querySelectorAll(".piece").forEach((piece) => {
      piece.querySelectorAll(".piece-cell").forEach((cell) => {
        const r = cell.getBoundingClientRect();

        const x = (r.left - rect.left) / zoom;
        const y = (r.top - rect.top) / zoom;

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

    advancingRef.current = true;

    setScore((s) => s + 1);
    setPiecesCount(next);
    setPieces(generatePieces(next, difficulty));
    setResetKey((k) => k + 1);
    requestAnimationFrame(() => {
      advancingRef.current = false;
    });
  };

  const reset = () => setResetKey((k) => k + 1);

  // GAME OVER
  if (gameOver) {
    return (
      <>
        <PuzzleLayout
          title="Contrarreloj"
          onBack={onBack}
          hideInternalTimer={true}
           shapes={pieces.map(p => p.shape)}
        >
          <div style={{ visibility: "hidden" }} />
        </PuzzleLayout>

        {createPortal(
          <div className="defeatOverlay">
            <div className="defeatPopup">

              <div className="defeatIcon">
                <TimerOff size={34} strokeWidth={2.2} />
              </div>

              <h2 className="defeatTitle">TIEMPO AGOTADO</h2>

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
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      <PuzzleLayout
        key={resetKey}
        title="Contrarreloj"
        onBack={onBack}
        hideInternalTimer={true}
        shapes={pieces.map((p) => p.shape)}
        pieceProps={{
          onDrop: checkVictory,
          onRotate: checkVictory,
        }}
      />
  
    {createPortal(
      <div className="timeAttackHud">
        {difficulty === "easy" && "🟢 Fácil"}
        {difficulty === "medium" && "🟡 Medio"}
        {difficulty === "hard" && "🔴 Difícil"}

        {" · "}⏱ {formatTime(timeLeft)}
        {" · "}⭐ {score}
      </div>,
      document.body
    )}
    </>
  );
}