import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes1";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 1"
      category="square"
      puzzleIndex={1}
      shapes={SHAPES}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}