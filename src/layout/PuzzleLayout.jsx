import { useState } from "react";
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
}) {
  const [showHelp, setShowHelp] = useState(false);

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
        {/* TÍTULO + AYUDA */}
        <div className="puzzleTitleWrap">
        <div className="puzzleTitleBlock">
          <h1 className="puzzleTitle">{title}</h1>
          <div className="puzzleTitleLine" />
        </div>

          {/* BOTÓN AYUDA */}
          <button
  onClick={() => setShowHelp(true)}
  style={{
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "None",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  }}
>
  <HelpCircle size={30} color="#222" />
</button>
        </div>

        {/* BOTONES DERECHA */}
        <div className="puzzleActions">
        <button
          onClick={onReset}
          className="puzzleBtn puzzleBtnPrimary"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={onBack}
          className="puzzleBtn"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      </div>

      {/* CONTENIDO (CENTRADO EN PANTALLA) */}
      <div className="puzzleContent">
        {children}
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
    </div>
  );
}