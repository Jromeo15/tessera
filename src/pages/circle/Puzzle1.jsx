import { useState } from "react";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import { SHAPES } from "./shapes/shapes1";
import { CELL_SIZE } from "../../constants";
import PuzzleLayout from "../../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const [pieces] = useState([
    { id: 1, color: "#4D96FF", shape: SHAPES[0] },
    { id: 2, color: "#4D96FF", shape: SHAPES[1] },
  ]);

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

        const x = rect.left - boardRect.left;
        const y = rect.top - boardRect.top;

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