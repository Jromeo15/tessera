import {
    Square,
    Circle,
    Triangle,
    Skull,
  } from "lucide-react";
  
  export default function Levels({
    onBack,
    onSelectCategory,
  }) {
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className="home__title">
            Categorías
          </h1>
  
          <div className="levelsGrid">
  
            {/* CUADRADO */}
            <button
              className="
                categoryBtn
                categoryBtnTheme
                categoryBtnTheme--square
              "
              onClick={() => onSelectCategory("square")}
            >
              <Square size={52} strokeWidth={2.5} />
            </button>
  
            {/* TRIÁNGULO */}
            <button
                className="
                categoryBtn
                categoryBtnTheme
                categoryBtnTheme--triangle
                "
                onClick={() => onSelectCategory("triangle")}
            >
                <Triangle size={52} strokeWidth={2.5} />
            </button>
  
            {/* CÍRCULO */}
            <button
              className="
                categoryBtn
                categoryBtnTheme
                categoryBtnTheme--circle
              "
              onClick={() => onSelectCategory("circle")}
            >
              <Circle size={52} strokeWidth={2.5} />
            </button>

            {/* CALAVERA */}
            <button
              className="
                categoryBtn
                categoryBtnTheme
                categoryBtnTheme--skull
              "
              onClick={() => onSelectCategory("skull")}
            >
              <Skull size={52} strokeWidth={2.5} />
            </button>
  
          </div>
  
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