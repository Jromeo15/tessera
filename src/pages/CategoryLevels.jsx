export default function CategoryLevels({
    category,
    onBack,
    onSelectLevel,
  }) {
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className="home__title">
            {category}
          </h1>
  
          {/* CUADRADO */}
          {category === "square" && (
            <button
              className="home__button"
              onClick={() => onSelectLevel(1)}
            >
              Puzzle 1
            </button>
          )}
  
          {/* TRIÁNGULO */}
          {category === "triangle" && (
            <button
              className="home__button"
              onClick={() => onSelectLevel(2)}
            >
              Puzzle 2
            </button>
          )}
  
          {/* VACÍOS DE MOMENTO */}
          {category === "circle" && (
            <p>Próximamente...</p>
          )}
  
          {category === "skull" && (
            <p>Próximamente...</p>
          )}
  
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