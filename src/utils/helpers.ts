// Get random first color for linear gradient
const contrastColors = [
  "#1e90ff", // Dodger Blue
  "#ff4500", // Orange Red
  "#32cd32", // Lime Green
  "#ff1493", // Deep Pink
  "#4b0082", // Indigo
  "#008080", // Teal
  "#9400d3", // Dark Violet
  "#ff8c00", // Dark Orange
  "#00ced1", // Dark Turquoise
  "#8b0000", // Dark Red
  "#2f4f4f", // Dark Slate Gray
  "#9932cc", // Dark Orchid
  "#228b22", // Forest Green
  "#4682b4", // Steel Blue
  "#800000", // Maroon
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * contrastColors.length);
  return contrastColors[randomIndex];
}