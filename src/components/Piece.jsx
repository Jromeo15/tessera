import { useState, useRef, useEffect, useMemo } from "react";
import { CELL_SIZE } from "../constants";

let activePieceId = null;

const rotateTriangleType = (value) => {
  switch (value) {
    case 3:
      return 5;

    case 5:
      return 6;

    case 6:
      return 4;

    case 4:
      return 3;

    default:
      return value;
  }
};

const rotateMatrix = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated = Array.from(
    { length: cols },
    () => Array(rows).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      const rotatedValue =
        rotateTriangleType(matrix[r][c]);

      rotated[c][rows - 1 - r] =
        rotatedValue;
    }
  }

  return rotated;
};

// hit test
const getCellFromPoint = (x, y) => {
  const el = document.elementFromPoint(x, y);
  return el?.closest?.(".piece-cell") || null;
};

export default function Piece({
  shape,
  color,
  id,
  shapeMode = "square",
  initialX = 0,
  initialY = 0,
  onDrop,
}) {
  const isTriangle = shapeMode === "triangle";
  const [gridPos, setGridPos] = useState(() => ({
    col: Math.round(initialX / CELL_SIZE) + 1,
    row: Math.round(initialY / CELL_SIZE),
  }));

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

  // -------------------------
  // DRAG START
  // -------------------------
  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    moved.current = false;

    activePieceId = id;

    start.current = {
      x: clientX,
      y: clientY,
    };

    offset.current = {
      x: clientX - gridPos.col * CELL_SIZE,
      y: clientY - gridPos.row * CELL_SIZE,
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragging.current) return;

    const dx = Math.abs(clientX - start.current.x);
    const dy = Math.abs(clientY - start.current.y);

    if (dx > 3 || dy > 3) {
      moved.current = true;

      setGridPos({
        col: Math.round(
          (clientX - offset.current.x) / CELL_SIZE
        ),
        row: Math.round(
          (clientY - offset.current.y) / CELL_SIZE
        ),
      });
    }
  };

  const endDrag = () => {
    dragging.current = false;

    if (activePieceId !== id) return;

    const board = document.querySelector(".board");
    if (!board) return;

    const rect = board.getBoundingClientRect();

    const xInside = gridPos.col * CELL_SIZE;
    const yInside = gridPos.row * CELL_SIZE;

    const inside =
      xInside >= 0 &&
      yInside >= 0 &&
      xInside <= rect.width &&
      yInside <= rect.height;

    if (!inside) {
      activePieceId = null;
      return;
    }

    setGridPos({
      col: Math.round(xInside / CELL_SIZE),
      row: Math.round(yInside / CELL_SIZE),
    });

    activePieceId = null;
    onDrop?.();
  };

  // -------------------------
  // INPUTS
  // -------------------------
  const onMouseDown = (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);

    if (!cell) return;

    if (!cell.closest(`.piece-${id}`)) return;

    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];

    const cell = getCellFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (!cell) return;

    if (!cell.closest(`.piece-${id}`)) return;

    startDrag(touch.clientX, touch.clientY);
  };

  const onClick = (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);

    if (!cell) return;

    if (!cell.closest(`.piece-${id}`)) return;

    if (moved.current) return;


    setRot((r) => (r + 1) % 4);

  };

  // -------------------------
  // GLOBAL EVENTS
  // -------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      moveDrag(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      const t = e.touches[0];

      moveDrag(t.clientX, t.clientY);
    };

    const handleMouseUp = () => endDrag();
    const handleTouchEnd = () => endDrag();

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [gridPos, rot]);

  return (
    <div
      className={`piece piece-${id}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={onClick}
      style={{
        position: "absolute",
        left: gridPos.col * CELL_SIZE,
        top: gridPos.row * CELL_SIZE,

        display: "grid",

        gridTemplateColumns: `repeat(${rotatedShape[0].length}, ${CELL_SIZE}px)`,

        cursor: "grab",
        userSelect: "none",
        touchAction: "none",

        zIndex: activePieceId === id ? 1000 : 1,

        // 🔥 CLAVE
        pointerEvents: "none",
      }}
    >
    {rotatedShape.flat().map((cell, i) => {
      if (!cell) {
        return (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              pointerEvents: "none",
            }}
          />
        );
      }

      return (
        <div
          key={i}
          className={`piece-cell type-${cell}`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,

            background: color,

            boxSizing: "border-box",
            pointerEvents: "auto",
          }}
        />
      );
    })}
    </div>
  );
}