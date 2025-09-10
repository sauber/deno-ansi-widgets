// Handle ansi strings
import { unicodeWidth } from "@std/cli/unicode-width";
import { stripAnsiCode } from "@std/fmt/colors";
import cliTruncate from "npm:cli-truncate";

/** Width of string in number of visible terminal characters */
export function ansiLength(str: string): number {
  return unicodeWidth(stripAnsiCode(str));
}

/** Cut or extend string to desired number of characters */
export function ansiTrunk(str: string, width: number): string {
  // Current length
  const len = ansiLength(str);

  // Length is correct
  if (len === width) return str;

  // Length to too short
  if (len <= width) return str + " ".repeat(width - len);

  // Length is too long
  return cliTruncate(str, width, { truncationCharacter: "" });
}
