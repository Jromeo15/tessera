import { CELL_SIZE } from "../constants";

export default function Board({ children }) {
  const cols = 9;
  const rows = 10;

  return (
    <div
      className="board"
      style={{
        position: "relative",
        width: cols * CELL_SIZE,
        height: rows * CELL_SIZE,

        margin: "0 auto",

        backgroundColor: "var(--board-bg)",

        border: "2px solid black",

        boxSizing: "content-box",
      }}
    >
      {/* GRID VISUAL */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "grid",

          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,

          pointerEvents: "none",
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,

              borderRight: "1px solid #d4d4d4",
              borderBottom: "1px solid #d4d4d4",

              boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
}