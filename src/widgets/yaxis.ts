import { scale } from "../utils/scale.ts";

/** Generate an ascii y-Axis of range from min to max spread out on number of lines
 * @param min Lowest number on scale
 * @param max Highest number on scale
 * @param lines Number of lines on scale
 * @param separator Single char at right side of numbers
 * @returns Joined string of exist lines
 */
export function yaxis(
  min: number,
  max: number,
  lines: number,
  separator: string = "┤",
): string {
  if (lines < 1) return "";

  // y axis numeric labels
  const yLabels: number[] = scale(min, max, lines);

  // Set width for y axis labels to width of longest label
  const yLabelWidth: number = Math.max(...yLabels.map((l) => String(l).length));

  // Convert numeric labels to right adjusted text labels, highest label first
  const yTextLabels: string[] = yLabels.map((l) =>
    String(l).padStart(yLabelWidth, " ") + separator
  ).reverse();

  return yTextLabels.join("\n");
}
