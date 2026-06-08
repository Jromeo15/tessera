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

  const checkVictory = (isFilled) => {
    const board = document.querySelector(".board");
    if (!board) return;
  
    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array.from({ length: BOARD_COLS }, () => [])
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
          const type = cell.dataset.cellType;
          grid[row][col].push(type);
        }
      });
    });
  
    const win = grid.every((row) =>
      row.every((cell) => isFilled(cell))
    );
  
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
      {({ isFilled }) => (
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
                onDrop={() => checkVictory(isFilled)}
              />
            ))}
          </Board>
        </div>
      )}
    </PuzzleLayout>
  );
}