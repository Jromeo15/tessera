import { useState, useRef, useEffect } from "react";

export default function Piece({ shape, color }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const cellSize = 20;

  const onMouseDown = (e) => {
    dragging.current = true;

    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        display: "grid",
        gridTemplateColumns: `repeat(${shape[0].length}, 20px)`,
        gap: 2,
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {shape.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            background: cell ? color : "transparent",
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  );
}