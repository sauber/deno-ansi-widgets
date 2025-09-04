import { Box } from "./box.ts";
import { scale } from "./scale.ts";

/** Render an array of numbers as an ascii art chart */
export class Chart extends Box {
  constructor(private readonly line: number[], height: number) {
    super(line.length, height);
  }

  /** List of labels on Y axis */
  private yLabels(): number[] {
    const min = Math.min(...this.line);
    const max = Math.max(...this.line);
    return scale(min, max, this.height);
  }

  /** Align line numbers to nearest label on Y axis */
  private lineHeight(): number[] {
    const yLabels: number[] = this.yLabels();
    const stepSize: number = yLabels[1] - yLabels[0];
    const lineHeight: number[] = [];
    for (const value of this.line) {
      const roundedNearest: number = Math.round(value / stepSize) * stepSize;
      const yLabelIndex: number = (roundedNearest - yLabels[0]) / stepSize;
      lineHeight.push(yLabelIndex);
    }
    return lineHeight;
  }

  /** Plot graphics symbols into a 2D grid */
  private plot(): string[][] {
    const lineHeight: number[] = this.lineHeight();
    const width: number = lineHeight.length - 1;
    const grid: string[][] = Array.from(
      { length: this.height },
      () => Array(width).fill(" "),
    );

    for (let i = 0; i < lineHeight.length - 1; i++) {
      const [y1, y2] = [lineHeight[i], lineHeight[i + 1]];
      if (y1 === y2) {
        // Going straight
        grid[y1][i] = "─";
      } else if (y1 < y2) {
        // Going up
        grid[y2][i] = "╭";
        grid[y1][i] = "╯";
      } else {
        // Going down
        grid[y1][i] = "╮";
        grid[y2][i] = "╰";
      }

      // Fill extra lines between points
      for (let y = Math.min(y1, y2) + 1; y < Math.max(y1, y2); y++) {
        grid[y][i] = "│";
      }
    }
    return grid.reverse(); // Topline first
  }

  /** Render the chart as an array of strings */
  override get lines(): string[] {
    // Labels as right adjusted strings, highest label first
    const yLabels: number[] = this.yLabels();
    const labelWidth: number = Math.max(
      ...yLabels.map((l) => l.toString().length),
    );
    const labels: string[] = yLabels.map((l) =>
      l.toString().padStart(labelWidth, " ")
    ).reverse();

    // Graph as joined strings
    const graph: string[] = this.plot().map((row) => row.join(""));

    // Join labels and graph rows side by side separated by axis symbol
    const lines: string[] = labels.map((label, index) =>
      [label, graph[index]].join("├")
    );
    return lines;
  }
}
