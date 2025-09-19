import { progress } from "../widgets/progress.ts";
import { Block } from "./block.ts";

/** Adjust size of progress bar to bolck size*/
export class Progress extends Block {
  /** Progress bar is always just one line high */
  public override readonly canSetHeight = false;
  public override readonly height = 1;
  private current = 0;
  private readonly start: number;

  constructor(
    private readonly label: string,
    private readonly total: number,
    public width: number = label.length + " [██████████] ".length +
      `${total}/${total}`.length + "14:43".length,
  ) {
    super();
    this.start = performance.now();
  }

  /** New width of text line */
  public setWidth(width: number): number {
    this.width = width;
    return width;
  }

  /** New height of text line, has no effect */
  public setHeight(_height: number): number {
    return 1;
  }

  /** Set current value of progress bar */
  public override update(current: number): void {
    this.current = current;
  }

  public get lines(): string[] {
    const bar: string = progress(
      this.current,
      this.total,
      performance.now() - this.start,
      this.width - this.label.length - 1,
    );
    return [this.label + " " + bar];
  }
}
