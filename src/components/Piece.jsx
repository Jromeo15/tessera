import { useState, useRef, useEffect } from "react";

export default function Piece() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const draggingRef = useRef(false);

  const offsetRef = useRef({ x: 0, y: 0 });

  // -------------------------
  // MOUSE
  // -------------------------
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

  // -------------------------
  // TOUCH (DEDOS)
  // -------------------------
  const onTouchStart = (e) => {
    const t = e.touches[0];

    draggingRef.current = true;

    offsetRef.current = {
      x: t.clientX - pos.x,
      y: t.clientY - pos.y,
    };
  };

  const onTouchMove = (e) => {
    if (!draggingRef.current) return;

    const t = e.touches[0];

    setPos({
      x: t.clientX - offsetRef.current.x,
      y: t.clientY - offsetRef.current.y,
    });
  };

  const onTouchEnd = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    // mouse
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // touch
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        width: 50,
        height: 50,
        background: "red",
        position: "absolute",
        left: pos.x,
        top: pos.y,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    />
  );
}