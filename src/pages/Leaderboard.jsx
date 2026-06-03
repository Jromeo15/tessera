import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/timeAttackScores";
import { ArrowLeft, Trophy, Medal } from "lucide-react";

export default function Leaderboard({ onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await getLeaderboard();

      if (!error) {
        setData(data);
      } else {
        console.error("Leaderboard error:", error);
      }

      setLoading(false);
    }

    load();
  }, []);

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
            marginBottom: 20,
          }}
        >
          Mejores puntuaciones de CONTRARRELOJ.
        </p>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}