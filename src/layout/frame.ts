import { Block } from "./block.ts";
import { frame } from "../widgets/frame.ts";
import { fit } from "../utils/fit.ts";
import { Fit } from "./fit.ts";

/** Bot a frame around a Block */
export class Frame extends Block {
  private readonly block: Block;

  constructor(block: Block, private title: string = "") {
    super();
    this.block = new Fit(block);
    this.expandToTitle();
  }

  /** If title is wider than content, expand content to match */
  private expandToTitle(): void {
    if (this.title.length > this.block.width) {
      this.block.setWidth(this.title.length);
    }
  }

  public override update(title: string): void {
    this.title = title;
    this.expandToTitle();
  }

  /** Width of the frame */
  public override get width(): number {
    return Math.max(this.title.length, this.block.width) + 2;
  }

  /** Height of the frame */
  public override get height(): number {
    return this.block.height + 2;
  }

  /** New width of the frame */
  public override setWidth(width: number): number {
    const innerWidth = Math.max(0, width - 2);
    this.block.setWidth(innerWidth);
    return this.block.width + 2;
  }

  /** New height of the frame */
  public override setHeight(height: number): number {
    const innerHeight = Math.max(0, height - 2);
    this.block.setHeight(innerHeight);
    return this.block.height + 2;
  }

  /** Render frame with title and inner block */
  public override toString(): string {
    return frame(this.block.toString(), this.title);
  }

  /** Render frame with title and inner block as lines */
  public override get lines(): string[] {
    return this.toString().split("\n");
  }
}
