import { ArrowLeft } from "lucide-react";

export default function CategoryLevels({
    category,
    puzzles,
    onBack,
    onSelectPuzzle,
  }) {
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
  
    const list = puzzles?.[category] || [];
  
    return (
      <div className="home">
        <div className="home__card">
  
          <h1 className={`home__title ${data?.className}`}>
            {data?.title}
          </h1>
  
          {/* PUZZLES AUTOMÁTICOS */}
          {list.map((puzzle) => (
            <button
              key={puzzle.name}
              className={`home__button categoryBtnTheme--${category}`}
              onClick={() => onSelectPuzzle(puzzle.component)}
            >
              {puzzle.name}
            </button>
          ))}
  
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