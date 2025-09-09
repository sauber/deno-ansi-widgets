import { ansiLength } from "../utils/ansi.ts";

/** Draw a frame around a text block
 * @param title Title text in the top border
 * @param block Multiline text block to wrap frame around
 * @returns Framed text block
 */
export function frame(block: string, title: string): string {
  const lines = block.split("\n");
  const titleLength = ansiLength(title);
  const width = Math.max(
    titleLength,    
    ...lines.map((line) => ansiLength(line)),
  );
  const top: string = "┌" + title + "─".repeat(width - titleLength) + "┐";
  const middle: string[] = lines.map((line) => "│" + line.padEnd(width) + "│");
  const bottom: string = "└" + "─".repeat(width) + "┘";
  return [top, ...middle, bottom].join("\n");
}
