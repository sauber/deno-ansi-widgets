import { Block } from "./block.ts";

/** X, Y coordinate and value */
export type Point = [number, number, number];
export type Points = Point[];

/** Display pair of data in a plot */
export class Scatter extends Block {
  // public override readonly canSetHeight = false;
  // public override readonly height = 1;

  constructor(
    private data: Points,
    public width: number,
    public height: number,
  ) {
    super();
  }

  /** Set text content */
  public override update(data: Points): void {
    this.data = data;
  }

  /** New width of text line */
  public override setWidth(width: number): number {
    this.width = width;
    return width;
  }

  /** New height of text line, has no effect */
  public override setHeight(height: number): number {
    this.height = height;
    return height;
  }

  /** Single line of text, padded or truncated to width */
  public override get lines(): string[] {
    // Generate y-axis, x-axis and bitmap
    return [];
  }
}
