import { useState } from "react";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { CELL_SIZE } from "../constants";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
];

// 🔥 SHAPES GENERADAS LOCALMENTE
const RANDOM_SHAPES = [
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    mode: "square",
  },
  {
    shape: [
      [1, 1],
      [1, 0],
    ],
    mode: "square",
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    mode: "triangle",
  },
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    mode: "square",
  },
  {
    shape: [
      [1],
      [1],
      [1],
    ],
    mode: "square",
  },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const generateRandomPieces = () => {
  const selected = shuffle(RANDOM_SHAPES).slice(0, 2);

  return selected.map((s, i) => ({
    id: i + 1,
    color: COLORS[i % COLORS.length],
    shape: s.shape,
    shapeMode: s.mode,
  }));
};

export default function PuzzleRandom({ onBack }) {
  const [showVictory, setShowVictory] = useState(false);
  const [pieces] = useState(() => generateRandomPieces());

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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <h1 style={{ margin: 0 }}>Puzzle Random</h1>

        <button
          onClick={onBack}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#333",
            color: "white",
          }}
        >
          ← Volver
        </button>
      </div>

      {/* BOARD */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 140,
        }}
      >
        <Board>
          {pieces.map((p) => (
            <Piece
              key={p.id}
              id={p.id}
              color={p.color}
              shape={p.shape}
              shapeMode={p.shapeMode}
              onDrop={checkVictory}
            />
          ))}
        </Board>
      </div>

      {/* VICTORY */}
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
              textAlign: "center",
            }}
          >
            <h2>VICTORIA</h2>
            <p>Has completado el puzzle aleatorio</p>

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
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}