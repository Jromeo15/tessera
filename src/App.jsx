import { useState } from "react";
import Board from "./components/Board";
import Piece from "./components/Piece";
import { SHAPES } from "./shapes";

export default function App() {
  const [pieces] = useState([
    { id: 1, color: "red", shape: SHAPES[0] },
    { id: 2, color: "blue", shape: SHAPES[1] },
    { id: 3, color: "green", shape: SHAPES[2] },
    { id: 4, color: "orange", shape: SHAPES[3] },
  ]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center" }}>Tessera</h1>

      {/* TABLERO ES EL ORIGEN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Board>
          {pieces.map((p) => (
            <Piece
              key={p.id}
              id={p.id}
              color={p.color}
              shape={p.shape}
            />
          ))}
        </Board>
      </div>
    </div>
  );
}