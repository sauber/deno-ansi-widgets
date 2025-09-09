import { Block, type Blocks } from "./block.ts";
import { Fit } from "./fit.ts";
import { type Elements, stretch } from "./stretch.ts";

/** Alignment of multiple blocks */
export abstract class Group extends Block {
  protected readonly blocks: Blocks;

  constructor(blocks: Blocks) {
    super();
    this.blocks = blocks.map((b) => new Fit(b));
    this.canSetWidth = this.blocks.some((b) => b.canSetWidth);
    this.canSetHeight = this.blocks.some((b) => b.canSetHeight);
  }

  /** Sum of widths of all blocks */
  public get width(): number {
    return this.blocks.reduce((a, b) => a + b.width, 0);
  }

  /** Sum of heights of all blocks */
  public get height(): number {
    return this.blocks.reduce((a, b) => a + b.height, 0);
  }

  /** New total width of all block */
  public setWidth(width: number): number {
    const current: Elements = this.blocks.map((
      b,
    ) => [b.width, b.canSetWidth]);
    const target: Elements = stretch(current, width);
    // console.log(current, target);

    // Set each block to new width
    this.blocks.forEach((b, i) => {
      if (current[i][1] && target[i][0] != current[i][0]) {
        b.setWidth(target[i][0]);
      }
    });

    // Calculate new total width
    return this.width;
  }

  /** New total height of all block */
  public setHeight(height: number): number {
    const current: Elements = this.blocks.map((
      b,
    ) => [b.height, b.canSetHeight]);
    const target: Elements = stretch(current, height);

    this.blocks.forEach((b, i) => {
      if (current[i][1] && target[i][0] != current[i][0]) {
        b.setHeight(target[i][0]);
      }
    });

    return this.height;
  }
}
