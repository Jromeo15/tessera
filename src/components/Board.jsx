import { CELL_SIZE } from "../constants";

export default function Board({ children, boardRef }) {
  const cols = 9;
  const rows = 10;

  return (
    <div
    ref={boardRef}
      className="board"
      style={{
        position: "relative",
        width: cols * CELL_SIZE,
        height: rows * CELL_SIZE,
      
        margin: "0 auto",
      
        background: `
          radial-gradient(
            circle at 50% 45%,
            rgba(0, 210, 255, 0.07),
            transparent 55%
          ),
          linear-gradient(
            145deg,
            #f4f7f9,
            #e7ecef 55%,
            #dfe5e8
          )
        `,
      
        border: "1px solid rgba(70, 150, 175, 0.35)",
      
        boxShadow: `
          0 18px 40px rgba(0,0,0,0.20),
          0 0 18px rgba(0,180,220,0.08),
          inset 0 1px 0 rgba(255,255,255,0.95),
          inset 0 -3px 10px rgba(0,60,80,0.08)
        `,
      
        borderRadius: 7,
      
        boxSizing: "content-box",
      
        overflow: "visible",
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

              borderRight: "1px solid rgba(40,150,180,0.10)",
              borderBottom: "1px solid rgba(40,150,180,0.10)",

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