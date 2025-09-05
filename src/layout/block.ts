/** Properties of elements that can be combined in terminal */
export abstract class Block {
  /** Update block with new content */
  public update(..._args: unknown[]): void {}

  /** Width of the block in number of characters */
  public abstract get width(): number;

  /** Height of the block in number of lines */
  public abstract get height(): number;

  /** Can the width be changed */
  public canSetHeight = true;

  /** Can the height be changed */
  public canSetWidth = true;

  /** Set new width of the block */
  public abstract setWidth(width: number): number;

  /** Set new height of the block */
  public abstract setHeight(height: number): number;

  /** Render block as array of lines */
  public abstract get lines(): Array<string>;

  /** Render block as joined lines */
  public toString(): string {
    return this.lines.join("\n");
  }
}

export type Blocks = Array<Block>;
