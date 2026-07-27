import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes2";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 2"
      category="triangle"
      puzzleIndex={2}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}