// Merge box-drawing characters by combining the directions they connect
import { ansiLength } from "./ansi.ts";

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

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

interface Cluster {
  text: string;
  width: number;
}

function clusters(line: string): Cluster[] {
  return Array.from(segmenter.segment(line), ({ segment }) => ({
    text: segment,
    width: ansiLength(segment),
  }));
}

/** Merge a top border into the bottom border above it, aligning by display
 * width. Rows can contain graphemes whose code point count differs from
 * their terminal width, e.g. "🖼️", so indexing by character is unsafe.
 */
export function mergeRows(bottom: string, top: string): string {
  const a = clusters(bottom);
  const b = clusters(top);
  let i = 0;
  let j = 0;
  let usedA = 0;
  let usedB = 0;
  let result = "";

  while (i < a.length || j < b.length) {
    // ANSI escapes carry no display width and must not consume a column
    while (i < a.length && a[i].width === 0) result += a[i++].text;
    while (j < b.length && b[j].width === 0) result += b[j++].text;

    const ga = a[i];
    const gb = b[j];
    if (!gb) {
      result += ga.text;
      i++;
      usedA = 0;
      continue;
    }
    if (!ga) {
      result += gb.text;
      j++;
      usedB = 0;
      continue;
    }

    if (usedA === 0 && usedB === 0) {
      result += ga.width === 1 && gb.width === 1
        ? joinBorder(ga.text, gb.text)
        : gb.text;
    }
    usedA++;
    usedB++;
    if (usedA >= ga.width) {
      i++;
      usedA = 0;
    }
    if (usedB >= gb.width) {
      j++;
      usedB = 0;
    }
  }
  return result;
}
