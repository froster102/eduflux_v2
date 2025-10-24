export function calculateOffset(page: { number: number; size: number }) {
  const { number, size } = page;
  const offset = (number - 1) * size;
  return offset;
}
