import { TextLine } from "./src/layout/textline.ts";
import { Stack } from "./src/layout/stack.ts";

// Widgets
const title = new TextLine("Deno ANSI Widgets");
const footer = new TextLine("Footer");

// Create a dashboard of multiple widgets
const dashboard = new Stack([title, footer]);

// Render dashboard
console.log(dashboard.toString());

// Update widgets
title.update("Updated Deno ANSI Widgets");

// // Render updated dashboard
const cursorUp = `\u001b[${dashboard.height}A`; // Move cursor up
console.log(cursorUp + dashboard.toString());
