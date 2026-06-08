export const COLORS = [
    // 🔴 RED / ENERGY (más diferenciados)
    "#FF4D4D", "#D90429", "#FF7A7A",
  
    // 🟠 ORANGE NEON (más separación real)
    "#FF6B00", "#FB8500", "#FFB703",
  
    // 🟡 ELECTRIC YELLOW
    "#FFE600", "#FFD000", "#FFC300",
  
    // 🟢 ACID / FUTURE GREEN
    "#39FF14", "#00FF85", "#00E676",
  
    // 🟦 CYBER BLUE
    "#00B8FF", "#1E90FF", "#4D96FF",
  
    // 🟣 NEON PURPLE
    "#B026FF", "#9D4EDD", "#7B2CBF",
  
    // 💗 HOT PINK / MAGENTA (más variedad real)
    "#FF4DA6", "#D946EF", "#FF6EC7",
  
    // 🟦 CYAN / ELECTRIC AQUA
    "#00F5FF", "#00E5FF", "#00C2FF",
  
    // 🧊 ICE BLUE / FUTURE LIGHT (sin tonos oscuros)
    "#E0F7FF", "#B3FFF6", "#A0E9FF",
  
    // ⚪ LIGHT FUTURISTIC NEUTRALS (sustituyen los oscuros)
    "#E2E8F0", "#CBD5E1", "#94A3B8",
  
    // ⚡ SPECIAL NEON ACCENTS
    "#FF3864", "#2DE2E6", "#F72585", "#7209B7"
  ];

export const shuffleArray = (array) => {
const arr = [...array];

for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

return arr;
};

export const getUniqueColors = (count) => {
    const shuffled = shuffleArray(COLORS);
  
    // si pides más colores que los disponibles
    if (count > shuffled.length) {
      throw new Error(
        `No hay suficientes colores únicos (${shuffled.length}) para ${count} piezas`
      );
    }
  
    return shuffled.slice(0, count);
  };