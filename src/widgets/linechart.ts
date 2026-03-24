import { CharPlot } from "../utils/charplot.ts";
import { scale } from "../utils/scale.ts";
import { downsample } from "../utils/downsample.ts";
import { alignNumbers } from "../utils/align.ts";

/** Create a terminal printable line chart from an array of numbers */
export function linechart(
  data: number[],
  height: number,
  width?: number,
): string {
  // Empty chart
  if (data.length === 0) return "";

  const min = Math.min(...data);
  const max = Math.max(...data);

  // Display straight line if no variation in values
  if (min === max) {
    const label = String(data[0]);
    return `${label}├${"─".repeat(width ? width - label.length - 1 : 0)}`;
  }

  if (height < 2) throw new Error("Height must be at least 2");

  // y axis numeric labels
  const yLabels: number[] = scale(min, max, height);

  // Convert numeric labels to right adjusted text labels, highest label first
  const yTextLabels: string[] = alignNumbers(yLabels).reverse();

  // Set width for y axis labels to width of longest label
  const yLabelWidth: number = yTextLabels[0].length;

  // Downsample data to fit width
  const downsampled = width ? downsample(data, width - yLabelWidth) : data;

  // Rectangular text area for holding chart characters
  const textmap: CharPlot = new CharPlot();

  // Insert Y Axis symbols
  for (let y = 0; y < height; y++) textmap.insert(0, y, "├");

  // Convert data values to y indices
  const stepSize: number = yLabels[1] - yLabels[0];
  const line: number[] = downsampled.map((value) =>
    Math.round((value - yLabels[0]) / stepSize)
  );

  // Plot data points
  for (let x = 1; x < line.length; x++) {
    const [y1, y2] = [line[x - 1], line[x]];
    if (y1 === y2) {
      // Going straight
      textmap.insert(x, y1, "─");
    } else if (y1 < y2) {
      // Going up
      textmap.insert(x, y2, "╭");
      textmap.insert(x, y1, "╯");
    } else {
      // Going down
      textmap.insert(x, y1, "╮");
      textmap.insert(x, y2, "╰");
    }

    // Fill extra lines between points
    for (let y = Math.min(y1, y2) + 1; y < Math.max(y1, y2); y++) {
      textmap.insert(x, y, "│");
    }
  }

  // Combine y axis labels with chart grid
  const chart: string = textmap.lines.map((line, i) =>
    `${yTextLabels[i]}${line}`
  ).join("\n");

  return chart;
}
