import piecePlaceSound from "../assets/audio/sfx/piece-place.m4a";
import victorySound from "../assets/audio/sfx/victory.mp3";

import { getSfxVolume } from "../lib/soundSettings";

const sounds = {
  piecePlace: new Audio(piecePlaceSound),
  victory: new Audio(victorySound),
};

export function playPiecePlaceSound() {
  const sound = sounds.piecePlace;

  sound.volume = getSfxVolume();
  sound.currentTime = 0;

  sound.play().catch(() => {});
}

export function playVictorySound() {
  const sound = sounds.victory;

  sound.volume = getSfxVolume();
  sound.currentTime = 0;

  sound.play().catch(() => {});
}