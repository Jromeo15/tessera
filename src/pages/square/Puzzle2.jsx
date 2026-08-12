import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes2";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 2"
      category="square"
      puzzleIndex={2}
      shapes={SHAPES}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}