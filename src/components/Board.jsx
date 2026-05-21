export default function Board() {
  const cols = 7;
  const rows = 10;

  const cells = Array.from({ length: cols * rows });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 50px)`,
        gap: 2,
        padding: 10,
        border: "2px solid black",
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          style={{
            width: 50,
            height: 50,
            background: "#f0f0f0",
            border: "1px solid #ddd",
          }}
        />
      ))}
    </div>
  );
}