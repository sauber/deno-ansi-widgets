import { assertEquals } from "@std/assert";
import { Stack } from "./stack.ts";
import { Box } from "./box.ts";
import { Frame } from "./frame.ts";
import { Split } from "./split.ts";
import { Static } from "./static.ts";

Deno.test("Stack can be created with no children", () => {
  const stack = new Stack([]);
  assertEquals(stack.height, 0);
  assertEquals(stack.width, 0);
});

Deno.test("Stack can be created with children", () => {
  const box1 = new Box(1, 1);
  const box2 = new Box(2, 2);
  const stack = new Stack([box1, box2]);
  assertEquals(stack.height, 3);
  assertEquals(stack.width, 2);
});

Deno.test("Stack renders children vertically", () => {
  const stack = new Stack([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  const expected = "xx\noo\noo";
  assertEquals(stack.toString(), expected);
});

Deno.test("Stretch total height of children", () => {
  const stack = new Stack([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  assertEquals(stack.height, 3);
  assertEquals(stack.width, 2);

  const stretched: number = stack.setHeight(5);
  assertEquals(stretched, 5);
  assertEquals(stack.width, 2);
  assertEquals(stack.toString(), "xx\nxx\noo\noo\noo");
});

const f = (body: string, title: string) => new Frame(new Static(body), title);

const framed = () => [
  new Frame(new Static("Body A"), "Title A"),
  new Frame(new Static("Body B"), "Title B"),
  new Frame(new Static("Body C"), "Title C"),
];

Deno.test("Stack collapses borders when all children are frames", () => {
  const stack = new Stack(framed());
  assertEquals(stack.width, 9);
  assertEquals(stack.height, 7);
  assertEquals(
    stack.toString(),
    "┌Title A┐\n" +
      "│Body A │\n" +
      "├Title B┤\n" +
      "│Body B │\n" +
      "├Title C┤\n" +
      "│Body C │\n" +
      "└───────┘",
  );
});

Deno.test("Stack does not collapse borders when a child is not a Frame", () => {
  const stack = new Stack([
    new Frame(new Static("Body A"), "Title A"),
    new Static("XXXXXXXXX"),
    new Frame(new Static("Body C"), "Title C"),
  ]);
  assertEquals(stack.width, 9);
  assertEquals(stack.height, 7);
  assertEquals(
    stack.toString(),
    "┌Title A┐\n" +
      "│Body A │\n" +
      "└───────┘\n" +
      "XXXXXXXXX\n" +
      "┌Title C┐\n" +
      "│Body C │\n" +
      "└───────┘",
  );
});

Deno.test("Stack collapses nested splits", () => {
  const stack = new Stack([
    f("Body A", "Title A"),
    new Split([f("Body B", "Title B"), f("Body C", "Title C")]),
    new Split([f("Body D", "Title D"), f("Body E", "Title E")]),
    new Split([f("F", "F"), f("Body G", "Title G")]),
    f("Body H", "Title H"),
  ]);
  assertEquals(stack.width, 17);
  assertEquals(stack.height, 11);
  assertEquals(
    stack.toString(),
    "┌Title A────────┐\n" +
      "│Body A         │\n" +
      "├Title B┬Title C┤\n" +
      "│Body B │Body C │\n" +
      "├Title D┼Title E┤\n" +
      "│Body D │Body E │\n" +
      "├F──┬Title G────┤\n" +
      "│F  │Body G     │\n" +
      "├Title H────────┤\n" +
      "│Body H         │\n" +
      "└───────────────┘",
  );
});

Deno.test("Stack collapses a split containing a collapsed stack", () => {
  const inner = new Stack([f("Body E1", "E1"), f("Body E2", "E2")]);
  const stack = new Stack([
    f("Body A", "Title A"),
    new Split([f("Body B", "Title B"), f("Body C", "Title C")]),
    new Split([f("Body D", "Title D"), inner]),
    new Split([f("F", "F"), f("Body G", "Title G")]),
    f("Body H", "Title H"),
  ]);
  assertEquals(stack.width, 17);
  assertEquals(stack.height, 13);
  assertEquals(
    stack.toString(),
    "┌Title A────────┐\n" +
      "│Body A         │\n" +
      "├Title B┬Title C┤\n" +
      "│Body B │Body C │\n" +
      "├Title D┼E1─────┤\n" +
      "│Body D │Body E1│\n" +
      "│       ├E2─────┤\n" +
      "│       │Body E2│\n" +
      "├F──┬Title G────┤\n" +
      "│F  │Body G     │\n" +
      "├Title H────────┤\n" +
      "│Body H         │\n" +
      "└───────────────┘",
  );
});
