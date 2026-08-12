import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes4";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 4"
      category="square"
      puzzleIndex={4}
      shapes={SHAPES}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}