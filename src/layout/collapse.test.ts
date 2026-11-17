import { assertEquals } from "@std/assert";
import { ansiLength } from "../utils/ansi.ts";
import { Collapse, CollapseAxis } from "./collapse.ts";
import { Frame } from "./frame.ts";
import { Split } from "./split.ts";
import { Stack } from "./stack.ts";
import { Static } from "./static.ts";

const f = (body: string, title: string) => new Frame(new Static(body), title);

const framed = () => [f("Body A", "Title A"), f("Body B", "Title B"), f("Body C", "Title C")];

Deno.test("Collapse detects frame-like children", () => {
  assertEquals(new Collapse(framed(), CollapseAxis.Horizontal).frameLike, true);
  assertEquals(new Collapse([framed()[0]], CollapseAxis.Horizontal).frameLike, false);
  assertEquals(new Collapse([f("A", "A"), new Static("other")], CollapseAxis.Vertical).frameLike, false);
});

Deno.test("Collapse accounts for shared borders on the layout axis", () => {
  const horizontal = new Collapse(framed(), CollapseAxis.Horizontal);
  assertEquals(horizontal.width, 25);
  assertEquals(horizontal.height, 3);

  const vertical = new Collapse(framed(), CollapseAxis.Vertical);
  assertEquals(vertical.width, 9);
  assertEquals(vertical.height, 7);
});

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
    f("Body A", "Title A"),
    new Static("other"),
    f("Body C", "Title C"),
  ]);
  assertEquals(split.width, 23);
  assertEquals(
    split.toString(),
    "┌Title A┐other┌Title C┐\n" +
      "│Body A │     │Body C │\n" +
      "└───────┘     └───────┘",
  );
});

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
    f("Body A", "Title A"),
    new Static("XXXXXXXXX"),
    f("Body C", "Title C"),
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

Deno.test("Stack merges borders by display width with emoji titles", () => {
  const stack = new Stack([
    f("x", "Title"),
    new Split([f("A", "🖼️"), f("B", "B")]),
  ]);
  assertEquals(stack.width, 7);
  assertEquals(
    stack.toString(),
    "┌Title┐\n" +
      "│x    │\n" +
      "├🖼️──┬B┤\n" +
      "│A  │B│\n" +
      "└───┴─┘",
  );
  for (const line of stack.lines) {
    assertEquals(ansiLength(line), stack.width);
  }
});
