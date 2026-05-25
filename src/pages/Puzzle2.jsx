import { useState } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { SHAPES } from "../shapes2";
import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function App({ onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const [pieces] = useState([
    { id: 1, color: "#FF6B6B", shape: SHAPES[0].shape, shapeMode: SHAPES[0].mode }, // coral rojo
    { id: 2, color: "#F7B801", shape: SHAPES[1].shape, shapeMode: SHAPES[1].mode }, // amarillo
    { id: 3, color: "#6BCB77", shape: SHAPES[2].shape, shapeMode: SHAPES[2].mode }, // verde
    { id: 4, color: "#4D96FF", shape: SHAPES[3].shape, shapeMode: SHAPES[3].mode }, // azul
    { id: 5, color: "#9D4EDD", shape: SHAPES[4].shape, shapeMode: SHAPES[4].mode }, // violeta
    { id: 6, color: "#FF7F50", shape: SHAPES[5].shape, shapeMode: SHAPES[5].mode }, // naranja
    { id: 7, color: "#2EC4B6", shape: SHAPES[6].shape, shapeMode: SHAPES[6].mode }, // turquesa
    { id: 8, color: "#845EC2", shape: SHAPES[7].shape, shapeMode: SHAPES[7].mode }, // morado profundo
    { id: 9, color: "#00C9A7", shape: SHAPES[8].shape, shapeMode: SHAPES[8].mode }, // verde aqua
    { id: 10, color: "#FF9671", shape: SHAPES[1].shape, shapeMode: SHAPES[1].mode }, // melocotón
  ]);

  // 🔥 CHECK VICTORIA
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
      title="Puzzle 2"
      onBack={onBack}
      onReset={() => {
        setShowVictory(false);
        setResetKey((k) => k + 1);
      }}
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
            shapeMode={p.shapeMode}

            initialX={(index % 5) * 120 - 260}
            initialY={Math.floor(index / 5) * 120}

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