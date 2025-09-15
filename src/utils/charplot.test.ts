import { assertEquals, assertThrows } from "@std/assert";
import { CharPlot } from "./charplot.ts";

Deno.test("CharPlot empty instance", () => {
  const cp = new CharPlot();
  assertEquals(cp.lines, []);
  assertEquals(cp.width, 0);
  assertEquals(cp.height, 0);
});

Deno.test("CharPlot single chars at integer positions", () => {
  const cp = new CharPlot();
  cp.insert(0, 0, "A");
  cp.insert(1, 1, "B");
  cp.insert(2, 2, "C");
  assertEquals(cp.lines, ["  C", " B ", "A  "]);
});

Deno.test("CharPlot double-width chars at integer positions", () => {
  const cp = new CharPlot();
  cp.insert(0, 0, "あ");
  cp.insert(1, 1, "い");
  assertEquals(cp.lines, [" い", "あ "]);
});

Deno.test("CharPlot single chars at non-integer positions", () => {
  const cp = new CharPlot();
  cp.insert(0.5, 0.5, "A");
  cp.insert(1.5, 1.5, "B");
  cp.insert(2.5, 2.5, "C");
  assertEquals(cp.lines, ["  C", " B ", "A  "]);
});

Deno.test("Skipping lines", () => {
  const cp = new CharPlot();
  cp.insert(0, 0, "A");
  cp.insert(3, 3, "D");
  assertEquals(cp.lines, ["   D", "    ", "    ", "A   "]);
});

Deno.test("Negative positions", () => {
  const cp = new CharPlot();
  cp.insert(-1, -1, "A");
  cp.insert(-2, -2, "B");
  cp.insert(-3, -3, "C");
  assertEquals(cp.lines, ["  A", " B ", "C  "]);
});

Deno.test("Fail to insert multiple char string at one position", () => {
  const cp = new CharPlot();
  assertThrows(
    () => cp.insert(0, 0, "CD"),
    Error,
  );
});

Deno.test("ANSI encoded chars", () => {
  const cp = new CharPlot();
  cp.insert(0, 0, "\u001b[31mあ\u001b[39m");
  cp.insert(1, 1, "\u001b[32mい\u001b[39m");
  assertEquals(cp.lines, [
    " \u001b[32mい\u001b[39m",
    "\u001b[31mあ\u001b[39m ",
  ]);
});
