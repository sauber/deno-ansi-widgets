import { assertEquals } from "@std/assert";
import { joinBorder, mergeRows } from "./border.ts";

Deno.test("joinBorder unions line directions", () => {
  assertEquals(joinBorder("┐", "┌"), "┬");
  assertEquals(joinBorder("│", "│"), "│");
  assertEquals(joinBorder("┘", "└"), "┴");
  assertEquals(joinBorder("└", "┌"), "├");
  assertEquals(joinBorder("─", "─"), "─");
  assertEquals(joinBorder("┘", "┐"), "┤");
  assertEquals(joinBorder("┴", "─"), "┴");
  assertEquals(joinBorder("┴", "┬"), "┼");
  assertEquals(joinBorder("│", "├"), "├");
});

Deno.test("joinBorder keeps incoming text", () => {
  assertEquals(joinBorder("┴", "T"), "T");
  assertEquals(joinBorder("┴", " "), " ");
});

Deno.test("mergeRows aligns glyphs by display width", () => {
  assertEquals(mergeRows("└┴┘", "┌┬┐"), "├┼┤");
  assertEquals(mergeRows("└─────┘", "┌🖼️──┬B┐"), "├🖼️──┬B┤");
});
