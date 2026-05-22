import { useState } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { SHAPES } from "../shapes";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const [pieces] = useState([
    { id: 1, color: "red", shape: SHAPES[0] },
    { id: 2, color: "blue", shape: SHAPES[1] },
    { id: 3, color: "green", shape: SHAPES[2] },
    { id: 4, color: "orange", shape: SHAPES[3] },
  ]);

  // 🔥 CHECK VICTORIA
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
      title="Puzle 1"
      onBack={onBack}
      onReset={() => {
        setShowVictory(false);
        setResetKey((k) => k + 1);
      }}
    >
      {/* BOARD */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 100,
          height: "100%",
        }}
      >
        <Board key={resetKey}>
          {pieces.map((p) => (
            <Piece
              key={p.id}
              id={p.id}
              color={p.color}
              shape={p.shape}
              onDrop={checkVictory}
            />
          ))}
        </Board>
      </div>

      {/* VICTORIA */}
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

            <button
              onClick={onBack}
              style={{
                marginTop: 20,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#ff2e63",
                color: "white",
              }}
            >
              Volver al menú
            </button>
          </div>
        </div>
      )}
    </PuzzleLayout>
  );
}