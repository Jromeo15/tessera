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

  const rotated = Array.from(
    { length: cols },
    () => Array(rows).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] =
        rotateCellType(matrix[r][c]);
    }
  }

  return rotated;
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
  const shapes = pieces.map((p) => {

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
  
  
    return shape;
  });
  
  const borderedShapes = addDiagonalBorders(
    shapes,
    pieces,
    grid
  );

  const rotatedShapes = borderedShapes.map(shape => {
    let result = shape;
  
    const rotations = Math.floor(Math.random() * 4);
  
    for (let i = 0; i < rotations; i++) {
      result = rotateMatrix(result);
    }
  
    return result;
  });
  
  return pieces.map((p, i) => ({
    id: p.id,
    color: p.color,
    shape: rotatedShapes[i],
    shapeMode: "square",
  }));
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


  return (
<PuzzleLayout
  title="Puzzle Random"
  onBack={onBack}
  onReset={() => {
    setShowVictory(false);
    setResetKey((k) => k + 1);
  }}
  showVictory={showVictory}
  onCloseVictory={() => setShowVictory(false)}
  shapes={pieces.map(p => p.shape)}
/>
  );
}