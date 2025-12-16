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
  // No lines
  if (height < 1) return [];

  // No width
  if (width < 1) return new Array(height).fill("");

  // Start with the assumption that both X and Y axis will be included
  let showXAxis = true;
  let showYAxis = true;

  // At least 3 lines to have Y axis
  if (height < 3) showYAxis = false;

  // At least 2 lines to have Z axis
  if (height < 2) showXAxis = false;
  // Verify if there is enough space for axes:
  // - Assuming X axis at bottom, create y axis at height - 1
  // - Verify that width of y axis still leaves room for plot area
  // - Assuming Y axis at left, create x axis at width - yaxis.width
  // - Verify that X axis has labels to show, otherwise cancel X axis
  // - If X axis is cancelled, re-create Y axis at full height
  // - Verify that Y axis leaves room for plot area, otherwise cancel Y axis too

  // Y-axis
  const ymin: number = Math.min(...points.map((p) => p[1]));
  const ymax: number = Math.max(...points.map((p) => p[1]));
  let yaxis = new YAxis(ymin, ymax, height - 1);

  // X-axis
  const xAxisWidth = width - (showYAxis ? yaxis.width : 0);
  if (xAxisWidth < 1) {
    showXAxis = false;
    if (showYAxis) yaxis = new YAxis(ymin, ymax, height);
  }
  const xmin: number = Math.min(...points.map((p) => p[0]));
  const xmax: number = Math.max(...points.map((p) => p[0]));
  const xaxis = new XAxis(xmin, xmax, xAxisWidth);
  console.log(xaxis);

  // Calculate plot area size, in half char block counts
  const xwidth: number = xAxisWidth * 2;
  const yheight: number = (height - (showXAxis ? 1 : 0)) * 2;
  const grid: number[][] = new Array(yheight).fill(0).map(() =>
    new Array(xwidth).fill(0)
  );

  console.log({ showXAxis, showYAxis, width, yheight });

  // Bucket all the points into a plot area
  // Keep track of max value for scaling
  let bucketMin = 0;
  let bucketMax = 0;
  points.forEach(([x, y, v]) => {
    const xpos = Math.floor(
      ((x - xmin) / (xmax - xmin)) * (xwidth - 1),
    );
    const ypos = yheight - 1 - Math.floor(
      ((y - ymin) / (ymax - ymin)) * (yheight - 1),
    );
    console.log(
      `Point (${x},${y}) with value ${v} goes to bucket (${xpos},${ypos})`,
    );
    const origValue = grid[ypos][xpos];
    const newValue = origValue + v;
    grid[ypos][xpos] = newValue;
    if (newValue > bucketMax) bucketMax = newValue;
    if (newValue < bucketMin) bucketMin = newValue;
  });

  // console.log(grid, xwidth, yheight);

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
  const ylines: string[] = yaxis.lines();
  const chartLines: string[] = [];
  for (let y = 0; y < yaxis.height; y++) {
    const yline = ylines[y];
    const plotLine = plotLines[y];
    chartLines.push(yline + plotLine);
  }

  // Add x-axis lines
  const xline = xaxis.toString().padStart(width, " ");
  chartLines.push(xline);

  return chartLines;
}
