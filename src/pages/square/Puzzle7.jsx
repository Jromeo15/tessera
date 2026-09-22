import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES, HINT } from "./shapes/shapes7";

export default function App({
  onBack,
  puzzles,
  onNextPuzzle,
}) {
  return (
    <PuzzleLayout
      title="Puzzle 7"
      category="square"
      puzzleIndex={7}
      shapes={SHAPES}
      hint={HINT}
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}