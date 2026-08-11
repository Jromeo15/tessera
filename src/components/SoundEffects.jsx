import piecePlaceSound from "../assets/audio/sfx/piece-place.m4a";

import { getSfxVolume } from "../lib/soundSettings";

const sounds = {
  piecePlace: new Audio(piecePlaceSound),
};

export function playPiecePlaceSound() {
  const sound = sounds.piecePlace;

  // Obtener el volumen actual configurado
  sound.volume = getSfxVolume();

  // Permite reproducir el sonido otra vez inmediatamente
  sound.currentTime = 0;

  sound.play().catch(() => {});
}