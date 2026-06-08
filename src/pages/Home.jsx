import { useState } from "react";
import logo from "../../images/logo.png";
import { Grid, Trophy, Play, Shuffle, Medal } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home({
  onLevels,
  onTimeAttack,
  onRandom,
  onLeaderboard,
}) {
  const { user } = useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState(2);

  const title = "TESSERA";

  const titleColors = [
    "#00F5FF", // cyan tech (base futurista)
    "#00B8FF", // azul eléctrico
    "#4D7CFF", // azul profundo limpio
  
    "#FFB000", // amarillo energético (alerta / reward)
    "#FF7A18", // naranja sci-fi (calor / acción)
  
    "#FF3DCE", // magenta HUD (UI futurista)
    "#A855F7", // violeta sci-fi
  ];

  return (
    <div className="home">
      <div className="home__card">

        <button
          className="home__randomBtn"
          onClick={() => setShowPopup(true)}
          aria-label="Puzle random"
          title="Puzle random"
        >
          <Shuffle size={20} />
        </button>

        <img
          src={logo}
          alt="Tessera logo"
          className="home__logo"
        />

<h1 className="home__title">
  {title.split("").map((char, i) => (
    <span
      key={i}
      style={{
        color: titleColors[i % titleColors.length],
      }}
    >
      {char}
    </span>
  ))}
</h1>

        <p className="home__subtitle">
          Encaja las piezas. Completa el tablero.
        </p>

        <button
          className="home__button"
          onClick={onLevels}
        >
          <Grid size={18} style={{ marginRight: 8 }} />
          Niveles
        </button>

        <button
          className="home__button"
          onClick={onTimeAttack}
        >
          <Trophy size={18} style={{ marginRight: 8 }} />
          Contrarreloj
        </button>

        <button
          className="home__button"
          onClick={onLeaderboard}
        >
          <Medal size={18} style={{ marginRight: 8 }} />
          Clasificación
        </button>

      </div>

      {/* POPUP RANDOM */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popup">
            <h3>Número de piezas</h3>

            <input
              type="number"
              min="1"
              max="20"
              value={value}
              onChange={(e) =>
                setValue(Number(e.target.value))
              }
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
              }}
            >
              <button onClick={() => setShowPopup(false)}>
                Cancelar
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  onRandom(value);
                }}
              >
                Jugar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}