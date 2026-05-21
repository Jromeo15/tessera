export default function Home({ onPlay }) {
    return (
      <div className="home">
        <div className="home__card">
          <h1 className="home__title">TESSERA</h1>
          <p className="home__subtitle">
            Encaja las piezas. Completa el tablero.
          </p>
  
          <button className="home__button" onClick={onPlay}>
            Jugar Puzzle 1
          </button>
        </div>
      </div>
    );
  }