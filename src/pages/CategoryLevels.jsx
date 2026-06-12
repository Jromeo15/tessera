import { useState } from "react";
import { ArrowLeft, Play, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FREE_LEVELS } from "../constants";

export default function CategoryLevels({
  category,
  puzzles,
  onBack,
  onSelectPuzzle,
}) {
  const { user } = useAuth();

  const [showLockedPopup, setShowLockedPopup] = useState(false);

  const CATEGORIES = {
    square: {
      title: "Fácil",
      className: "title--square",
    },
    triangle: {
      title: "Medio",
      className: "title--triangle",
    },
    circle: {
      title: "Difícil",
      className: "title--circle",
    },
    skull: {
      title: "Chunguele",
      className: "title--skull",
    },
  };

  const data = CATEGORIES[category];
  const list = puzzles?.[category] || [];

  return (
    <div className="home">
      <div className="home__card">

        <h1 className={`home__title ${data?.className}`}>
          {data?.title}
        </h1>

        {list.map((puzzle, index) => {
          const isLocked = !user && index >= FREE_LEVELS;

          return (
            <button
              key={puzzle.name}
              className={`home__button categoryBtnTheme--${category} ${
                isLocked ? "lockedLevel" : ""
              }`}
              onClick={() => {
                if (isLocked) {
                  setShowLockedPopup(true);
                  return;
                }

                onSelectPuzzle(puzzle.component);
              }}
            >
              <span className="puzzleBtnContent">
                {isLocked ? (
                  <Lock size={16} strokeWidth={2.5} />
                ) : (
                  <Play size={16} strokeWidth={2.5} />
                )}

                {puzzle.name.replace(/([a-zA-Z])(\d+)$/, "$1 $2")}
              </span>
            </button>
          );
        })}

        {showLockedPopup && (
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
                width: 340,
                textAlign: "center",
                position: "relative",
              }}
            >
              <button
                onClick={() => setShowLockedPopup(false)}
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

              <Lock
                size={40}
                style={{
                  marginBottom: 10,
                  color: "#666",
                }}
              />

              <h3>Nivel bloqueado</h3>

              <p
                style={{
                  marginTop: 20,
                  lineHeight: 1.5,
                }}
              >
                Necesitas iniciar sesión para acceder a estos niveles.
                <br />
                <br />
              </p>

              <button
                onClick={() => setShowLockedPopup(false)}
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
                Entendido
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}