import piecePlaceSound from "../assets/audio/sfx/piece-place.m4a";

const sounds = {
  piecePlace: new Audio(piecePlaceSound),
};

sounds.piecePlace.volume = 0.35;

export function playPiecePlaceSound() {
  const sound = sounds.piecePlace;

  // Permite reproducir el sonido otra vez inmediatamente
  sound.currentTime = 0;

  sound.play().catch(() => {});
}