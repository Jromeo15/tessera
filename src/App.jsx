import { useState } from "react";

import Home from "./pages/Home";
import Levels from "./pages/Levels";
import CategoryLevels from "./pages/CategoryLevels";
import PuzzleRandom from "./pages/PuzzleRandom";

// AUTO IMPORT DE PUZZLES
const puzzles = import.meta.glob("./pages/**/Puzzle*.jsx", {
  eager: true,
});

// AGRUPAR POR CATEGORÍA
const groupedPuzzles = {};

Object.entries(puzzles).forEach(([path, module]) => {
  const match = path.match(/pages\/(\w+)\/(Puzzle\d+)\.jsx/);

  if (!match) return;

  const [, category, puzzleName] = match;

  if (!groupedPuzzles[category]) {
    groupedPuzzles[category] = [];
  }

  groupedPuzzles[category].push({
    name: puzzleName,
    component: module.default,
  });
});

export default function App() {
  const [screen, setScreen] = useState("home");

  const [category, setCategory] = useState(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [randomCount, setRandomCount] = useState(2);

  // HOME
  if (screen === "home") {
    return (
      <Home
        onLevels={() => setScreen("levels")}
        onTimeAttack={() => {}}
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

  // LISTA DE PUZZLES POR CATEGORÍA
  if (screen === "category") {
    return (
      <CategoryLevels
        category={category}
        puzzles={groupedPuzzles}
        onBack={() => setScreen("levels")}
        onSelectPuzzle={(PuzzleComponent) => {
          setSelectedPuzzle(() => PuzzleComponent);
          setScreen("puzzle");
        }}
      />
    );
  }

  // PUZZLE DINÁMICO
  if (screen === "puzzle") {
    const Puzzle = selectedPuzzle;
    return <Puzzle onBack={() => setScreen("category")} />;
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