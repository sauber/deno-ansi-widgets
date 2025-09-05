import { Block } from "./block.ts";

/** Rows of lines of spaces with same width */
export class Box extends Block {
  constructor(
    public width: number,
    public height: number,
    private readonly fill: string = " ",
  ) {
    super();
  }

  /** Create new box with different width */
  public setWidth(width: number): number {
    return this.width = width;
  }

  /** Create new box with different height */
  public setHeight(height: number): number {
    return this.height = height;
  }

  /** Render box as joined lines */
  public get lines(): string[] {
    const line: string = this.fill.repeat(this.width).substring(0, this.width);
    const lines: string[] = Array(this.height).fill(line);
    return lines;
  }
}
