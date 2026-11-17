import { Block } from "./block.ts";

/** Base for blocks that only forward to a wrapped block */
export abstract class DelegatingBlock extends Block {
  protected constructor(protected readonly inner: Block) {
    super();
    this.canSetWidth = inner.canSetWidth;
    this.canSetHeight = inner.canSetHeight;
  }

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
