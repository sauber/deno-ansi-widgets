import { assertEquals } from "@std/assert";
import { downsample } from "./downsample.ts";

Deno.test("downsample", () => {
  const data = [34, 35, 72, 46, 65, 54, 20, 59, 76, 43];
  const count = 5;
  const result = downsample(data, count);
  assertEquals(result.length, count);
  assertEquals(result, [34, 72, 46, 76, 43]);
});
