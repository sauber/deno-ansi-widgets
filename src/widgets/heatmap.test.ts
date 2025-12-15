import { heatmap, type Points } from "./heatmap.ts";

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
