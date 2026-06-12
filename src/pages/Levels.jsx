import { useState, useEffect } from "react";
import {
  Square,
  Circle,
  Triangle,
  Skull,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { FREE_LEVELS } from "../constants";

export default function Levels({
  onBack,
  onSelectCategory,
}) {
  const { user } = useAuth();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // CARGAR PROGRESO UNA SOLA VEZ
  // ----------------------------
  useEffect(() => {
    async function loadProgress() {
      setLoading(true);

      if (!user) {
        setProgress([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_progress")
        .select("category, unlocked_level")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading progress:", error);
        setProgress([]);
      } else {
        setProgress(data || []);
      }

      setLoading(false);
    }

    loadProgress();
  }, [user]);



  return (
    <div className="home">
      <div className="home__card">

        <h1 className="niveles__title">
          Niveles
        </h1>

        <p
          style={{
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Elige una dificultad.
        </p>

        <div className="levelsGrid">

          <button
            className="categoryBtn categoryBtnTheme categoryBtnTheme--square"
            onClick={() =>
              onSelectCategory("square", progress)
            }
          >
            <Square size={52} strokeWidth={2.5} />
          </button>

          <button
            className="categoryBtn categoryBtnTheme categoryBtnTheme--triangle"
            onClick={() =>
              onSelectCategory("triangle", progress)
            }
          >
            <Triangle size={52} strokeWidth={2.5} />
          </button>

          <button
            className="categoryBtn categoryBtnTheme categoryBtnTheme--circle"
            onClick={() =>
              onSelectCategory("circle", progress)
            }
          >
            <Circle size={52} strokeWidth={2.5} />
          </button>

          <button
            className="categoryBtn categoryBtnTheme categoryBtnTheme--skull"
            onClick={() =>
              onSelectCategory("skull", progress)
            }
          >
            <Skull size={52} strokeWidth={2.5} />
          </button>

        </div>

        <button
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}