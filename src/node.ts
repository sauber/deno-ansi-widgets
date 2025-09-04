import { Block, type Blocks } from "./block.ts";
import { type Elements, stretch } from "./stretch.ts";

/** Handle multiple blocks */
export abstract class Node extends Block {
  constructor(protected readonly blocks: Blocks) {
    super();
  }

  /** Create derived class with new set of blocks */
  public create(blocks: Blocks): this {
    return new (this.constructor as new (blocks: Blocks) => this)(blocks);
  }

  /** Sum of widths of all blocks */
  public get width(): number {
    return this.blocks.reduce((a, b) => a + b.width, 0);
  }

  /** Sum of heights of all blocks */
  public get height(): number {
    return this.blocks.reduce((a, b) => a + b.height, 0);
  }

  /** Scaling is possible if at least one child can scale */
  override get canSetWidth(): boolean {
    return this.blocks.some((b) => b.canSetWidth);
  }

  /** Scaling is possible if at least one child can scale */
  override get canSetHeight(): boolean {
    return this.blocks.some((b) => b.canSetHeight);
  }

  /** New total width of all block */
  public setWidth(width: number): this {
    const current: Elements = this.blocks.map((
      b,
    ) => [b.width, b.canSetWidth]);
    const target: Elements = stretch(current, width);

    const stretched: Blocks = this.blocks.map((b, i) =>
      b.setWidth(target[i][0])
    );

    return this.create(stretched);
  }


    /** New total height of all block */
  public setHeight(height: number): this {
    const current: Elements = this.blocks.map((
      b,
    ) => [b.height, b.canSetHeight]);
    const target: Elements = stretch(current, height);

    const stretched: Blocks = this.blocks.map((b, i) =>
      b.setHeight(target[i][0])
    );

    return this.create(stretched);
  }

}
