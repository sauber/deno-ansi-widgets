import type { Blocks } from "./block.ts";
import { Group } from "./group.ts";
import { joinBorder } from "../utils/border.ts";

/** Display multiple blocks side by side */
export class Split extends Group {
  private readonly collapsed: boolean;

  constructor(blocks: Blocks) {
    // Detect before super(): Group wraps children in Fit, hiding their types
    const collapsed = blocks.length > 1 &&
      blocks.every((b) => b.frameLike);
    super(blocks);
    this.collapsed = collapsed;
    if (collapsed) this.widthOverlap = this.blocks.length - 1;
    // Adjust height of all blocks to the block with maximum height
    const commonHeight = this.height;
    this.setHeight(commonHeight);
  }

  /** Maximum height of all blocks */
  public override get height(): number {
    return Math.max(0, ...this.blocks.map((b) => b.height));
  }

  /** A collapsed split presents frame-like borders to its parent */
  public override get frameLike(): boolean {
    return this.collapsed;
  }

  /** Rendered width, accounting for shared border columns */
  public override get width(): number {
    return super.width - this.widthOverlap;
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
        const line = grid[j][i] || " ".repeat(this.blocks[j].width);
        if (j > 0 && this.collapsed) {
          const prev = lines[i];
          const joint = joinBorder(
            prev[prev.length - 1] ?? "",
            line[0] ?? "",
          );
          lines[i] = prev.slice(0, -1) + joint + line.slice(1);
        } else {
          lines[i] += line;
        }
      }
    }
    return lines;
  }
}
