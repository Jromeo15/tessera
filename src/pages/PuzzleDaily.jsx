import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { CELL_SIZE } from "../constants";
import PuzzleLayout from "../layout/PuzzleLayout";

import {
    getDailyPuzzle,
    createDailyPuzzle,
    setDailyCompleted,
  } from "../lib/dailyPuzzle";
  
import { useAuth } from "../context/AuthContext";

import { generatePieces } from "../lib/puzzleGenerator";

const BOARD_COLS = 9;
const BOARD_ROWS = 10;

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9D4EDD",
  "#FF8E3C",
  "#2EC4B6",
  "#845EC2",
  "#00C9A7",
  "#FF9671",
  "#00B8D9",
  "#C34A36",
  "#3EC1D3",
  "#F67280",
  "#8BC34A",
  "#A66CFF",
];

function getTodayId() {
    const d = new Date();
  
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
  
    return `${year}${month}${day}`;
  }

export default function PuzzleDaily({ onBack }) {

  const { user } = useAuth();

  const [pieces, setPieces] = useState([]);

  const [loading, setLoading] = useState(true);

  const [resetKey, setResetKey] = useState(0);

  const [time, setTime] = useState(0);

  const [finished, setFinished] = useState(false);

  const solvedRef = useRef(false);

  useEffect(() => {

    async function loadPuzzle() {

      const today = getTodayId();

      const { data, error } = await getDailyPuzzle(today);

      console.log("ID buscado:", today);
      console.log("DATA:", data);
      console.log("ERROR:", error);
      
      if (error) {
        console.error(error);
        return;
      }
      
      let shapes;
      
      if (data) {
      
        // Ya existe el puzzle diario
        shapes = data.shapes;
      
      } else {
      
        // No existe -> lo generamos
      
        const piecesCount =
          Math.floor(Math.random() * 5) + 8;
      
        const generatedPieces =
          generatePieces(piecesCount);
      
        shapes = generatedPieces.map(
          (p) => p.shape
        );
      
        const { error: insertError } =
        await createDailyPuzzle(
          today,
          shapes
        );
      
      if (insertError) {
      
        if (insertError.code === "23505") {
      
          // Otro cliente (o el segundo useEffect de React)
          // ya lo ha creado. Lo volvemos a leer.
      
          const { data } = await getDailyPuzzle(today);
      
          if (!data) {
            console.error("No se pudo recuperar el puzle.");
            return;
          }
      
          shapes = data.shapes;
      
        } else {
      
          console.error(insertError);
          return;
      
        }
      }
      }
      
      const loadedPieces = shapes.map((shape, index) => ({
        id: index + 1,
        color: COLORS[index % COLORS.length],
        shape,
      }));

      setPieces(loadedPieces);

      setLoading(false);
    }

    loadPuzzle();

  }, []);

  useEffect(() => {

    if (loading) return;

    if (finished) return;

    const interval = setInterval(() => {

      setTime((t) => t + 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [loading, finished]);

  const formatTime = (t) => {

    const min = Math.floor(t / 60);

    const sec = t % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  };

  const reset = () => {
    setResetKey((k) => k + 1);
  };

  if (loading) {
    return (
      <PuzzleLayout
        title="Puzle diario"
        onBack={onBack}
        hideInternalTimer={true}
        shapes={[]}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: 22,
          }}
        >
          Cargando...
        </div>
      </PuzzleLayout>
    );
  }

  return (
    <>
      <PuzzleLayout
        key={resetKey}
        title="Puzle diario"
        onBack={onBack}
        onReset={reset}
        hideInternalTimer={true}
        showVictory={finished}
        onCloseVictory={() => {}}
        shapes={pieces.map((p) => p.shape)}
        onVictory={async () => {

            console.log("ON VICTORY DAILY");
            if (solvedRef.current) return;
          
            solvedRef.current = true;
          
            if (user) {
               console.log("user id dentro", user.id);
               
               const today = getTodayId();

               await setDailyCompleted(user.id, today);
            } else{
                console.log("No hay user");
            }
          
            setFinished(true);
          }}
      />

      {createPortal(
        <div className="timeAttackHud">
          ⏱ {formatTime(time)}
        </div>,
        document.body
      )}
    </>
  );
}