import { useState } from "react";
import Board from "../../components/Board";
import Piece from "../../components/Piece";
import { SHAPES } from "./shapes/shapes-logo";
import { CELL_SIZE } from "../../constants";
import PuzzleLayout from "../../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const [pieces] = useState([
    { id: 1, color: "#F7B801", shape: SHAPES[0] }, // coral rojo
    { id: 2, color: "#FF7F50", shape: SHAPES[1] }, // amarillo
    { id: 3, color: "#6BCB77", shape: SHAPES[2] }, // verde
    { id: 4, color: "#2EC4B6", shape: SHAPES[3] }, // azul
    { id: 5, color: "#4D96FF", shape: SHAPES[4] }, // violeta
    { id: 6, color: "#FF6B6B", shape: SHAPES[5] }, // naranja
    { id: 7, color: "#9D4EDD", shape: SHAPES[6] }, // turquesa
    { id: 8, color: "#d3d3d3", shape: SHAPES[7] },
    { id: 9, color: "#d3d3d3", shape: SHAPES[8] },
    { id: 10, color: "#d3d3d3", shape: SHAPES[9] },
    { id: 11, color: "#d3d3d3", shape: SHAPES[10] },
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
      onRotate={checkVictory}
    />
  ))}
</Board>
      </div>
    </PuzzleLayout>
  );
}