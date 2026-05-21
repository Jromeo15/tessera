import { useState } from "react";
import Home from "./pages/Home";
import Puzzle1 from "./pages/Puzzle1";

export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "home") {
    return <Home onPlay={() => setScreen("puzzle1")} />;
  }

  if (screen === "puzzle1") {
    return (
      <Puzzle1
        onBack={() => setScreen("home")}
      />
    );
  }

  return null;
}