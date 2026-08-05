import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const styles = ["basic", "cartoon", "candy", "tiles"];

export default function Extras({ onBack }) {
  const { user } = useAuth();

  const [selectedStyle, setSelectedStyle] = useState("basic");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadStyle = async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("piece_style")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error obteniendo el estilo de piezas:", error);
        return;
      }

      if (data?.piece_style) {
        setSelectedStyle(data.piece_style);
      }
    };

    loadStyle();
  }, [user]);

  const currentIndex = styles.indexOf(selectedStyle);

  const previousStyle = () => {
    setSelectedStyle(
      styles[(currentIndex - 1 + styles.length) % styles.length]
    );
  };

  const nextStyle = () => {
    setSelectedStyle(
      styles[(currentIndex + 1) % styles.length]
    );
  };

  const saveStyle = async () => {
    if (!user || saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("user_settings")
      .update({
        piece_style: selectedStyle,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error guardando el estilo de piezas:", error);
      setSaving(false);
      return;
    }

    setSaving(false);
    onBack();
  };

  return (
    <div className="home">
      <div className="home__card">

        <button
          onClick={onBack}
          className="puzzleIconBtn puzzleIconBtn--back categoryBackBtn"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <Star
          size={80}
          color="#c084fc"
          strokeWidth={2.5}
        />

        <h1 className="niveles__title_timeattack">
          EXTRAS
        </h1>

<div
  style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 25,
  }}
>
  <div
    style={{
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 10,
    }}
  >
    Estilo de las piezas
  </div>

  <div
    style={{
      width: "65%",
      height: 85,
      border: "1px solid rgba(192, 132, 252, 0.35)",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
      background:
        "linear-gradient(135deg, rgba(192,132,252,0.12), rgba(168,85,247,0.06))",
      boxShadow:
        "0 8px 20px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
    }}
  >
    <button
      onClick={previousStyle}
      aria-label="Estilo anterior"
      style={{
        width: 45,
        height: "100%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#a855f7",
      }}
    >
      <ChevronLeft
        size={32}
        strokeWidth={2.5}
      />
    </button>

    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        textTransform: "capitalize",
        color: "#7e22ce",
        letterSpacing: 0.3,
      }}
    >
      {selectedStyle}
    </div>

    <button
      onClick={nextStyle}
      aria-label="Siguiente estilo"
      style={{
        width: 45,
        height: "100%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#a855f7",
      }}
    >
      <ChevronRight
        size={32}
        strokeWidth={2.5}
      />
    </button>
  </div>
</div>


        <button
          className="home__button"
          onClick={saveStyle}
          disabled={saving}
          style={{
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Guardando..." : "Hecho"}
        </button>

      </div>
    </div>
  );
}
