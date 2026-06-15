import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes7";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 7"
      category="triangle"
      puzzleIndex={7}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}