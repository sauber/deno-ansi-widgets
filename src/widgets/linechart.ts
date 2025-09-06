import { scale } from "../utils/scale.ts";

/** Create a terminal printable line chart from an array of numbers */
export function linechart(
  data: number[],
  height: number,
  width?: number,
): string {
  // Empty chart
  if (data.length === 0) return "";

  // Extend single data point as a line
  if (data.length === 1) {
    const label = String(data[0]);
    return `${label}├${"─".repeat(width ? width - label.length - 1 : 0)}`;
  }

  if (height < 2) throw new Error("Height must be at least 2");

  // y axis numeric labels
  const min = Math.min(...data);
  const max = Math.max(...data);
  const yLabels: number[] = scale(min, max, height);

  // Set width for y axis labels to width of longest label
  const yLabelWidth: number = Math.max(...yLabels.map((l) => String(l).length));

  // Convert numeric labels to right adjusted text labels, highest label first
  const yTextLabels: string[] = yLabels.map((l) =>
    String(l).padStart(yLabelWidth, " ")
  ).reverse();

  // Downsample data to fit width
  const downsampled = width
    ? data.filter((_, i) =>
      i % Math.ceil(data.length / (width - yLabelWidth)) === 0
    )
    : data;
  const graphWidth: number = downsampled.length;

  // Chart grid, indexed [y][x] where [0][0] is top-left
  const grid: string[][] = Array.from(
    { length: height },
    () => Array(graphWidth - 1).fill(" "),
  );

  // Insert a char into (x,y) position in grid, where y=0 is bottom
  function plot(x: number, y: number, char: string): void {
    grid[height - y - 1][x] = char;
  }

  // Convert data values to y indices
  const stepSize: number = yLabels[1] - yLabels[0];
  const line: number[] = downsampled.map((value) =>
    (Math.round(value / stepSize) * stepSize - yLabels[0]) / stepSize
  );

  // Plot data points
  for (let x = 0; x < line.length - 1; x++) {
    const [y1, y2] = [line[x], line[x + 1]];
    if (y1 === y2) {
      // Going straight
      plot(x, y1, "─");
    } else if (y1 < y2) {
      // Going up
      plot(x, y2, "╭");
      plot(x, y1, "╯");
    } else {
      // Going down
      plot(x, y1, "╮");
      plot(x, y2, "╰");
    }

    // Fill extra lines between points
    for (let y = Math.min(y1, y2) + 1; y < Math.max(y1, y2); y++) {
      plot(x, y, "│");
    }
  }

  // Combine y axis labels with chart grid
  const chart: string = grid.map((row, i) =>
    `${yTextLabels[i]}├${row.join("")}`
  ).join("\n");

  return chart;
}
