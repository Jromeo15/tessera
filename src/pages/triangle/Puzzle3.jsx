import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes2";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 3"
      category="triangle"
      puzzleIndex={3}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}