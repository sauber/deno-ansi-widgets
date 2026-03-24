/** Convert numbers to strings of equal length
 * Ensure . in floating point numbers are at same position in string. Pad with zeros at end of string where necessary.
 * Pad with spaces at start of string where necessary.
 * @param numbers Array of numbers to pad
 * @param padChar Character to use for padding, default is space
 * @returns Array of space/0 padded strings
 */
export function alignNumbers(numbers: number[]): string[] {
  if (numbers.length === 0) return [];

  const parts = numbers.map((n) => {
    const s = n.toString();
    const dotIndex = s.indexOf(".");
    return {
      left: dotIndex === -1 ? s : s.slice(0, dotIndex),
      right: dotIndex === -1 ? "" : s.slice(dotIndex + 1),
      hasDot: dotIndex !== -1,
    };
  });

  const maxLeft = Math.max(...parts.map((p) => p.left.length));
  const maxRight = Math.max(...parts.map((p) => p.right.length));
  const anyDot = parts.some((p) => p.hasDot);

  return parts.map((p) => {
    const leftPadded = p.left.padStart(maxLeft, " ");
    const rightPadded = p.right.padEnd(maxRight, "0");
    if (anyDot) {
      return `${leftPadded}.${rightPadded}`;
    }
    return leftPadded;
  });
}
