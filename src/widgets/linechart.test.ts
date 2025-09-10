import { assertEquals, assertThrows } from "@std/assert";
import { linechart } from "./linechart.ts";

Deno.test("Empty", () => {
  const chart = linechart([], 4);
  assertEquals(chart, "");
});

Deno.test("Height < 2", () => {
  assertThrows(
    () => {
      linechart([1, 2, 3], 1);
    },
    Error,
    "Height must be at least 2",
  );
});

Deno.test("Single data point", () => {
  const chart = linechart([42], 4, 10);
  assertEquals(chart, "42├───────");
});

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

Deno.test("Render #4", () => {
  const chart = linechart([0.5745445329702179, 0.7249570604872655], 7, 39);
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "0.85├ ",
    " 0.8├ ",
    "0.75├ ",
    " 0.7├╭",
    "0.65├│",
    " 0.6├│",
    "0.55├╯",
  ]);
});
