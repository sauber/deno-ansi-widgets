import type { Blocks } from "./block.ts";
import { Group } from "./group.ts";

/** Display multiple blocks side by side */
export class Split extends Group {
  constructor(blocks: Blocks) {
    super(blocks);
    // Adjust height of all blocks to the block with maximum height
    const commonHeight = this.height;
    this.setHeight(commonHeight);
  }

  /** Maximum height of all blocks */
  public override get height(): number {
    return Math.max(0, ...this.blocks.map((b) => b.height));
  }

  /** New height of each block */
  public override setHeight(height: number): number {
    this.blocks.forEach((b) => b.setHeight(height));
    return this.height;
  }

  /** Combine lines row by row from all elements */
  public get lines(): string[] {
    const grid = this.blocks.map((b) => b.lines);
    const lineCount = this.height;
    const lines: string[] = Array(lineCount).fill("");
    for (let i = 0; i < lineCount; i++) {
      for (let j = 0; j < this.blocks.length; j++) {
        lines[i] += grid[j][i] || " ".repeat(this.blocks[j].width);
      }
    }
    return lines;
  }
}
