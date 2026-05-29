export default function CategoryLevels({
    category,
    onBack,
    onSelectLevel,
  }) {
    // CONFIG INTERNA DE CATEGORÍAS
    const CATEGORIES = {
      square: {
        title: "Fácil",
        className: "title--square",
      },
      triangle: {
        title: "Medio",
        className: "title--triangle",
      },
      circle: {
        title: "Difícil",
        className: "title--circle",
      },
      skull: {
        title: "Chunguele",
        className: "title--skull",
      },
    };
  
    const data = CATEGORIES[category];
  
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className={`home__title ${data?.className}`}>
            {data?.title}
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
  
          {/* CÍRCULO */}
          {category === "circle" && (
            <p>Próximamente...</p>
          )}
  
          {/* CALAVERA */}
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