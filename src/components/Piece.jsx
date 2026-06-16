import { useState, useRef, useEffect, useMemo } from "react";
import { CELL_SIZE } from "../constants";
import { Undo, Redo } from "lucide-react";

let activePieceId = null;
let topPieceId = null;

let overlapTick = 0;

const forceGlobalOverlapRecalc = () => {
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("global-overlap"));
  });
};

const compatiblePairs = {
  "3": "6",
  "6": "3",

  "4": "5",
  "5": "4",

  "a": "g",
  "g": "a",

  "b": "h",
  "h": "b",

  "c": "e",
  "e": "c",

  "d": "f",
  "f": "d",
};

const areCompatible = (a, b) => {
  return compatiblePairs[a] === b;
};


const rotateCellType  = (value) => {
  switch (value) {
    case 3:
      return 5;

    case 5:
      return 6;

    case 6:
      return 4;

    case 4:
      return 3;

    case "a": return "b";
    case "b": return "c";
    case "c": return "d";
    case "d": return "a";
    
    case "e": return "f";
    case "f": return "g";
    case "g": return "h";
    case "h": return "e";

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
      rotateCellType(matrix[r][c]);

      rotated[c][rows - 1 - r] =
        rotatedValue;
    }
  }

  return rotated;
};

// hit test
const getCellFromPoint = (x, y) => {
  let el = document.elementFromPoint(x, y);

  while (
    el &&
    (
      el.classList?.contains("type-e") ||
      el.classList?.contains("type-f") ||
      el.classList?.contains("type-g") ||
      el.classList?.contains("type-h")
    )
  ) {
    el.style.pointerEvents = "none";
    el = document.elementFromPoint(x, y);
    el?.style?.removeProperty("pointer-events");
  }

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
  onRotate,
}) {
  const isTriangle = shapeMode === "triangle";
  const [gridPos, setGridPos] = useState(() => ({
    col: Math.round(initialX / CELL_SIZE) + 1,
    row: Math.round(initialY / CELL_SIZE),
  }));

  const [rot, setRot] = useState(0);
  const [showRotateButtons, setShowRotateButtons] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [isTouchingPanel, setIsTouchingPanel] = useState(false);


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

  const checkOverlap = () => {
    const pieces = document.querySelectorAll(".piece");
    const myCells = document.querySelectorAll(`.piece-${id} .piece-cell`);
    const getType = (el) => {
      const match = [...el.classList].find(c => c.startsWith("type-"));
      return match ? match.replace("type-", "") : null;
    };
  
    let overlap = false;
  
    myCells.forEach((cell) => {
      const rect = cell.getBoundingClientRect();
  
      pieces.forEach((el) => {
        if (el.classList.contains(`piece-${id}`)) return;
  
        const targetCells = el.querySelectorAll(".piece-cell");
  
        targetCells.forEach((t) => {
          const r = t.getBoundingClientRect();
  
        const intersect =
          !(rect.right <= r.left ||
            rect.left >= r.right ||
            rect.bottom <= r.top ||
            rect.top >= r.bottom);
        
        if (intersect) {
          const a = getType(cell);
          const b = getType(t);
        
          // si son triángulos compatibles, NO es overlap
          console.log("compatibilidad", a, b);
          if (a && b && areCompatible(a, b)) {
            return;
          }
        
          overlap = true;
        }
        });
      });
    });
  
    return overlap;
  };

  const updatePanelTouch = () => {
    const panel = document.querySelector(".puzzleBottomPanel");
    if (!panel) return;
  
    const panelRect = panel.getBoundingClientRect();
  
    const myCells = document.querySelectorAll(`.piece-${id} .piece-cell`);
  
    let touching = false;
  
    myCells.forEach((cell) => {
      const rect = cell.getBoundingClientRect();
  
      const intersect =
        !(rect.right <= panelRect.left ||
          rect.left >= panelRect.right ||
          rect.bottom <= panelRect.top ||
          rect.top >= panelRect.bottom);
  
      if (intersect) touching = true;
    });
  
    setIsTouchingPanel(touching);
  };

  // -------------------------
  // DRAG START
  // -------------------------
  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    moved.current = false;


    activePieceId = id;
    topPieceId = id;

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
        col: Math.round((clientX - offset.current.x) / CELL_SIZE),
        row: Math.round((clientY - offset.current.y) / CELL_SIZE),
      });

    forceGlobalOverlapRecalc();
      
    }
  };
  const endDrag = () => {
  
    dragging.current = false;
  
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
      topPieceId = null;
      return;
    }
  
    const finalCol = Math.round(xInside / CELL_SIZE);
    const finalRow = Math.round(yInside / CELL_SIZE);
  
    setGridPos({
      col: finalCol,
      row: finalRow,
    });
  
    activePieceId = null;
  
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          onDrop?.({ col: finalCol, row: finalRow });
          forceGlobalOverlapRecalc();
        }, 0);
      });
    });

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

    topPieceId = id;
  
    setShowRotateButtons((v) => !v);
  };

  const rotateLeft = (e) => {
    e.stopPropagation();
  
    setRot((r) => (r + 3) % 4);
    topPieceId = id;
  
    requestAnimationFrame(() => {
      onRotate?.();
    });
  
    setShowRotateButtons(false);
    forceGlobalOverlapRecalc();
    
  };
  
  const rotateRight = (e) => {
    e.stopPropagation();
  
    setRot((r) => (r + 1) % 4);
    topPieceId = id;
  
    requestAnimationFrame(() => {
      onRotate?.();
    });
  
    setShowRotateButtons(false);
    forceGlobalOverlapRecalc();
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


  useEffect(() => {
    if (!showRotateButtons) return;
  
    const closeButtons = (e) => {
      if (!e.target.closest(`.piece-${id}`)) {
        setShowRotateButtons(false);
      }
    };
  
    window.addEventListener("mousedown", closeButtons);
    window.addEventListener("touchstart", closeButtons);
  
    return () => {
      window.removeEventListener("mousedown", closeButtons);
      window.removeEventListener("touchstart", closeButtons);
    };
  }, [showRotateButtons, id]);

  useEffect(() => {
    const clearFocus = () => {
      activePieceId = null;
      topPieceId = null;
    };
  
    const handleMouseUp = () => clearFocus();
    const handleTouchEnd = () => clearFocus();
  
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);
  
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    let raf;
  
    const update = () => {
      cancelAnimationFrame(raf);
  
      raf = requestAnimationFrame(() => {
        setIsOverlapping(checkOverlap());
      });
    };
  
    update();
  
    window.addEventListener("global-overlap", update);
  
    return () => {
      window.removeEventListener("global-overlap", update);
      cancelAnimationFrame(raf);
    };
  }, [gridPos, rot]);

  useEffect(() => {
    updatePanelTouch();
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
      
        zIndex:
          topPieceId === id
            ? 9999
            : activePieceId === id
              ? 5000
              : 1,
      
      
              transform:
              dragging.current || !isTouchingPanel
                ? "scale(1)"
                : "scale(0.4)",
        transition: "transform 0.15s ease",
      }}
    >

{showRotateButtons && (
  <div
  style={{
    position: "absolute",
    top: -55,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 28,
    pointerEvents: "auto",
    zIndex: 999999,
    isolation: "isolate",
  }}
  >
<button
  onClick={rotateLeft}
  className="rotateButton"
>
  <Undo className="rotateButtonIcon" />
</button>

<button
  onClick={rotateRight}
  className="rotateButton"
>
  <Redo className="rotateButtonIcon" />
</button>
  </div>
)}

    {rotatedShape.flat().map((cell, i) => {
      if (!cell) {
        return (
          <div
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      }

      return (
        <div
          key={i}
          data-cell-type={cell}
          className={`piece-cell type-${cell}`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,

            background: color,
            opacity: isOverlapping ? 0.6 : 1,
            filter: isOverlapping ? "brightness(0.6)" : "none",

            boxSizing: "border-box",
            pointerEvents: "auto",
          }}
        />
      );
    })}
    </div>
  );
}