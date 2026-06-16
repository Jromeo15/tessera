import { useState, useEffect } from "react";
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

const BOARD_PIXEL_WIDTH = BOARD_COLS * CELL_SIZE;
const BOARD_PIXEL_HEIGHT = BOARD_ROWS * CELL_SIZE;

const SAFE_MARGIN = 20;

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
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const getPieceWidth = (shape) => {
    let maxX = 0;

    shape.forEach((row) => {
      row.forEach((cell, x) => {
        if (cell) maxX = Math.max(maxX, x);
      });
    });

    return maxX + 1;
  };

  const [pieces] = useState(() => {
    const colors = getUniqueColors(shapes.length);
  
    return shapes.map((shape, i) => ({
      id: i + 1,
      color: colors[i],
      shape,
    }));
  });

  const checkVictory = (isFilledFn) => {
    console.log("[VICTORY] checkVictory called");
  
    const board = document.querySelector(".board");
    if (!board) {
      console.log("[VICTORY] NO BOARD FOUND");
      return;
    }
  
    const piecesDom = document.querySelectorAll(".piece");
    console.log("[VICTORY] pieces found:", piecesDom.length);
  
    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array.from({ length: BOARD_COLS }, () => [])
    );
  
    let totalCells = 0;
  
    piecesDom.forEach((piece, pi) => {
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
          totalCells++;
        }
      });
    });
  
    console.log("[VICTORY] total filled cells:", totalCells);
  
    console.table(grid.map(r => r.map(c => c.join(""))));
  
    const win = grid.every(row =>
      row.every(cell => isFilledFn(cell))
    );
  
    console.log("[VICTORY] RESULT =", win);
  
    setShowVictory(win);
  };

  const topCount = Math.ceil(pieces.length / 2);
  
  useEffect(() => {
    console.log("[PuzzleLayout MOUNT]", {
      title,
      category,
      puzzleIndex,
      user: user?.id,
    });
  }, []);

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
      console.log("[registerProgress] SELECT error", error);
      return;
    }
  
    // si no existe fila → crearla y salir
    if (!data) {
      await supabase.from("user_progress").insert({
        user_id: user.id,
        category,
        unlocked_level: nextLevel,
      });
      return;
    }
  
    const current = data.unlocked_level ?? 1;
  
    // 🔥 NUNCA bajar progreso, solo subirlo
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
    console.log("[PuzzleLayout RESET STATE]", {
      puzzleIndex,
      category,
    });
  
    setHasRegistered(false);
    setRunning(true);
    setTime(0);
  }, [puzzleIndex, category]);

  useEffect(() => {
    // bloquear scroll en móvil
    const preventScroll = (e) => {
      e.preventDefault();
    };
  
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  
    document.addEventListener("touchmove", preventScroll, { passive: false });
  
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
  
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
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
    setResetKey((k) => k + 1);
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

  {/* PANEL INFERIOR */}
<div className="puzzleBottomPanel" />
  
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
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition: "transform 0.2s ease",
  }}
>
  {children ? (
    typeof children === "function"
      ? children({ isFilled: checkCellFilled })
      : children
  ) : (
    <Board key={resetKey}>
      {pieces.map((p, index) => {
        const isTopRow = index < topCount;
        const rowIndex = isTopRow ? index : index - topCount;

        const pieceWidth = getPieceWidth(p.shape) * CELL_SIZE;

        const availableWidth = BOARD_PIXEL_WIDTH - SAFE_MARGIN * 2;

        const slotWidth =
          topCount > 1 ? availableWidth / (topCount - 1) : 0;

        let centerX =
          topCount > 1
            ? SAFE_MARGIN + slotWidth * rowIndex
            : BOARD_PIXEL_WIDTH / 2;

        const globalBias = -40;
        centerX += globalBias;

        const minCenter = SAFE_MARGIN + pieceWidth / 2;
        const maxCenter =
          BOARD_PIXEL_WIDTH - SAFE_MARGIN - pieceWidth / 2;

        if (centerX < minCenter) {
          centerX += (minCenter - centerX) * 0.6;
        } else if (centerX > maxCenter) {
          centerX -= (centerX - maxCenter) * 0.6;
        }

        const x = centerX - pieceWidth / 2;

        const y = isTopRow
          ? -80
          : window.innerHeight * 0.15;

          const delayedCheck = () => {
            requestAnimationFrame(() => {
              checkVictory(checkCellFilled);
            });
          };

        return (
          
          <Piece
            key={p.id}
            id={p.id}
            color={p.color}
            shape={p.shape}
            initialX={x}
            initialY={y}
            onDrop={() => delayedCheck()}
            onRotate={() => delayedCheck()}
          />
        );
      })}
    </Board>
  )}
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