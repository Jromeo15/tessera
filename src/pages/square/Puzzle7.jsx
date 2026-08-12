import PuzzleLayout from "../../layout/PuzzleLayout";
import { SHAPES } from "./shapes/shapes-logo";

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
      onBack={onBack}
      puzzles={puzzles}
      onNextPuzzle={onNextPuzzle}
    />
  );
}