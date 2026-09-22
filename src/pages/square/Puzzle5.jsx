import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES, HINT } from "./shapes/shapes5";

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
      hint={HINT}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}