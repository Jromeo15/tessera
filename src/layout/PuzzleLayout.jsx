import { useState } from "react";
import { HelpCircle } from "lucide-react";

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        {/* TÍTULO + AYUDA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ margin: 0 }}>{title}</h1>

          {/* BOTÓN AYUDA */}
          <button
          onClick={() => setShowHelp(true)}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "none",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <HelpCircle size={30} />
        </button>
        </div>

        {/* BOTONES DERECHA */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onReset}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#ff2e63",
              color: "white",
            }}
          >
            ↻ Reiniciar
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#333",
              color: "white",
            }}
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* CONTENIDO (CENTRADO EN PANTALLA) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
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