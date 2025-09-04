import type { Blocks } from "./block.ts";
import { Node } from "./node.ts";

/** One or more blocks on top of each other with same width */
export class Stack extends Node {
  private readonly commonWidth: number;

  constructor(blocks: Blocks) {
    const commonWidth: number = Math.max(0, ...blocks.map((b) => b.width));
    const adjusted = blocks.map((b) => b.setWidth(commonWidth));
    super(adjusted);
    this.commonWidth = commonWidth;
  }

  /** Width of each block */
  public override get width(): number {
    return this.commonWidth;
  }

  /** New width of each block */
  public override setWidth(width: number): this {
    return this.create(this.blocks.map((b) => b.setWidth(width)));
  }

  public get lines(): string[] {
    return this.blocks.flatMap((b) => b.lines);
  }
}
