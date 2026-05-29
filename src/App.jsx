import { useState } from "react";

import Home from "./pages/Home";
import Levels from "./pages/Levels";

import Puzzle1 from "./pages/Puzzle1";
import Puzzle2 from "./pages/Puzzle2";
import PuzzleRandom from "./pages/PuzzleRandom";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [randomCount, setRandomCount] = useState(2);

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

  // SELECTOR DE NIVELES
  if (screen === "levels") {
    return (
      <Levels
        onBack={() => setScreen("home")}
        onSelectLevel={(level) => setScreen(level)}
      />
    );
  }

  // PUZZLES
  if (screen === 1) {
    return <Puzzle1 onBack={() => setScreen("levels")} />;
  }

  if (screen === 2) {
    return <Puzzle2 onBack={() => setScreen("levels")} />;
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