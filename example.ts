import { TextLine } from "./src/layout/textline.ts";
import { Stack } from "./src/layout/stack.ts";
import { Frame } from "./src/layout/frame.ts";
import { Split } from "./src/layout/split.ts";
import { Box } from "./src/layout/box.ts";
import { LineChart } from "./src/layout/linechart.ts";
import { Static } from "./src/layout/static.ts";
import { blockify } from "jsr:@sauber/block-image";
import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts";
import { decode } from "https://deno.land/x/jpegts@1.1/mod.ts";
import { Progress } from "./src/layout/progress.ts";
import { Gauges } from "./src/layout/gauges.ts";

// Updateable Widgets
const title = new TextLine("Deno ANSI Widgets");
const chart = new LineChart([1, 3, 2, 5, 4, 6, 5, 7, 6, 8], 5);
const gauges = new Gauges([
  ["Pos", 0, 100, 0],
  ["Neg", -11, 11, 0],
]);
const progress = new Progress("Progress", 100);

// Download and blockify image
const url =
  "https://sample-files.com/downloads/images/jpg/color_test_800x600_118kb.jpg";
const data = (await fetch(url)).arrayBuffer();
const originalJPEG = new Uint8Array(await data);
const imageCols = 20;
const imageRows = 10;
const resizedJPEG: Uint8Array = await resize(originalJPEG, {
  width: imageCols,
  height: imageRows,
  aspectRatio: false, // because half-width chars
});
const rawData: Uint8Array = decode(resizedJPEG).data;
const printable: string = blockify(rawData, imageCols, imageRows);

// Create a dashboard layout with multiple widgets
const dashboard = new Frame(
  new Stack([
    new Frame(title, "Title"),
    new Split([
      new Frame(
        new Stack([
          new TextLine("A Picture"),
          new Static(printable),
        ]),
        "🖼️",
      ),
      new Frame(new Box(2, 2, "♬"), "Box 2x2"),
      new Frame(chart, "Line Chart"),
    ]),
    new Split([
      new Frame(new Static("Wrapped\ntext")),
      new Frame(new Static("Unwrapped text")),
    ]),
    new Frame(gauges),
    progress,
  ]),
  "Example Dashboard",
);

// Render dashboard
console.log(dashboard.toString());

// Update values in widgets
title.update("Updated Deno ANSI Widgets");
progress.update(50);
chart.update([2, 4, 3, 6, 5, 7, 6, 8, 7, 9, 10, 8]);
gauges.update([95, -0.11]);

// Render updated dashboard, overwrite previous output
const cursorUp = `\u001b[${dashboard.height}A`; // Move cursor up
console.log(cursorUp + dashboard.toString());
