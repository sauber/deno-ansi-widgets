import { Block, type Blocks } from "./block.ts";
import { Collapse, CollapseAxis } from "./collapse.ts";

/** Display multiple blocks side by side */
export class Split extends Block {
  private readonly inner: Collapse;

  constructor(blocks: Blocks) {
    super();
    this.inner = new Collapse(blocks, CollapseAxis.Horizontal);
    this.canSetWidth = this.inner.canSetWidth;
    this.canSetHeight = this.inner.canSetHeight;
  }

  /** Collapsed children present frame-like borders to a parent */
  public override get frameLike(): boolean {
    return this.inner.frameLike;
  }

  public override get width(): number {
    return this.inner.width;
  }

  public override get height(): number {
    return this.inner.height;
  }

  public override setWidth(width: number): number {
    return this.inner.setWidth(width);
  }

  public override setHeight(height: number): number {
    return this.inner.setHeight(height);
  }

  public override get lines(): string[] {
    return this.inner.lines;
  }
}
