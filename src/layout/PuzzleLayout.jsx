import { useState, useEffect } from "react";
import {
  HelpCircle,
  RotateCcw,
  ArrowLeft
} from "lucide-react";

export default function PuzzleLayout({
  title,
  onBack,
  onReset,
  children,
  showVictory = false,
  onCloseVictory,
  externalTimer = null,
  hideInternalTimer = false,
}) {
  const [showHelp, setShowHelp] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
  
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (showVictory) {
      setRunning(false);
    }
  }, [showVictory]);

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
    <h1 className="puzzleTitle">{title}</h1>
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
    onClick={onReset}
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
      <div className="puzzleContent">
        {children}
      </div>

      {!hideInternalTimer && (
  <div className="puzzleTimerBottom">
    {externalTimer ?? formatTime(time)}
  </div>
)}

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
                fontSize: 18,
                cursor: "pointer",
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
        onClick={onCloseVictory}
        className="victoryClose"
      >
        ×
      </button>

      <div className="victoryIcon">
        ✨
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