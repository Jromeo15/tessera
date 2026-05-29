import { useState } from "react";

import Home from "./pages/Home";
import Levels from "./pages/Levels";
import CategoryLevels from "./pages/CategoryLevels";
import Puzzle1 from "./pages/square/Puzzle1";
import Puzzle2 from "./pages/triangle/Puzzle2";
import PuzzleRandom from "./pages/PuzzleRandom";

export default function App() {
  const [screen, setScreen] = useState("home");

  const [randomCount, setRandomCount] = useState(2);

  // categoría seleccionada
  const [category, setCategory] = useState(null);

  // HOME
  if (screen === "home") {
    return (
      <Home
        onLevels={() => setScreen("levels")}
        onTimeAttack={() => {
          // de momento vacío
        }}
        onRandom={(count) => {
          setRandomCount(count);
          setScreen("random");
        }}
      />
    );
  }

  // CATEGORÍAS
  if (screen === "levels") {
    return (
      <Levels
        onBack={() => setScreen("home")}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setScreen("category");
        }}
      />
    );
  }

  // NIVELES DE CADA CATEGORÍA
  if (screen === "category") {
    return (
      <CategoryLevels
        category={category}
        onBack={() => setScreen("levels")}
        onSelectLevel={(level) => setScreen(level)}
      />
    );
  }

  // PUZZLES
  if (screen === 1) {
    return <Puzzle1 onBack={() => setScreen("category")} />;
  }

  if (screen === 2) {
    return <Puzzle2 onBack={() => setScreen("category")} />;
  }

  // RANDOM
  if (screen === "random") {
    return (
      <PuzzleRandom
        piecesCount={randomCount}
        onBack={() => setScreen("home")}
      />
    );
  }

  return null;
}