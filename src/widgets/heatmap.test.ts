import { assertEquals } from "@std/assert";
import { heatmap, type Points } from "./heatmap.ts";

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
  const plot = heatmap(points, 20, 10);
  // console.log(plot.join("\n"));
  // Visual inspection required
});
