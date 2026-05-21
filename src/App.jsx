import Board from "./components/Board";
import Piece from "./components/Piece";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Tessera</h1>

      <Board />

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Piece />
        <Piece />
      </div>
    </div>
  );
}