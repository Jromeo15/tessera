import { CalendarDays, ArrowLeft, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Daily({ onBack, onStart }) {
  const { user } = useAuth();

  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();

    const date =
      now.getDate().toString().padStart(2, "0") +
      "/" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      now.getFullYear();

    setToday(date);
  }, []);

  return (
    <div className="home">
      <div className="home__card">

        <button
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <CalendarDays
          size={80}
          color="#c084fc"
          strokeWidth={2.5}
        />

        <h1 className="niveles__title_timeattack">
          PUZLE DIARIO
        </h1>

        <p
          style={{
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Cada día hay un único puzle igual para todos los jugadores.
          ¿Serás capaz de resolver el de hoy?
        </p>

        <p
          style={{
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          📅 {today}
        </p>

        {user ? (
          <p
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Tu progreso se guardará automáticamente.
          </p>
        ) : (
          <p
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Puedes jugar sin iniciar sesión.
          </p>
        )}

        <button
          className="home__button"
          onClick={onStart}
        >
          <Play
            size={18}
            style={{ marginRight: 8 }}
          />
          Jugar
        </button>

      </div>
    </div>
  );
}