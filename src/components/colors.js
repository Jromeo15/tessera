export const COLORS_BASIC = [
  // 🔴 RED / ENERGY
  "#FF4D4D", "#D90429", "#FF7A7A",

  // 🟠 ORANGE NEON
  "#FF6B00", "#FB8500", "#FFB703",

  // 🟡 ELECTRIC YELLOW
  "#FFE600", "#FFD000", "#FFC300",

  // 🟢 ACID / FUTURE GREEN
  "#39FF14", "#00FF85", "#00E676",

  // 🟦 CYBER BLUE
  "#00B8FF", "#1E90FF", "#4D96FF",

  // 🟣 NEON PURPLE
  "#B026FF", "#9D4EDD", "#7B2CBF",

  // 💗 HOT PINK / MAGENTA
  "#FF4DA6", "#D946EF", "#FF6EC7",

  // 🟦 CYAN / ELECTRIC AQUA
  "#00F5FF", "#00E5FF", "#00C2FF",

  // 🧊 ICE BLUE / FUTURE LIGHT
  "#E0F7FF", "#B3FFF6", "#A0E9FF",

  // ⚪ LIGHT FUTURISTIC NEUTRALS
  "#E2E8F0", "#CBD5E1", "#94A3B8",

  // ⚡ SPECIAL NEON ACCENTS
  "#FF3864", "#2DE2E6", "#F72585", "#7209B7",
];

export const COLORS_CARTOON = [
  // RED
  "#E83E5B",

  // ORANGE
  "#F47B3A",

  // YELLOW
  "#F6D65B",

  // GREEN
  "#3EDC9A",

  // CYAN
  "#4DE8EE",

  // BLUE
  "#4F9FFF",

  // PURPLE
  "#9567E8",

  // MAGENTA
  "#E85BBF",

  // PINK
  "#FF8BC4",

  // ICE
  "#C8F3FA",

  // WHITE / SILVER
  "#DCE5EE",

  // DARK SILVER
  "#AEBECD",

  // EXTRA FUTURISTIC
  "#FFB347",
  "#6FE7B7",
  "#7DD3FC",
];

export const COLORS_CANDY = [
  // RED
  "#FF3B4E",

  // CORAL
  "#FF6B5A",

  // ORANGE
  "#FF8A2A",

  // PEACH
  "#FFB347",

  // YELLOW
  "#FFD93D",

  // LIME
  "#B8E62E",

  // GREEN
  "#4DDE6C",

  // MINT
  "#35E0A1",

  // TURQUOISE
  "#24D9D0",

  // CYAN
  "#32D9FF",

  // SKY BLUE
  "#4DA6FF",

  // BLUE
  "#367CFF",

  // INDIGO
  "#6555FF",

  // PURPLE
  "#9B4DFF",

  // VIOLET
  "#C04DFF",

  // MAGENTA
  "#F044D8",

  // HOT PINK
  "#FF4FA3",

  // PINK
  "#FF75C8",

  // CREAM
  "#FFF1A8",

  // WHITE
  "#FFFFFF",
];

export const COLORS_NEON = [
  // 🔴 LASER RED
  "#FF1744",
  "#FF003C",
  "#FF2A6D",

  // 🟠 NEON ORANGE
  "#FF5F00",
  "#FF7A00",
  "#FF9500",

  // 🟡 ELECTRIC YELLOW
  "#FFF000",
  "#FFE600",
  "#FFD500",

  // 🟢 LASER GREEN
  "#39FF14",
  "#00FF66",
  "#00FF85",

  // 🟢 LIME NEON
  "#B6FF00",
  "#8CFF00",
  "#CCFF00",

  // 🔵 ELECTRIC BLUE
  "#00BFFF",
  "#008CFF",
  "#0066FF",

  // 🩵 CYAN NEON
  "#00FFFF",
  "#00F5FF",
  "#00E5FF",

  // 🟣 LASER PURPLE
  "#8A2BE2",
  "#A020F0",
  "#BF00FF",

  // 💗 HOT PINK
  "#FF00A8",
  "#FF1493",
  "#FF007F",

  // 🌸 ELECTRIC MAGENTA
  "#FF00FF",
  "#F000FF",
  "#D900FF",

  // 🔷 ULTRAVIOLET / CYBER
  "#6A00FF",
  "#7000FF",
  "#9D00FF",

  // ⚡ SPECIAL NEON
  "#00FFCC",
  "#00FFD5",
  "#FFEA00",
  "#FF3CAC",
];

export const shuffleArray = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

export const getUniqueColors = (colors, count) => {
  const shuffled = shuffleArray(colors);

  if (count > shuffled.length) {
    throw new Error(
      `No hay suficientes colores únicos (${shuffled.length}) para ${count} piezas`
    );
  }

  return shuffled.slice(0, count);
};