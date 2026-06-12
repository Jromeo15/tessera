import { useState, useEffect } from "react";
import { ArrowLeft, Play, Lock, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { FREE_LEVELS } from "../constants";

export default function CategoryLevels({
  category,
  puzzles,
  onBack,
  onSelectPuzzle,
  progress: externalProgress, // 👈 NUEVO (opcional)
}) {
  const { user } = useAuth();

  const [popupType, setPopupType] = useState(null);
  const [progress, setProgress] = useState([]);

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

  // ----------------------------
  // PROGRESO FINAL (LOCAL O EXTERNO)
  // ----------------------------
  const finalProgress = externalProgress ?? progress;

  // ----------------------------
  // CARGAR PROGRESO SOLO SI NO VIENE DE ARRIBA
  // ----------------------------
  useEffect(() => {
    async function loadProgress() {
      if (externalProgress) return; // 👈 clave: si ya viene cargado, no fetch

      if (!user) {
        setProgress([]);
        return;
      }

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading progress:", error);
        setProgress([]);
        return;
      }

      setProgress(data || []);
    }

    loadProgress();
  }, [user, externalProgress]);

  return (
    <div className="home">
      <div className="home__card">

        <h1 className={`home__title ${data?.className}`}>
          {data?.title}
        </h1>

        {list.map((puzzle, index) => {
          const userCategory = finalProgress.find(
            (p) => p.category === category
          );

          const unlockedLevel =
            userCategory?.unlocked_level ?? FREE_LEVELS;

          const isCompleted = index + 1 < unlockedLevel;

          const isLocked = index >= unlockedLevel;

          return (
            <button
              key={puzzle.name}
              className={`home__button categoryBtnTheme--${category} ${
                isLocked ? "lockedLevel" : ""
              }`}
              onClick={() => {
                if (!user) {
                  setPopupType("login");
                  return;
                }

                if (isLocked) {
                  setPopupType("progress");
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
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {puzzle.name.replace(/([a-zA-Z])(\d+)$/, "$1 $2")}

                  {isCompleted && <span className="completedDot" />}
                </span>
              </span>
            </button>
          );
        })}

        {/* POPUP */}
        {popupType && (
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
                onClick={() => setPopupType(null)}
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

              {popupType === "login" && (
                <>
                  <Lock size={40} style={{ marginBottom: 10, color: "#666" }} />
                  <h3>Acceso limitado</h3>
                  <p style={{ marginTop: 20, lineHeight: 1.5 }}>
                    Necesitas iniciar sesión para acceder a estos niveles.
                  </p>
                </>
              )}

              {popupType === "progress" && (
                <>
                  <Lock size={40} style={{ marginBottom: 10, color: "#666" }} />
                  <h3>Nivel bloqueado</h3>
                  <p style={{ marginTop: 20, lineHeight: 1.5 }}>
                    Completa los niveles anteriores para desbloquear este contenido.
                  </p>
                </>
              )}

              <button
                onClick={() => setPopupType(null)}
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