export default function Board() {
  const size = 5;

  const cells = Array.from({ length: size * size });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 50px)",
        width: "fit-content",
        border: "2px solid black",
        marginTop: 20,
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          style={{
            width: 50,
            height: 50,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
}
