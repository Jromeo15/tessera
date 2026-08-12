import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes5";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 5"
      category="square"
      puzzleIndex={5}
      shapes={SHAPES}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}