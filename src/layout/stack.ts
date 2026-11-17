import type { Blocks } from "./block.ts";
import { Group } from "./group.ts";
import { joinBorder } from "../utils/border.ts";

/** One or more blocks on top of each other with same width */
export class Stack extends Group {
  private readonly collapsed: boolean;

  constructor(blocks: Blocks) {
    // Detect before super(): Group wraps children in Fit, hiding their types
    const collapsed = blocks.length > 1 &&
      blocks.every((b) => b.frameLike);
    super(blocks);
    this.collapsed = collapsed;
    if (collapsed) this.heightOverlap = this.blocks.length - 1;
    // Adjust width of all blocks to the block with maximum width
    const commonWidth = this.width;
    this.setWidth(commonWidth);
  }

  /** Maximum width of all blocks */
  public override get width(): number {
    return Math.max(0, ...this.blocks.map((b) => b.width));
  }

  /** A collapsed stack presents frame-like borders to its parent */
  public override get frameLike(): boolean {
    return this.collapsed;
  }

  /** Rendered height, accounting for shared border rows */
  public override get height(): number {
    return super.height - this.heightOverlap;
  }

  /** Set new width of each block */
  public override setWidth(width: number): number {
    this.blocks.map((b) => b.setWidth(width));
    return this.width;
  }

  /** Concatenate lines from all blocks, merging frame borders when collapsed */
  public get lines(): string[] {
    const grid = this.blocks.map((b) => b.lines);
    if (!this.collapsed) return grid.flat();
    const lines: string[] = [];
    for (let i = 0; i < grid.length; i++) {
      const child = grid[i];
      if (i === 0) {
        lines.push(...child);
        continue;
      }
      // Merge this frame's top border into the previous bottom border,
      // preserving junction glyphs from both sides
      const bottom = lines[lines.length - 1];
      const top = child[0];
      lines[lines.length - 1] = Array.from(bottom).map((glyph, i) =>
        joinBorder(glyph, top[i] ?? glyph)
      ).join("");
      lines.push(...child.slice(1));
    }
    return lines;
  }
}
