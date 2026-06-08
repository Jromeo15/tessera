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

        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 40%),
          radial-gradient(circle at 80% 90%, rgba(0,200,255,0.08), transparent 50%),
          linear-gradient(145deg, #f5f5f5, #e6e6e6)
        `,

        border: "1px solid rgba(0,0,0,0.12)",

        boxShadow: `
          0 12px 35px rgba(0,0,0,0.18),
          inset 0 1px 0 rgba(255,255,255,0.9),
          inset 0 -2px 8px rgba(0,0,0,0.05)
        `,

        borderRadius: 5,

        boxSizing: "content-box",
      }}
    >
      {/*GRID VISUAL */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,

          pointerEvents: "none",

          // sutil efecto de profundidad
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,

              borderRight: "1px solid rgba(0,0,0,0.06)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",

              boxSizing: "border-box",

              // micro brillo sutil (da look tech)
              background: "rgba(255,255,255,0.02)",
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
}