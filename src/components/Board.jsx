export default function Board() {
  const size = 5;

  const cells = Array.from({ length: size * size });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 40px)",
        gap: "2px",
        margin: "20px",
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          style={{
            width: 40,
            height: 40,
            border: "1px solid #ccc",
          }}
        />
      ))}
    </div>
  );
}
