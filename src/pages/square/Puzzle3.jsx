import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes3";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 3"
      category="square"
      puzzleIndex={1}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}