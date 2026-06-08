import {
    Square,
    Circle,
    Triangle,
    Skull,
    ArrowLeft,
  } from "lucide-react";
  
  export default function Levels({
    onBack,
    onSelectCategory,
  }) {
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className="niveles__title">
            Niveles
          </h1>
          <p
          style={{
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Elige una dificultad.
        </p>
  
          <div className="levelsGrid">
  
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
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
  
        </div>
      </div>
    );
  }