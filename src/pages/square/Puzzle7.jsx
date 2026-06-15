import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes-logo";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 7"
      category="square"
      puzzleIndex={7}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}