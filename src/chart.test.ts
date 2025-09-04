import { assertEquals, assertInstanceOf } from "@std/assert";
import { Chart } from "./chart.ts";

Deno.test("Instance", () => {
  const chart = new Chart([1, 2, 3], 5);
  assertInstanceOf(chart, Chart);
});

Deno.test("Render #1", () => {
  const chart = new Chart([1, 2, 2, 4, 3], 4);
  const lines: string[] = chart.lines;
  assertEquals(lines, [
    "4├  ╭╮",
    "3├  │╰",
    "2├╭─╯ ",
    "1├╯   ",
  ]);
});

Deno.test("Render #2", () => {
  const chart = new Chart([1, 2, 2, 14, 3], 4);
  const lines: string[] = chart.lines;
  assertEquals(lines, [
    "15├  ╭╮",
    "10├  ││",
    " 5├  │╰",
    " 0├──╯ ",
  ]);
});

Deno.test("Render #3", () => {
  const chart = new Chart([-1, 2, 2, 14, 3], 4);
  const lines: string[] = chart.lines;
  assertEquals(lines, [
    " 20├    ",
    " 10├  ╭╮",
    "  0├──╯╰",
    "-10├    ",
  ]);
});
