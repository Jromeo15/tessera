import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes2";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 4"
      category="triangle"
      puzzleIndex={4}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}