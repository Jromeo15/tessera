import { Timer, ArrowLeft, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBestTimeAttackScore } from "../lib/timeAttackScores";

export default function TimeAttack({ onBack, onStart }) {
  const [difficulty, setDifficulty] = useState("easy");

  const { user } = useAuth();

  const [bestEasy, setBestEasy] = useState(0);
  const [bestMedium, setBestMedium] = useState(0);
  const [bestHard, setBestHard] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) {
        setBestEasy(0);
        setBestMedium(0);
        setBestHard(0);
        return;
      }

      setLoading(true);

      const easy = await getBestTimeAttackScore(user.id, "easy");
      const medium = await getBestTimeAttackScore(user.id, "medium");
      const hard = await getBestTimeAttackScore(user.id, "hard");

      setBestEasy(easy.bestScore ?? 0);
      setBestMedium(medium.bestScore ?? 0);
      setBestHard(hard.bestScore ?? 0);

      setLoading(false);
    }

    load();
  }, [user]);

  return (
    <div className="home">
      <div className="home__card">

        <button
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <Timer size={80} color="#c084fc" strokeWidth={2.5} />

        <h1 className="niveles__title_timeattack">
          CONTRARRELOJ
        </h1>

        <p style={{ textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
          Tienes 5 minutos para resolver el mayor número de puzles que puedas.
          Cuando resuelvas uno, en el siguiente se incrementará el número de piezas.
          ¡Suerte!
        </p>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="timeattackSelect"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>

        {user && (
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              lineHeight: 1.8,
            }}
          >
            <strong>🏆 Tus mejores puntuaciones</strong>
            <div>Fácil: {loading ? "..." : bestEasy}</div>
            <div>Medio: {loading ? "..." : bestMedium}</div>
            <div>Difícil: {loading ? "..." : bestHard}</div>
          </div>
        )}

        {!user && (
          <p style={{ textAlign: "center", marginTop: 10 }}>
            Inicia sesión para guardar tu récord
          </p>
        )}

        <button
          className="home__button"
          onClick={() =>
            onStart({
              difficulty,
              startPieces: 3,
              timeLimit: 300,
            })
          }
        >
          <Play size={18} style={{ marginRight: 8 }} />
          Jugar
        </button>

      </div>
    </div>
  );
}