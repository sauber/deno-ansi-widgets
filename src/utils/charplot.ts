import { ansiLength } from "./ansi.ts";
import { stripAnsiCode } from "@std/fmt/colors";

/** Plot single characters into a 2D map of chars.
 * Double-width charaters takes up two spots.
 * Low X is left and high X is right.
 * Low Y is bottom and high Y at top.
 * Round X and Y to nearest integer position.
 * Auto expand grid to accomodate higher or lower X and Y positions.
 * Assemble lines by joining all chars at each line.
 * Aseembled lines are padded with blank space at start and end to have equal length.
 * Assembled lines are returned with top lines first for naturaly terminal printing order.
 */
export class CharPlot {
  private grid: Map<number, Map<number, string>> = new Map();
  private minX = Infinity;
  private maxX = -Infinity;
  private minY = Infinity;
  private maxY = -Infinity;

  constructor() {}

  /** Number of single width chars of every line */
  public get width(): number {
    if (this.grid.size === 0) {
      return 0;
    }
    return this.maxX - this.minX + 1;
  }

  /** Number of lines */
  public get height(): number {
    if (this.grid.size === 0) {
      return 0;
    }
    return this.maxY - this.minY + 1;
  }

  /** Insert single or doublewidth char at position */
  public insert(x: number, y: number, char: string): void {
    if ([...stripAnsiCode(char)].length > 1) {
      throw new Error(
        `Invalid char: "${char}". Only single characters are allowed.`, 
      );
    }
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    if (!this.grid.has(roundedY)) {
      this.grid.set(roundedY, new Map());
    }
    this.grid.get(roundedY)!.set(roundedX, char);

    this.minX = Math.min(this.minX, roundedX);
    this.maxX = Math.max(this.maxX, roundedX + Math.max(0, ansiLength(char) - 1));
    this.minY = Math.min(this.minY, roundedY);
    this.maxY = Math.max(this.maxY, roundedY);
  }

  /** Assemble each line */
  public get lines(): string[] {
    if (this.grid.size === 0) {
      return [];
    }

    const result: string[] = [];
    const plotWidth = this.maxX - this.minX + 1;

    for (let y = this.maxY; y >= this.minY; y--) {
      let line = "";
      const row = this.grid.get(y);
      if (row) {
        const charsInRow: { [key: number]: string } = {};
        row.forEach((char, x) => {
          charsInRow[x] = char;
        });

        for (let x = this.minX; x <= this.maxX; x++) {
          if (charsInRow[x]) {
            const char = charsInRow[x];
            line += char;
            const width = ansiLength(char);
            if (width > 1) {
              x += width - 1;
            }
          } else {
            line += " ";
          }
        }
      } else {
        line = " ".repeat(plotWidth);
      }
      result.push(line);
    }
    return result;
  }

  public toString(): string {
    return this.lines.join("\n");
  }
}
