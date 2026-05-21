export default function Home({ onPlay }) {
    return (
      <div className="home">
        <div className="home__card">
          <h1 className="home__title">TESSERA</h1>
  
          <p className="home__subtitle">
            Encaja las piezas. Completa el tablero.
          </p>
  
          <button
            className="home__button"
            onClick={() => onPlay(1)}
          >
            Jugar Puzle 1
          </button>
  
          <button
            className="home__button"
            onClick={() => onPlay(2)}
          >
            Jugar Puzle 2
          </button>
        </div>
      </div>
    );
  }