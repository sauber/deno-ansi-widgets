import { assertEquals } from "@std/assert";
import { heatmap, type Points } from "./heatmap.ts";
import { stripAnsiCode } from "@std/fmt/colors";

Deno.test("Zero Height", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const map = heatmap(points, 20, 0);
  assertEquals(map, []);
});

Deno.test("Zero Width", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const map = heatmap(points, 0, 10);
  assertEquals(map, Array(10).fill(""));
});

Deno.test("One char plot area", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const map = heatmap(points, 1, 1);
  const stripped = stripAnsiCode(map[0]);
  assertEquals(stripped, "▞");
});

Deno.test("Zero lines", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const lines: string[] = heatmap(points, 20, 0);
  assertEquals(lines, []);
});

Deno.test("Zero width", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const lines: string[] = heatmap(points, 0, 2);
  assertEquals(lines, ["", ""]);
});

Deno.test("Single char", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const lines: string[] = heatmap(points, 1, 1);
  assertEquals(lines, ["█"]);
});

Deno.test("Heatmap Plot", () => {
  const points: Points = [
    [1, 1, 10],
    [2, 2, 20],
    [3, 3, 30],
  ];
  const map = heatmap(points, 20, 5);
  assertEquals(map.length, 5);
  assertEquals(stripAnsiCode(map[0]).length, 20);
});
