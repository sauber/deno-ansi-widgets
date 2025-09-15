import { CharPlot } from "../utils/charplot.ts";
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

  const textmap = new CharPlot();

  // Insert Y Axis
  for (let y = 0; y < height; y++) textmap.insert(0, y, "├");

  // Convert data values to y indices
  const stepSize: number = yLabels[1] - yLabels[0];
  const line: number[] = downsampled.map((value) =>
    (Math.round(value / stepSize) * stepSize - yLabels[0]) / stepSize
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
