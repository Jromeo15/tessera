const DEFAULT_MUSIC_VOLUME = 0.1;
const DEFAULT_SFX_VOLUME = 0.35;

export function getMusicVolume() {
  const value = localStorage.getItem("musicVolume");

  if (value === null) {
    return DEFAULT_MUSIC_VOLUME;
  }

  return Number(value);
}

export function getSfxVolume() {
  const value = localStorage.getItem("sfxVolume");

  if (value === null) {
    return DEFAULT_SFX_VOLUME;
  }

  return Number(value);
}

export function setMusicVolume(value) {
  const volume = Math.max(0, Math.min(0.5, Number(value)));

  localStorage.setItem("musicVolume", volume);

  window.dispatchEvent(
    new CustomEvent("music-volume-change", {
      detail: volume,
    })
  );
}

export function setSfxVolume(value) {
  const volume = Math.max(0, Math.min(0.5, Number(value)));

  localStorage.setItem("sfxVolume", volume);

  window.dispatchEvent(
    new CustomEvent("sfx-volume-change", {
      detail: volume,
    })
  );
}