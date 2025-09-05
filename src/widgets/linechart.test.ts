
import { assertEquals } from "@std/assert";
import { linechart } from "./linechart.ts";

Deno.test("Render #1", () => {
  const chart: string = linechart([1, 2, 2, 4, 3], 4);
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "4├  ╭╮",
    "3├  │╰",
    "2├╭─╯ ",
    "1├╯   ",
  ]);
});

Deno.test("Render #2", () => {
  const chart = linechart([1, 2, 2, 14, 3], 4);
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "15├  ╭╮",
    "10├  ││",
    " 5├  │╰",
    " 0├──╯ ",
  ]);
});

Deno.test("Render #3", () => {
  const chart = linechart([-1, 2, 2, 14, 3], 4);
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    " 20├    ",
    " 10├  ╭╮",
    "  0├──╯╰",
    "-10├    ",
  ]);
});
