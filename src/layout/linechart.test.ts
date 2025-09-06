import { assertEquals, assertInstanceOf } from "@std/assert";
import { LineChart } from "./linechart.ts";

Deno.test("Instance", () => {
  const chart = new LineChart([], 0);
  assertInstanceOf(chart, LineChart);
});

Deno.test("Get dimensions", () => {
  const chart = new LineChart([1, 2, 3], 5);
  assertEquals(chart.width, 4);
  assertEquals(chart.height, 5);
});

Deno.test("Set dimensions", () => {
  const chart = new LineChart([1, 2, 3], 5);
  assertEquals(chart.setWidth(10), 10);
  assertEquals(chart.width, 10);
  assertEquals(chart.height, 5);
});

Deno.test("Render chart", () => {
  const chart = new LineChart([1, 3, 2], 3);
  const expected = [
    "3├╭╮",
    "2├│╰",
    "1├╯ ",
  ];
  assertEquals(chart.toString().split("\n"), expected);
});
