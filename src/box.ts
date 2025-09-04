import { Block } from "./block.ts";

/** Rows of lines of spaces with same width */
export class Box extends Block {
  constructor(
    public readonly width: number,
    public readonly height: number,
    private readonly fill: string = " ",
  ) {
    super();
  }

  /** Create new box with different width and height */
  public setSize(width: number, height: number): Box {
    if (width == this.width && height == this.height) return this;
    return new Box(width, height, this.fill);
  }

  /** Create new box with different width */
  public setWidth(width: number): Box {
    return this.setSize(width, this.height);
  }

  /** Create new box with different height */
  public setHeight(height: number): Box {
    return this.setSize(this.width, height);
  }

  /** Render box as joined lines */
  public get lines(): string[] {
    const line: string = this.fill.repeat(this.width).substring(0, this.width);
    const lines: string[] = Array(this.height).fill(line);
    return lines;
  }
}
