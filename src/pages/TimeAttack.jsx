import { Timer, ArrowLeft, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBestTimeAttackScore } from "../lib/timeAttackScores";

export default function TimeAttack({ onBack, onStart }) {
  const [difficulty, setDifficulty] = useState("easy");

  const { user } = useAuth();
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) {
        setBestScore(0);
        return;
      }

      setLoading(true);

      const res = await getBestTimeAttackScore(user.id);

      console.log("TIME ATTACK BEST SCORE RESPONSE:", res);

      setBestScore(res.bestScore ?? 0);

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
          <p style={{ textAlign: "center", marginTop: 10 }}>
            🏆 Mejor puntuación:{" "}
            {loading ? "..." : bestScore}
          </p>
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