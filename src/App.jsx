import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Levels from "./pages/Levels";
import CategoryLevels from "./pages/CategoryLevels";
import PuzzleRandom from "./pages/PuzzleRandom";
import PuzzleTimeAttack from "./pages/PuzzleTimeAttack";
import TimeAttack from "./pages/TimeAttack";
import UserMenu from "./components/UserMenu";
import Leaderboard from "./pages/Leaderboard";
import Daily from "./pages/Daily";
import PuzzleDaily from "./pages/PuzzleDaily";
import Extras from "./pages/Extras";
import BackgroundMusic from "./components/BackgroundMusic";

const puzzles = import.meta.glob("./pages/**/Puzzle*.jsx", {
  eager: true,
});

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

  const [timeAttackConfig, setTimeAttackConfig] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  let content = null;

  const isPuzzleScreen =
    screen === "puzzle" ||
    screen === "random" ||
    screen === "timeattack-game" ||
    screen === "daily" ||
    screen === "daily-game";

  // ---------------- HOME ----------------
  if (screen === "home") {
    content = (
      <Home
        onLevels={() => setScreen("levels")}
        onTimeAttack={() => setScreen("timeattack")}
        onDaily={() => setScreen("daily")}
        onRandom={(count) => {
          setRandomCount(count);
          setScreen("random");
        }}
        onLeaderboard={() => setScreen("leaderboard")}
        onExtras={() => setScreen("extras")}
      />
    );
  }

  // ---------------- TIME ATTACK SETUP ----------------
  else if (screen === "timeattack") {
    content = (
      <TimeAttack
        onBack={() => setScreen("home")}
        onStart={(config) => {
          setTimeAttackConfig(config);
          setScreen("timeattack-game");
        }}
      />
    );
  }

  // ---------------- TIME ATTACK GAME ----------------
  else if (screen === "timeattack-game") {
    content = (
      <PuzzleTimeAttack
        config={timeAttackConfig}
        onBack={() => setScreen("home")}
      />
    );
  }

  // ---------------- LEVELS ----------------
  else if (screen === "levels") {
    content = (
      <Levels
        onBack={() => setScreen("home")}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setScreen("category");
        }}
      />
    );
  }

  // ---------------- CATEGORY ----------------
  else if (screen === "category") {
    content = (
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

  // ---------------- PUZZLE NORMAL ----------------
  else if (screen === "puzzle") {
    const Puzzle = selectedPuzzle;

    content = (
      <Puzzle onBack={() => setScreen("category")} />
    );
  }

  // ---------------- RANDOM ----------------
  else if (screen === "random") {
    content = (
      <PuzzleRandom
        piecesCount={randomCount}
        onBack={() => setScreen("home")}
      />
    );
  }

  // ---------------- DAILY ----------------
  else if (screen === "daily") {
    content = (
      <Daily
        onBack={() => setScreen("home")}
        onStart={() => setScreen("daily-game")}
      />
    );
  }

  // ---------------- DAILY GAME ----------------
  else if (screen === "daily-game") {
    content = (
      <PuzzleDaily
        onBack={() => setScreen("home")}
      />
    );
  }

  // ---------------- EXTRAS ----------------
  else if (screen === "extras") {
    content = (
      <Extras
        onBack={() => setScreen("home")}
      />
    );
  }

  else if (screen === "leaderboard") {
    content = (
      <Leaderboard onBack={() => setScreen("home")} />
    );
  }

  return (
    <>
    <BackgroundMusic />
      {!isPuzzleScreen && <UserMenu />}
      {content}
    </>
  );
}