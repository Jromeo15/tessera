import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes4";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 4"
      category="square"
      puzzleIndex={4}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}