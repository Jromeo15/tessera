import { useState } from "react";
import logo from "../../images/logo.png";
import { Shuffle } from "lucide-react";

export default function Home({ onPlay, onRandom }) {
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
  style={{
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }}
>
  <Shuffle size={20} color="#222" />
</button>

      <img src={logo} alt="Tessera logo" className="home__logo" />

      <h1 className="home__title">TESSERA</h1>

      <p className="home__subtitle">
        Encaja las piezas. Completa el tablero.
      </p>

      <button className="home__button" onClick={() => onPlay(1)}>
        Jugar Puzzle 1
      </button>

      <button className="home__button" onClick={() => onPlay(2)}>
        Jugar Puzzle 2
      </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popup">
            <h3>Número de piezas</h3>

            <input
              type="number"
              min="1"
              max="20"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
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