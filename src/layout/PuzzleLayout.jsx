import { useState, useEffect, useRef } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Board from "../components/Board";
import Piece from "../components/Piece";
import { getUniqueColors } from "../components/colors";

import { CELL_SIZE } from "../constants";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

export default function PuzzleLayout({
  title,
  category,
  puzzleIndex,
  onBack,
  children,
  externalTimer = null,
  hideInternalTimer = false,
  isFilled,
  shapes,
}) {
  let stp = 0;
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const panelRef = useRef(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const [hiddenPieces, setHiddenPieces] = useState({});
  const [panelReady, setPanelReady] = useState(false);
  const [reappearingPieces, setReappearingPieces] = useState({});
  const [disappearingPieces, setDisappearingPieces] = useState({});
  const [topPieceId, setTopPieceId] = useState(null);

  const [pieces] = useState(() => {
    const colors = getUniqueColors(shapes.length);
  
    return shapes.map((shape, i) => ({
      id: i + 1,
      color: colors[i],
      shape,
      height: shape.length,
      width: shape[0].length,
    }));
  });

  const sortedPieces = [...pieces].sort((a, b) => b.width - a.width);

  const initialPositions = useRef(null);

if (!initialPositions.current) {
  let stp = 0;

  const screenHeight = window.innerHeight;
  const y = screenHeight / 1.8 + 2 * 0.4 * CELL_SIZE;
  const baseX = -window.innerWidth / 5 + 2 * 0.4 * CELL_SIZE;

  initialPositions.current = sortedPieces.map((p) => {
    const initialX = baseX + stp;

    stp += p.width * CELL_SIZE * 0.4 + CELL_SIZE * 0.4;

    return {
      id: p.id,
      initialX,
      initialY: y,
    };
  });
}

  const checkVictory = (isFilledFn) => {
  
    const board = document.querySelector(".board");
  
    const piecesDom = document.querySelectorAll(".piece");
  
    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array.from({ length: BOARD_COLS }, () => [])
    );
  
    piecesDom.forEach((piece) => {
      const cells = piece.querySelectorAll(".piece-cell");

      const boardRect = board.getBoundingClientRect();
  
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
  
        const zoom =
          parseFloat(getComputedStyle(document.body).getPropertyValue("--zoom")) || 1;
  
        const x = (rect.left - boardRect.left) / zoom;
        const y = (rect.top - boardRect.top) / zoom;
  
        const col = Math.round(x / CELL_SIZE);
        const row = Math.round(y / CELL_SIZE);
  
        if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS) {
          const type = cell.dataset.cellType || "1";
          grid[row][col].push(type);
        }
      });
    });
  
    const win = grid.every(row =>
      row.every(cell => isFilledFn(cell))
    );

    setShowVictory(win);
  };

  const zoomOut = () => {
    setZoom((z) => Math.max(0.8, z - 0.2));
  };
  
  const zoomIn = () => {
    setZoom((z) => Math.min(1.2, z + 0.2));
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
  
  const defaultIsFilled = (parts) => {
    if (parts.length === 0) {
      return false;
    }
  
    if (parts.includes("1")) {
      return true;
    }
  
    if (parts.length !== 2) {
      return false;
    }
  
    return compatiblePairs[parts[0]] === parts[1];
  };
  
  const checkCellFilled = isFilled || defaultIsFilled;

  const registerProgress = async () => {
    if (!user) return;
    if (puzzleIndex <= 1) return;
  
    const nextLevel = puzzleIndex + 1;
  
    const { data, error } = await supabase
      .from("user_progress")
      .select("unlocked_level")
      .eq("user_id", user.id)
      .eq("category", category)
      .maybeSingle();
  
    if (error) {
      return;
    }
    if (!data) {
      await supabase.from("user_progress").insert({
        user_id: user.id,
        category,
        unlocked_level: nextLevel,
      });
      return;
    }
  
    const current = data.unlocked_level ?? 1;
  
    const newLevel = Math.max(current, nextLevel);
  
    if (newLevel === current) return;
  
    await supabase
      .from("user_progress")
      .update({
        unlocked_level: newLevel,
      })
      .eq("user_id", user.id)
      .eq("category", category);
  };
  useEffect(() => {
    if (!running) return;
  
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!showVictory) return;
    if (hasRegistered) return;
  
    setRunning(false);
    setHasRegistered(true);
  
    registerProgress();
  }, [showVictory]);

  useEffect(() => {
    document.body.style.setProperty("--zoom", zoom);
  }, [zoom]);

  useEffect(() => {
    setHasRegistered(false);
    setRunning(true);
    setTime(0);
  }, [puzzleIndex, category]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);


  useEffect(() => {
    if (!panelVisible) return;
  
    const ids = Object.keys(hiddenPieces);
  
    if (ids.length === 0) return;
  
    const newState = {};
  
    ids.forEach((id) => {
      newState[id] = true;
    });
  
    setReappearingPieces(newState);
  
    const timeout = setTimeout(() => {
      setReappearingPieces({});
    }, 300);
  
    return () => clearTimeout(timeout);
  }, [panelVisible]);


  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
  
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const isPieceTouchingPanel = (pieceEl) => {
    if (!panelRef.current || !pieceEl) return false;
  
    const panelRect = panelRef.current.getBoundingClientRect();
    const pieceRect = pieceEl.getBoundingClientRect();
  
    return !(
      pieceRect.bottom < panelRect.top ||
      pieceRect.top > panelRect.bottom ||
      pieceRect.right < panelRect.left ||
      pieceRect.left > panelRect.right
    );
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
      <div className="puzzleHeader">
{/* TÍTULO */}
<div className="puzzleTitleWrap">
  <div className="puzzleTitleBlock">
  <h1 className={`puzzleTitle ${title === "Contrarreloj" ? "puzzleTitle--small" : ""}`}>
    {title}
  </h1>
    <div className="puzzleTitleLine" />
  </div>
</div>

{/* BOTONES DERECHA */}
<div className="puzzleActions">

  <button
    onClick={() => setShowHelp(true)}
    className="puzzleIconBtn puzzleIconBtn--help"
  >
    <HelpCircle size={20} strokeWidth={2.5} />
  </button>

  <button
  onClick={() => {
  
    setShowVictory(false);
  
    setResetKey((k) => {
      return k + 1;
    });
  }}
  className="puzzleIconBtn puzzleIconBtn--reset"
>
    <RotateCcw size={20} strokeWidth={2.5} />
  </button>

  <button
    onClick={onBack}
    className="puzzleIconBtn puzzleIconBtn--back"
  >
    <ArrowLeft size={20} strokeWidth={2.5} />
  </button>

</div>
      </div>

      {/* CONTENIDO (CENTRADO EN PANTALLA) */}
{/* CONTENIDO (CENTRADO EN PANTALLA) */}
<div className="puzzleContent" style={{ position: "relative" }}>


  
  {/* ZOOM BAR (FLOAT TOP-LEFT) */}
  <div
  style={{
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    gap: 10,
    zIndex: 50,
  }}
>
<button
  onClick={zoomOut}
  style={{
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#3aafe0",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 8px 20px rgba(0,157,255,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    transition: "all 0.2s ease",
  }}
>
  <ZoomOut size={18} strokeWidth={2.5} />
</button>

<button
  onClick={zoomIn}
  style={{
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#3aafe0",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 8px 20px rgba(0,157,255,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    transition: "all 0.2s ease",
  }}
>
  <ZoomIn size={18} strokeWidth={2.5} />
</button>

</div>

{!hideInternalTimer && (
  <div className="puzzleTimerBottom">
    {externalTimer ?? formatTime(time)}
  </div>
)}


  {/* CONTENIDO REAL */}
  <div
  style={{
    transformOrigin: "center center",
    transition: "transform 0.2s ease",
    zIndex: 999
  }}
>
  {children ? (
    typeof children === "function"
      ? children({ isFilled: checkCellFilled })
      : children
  ) : (

    <div style={{ position: "relative", zIndex: 50, transform: "translateY(-80px)"}}>
<Board key={resetKey}>
  <div
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    paddingLeft: 0,
  }}
>´

  
  {sortedPieces.map((p, index) => {

const { initialX, initialY } = initialPositions.current[index];

  const delayedCheck = () => {
    requestAnimationFrame(() => {
      checkVictory(checkCellFilled);
    });
  };

  const el = document.querySelector(`.piece-${p.id}`);
  const shouldHide = !panelVisible && isPieceTouchingPanel(el);

  if (shouldHide && !hiddenPieces[p.id]) {
    setHiddenPieces(prev => ({
      ...prev,
      [p.id]: true,
    }));
  }

return (
<div
  key={`${resetKey}-${p.id}`}
  className={
    reappearingPieces[p.id]
      ? "pieceReappear"
      : disappearingPieces[p.id]
      ? "pieceDisappear"
      : ""
  }
  style={{
    display:
      hiddenPieces[p.id] && !panelVisible
        ? "none"
        : "block",
  }}
>
<Piece
  id={p.id}
  color={p.color}
  shape={p.shape}
  initialX={initialX}
  initialY={initialY}
  onDrop={delayedCheck}
  onRotate={delayedCheck}
  setTopPieceId={setTopPieceId}
  topPieceId={topPieceId}
/>
  </div>
);
})}
  </div>
</Board>
</div>
  )}
  
