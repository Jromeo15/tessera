import { useState } from "react";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import { SHAPES } from "./shapes/shapes1";
import { CELL_SIZE } from "../../constants";
import PuzzleLayout from "../../layout/PuzzleLayout";
import { getUniqueColors } from "../../components/colors";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

const BOARD_PIXEL_WIDTH = BOARD_COLS * CELL_SIZE;
const BOARD_PIXEL_HEIGHT = BOARD_ROWS * CELL_SIZE;

const SAFE_MARGIN = 20;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const getPieceWidth = (shape) => {
    let maxX = 0;

    shape.forEach((row) => {
      row.forEach((cell, x) => {
        if (cell) maxX = Math.max(maxX, x);
      });
    });

    return maxX + 1;
  };

  const [pieces] = useState(() => {
    const colors = getUniqueColors(SHAPES.length);
  
    return SHAPES.map((shape, i) => ({
      id: i + 1,
      color: colors[i],
      shape,
    }));
  });

  const checkVictory = () => {
    const board = document.querySelector(".board");
    if (!board) return;

    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array(BOARD_COLS).fill(false)
    );

    const piecesDom = document.querySelectorAll(".piece");

    piecesDom.forEach((piece) => {
      const cells = piece.querySelectorAll(".piece-cell");

      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const zoom = parseFloat(getComputedStyle(document.body).getPropertyValue("--zoom")) || 1;

        const x = (rect.left - boardRect.left) / zoom;
        const y = (rect.top - boardRect.top) / zoom;

        const col = Math.round(x / CELL_SIZE);
        const row = Math.round(y / CELL_SIZE);

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

  const topCount = Math.ceil(pieces.length / 2);

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
        {pieces.map((p, index) => {
          const isTopRow = index < topCount;
          const rowIndex = isTopRow ? index : index - topCount;

          const pieceWidth = getPieceWidth(p.shape) * CELL_SIZE;

          const availableWidth = BOARD_PIXEL_WIDTH - SAFE_MARGIN * 2;

          const slotWidth =
            topCount > 1 ? availableWidth / (topCount - 1) : 0;

          let centerX =
            topCount > 1
              ? SAFE_MARGIN + slotWidth * rowIndex
              : BOARD_PIXEL_WIDTH / 2;
          
          const globalBias = -40; // prueba entre -8 y -20 si quieres más efecto
          centerX += globalBias;

          const minCenter = SAFE_MARGIN + pieceWidth / 2;
          const maxCenter = BOARD_PIXEL_WIDTH - SAFE_MARGIN - pieceWidth / 2;

          if (centerX < minCenter) {
            centerX += (minCenter - centerX) * 0.6;
          } else if (centerX > maxCenter) {
            centerX -= (centerX - maxCenter) * 0.6;
          }

          const x = centerX - pieceWidth / 2;

          const y = isTopRow
            ? -80
            : window.innerHeight * 0.15;

          return (
            <Piece
              key={p.id}
              id={p.id}
              color={p.color}
              shape={p.shape}
              initialX={x}
              initialY={y}
              onDrop={checkVictory}
              onRotate={checkVictory}
            />
          );
        })}
      </Board>
      </div>
    </PuzzleLayout>
  );
}