import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const styles = ["basic", "cartoon", "candy", "tiles", "wood"];

export default function Extras({ onBack, embedded = false }) {
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
    <div
      className="settingsOverlay"
      onClick={onBack}
    >
      <div
        className="settingsModal extrasModal"
        onClick={(e) => e.stopPropagation()}
      >
      <button
        onClick={onBack}
        className="victoryClose"
      >
        ×
      </button>
  
        <h3>Extras</h3>
  
        <div className="volumeSetting">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Estilo de piezas
            </span>
          </div>
  
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button
              onClick={previousStyle}
              aria-label="Estilo anterior"
              style={{
                width: 45,
                height: 45,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                flex: 1,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 700,
                textTransform: "capitalize",
                color: "#7e22ce",
              }}
            >
              {selectedStyle}
            </div>
  
            <button
              onClick={nextStyle}
              aria-label="Siguiente estilo"
              style={{
                width: 45,
                height: 45,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
            width: "100%",
          }}
        >
          {saving ? "Guardando..." : "Hecho"}
        </button>
      </div>
    </div>
  );
}