{/* PANEL + BOTÓN TOGGLE */}
<div
  style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    overflow: "visible",
    pointerEvents: "none",
  }}
>
{panelVisible !== undefined && (
  <>
    {/* PANEL + BOTÓN */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
<div
  ref={panelRef}
  className={`puzzleBottomPanel ${
    panelReady
      ? panelVisible
        ? "panel--open"
        : "panel--closed"
      : ""
  }`}
  style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
    overflow: "hidden",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, ${CELL_SIZE * 0.4}px)`,
      gridAutoRows: `${CELL_SIZE * 0.4}px`,
      pointerEvents: "none",
    }}
  >
    {Array.from({
      length:
        Math.ceil(window.innerWidth / (CELL_SIZE * 0.4)) *
        Math.ceil(220 / (CELL_SIZE * 0.4)),
    }).map((_, i) => (
      <div
        key={i}
        style={{
          borderRight: "1px solid rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          boxSizing: "border-box",
        }}
      />
    ))}
  </div>
</div>
    </div>

    {/* BOTÓN ÚNICO ANIMADO */}
    <button
onPointerDown={(e) => {
  e.preventDefault();

  if (panelVisible) {
    const toHide = {};

    pieces.forEach((p) => {
      const el = document.querySelector(`.piece-${p.id}`);

      if (isPieceTouchingPanel(el)) {
        toHide[p.id] = true;
      }
    });

    setDisappearingPieces(toHide);

    setTimeout(() => {
      setHiddenPieces((prev) => ({
        ...prev,
        ...toHide,
      }));

      setDisappearingPieces({});
    }, 180);
  } else {
    setReappearingPieces({ ...hiddenPieces });

    setTimeout(() => {
      setReappearingPieces({});
    }, 300);

    setHiddenPieces({});
  }

  setPanelVisible(!panelVisible);
  setPanelReady(true);
}}
      className={`puzzleToggleButton ${
        panelVisible ? "toggle--open" : "toggle--closed"
      }`}
    >
      <span style={{ fontSize: 12, color: "#6f6f6f" }}>
        {panelVisible ? "▼" : "▲"}
      </span>
    </button>
  </>
)}
</div>
</div>

</div>

      {/* MODAL AYUDA */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              width: 320,
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowHelp(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 22,
                fontWeight: "bold",
                cursor: "pointer",
                color: "#000",
              }}
            >
              ×
            </button>

            <h3>Ayuda</h3>

            <p style={{ marginTop: 15, textAlign: "left" }}>
              Arrastra las piezas para colocarlas sobre el tablero
              <br />
              <br />
              Pulsa sobre una pieza para rotarla
              <br />
              <br />
              Rellena todas las casillas del tablero con las piezas
              <br />
              <br />
              Si la pieza está gris significa que está encima o debajo de otra pieza
              <br />
              <br />
              Pulsa sobre el zoom en la esquina superior izquirda de la pantalla para acercar o alejar las piezas.
            </p>

            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: 20,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#333",
                color: "white",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* MODAL VICTORIA */}
{showVictory && (
  <div className="victoryOverlay">
    <div className="victoryPopup">

    <button
  onClick={() => setShowVictory(false)}
  className="victoryClose"
>
        ×
      </button>

      <div className="victoryIcon">
        {/* ✨ */}
      </div>

      <h2 className="victoryTitle">
        ¡VICTORIA!
      </h2>

      <div className="victoryLine" />

      <p className="victoryText">
        Has completado el puzzle correctamente
      </p>
      <p className="victoryTime">
  Tiempo: {formatTime(time)}
</p>

      <button
        onClick={onBack}
        className="victoryButton"
      >
        Volver al menú
      </button>
    </div>
  </div>
)}
    </div>
  );
}