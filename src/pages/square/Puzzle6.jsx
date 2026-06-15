import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes6";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 6"
      category="square"
      puzzleIndex={6}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}