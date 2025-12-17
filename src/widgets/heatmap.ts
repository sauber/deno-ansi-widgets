import { blockify } from "@sauber/block-image";
import { XAxis } from "./xaxis.ts";
import { YAxis } from "./yaxis.ts";

/** X, Y and Value */
export type Point = [number, number, number];
export type Points = Point[];

/** Render a heatmap plot with Y and X axis
 * @param Points Array of points to plot
 * @param width Width of plot area
 * @param height Height of plot area
 * @returns Joined string of plot
 */
export function heatmap(
  points: Points,
  width: number,
  height: number,
): string[] {
  // Zero height plot
  if (height < 1) return [];

  // Zero width plot
  if (width < 1) return Array(height).fill("");

  // Confirm if there is enough space to display axes:
  // - Assuming X axis at bottom, create y axis at height - 1
  // - Verify that width of y axis still leaves room for plot area
  // - Assuming Y axis at left, create x axis at width - yaxis.width
  // - Verify that X axis has labels to show, otherwise cancel X axis
  // - If X axis is cancelled, re-create Y axis at full height
  // - Verify that Y axis leaves room for plot area, otherwise cancel Y axis too

  // Create Y Axis with space for X Axis
  const ymin = Math.min(...points.map((p) => p[1]));
  const ymax = Math.max(...points.map((p) => p[1]));
  const tempYAxis = new YAxis(ymin, ymax, height - 1);
  const yAxisWidth = tempYAxis.width;
  const canShowYAxis = (width - yAxisWidth) >= 1; // At least 1 char for plot

  // Determine if X-axis can be displayed
  const xmin = Math.min(...points.map((p) => p[0]));
  const xmax = Math.max(...points.map((p) => p[0]));
  const xAxisWidth = width - (canShowYAxis ? yAxisWidth : 0);
  const xAxis = new XAxis(xmin, xmax, xAxisWidth);
  const canShowXAxis = xAxis.labels.length > 0;

  // If cannot show X axis, regenerate y Axis at full height (even though it may not fit)
  const yAxis = (!canShowXAxis) ? new YAxis(ymin, ymax, height) : tempYAxis;

  // Plot area size in half char blocks
  const xwidth: number = (canShowXAxis ? xAxis.width : width) * 2;
  const yheight: number = (height - (canShowXAxis ? 1 : 0)) * 2;
  const grid: number[][] = new Array(yheight).fill(0).map(() =>
    new Array(xwidth).fill(0)
  );

  // Bucket all the points into a plot area
  // Keep track of max value for scaling
  let bucketMin = 0;
  let bucketMax = 0;
  const xPosMin = canShowXAxis ? xAxis.labels[0] : xmin;
  const xPosMax = canShowXAxis ? xAxis.labels[xAxis.labels.length - 1] : xmax;
  const yPosMin = canShowYAxis ? yAxis.labels[0] : ymin;
  const yPosMax = canShowYAxis ? yAxis.labels[yAxis.labels.length - 1] : ymax;
  points.forEach(([x, y, v]) => {
    const xpos = Math.floor(
      ((x - xPosMin) / (xPosMax - xPosMin)) * (xwidth - 1),
    );
    const ypos = yheight - 1 - Math.floor(
      ((y - yPosMin) / (yPosMax - yPosMin)) * (yheight - 1),
    );
    const origValue = grid[ypos][xpos];
    const newValue = origValue + v;
    grid[ypos][xpos] = newValue;
    if (newValue > bucketMax) bucketMax = newValue;
    if (newValue < bucketMin) bucketMin = newValue;
  });

  // Create a function which will scale bucket value to range 0-255.
  // If all values are positive then scale using a simple multiplier.
  // If some values are negative then scale to range -128 to 127 and offset with 128.
  let scaleFn: (v: number) => number;
  if (bucketMin >= 0) {
    const multiplier = bucketMax === 0 ? 1 : 255 / bucketMax;
    scaleFn = (v) => Math.floor(v * multiplier);
  } else {
    const multiplier = 127 / Math.max(-bucketMin, bucketMax);
    const offset = 128;
    scaleFn = (v) => offset + Math.floor(v * multiplier);
  }

  // Convert scaled bucket values to pixel array
  const pixels: Uint8Array = new Uint8Array(xwidth * yheight * 4);
  for (let y = 0; y < yheight; y++) {
    for (let x = 0; x < xwidth; x++) {
      const value = grid[y][x];
      const scaled = scaleFn(value);
      pixels[4 * (y * xwidth + x) + 0] = scaled; // R
      pixels[4 * (y * xwidth + x) + 1] = scaled; // G
      pixels[4 * (y * xwidth + x) + 2] = scaled; // B
      // No alpha value set (default 0)
    }
  }

  // Convert pixel array to block characters
  const plot: string = blockify(pixels, xwidth, yheight);
  const plotLines: string[] = plot.split("\n");

  // Merge y-axis and plot lines
  const ylines: string[] = canShowYAxis
    ? yAxis.lines()
    : Array(height).fill("");
  const chartLines: string[] = [];
  for (let y = 0; y < yAxis.height; y++) {
    const yline = ylines[y];
    const plotLine = plotLines[y];
    chartLines.push(yline + plotLine);
  }

  // Add x-axis lines
  if (canShowXAxis) chartLines.push(xAxis.toString().padStart(width, " "));

  return chartLines;
}
