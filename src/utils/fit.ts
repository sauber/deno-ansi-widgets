/** Ensure count of lines and length of each line is exact */
export function fit(lines: string[], width: number, height: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < height; i++) {
    result.push(
      i < lines.length
        ? lines[i].substring(0, width).padEnd(width, " ")
        : " ".repeat(width),
    );
  }
  return result;
}
