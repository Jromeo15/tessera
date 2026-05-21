import { useState, useRef, useEffect } from "react";

export default function Piece() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const draggingRef = useRef(false);

  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    draggingRef.current = true;

    offsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const onMouseMove = (e) => {
    if (!draggingRef.current) return;

    setPos({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  };

  const onMouseUp = () => {
    draggingRef.current = false;
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
        width: 50,
        height: 50,
        background: "black",
        position: "absolute",
        left: pos.x,
        top: pos.y,
        cursor: "grab",
        userSelect: "none",
      }}
    />
  );
}