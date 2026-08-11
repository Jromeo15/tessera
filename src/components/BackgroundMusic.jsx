import { useEffect, useRef } from "react";
import backgroundMusic from "../assets/audio/music/background.mp3";
import { getMusicVolume } from "../lib/soundSettings";

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = getMusicVolume();
    audio.loop = true;

    const handleVolumeChange = (e) => {
      audio.volume = e.detail;
    };

    const startMusic = () => {
      audio.play().catch(() => {});

      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
    };

    audio.play().catch(() => {
      document.addEventListener("pointerdown", startMusic);
      document.addEventListener("keydown", startMusic);
    });

    window.addEventListener(
      "music-volume-change",
      handleVolumeChange
    );

    return () => {
      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);

      window.removeEventListener(
        "music-volume-change",
        handleVolumeChange
      );
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