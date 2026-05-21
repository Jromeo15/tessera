import Board from "./components/Board";
import Piece from "./components/Piece";

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Tessera</h1>

      {/* TABLERO CENTRADO */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Board />
      </div>

      {/* PIEZAS ABAJO */}
      <div
        style={{
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Piece color="red" shape={[ [1,1], [1,1] ]} />
        <Piece color="blue" shape={[ [1,1,1], [0,1,0] ]} />
        <Piece color="green" shape={[ [1,1,0], [0,1,1] ]} />
        <Piece color="orange" shape={[ [1], [1], [1] ]} />
      </div>
    </div>
  );
}