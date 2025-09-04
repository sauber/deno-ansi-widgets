/** Properties of elements that can be combined in terminal */
export abstract class Block {
  public abstract get width(): number;
  public abstract get height(): number;
  public canSetHeight = true;
  public canSetWidth = true;
  public abstract setWidth(width: number): Block;
  public abstract setHeight(height: number): Block;

  public abstract get lines(): Array<string>;
  public toString(): string {
    return this.lines.join("\n");
  }

}

export type Blocks = Array<Block>;
