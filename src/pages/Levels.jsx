export default function Levels({
    onBack,
    onSelectLevel,
  }) {
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className="home__title">
            Selección de niveles
          </h1>
  
          <button
            className="home__button"
            onClick={() => onSelectLevel(1)}
          >
            Puzzle 1
          </button>
  
          <button
            className="home__button"
            onClick={() => onSelectLevel(2)}
          >
            Puzzle 2
          </button>
  
          <button
            className="home__button"
            onClick={onBack}
          >
            Volver
          </button>
  
        </div>
      </div>
    );
  }