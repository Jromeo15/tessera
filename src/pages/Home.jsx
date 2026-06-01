import { useState } from "react";
import logo from "../../images/logo.png";
import { Shuffle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home({
  onLevels,
  onTimeAttack,
  onRandom,
}) {
  const { user } = useAuth();

  console.log("Usuario:", user);
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState(2);

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

        <h1 className="home__title">TESSERA</h1>

        <p className="home__subtitle">
          Encaja las piezas. Completa el tablero.
        </p>

        <button
          className="home__button"
          onClick={onLevels}
        >
          Niveles
        </button>

        <button
          className="home__button"
          onClick={onTimeAttack}
        >
          Contrarreloj
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