import { assertEquals } from "@std/assert";
import { type Elements, stretch } from "./stretch.ts"; // Assuming stretch.ts is in the same directory

Deno.test("stretch: no stretchable elements", () => {
  const elements: Elements = [[10, false], [20, false], [30, false]];
  const targetSize = 60;
  const expected: Elements = [[10, false], [20, false], [30, false]];
  assertEquals(stretch(elements, targetSize), expected);
});

Deno.test("stretch: all stretchable elements, expand", () => {
  const elements: Elements = [[10, true], [20, true], [30, true]];
  const targetSize = 120;
  const expected: Elements = [[20, true], [40, true], [60, true]];
  assertEquals(stretch(elements, targetSize), expected);
});

Deno.test("stretch: all stretchable elements, retract", () => {
  const elements: Elements = [[10, true], [20, true], [30, true]];
  const targetSize = 30;
  const expected: Elements = [[5, true], [10, true], [15, true]];
  assertEquals(stretch(elements, targetSize), expected);
});

Deno.test("stretch: mixed elements, expand", () => {
  const elements: Elements = [[10, false], [20, true], [30, false], [40, true]];
  const targetSize = 150; // Non-stretchable sum = 40. Remaining = 110. Stretchable sum = 60. Ratio = 110/60 = 1.833
  const expected: Elements = [[10, false], [37, true], [30, false], [73, true]]; // 20*1.833 = 36.66 -> 37, 40*1.833 = 73.33 -> 73
  assertEquals(stretch(elements, targetSize), expected);
});
