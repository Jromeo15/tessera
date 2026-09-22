import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES, HINT } from "./shapes/shapes3";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 3"
      category="square"
      puzzleIndex={3}
      shapes={SHAPES}
      hint={HINT}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}