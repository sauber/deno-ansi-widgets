import { assertEquals } from "@std/assert";
import { Split } from "./split.ts";
import { Box } from "./box.ts";

Deno.test("Split can be created with no elements", () => {
  const row = new Split([]);
  assertEquals(row.height, 0);
  assertEquals(row.width, 0);
});

Deno.test("Split can be created with elements", () => {
  const box1 = new Box(1, 1);
  const box2 = new Box(2, 2);
  const row = new Split([box1, box2]);
  assertEquals(row.height, 2);
  assertEquals(row.width, 3);
});

Deno.test("Splint renders elements horizontally", () => {
  const row = new Split([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  const expected = "xoo\nxoo";
  assertEquals(row.toString(), expected);
});

Deno.test("Split total height of elements", () => {
  const row = new Split([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  assertEquals(row.height, 2);
  assertEquals(row.width, 3);

  const height: number = row.setWidth(5);
  assertEquals(height, 5);
  assertEquals(row.width, 5);
  assertEquals(row.toString(), "xxooo\nxxooo");
});
