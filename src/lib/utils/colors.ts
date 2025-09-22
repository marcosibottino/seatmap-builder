export const randomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

export function darkenColor(hex: string, factor = 0.7): string {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.max(0, Math.floor(r * factor));
  g = Math.max(0, Math.floor(g * factor));
  b = Math.max(0, Math.floor(b * factor));

  return `rgb(${r}, ${g}, ${b})`;
}

export const generateSeatId = (rowId: string, index: number) =>
  `${rowId}-${index}`;

export const generateRowId = (index: number) =>
  `row-${index}`;
