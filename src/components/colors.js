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

export const COLORS_TILES = [
  // 🔴 ROJO CERÁMICA
  "#F28B82",
  "#FFAAA5",
  "#EFA3A3",

  // 🟠 MELocotón
  "#FFB38A",
  "#FFC09A",
  "#F7B58B",

  // 🟡 CREMA / AMARILLO
  "#FFE59A",
  "#FFF0B3",
  "#F6DFA0",

  // 🟢 VERDE MENTA
  "#9FE2BF",
  "#A8E6CF",
  "#B7E4C7",

  // 🟢 VERDE CLARO
  "#B8D8A8",
  "#C5E1A5",
  "#AFCFA4",

  // 🔵 AZUL CIELO
  "#8FD3FF",
  "#A7DFFF",
  "#9CCFF2",

  // 🩵 AZUL AGUA
  "#8EDDE6",
  "#A5E5E9",
  "#9DD9D2",

  // 🟣 LAVANDA
  "#C7B5E3",
  "#D2C2E8",
  "#BFA7D9",

  // 💗 ROSA
  "#F3A6C8",
  "#F6B6D2",
  "#EFA8C4",

  // 🌸 ROSA PÁLIDO
  "#F7C6D9",
  "#F8D0DF",
  "#EFC1D5",

  // 🔷 TURQUESA
  "#8FD8D2",
  "#A3E0DA",
  "#91D5CC",

  // ⚪ BLANCO / MARFIL
  "#F2F0E6",
  "#FFF8E7",
  "#E8E4D8",
];

export const COLORS_WOOD = [
  // 🤍 MADERA BLANCA
  "#F3EDE2",

  // 🩶 MADERA GRIS CLARA
  "#D8D0C4",

  // 🩶 GRIS MADERA
  "#B8ADA0",

  // 🟤 ABEDUL
  "#D8B98A",

  // 🟤 ROBLE CLARO
  "#C9A66B",

  // 🟤 MIEL
  "#C88A4A",

  // 🟤 ROBLE
  "#A9703F",

  // 🟤 CEDRO
  "#A45D35",

  // 🟤 CAOBA CLARA
  "#8F4F32",

  // 🟤 NOGAL
  "#70452F",

  // 🟤 NOGAL OSCURO
  "#583A2A",

  // ⚫ MADERA AHUMADA
  "#40352E",

  // ⚫ ÉBANO
  "#292522",
];

export const COLORS_METAL = [
  // ⚪ PLATA CLARA
  "#F2F2F2",

  // ⚪ PLATA
  "#DCDCDC",

  // 🩶 GRIS MUY CLARO
  "#C6C6C6",

  // 🩶 GRIS CLARO
  "#B0B0B0",

  // 🩶 GRIS MEDIO CLARO
  "#999999",

  // 🩶 GRIS MEDIO
  "#828282",

  // 🩶 GRIS
  "#6B6B6B",

  // 🩶 GRIS OSCURO
  "#555555",

  // ⚫ GRAFITO
  "#3F3F3F",

  // ⚫ NEGRO GRISÁCEO
  "#2A2A2A",

  // ⚫ NEGRO
  "#151515",
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