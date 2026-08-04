export const COLORS = [
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
"#FFB347", // ámbar
"#6FE7B7", // verde menta
"#7DD3FC", // azul cielo
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