import type { Blocks } from "./block.ts";
import { Node } from "./node.ts";

export class Adjacent extends Node {
  // Same height of each block
  private readonly commonHeight: number;

  constructor(blocks: Blocks) {
    const commonHeight = Math.max(0, ...blocks.map((b) => b.height));
    const adjusted: Blocks = blocks.map((b) => b.setHeight(commonHeight));
    super(adjusted);
    this.commonHeight = commonHeight;
  }

  /** Height of each block */
  public override get height(): number {
    return this.commonHeight;
  }

  /** New height of each block */
  public override setHeight<Adjacent>(height: number): this {
    return this.create(this.blocks.map((b) => b.setHeight(height)));
  }

  /** New total height of all block */
  // public setWidth(width: number): Adjacent {
  //   const current: Elements = this.blocks.map((
  //     b,
  //   ) => [b.width, b.canSetWidth]);
  //   const target: Elements = stretch(current, width);

  //   const stretched: Blocks = this.blocks.map((b, i) =>
  //     b.setWidth(target[i][0])
  //   );

  //   return new Adjacent(stretched);
  // }

  /** Combine lines at each from all elements */
  public get lines(): string[] {
    const grid = this.blocks.map((b) => b.lines);
    const lineCount = this.height;
    const lines: string[] = Array(lineCount).fill("");
    for (let i = 0; i < lineCount; i++) {
      for (let j = 0; j < this.blocks.length; j++) {
        lines[i] += grid[j][i];
      }
    }
    return lines;
  }
}
