import { ansiLength, ansiTrunk } from "../utils/ansi.ts";
import { Block } from "./block.ts";

/** Rows of filled lines with same width */
export class Box extends Block {
  private line: string;

  constructor(
    public width: number,
    public height: number,
    private readonly fill: string = " ",
  ) {
    super();
    this.line = ansiTrunk(this.fill.repeat(this.width), this.width);
    this.width = ansiLength(this.line);
  }

  /** Create new box with different width */
  public setWidth(width: number): number {
    this.line = ansiTrunk(this.fill.repeat(width), width);
    return this.width = ansiLength(this.line);;
  }

  /** Create new box with different height */
  public setHeight(height: number): number {
    return this.height = height;
  }

  /** Render box as joined lines */
  public get lines(): string[] {
    const lines: string[] = Array(this.height).fill(this.line);
    return lines;
  }
}
