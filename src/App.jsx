import { useState } from "react";
import Home from "./pages/Home";
import Puzzle1 from "./pages/Puzzle1";
import Puzzle2 from "./pages/Puzzle2";
import PuzzleRandom from "./pages/PuzzleRandom";

export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "home") {
    return <Home onPlay={(n) => setScreen(n)} />;
  }

  if (screen === 1) {
    return <Puzzle1 onBack={() => setScreen("home")} />;
  }

  if (screen === 2) {
    return <Puzzle2 onBack={() => setScreen("home")} />;
  }

  if (screen === "random") {
    return <PuzzleRandom onBack={() => setScreen("home")} />;
  }

  return null;
}