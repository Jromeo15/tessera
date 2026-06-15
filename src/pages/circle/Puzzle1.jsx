import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes1";

export default function App({ onBack }) {
  return (
    <PuzzleLayout
      title="Puzzle 1"
      category="circle"
      puzzleIndex={1}
      shapes={SHAPES}
      onBack={onBack}
    />
  );
}