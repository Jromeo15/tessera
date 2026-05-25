import { useState } from "react";
import logo from "../../images/logo.png";

export default function Home({ onPlay, onRandom }) {
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState(2);

  return (
    <div className="home">
      <div className="home__card">

        <img
          src={logo}
          alt="Tessera logo"
          className="home__logo"
        />

        <h1 className="home__title">TESSERA</h1>

        <p className="home__subtitle">
          Encaja las piezas. Completa el tablero.
        </p>

        <button className="home__button" onClick={() => onPlay(1)}>
          Jugar Puzle 1
        </button>

        <button className="home__button" onClick={() => onPlay(2)}>
          Jugar Puzle 2
        </button>

        <button
          className="home__button"
          onClick={() => setShowPopup(true)}
        >
          Jugar Puzle Random
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