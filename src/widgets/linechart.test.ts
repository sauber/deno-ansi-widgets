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
    "0.80├ ",
    "0.75├ ",
    "0.70├╭",
    "0.65├│",
    "0.60├│",
    "0.55├╯",
  ]);
});

Deno.test("Straight Line", () => {
  const data = [0, 0];
  const chart = linechart(data, 3, 10);
  assertEquals(chart, "0├────────");
});

Deno.test("Two Lines", () => {
  const chart = linechart([[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]], 5, 20);
  const lines: string[] = chart.split("\n");
  assertEquals(lines, ["5├╮  ╭", "4├╰╮╭╯", "3├ ╰╮ ", "2├╭╯╰╮", "1├╯  ╰"]);
});

Deno.test("Three Lines", () => {
  const chart = linechart(
    [[2, 2, 2, 2, 2], [1, 2, 3, 4, 5], [3, 4, 5, 4, 3]],
    5,
    20,
  );
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "5├ ╭╮╭",
    "4├╭╯╰╮",
    "3├╯╭╯╰",
    "2├╭╯──",
    "1├╯   ",
  ]);
});

Deno.test("Uneven Series Lengths", () => {
  assertThrows(
    () => {
      linechart([[1, 2, 3], [4, 5]], 4);
    },
    Error,
    "All series must have the same length",
  );
});

Deno.test("Swap foreground and background colors", () => {
  const chart = linechart([1, 2, 3], 3, 10, "\x1b[7m");
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "3├ \x1b[7m╭\x1b[0m",
    "2├\x1b[7m╭╯\x1b[0m",
    "1├\x1b[7m╯ \x1b[0m",
  ]);
});

Deno.test("Green line and red line", () => {
  const chart = linechart(
    [[1, 2, 3], [3, 2, 1]],
    3,
    undefined,
    ["\x1b[32m", "\x1b[31m"],
  );
  const lines: string[] = chart.split("\n");
  assertEquals(lines, [
    "3├\x1b[31m╮\x1b[32m╭\x1b[0m",
    "2├\x1b[31m╰╮\x1b[0m",
    "1├\x1b[32m╯\x1b[31m╰\x1b[0m",
  ]);
});
