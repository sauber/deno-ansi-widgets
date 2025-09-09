import type { Blocks } from "./block.ts";
import { Group } from "./group.ts";

/** One or more blocks on top of each other with same width */
export class Stack extends Group {
  constructor(blocks: Blocks) {
    super(blocks);
    // Adjust width of all blocks to the block with maximum width
    const commonWidth = this.width;
    this.setWidth(commonWidth);
  }

  /** Maximum width of all blocks */
  public override get width(): number {
    return Math.max(0, ...this.blocks.map((b) => b.width));
  }

  /** Set new width of each block */
  public override setWidth(width: number): number {
    this.blocks.map((b) => b.setWidth(width));
    return this.width;
  }

  /** Concatenate lines from all blocks  */
  public get lines(): string[] {
    // return this.blocks.flatMap((b) => b.lines);
    const lines = this.blocks.map((b) => b.lines);
    console.log("stack lines", lines);
    return lines.flat();
  }
}
