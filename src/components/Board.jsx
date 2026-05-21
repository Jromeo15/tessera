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
        border: "2px solid black",
        backgroundColor: "#f2f2f2",
      }}
    >
      {/* grid visual SOLO decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              outline: "1px solid #ddd",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
}