import { Box } from "./box.ts";
import { scale } from "./scale.ts";

export class YAxis extends Box {
  public override readonly canSetWidth = false;

  constructor(
    private readonly min: number,
    private readonly max: number,
    private readonly count: number,
  ) {
    if (count < 2) throw new Error("Count must be at least 2");
    const width = 1 + Math.max(String(min).length, String(max).length);
    super(width, count);
  }

  override get lines(): string[] {
    const labels = scale(this.min, this.max, this.count);
    return labels.map((label) =>
      label.toString().padStart(this.width - 1) + "├"
    );
  }
}
