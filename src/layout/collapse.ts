import type { Blocks } from "./block.ts";
import { Group } from "./group.ts";
import { joinBorder, mergeRows } from "../utils/border.ts";

/** Axis along which children are arranged */
export type CollapseAxis = "horizontal" | "vertical";

/** Compose a group of blocks, merging shared frame borders when every child
 * presents a frame-like border. Layered between a Split/Stack and its children.
 */
export class Collapse extends Group {
  private readonly collapsed: boolean;
  private readonly axis: CollapseAxis;

  constructor(blocks: Blocks, axis: CollapseAxis) {
    // Detect before super(): Group wraps children in Fit, hiding their types
    const collapsed = blocks.length > 1 && blocks.every((b) => b.frameLike);
    super(blocks);
    this.collapsed = collapsed;
    this.axis = axis;
    if (collapsed) {
      if (axis === "horizontal") this.widthOverlap = this.blocks.length - 1;
      else this.heightOverlap = this.blocks.length - 1;
    }
    // Stretch children across the axis perpendicular to the layout
    if (axis === "horizontal") this.setHeight(this.height);
    else this.setWidth(this.width);
  }

  /** A collapsed group presents frame-like borders to its parent */
  public override get frameLike(): boolean {
    return this.collapsed;
  }

  /** Rendered width, accounting for shared border columns */
  public override get width(): number {
    return this.axis === "horizontal"
      ? super.width - this.widthOverlap
      : Math.max(0, ...this.blocks.map((b) => b.width));
  }

  /** Rendered height, accounting for shared border rows */
  public override get height(): number {
    return this.axis === "vertical"
      ? super.height - this.heightOverlap
      : Math.max(0, ...this.blocks.map((b) => b.height));
  }

  /** New total width of all blocks */
  public override setWidth(width: number): number {
    if (this.axis === "vertical") {
      this.blocks.forEach((b) => b.setWidth(width));
      return this.width;
    }
    return super.setWidth(width);
  }

  /** New total height of all blocks */
  public override setHeight(height: number): number {
    if (this.axis === "horizontal") {
      this.blocks.forEach((b) => b.setHeight(height));
      return this.height;
    }
    return super.setHeight(height);
  }

  /** Compose child grids, merging borders on shared edges when collapsed */
  public override get lines(): string[] {
    const grid = this.blocks.map((b) => b.lines);
    return this.axis === "horizontal"
      ? this.horizontal(grid)
      : this.vertical(grid);
  }

  /** Place child grids side by side */
  private horizontal(grid: string[][]): string[] {
    const count = this.height;
    const lines: string[] = Array(count).fill("");
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < grid.length; j++) {
        const line = grid[j][i] || " ".repeat(this.blocks[j].width);
        if (j > 0 && this.collapsed) {
          const prev = lines[i];
          const joint = joinBorder(prev[prev.length - 1] ?? "", line[0] ?? "");
          lines[i] = prev.slice(0, -1) + joint + line.slice(1);
        } else {
          lines[i] += line;
        }
      }
    }
    return lines;
  }

  /** Place child grids one above the other */
  private vertical(grid: string[][]): string[] {
    if (!this.collapsed) return grid.flat();
    const lines: string[] = [];
    for (let i = 0; i < grid.length; i++) {
      const child = grid[i];
      if (i === 0) {
        lines.push(...child);
        continue;
      }
      const bottom = lines[lines.length - 1];
      lines[lines.length - 1] = mergeRows(bottom, child[0]);
      lines.push(...child.slice(1));
    }
    return lines;
  }
}
