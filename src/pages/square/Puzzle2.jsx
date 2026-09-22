import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES, HINT } from "./shapes/shapes2";

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
      hint={HINT}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}