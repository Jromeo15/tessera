import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/timeAttackScores";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const difficulties = [
  {
    id: "easy",
    title: "FÁCIL",
  },
  {
    id: "medium",
    title: "MEDIO",
  },
  {
    id: "hard",
    title: "DIFÍCIL",
  },
];

export default function Leaderboard({ onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [difficultyIndex, setDifficultyIndex] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await getLeaderboard(
        difficulties[difficultyIndex].id
      );

      if (!error) {
        setData(data);
      } else {
        console.error("Leaderboard error:", error);
      }

      setLoading(false);
    }

    load();
  }, [difficultyIndex]);

  const previous = () => {
    setDifficultyIndex(
      (i) => (i - 1 + difficulties.length) % difficulties.length
    );
  };

  const next = () => {
    setDifficultyIndex(
      (i) => (i + 1) % difficulties.length
    );
  };

  return (
    <div className="leaderboardPage">
      <div className="leaderboardCard">

        <button
          className="home__randomBtn"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="niveles__title">
          CLASIFICACIÓN
        </h1>

        <p
          style={{
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 18,
          }}
        >
          Mejores puntuaciones de CONTRARRELOJ.
        </p>

        <div className="leaderboardSelector">

          <button
            className="leaderboardArrow"
            onClick={previous}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="leaderboardDifficulty">
            {difficulties[difficultyIndex].title}
          </div>

          <button
            className="leaderboardArrow"
            onClick={next}
          >
            <ChevronRight size={22} />
          </button>

        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="leaderboardTableWrap">
            <table className="leaderboardTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Puntos</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, index) => (
                  <tr key={row.user_id}>
                    <td>
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && index + 1}
                    </td>

                    <td>
                      {row.username?.split("@")[0] ?? "Anon"}
                    </td>

                    <td>
                      <strong>{row.best_score}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}