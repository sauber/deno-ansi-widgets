import { assertEquals } from "@std/assert";
import { joinBorder } from "./border.ts";

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
