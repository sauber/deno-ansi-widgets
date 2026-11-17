// Merge box-drawing characters by combining the directions they connect

const U = 1;
const D = 2;
const L = 4;
const R = 8;

const MASKS: Record<string, number> = {
  "│": U | D,
  "─": L | R,
  "┌": D | R,
  "┐": D | L,
  "└": U | R,
  "┘": U | L,
  "├": U | D | R,
  "┤": U | D | L,
  "┬": D | L | R,
  "┴": U | L | R,
  "┼": U | D | L | R,
};

const GLYPHS: Record<number, string> = {};
for (const [glyph, mask] of Object.entries(MASKS)) {
  GLYPHS[mask] = glyph;
}

/** Join two adjacent border characters into a single junction.
 * When either character is not a border glyph, the incoming one wins,
 * preserving title text from the lower or right hand block.
 */
export function joinBorder(current: string, incoming: string): string {
  const a = MASKS[current];
  const b = MASKS[incoming];
  if (a === undefined || b === undefined) return incoming;
  return GLYPHS[a | b] ?? incoming;
}
