import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes5";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 5"
      category="square"
      puzzleIndex={1}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}