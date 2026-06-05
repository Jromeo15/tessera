import { useState } from "react";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import { SHAPES } from "./shapes/shapes7";
import { CELL_SIZE } from "../../constants";
import PuzzleLayout from "../../layout/PuzzleLayout";
import { getUniqueColors } from "../../components/colors";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

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
  
    const boardRect = board.getBoundingClientRect();
  
    const piecesDom = document.querySelectorAll(".piece");
  
    piecesDom.forEach((piece) => {
      const cells = piece.querySelectorAll(".piece-cell");
  
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
  
        // 🔥 usar centro de la celda (MUY importante)
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
  title="Puzzle 7"
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
        index < pieces.length / 2
          ? Math.floor(index / 4) * 140 - 60
          : Math.floor(index / 4) * 140 - 60
      }
      onDrop={checkVictory}
    />
  ))}
</Board>
      </div>

    </PuzzleLayout>
  );
}