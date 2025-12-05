import { scale } from "../utils/scale.ts";

/** X, Y and Value */
export type Point = [number, number, number];
export type Points = Point[];

/** Render a scatter plot with Y and X axis
 * @param Points Array of points to plot
 * @param width Width of plot area
 * @param height Height of plot area
 * @returns Joined string of plot
 */
export function scatter(points: Points, width: number, height: number): string {
  // Range of yaxis
  const ymin = Math.min(...points.map((p) => p[1]));
  const ymax = Math.max(...points.map((p) => p[1]));
  // Reserve to lines for x-axis labels
  const rows = height - 2;
  const yNumbers = scale(ymin, ymax, rows);

  // Generate y-axis, x-axis and bitmap
  return "";
}
