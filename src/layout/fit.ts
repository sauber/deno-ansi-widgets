import { fit } from "../utils/fit.ts";
import { Block } from "./block.ts";

/** Fix inner Block to specific size */
export class Fit extends Block {
  public override width: number;
  public override height: number;

  constructor(
    protected block: Block,
    width?: number,
    height?: number,
  ) {
    super();
    this.width = width || block.width;
    this.height = height || block.height;
  }

  public override setWidth(width: number): number {
    // console.log("Fit setWidth", width, this.block.toString());
    this.block.setWidth(width);
    return this.width = width;
  }

  public override setHeight(height: number): number {
    // console.log("Fit setHeight", height, this.block.toString());
    this.block.setHeight(height);
    return this.height = height;
  }

  public override get lines(): string[] {
    return fit(this.block.lines, this.width, this.height);
  }
}
