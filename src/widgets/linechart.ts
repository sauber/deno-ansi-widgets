import { CharPlot } from "../utils/charplot.ts";
import { scale } from "../utils/scale.ts";
import { downsample } from "../utils/downsample.ts";
import { alignNumbers } from "../utils/align.ts";

export type AnsiStyle = string; // Placeholder for ANSI style strings

/** Create a terminal printable line chart from an array of numbers */
export function linechart(
  values: number[] | number[][],
  height: number,
  width?: number,
  style?: AnsiStyle | AnsiStyle[],
): string {
  // Handle empty input
  if (values.length === 0) return "";

  // Determine if input is multiple series (2D array) or single series (1D array)
  let seriesArray: number[][];
  const firstElement = values[0];
  if (Array.isArray(firstElement)) {
    // Input is a 2D array (multiple series)
    seriesArray = values as number[][];
  } else {
    // Input is a 1D array (single series), wrap in array
    seriesArray = [values as number[]];
  }

  // Validate that all series have the same length
  const length = seriesArray[0].length;
  for (const series of seriesArray) {
    if (series.length !== length) {
      throw new Error("All series must have the same length");
    }
  }

  // Compute global min and max across all values
  const flat = seriesArray.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  // Early return for straight line(s)
  if (min === max) {
    const label = String(seriesArray[0][0]);
    return `${label}├${"─".repeat(width ? width - label.length - 1 : 0)}`;
  }

  if (height < 2) throw new Error("Height must be at least 2");

  // y axis numeric labels
  const yLabels: number[] = scale(min, max, height);

  // Convert numeric labels to aligned number labels, highest label first
  const yTextLabels: string[] = alignNumbers(yLabels).reverse();

  // Set width for y axis labels to width of longest label
  const yLabelWidth: number = yTextLabels[0].length;

  // Determine base width per series (including space for label)
  const baseWidth = width ? width - yLabelWidth : length;

  // Textmap for holding chart symbols, indexed by (x, y) coordinates
  const textmap = new CharPlot();

  // Insert Y axis border at column 0
  for (let y = 0; y < height; y++) {
    textmap.insert(0, y, "├");
  }

  // Compute step size for mapping values to y indices
  const stepSize = yLabels[1] - yLabels[0];

  // Plot each series
  let seriesIndex = 0;
  for (const series of seriesArray) {
    // Get style for this series
    const seriesStyle = style
      ? (Array.isArray(style) ? style[seriesIndex] : style)
      : undefined;

    // Downsample if width provided
    const downsampled = width && width < series.length
      ? downsample(series, baseWidth)
      : series;

    // Map values to y indices
    const line = downsampled.map((value) =>
      Math.round((value - yLabels[0]) / stepSize)
    );

    // Plot the line with series style
    let prevY = line[0];
    for (let x = 1; x < line.length; x++) {
      const currY = line[x];
      if (prevY === currY) {
        // Going straight
        textmap.insert(x, currY, "─", seriesStyle);
      } else if (prevY < currY) {
        // Going up
        textmap.insert(x, currY, "╭", seriesStyle);
        textmap.insert(x, prevY, "╯", seriesStyle);
      } else {
        // Going down
        textmap.insert(x, prevY, "╮", seriesStyle);
        textmap.insert(x, currY, "╰", seriesStyle);
      }
      // Fill vertical lines
      const startY = Math.min(prevY, currY) + 1;
      const endY = Math.max(prevY, currY);
      for (let y = startY; y < endY; y++) {
        textmap.insert(x, y, "│", seriesStyle);
      }
      prevY = currY;
    }
    seriesIndex++;
  }

  // Combine y axis labels with chart grid
  const chart = textmap.lines.map((line, i) => `${yTextLabels[i]}${line}`)
    .join("\n");

  return chart;
}
