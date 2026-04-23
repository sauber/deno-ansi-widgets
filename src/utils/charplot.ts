import { ansiLength } from "./ansi.ts";
import { stripAnsiCode } from "@std/fmt/colors";

type Cell = { char: string; ansi: string };
type Line = Map<number, Cell>;
type Grid = Map<number, Line>;

/** Plot single characters into a 2D map of chars.
 * Double-width characters takes up two spots.
 * Low X is left and high X is right.
 * Low Y is bottom and high Y at top.
 * Round X and Y to nearest integer position.
 * Auto expand grid to accommodate higher or lower X and Y positions.
 * Assemble lines by joining all chars at each line.
 * Aseembled lines are padded with blank space at start and end to have equal length.
 * Assembled lines are returned with top lines first for naturaly terminal printing order.
 */
export class CharPlot {
  private grid: Grid = new Map();
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

  /** Insert single or doublewidth char at position
   * Optionally with ANSI code for styling. ANSI code should not contain visible characters, only escape codes. ANSI code will be applied to the char and reset after the char, so it will not affect other chars in the same line.
   * @param x column position (rounded to nearest integer)
   * @param y line position counting from bottom and up (rounded to nearest integer)
   * @param char Single or double-width character to insert
   * @param ansi Optional ANSI code for styling the char. Should not contain visible characters.
   * @throws Error if char is not a single character or if ANSI code contains visible characters.
   */
  public insert(x: number, y: number, char: string, ansi?: string): void {
    // Validate single char
    if (char.length !== 1) {
      throw new Error(
        `Invalid char: "${char}". Only single characters are allowed.`,
      );
    }

    // Validate that ANSI code has no visible chars
    if (ansi && stripAnsiCode(ansi).length !== 0) {
      throw new Error(
        `Invalid ANSI code: "${ansi}". ANSI code should not contain visible characters.`,
      );
    }

    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    if (!this.grid.has(roundedY)) {
      this.grid.set(roundedY, new Map());
    }
    const cell: Cell = { char, ansi: ansi ?? "" };
    this.grid.get(roundedY)!.set(roundedX, cell);

    this.minX = Math.min(this.minX, roundedX);
    this.maxX = Math.max(
      this.maxX,
      roundedX + Math.max(0, ansiLength(char) - 1),
    );
    this.minY = Math.min(this.minY, roundedY);
    this.maxY = Math.max(this.maxY, roundedY);
  }

  /** Assemble a single line from ordered cells, applying minimal ANSI escapes */
  private assembleLine(
    row: Line,
  ): string {
    const parts: string[] = [];
    let lastAnsi = "";
    let skip = 0;
    for (let x = this.minX; x <= this.maxX; x++) {
      // Handle double-width chars by skipping next cell(s)
      if (skip > 0) {
        skip--;
        continue;
      }

      const cell: Cell | undefined = row.get(x);

      // Insert blank if no char at this position
      if (!cell) {
        parts.push(" ");
        continue;
      }

      const { char, ansi } = cell;

      if (ansi) {
        if (lastAnsi) {
          if (ansi !== lastAnsi) {
            // Change ANSI style
            parts.push(ansi);
            lastAnsi = ansi;
          } else {
            // Same ANSI style, no need to re-apply
          }
        } else {
          // New ANSI style
          parts.push(ansi);
          lastAnsi = ansi;
        }
      } else {
        if (lastAnsi) {
          // Reset ANSI style when leaving styled cell
          parts.push("\x1b[0m");
          lastAnsi = "";
        } else {
          // Still no ANSI style, just another normal char
        }
      }

      const width = ansiLength(char);
      parts.push(char);
      if (width > 1) {
        skip = width - 1;
      }
    }
    // Reset at end if needed
    if (lastAnsi) {
      parts.push("\x1b[0m");
    }
    return parts.join("");
  }

  /** Assemble lines */
  public get lines(): string[] {
    if (this.grid.size === 0) {
      return [];
    }

    const result: string[] = [];

    for (let y = this.maxY; y >= this.minY; y--) {
      const row = this.grid.get(y) ?? new Map();
      result.push(this.assembleLine(row));
    }

    return result;
  }

  public toString(): string {
    return this.lines.join("\n");
  }
}
