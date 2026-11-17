import { assertEquals } from "@std/assert";
import { Split } from "./split.ts";
import { Box } from "./box.ts";
import { Frame } from "./frame.ts";
import { Static } from "./static.ts";

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

const framed = () => [
  new Frame(new Static("Body A"), "Title A"),
  new Frame(new Static("Body B"), "Title B"),
  new Frame(new Static("Body C"), "Title C"),
];

Deno.test("Split collapses borders when all children are frames", () => {
  const split = new Split(framed());
  assertEquals(split.width, 25);
  assertEquals(split.height, 3);
  assertEquals(
    split.toString(),
    "┌Title A┬Title B┬Title C┐\n" +
      "│Body A │Body B │Body C │\n" +
      "└───────┴───────┴───────┘",
  );
});

Deno.test("Split keeps width after stretching collapsed frames", () => {
  const split = new Split(framed());
  assertEquals(split.setWidth(31), 31);
  assertEquals(split.width, 31);
  assertEquals(
    split.toString(),
    "┌Title A──┬Title B──┬Title C──┐\n" +
      "│Body A   │Body B   │Body C   │\n" +
      "└─────────┴─────────┴─────────┘",
  );
});

Deno.test("Split does not collapse borders when a child is not a Frame", () => {
  const split = new Split([
    new Frame(new Static("Body A"), "Title A"),
    new Static("other"),
    new Frame(new Static("Body C"), "Title C"),
  ]);
  assertEquals(split.width, 23);
  assertEquals(
    split.toString(),
    "┌Title A┐other┌Title C┐\n" +
      "│Body A │     │Body C │\n" +
      "└───────┘     └───────┘",
  );
});
