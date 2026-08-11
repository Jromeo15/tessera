import { useEffect, useRef } from "react";
import backgroundMusic from "../assets/audio/music/background.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.25;
    audio.loop = true;

    const startMusic = () => {
      audio.play().catch(() => {
        // El navegador puede bloquear el autoplay
      });

      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
    };

    // Intentamos reproducir inmediatamente
    audio.play().catch(() => {
      // Si el navegador bloquea el autoplay,
      // esperamos a la primera interacción del usuario.
      document.addEventListener("pointerdown", startMusic);
      document.addEventListener("keydown", startMusic);
    });

    return () => {
      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={backgroundMusic}
      preload="auto"
    />
  );
}
