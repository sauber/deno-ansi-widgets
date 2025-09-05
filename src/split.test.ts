import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";
import { Split } from "./split.ts";
import { Box } from "./box.ts";

Deno.test("Adjacent can be created with no elements", () => {
  const row = new Split([]);
  assertEquals(row.height, 0);
  assertEquals(row.width, 0);
});

Deno.test("Adjacent can be created with elements", () => {
  const box1 = new Box(1, 1);
  const box2 = new Box(2, 2);
  const row = new Split([box1, box2]);
  assertEquals(row.height, 2);
  assertEquals(row.width, 3);
});

Deno.test("Adjacent renders elements horizontally", () => {
  const row = new Split([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  const expected = "xoo\nxoo";
  assertEquals(row.toString(), expected);
});

Deno.test("Adjacent total height of elements", () => {
  const row = new Split([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  assertEquals(row.height, 2);
  assertEquals(row.width, 3);

  const stretched = row.setWidth(5);
  assertEquals(stretched.height, 2);
  assertEquals(stretched.width, 5);
  assertEquals(stretched.toString(), "xxooo\nxxooo");
});
