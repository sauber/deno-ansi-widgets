import { TextLine } from "./src/layout/textline.ts";
import { Stack } from "./src/layout/stack.ts";
import { Frame } from "./src/layout/frame.ts";
import { Split } from "./src/layout/split.ts";
import { Box } from "./src/layout/box.ts";
import { LineChart } from "./src/layout/linechart.ts";
import { Static } from "./src/layout/static.ts";

// Widgets
const title = new TextLine("Deno ANSI Widgets");
const footer = new TextLine("Footer");
const chart = new LineChart([1, 3, 2, 5, 4, 6, 5, 7, 6, 8], 5);

// Create a dashboard of multiple widgets
const dashboard = new Frame(
  new Stack([
    new Frame(title, "Title"),
    new Split([
      new Frame(new TextLine("Text Line 1")),
      new Frame(new Box(2, 2, "."), "Box 2x2"),
      new Frame(chart, "Line Chart"),
    ]),
    new Split([
      new Frame(new Static("Wrapped\ntext")),
      new Frame(new Static("Unwrapped text")),
    ]),
    new Frame(footer),
  ]),
  "Example Dashboard",
);

// Render dashboard
console.log(dashboard.toString());

// Update values in widgets
// title.update("Updated Deno ANSI Widgets");
// footer.update("Updated Footer");
// chart.update([2, 4, 3, 6, 5, 7, 6, 8, 7, 9]);

// // Render updated dashboard, overwrite previous output
// const cursorUp = `\u001b[${dashboard.height}A`; // Move cursor up
// console.log(cursorUp + dashboard.toString());
