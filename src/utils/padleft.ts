/** Convert numbers to strings and pad left to make all strings equal length
 * @param numbers Array of numbers to pad
 * @param padChar Character to use for padding, default is space
 * @returns Array of padded strings
 */
export function padleft(numbers: number[], padChar: string = " "): string[] {
  const maxLength = Math.max(...numbers.map((n) => n.toString().length));
  return numbers.map((n) => n.toString().padStart(maxLength, padChar));
}
