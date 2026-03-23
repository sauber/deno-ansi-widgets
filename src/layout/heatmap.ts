import { heatmap, type Points } from "../widgets/heatmap.ts";
import { Block } from "./block.ts";

/** Display pair of data in a plot */
export class Heatmap extends Block {
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
    return heatmap(this.data, this.width, this.height);
  }
}
