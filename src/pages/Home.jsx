import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <h1>Tessera</h1>

      <Link to="/puzzle/1">
        <button
          style={{
            padding: "12px 24px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Puzzle 1
        </button>
      </Link>
    </div>
  );
}