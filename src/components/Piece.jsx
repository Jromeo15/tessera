import { useState, useRef, useEffect, useMemo } from "react";
import { CELL_SIZE } from "../constants";

let activePieceId = null;

const rotateMatrix = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }

  return rotated;
};

const findTopLeft = (shape) => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) return { r, c };
    }
  }
  return { r: 0, c: 0 };
};

// 🔥 HIT TEST GLOBAL REAL
const getCellFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  return el?.closest?.(".piece-cell") || null;
};

export default function Piece({ shape, color, id }) {
  const [pos, setPos] = useState({ x: 0, y: -240 });
  const [rot, setRot] = useState(0);

  const dragging = useRef(false);
  const moved = useRef(false);

  const offset = useRef({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0 });

  const rotatedShape = useMemo(() => {
    let s = shape;
    for (let i = 0; i < rot; i++) {
      s = rotateMatrix(s);
    }
    return s;
  }, [shape, rot]);

  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    moved.current = false;

    activePieceId = id;

    start.current = { x: clientX, y: clientY };

    offset.current = {
      x: clientX - pos.x,
      y: clientY - pos.y,
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragging.current) return;

    const dx = Math.abs(clientX - start.current.x);
    const dy = Math.abs(clientY - start.current.y);

    if (dx > 3 || dy > 3) {
      moved.current = true;

      setPos({
        x: clientX - offset.current.x,
        y: clientY - offset.current.y,
      });
    }
  };

  const endDrag = () => {
    dragging.current = false;

    if (activePieceId !== id) return;

    const board = document.querySelector(".board");
    if (!board) return;

    const rect = board.getBoundingClientRect();

    const relativeX = pos.x;
    const relativeY = pos.y;

    const inside =
      relativeX >= 0 &&
      relativeY >= 0 &&
      relativeX <= rect.width &&
      relativeY <= rect.height;

    if (!inside) {
      activePieceId = null;
      return;
    }

    const col = Math.round(relativeX / CELL_SIZE);
    const row = Math.round(relativeY / CELL_SIZE);

    const { r, c } = findTopLeft(rotatedShape);

    setPos({
      x: col * CELL_SIZE - c * CELL_SIZE,
      y: row * CELL_SIZE - r * CELL_SIZE,
    });

    activePieceId = null;
  };

  // -------------------------
  // POINTER START (mouse/touch)
  // -------------------------
  const onMouseDown = (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];

    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (!cell) return;

    startDrag(touch.clientX, touch.clientY);
  };

  // -------------------------
  // ROTATION CLICK
  // -------------------------
  const onClick = (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    if (moved.current) return;

    setRot((r) => (r + 1) % 4);
  };

  useEffect(() => {
    const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    };

    const handleMouseUp = () => endDrag();
    const handleTouchEnd = () => endDrag();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pos, rotatedShape]);

  return (
    <div
      className="piece"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={onClick}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        display: "grid",
        gridTemplateColumns: `repeat(${rotatedShape[0].length}, ${CELL_SIZE}px)`,
        gap: 0,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {rotatedShape.flat().map((cell, i) =>
        cell ? (
          <div
            className="piece-cell"
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: color,
              outline: "1px solid rgba(0,0,0,0.2)",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              pointerEvents: "none",
            }}
          />
        )
      )}
    </div>
  );
}