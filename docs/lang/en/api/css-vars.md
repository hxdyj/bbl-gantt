---
layout: doc
footer: false
---

# CSS Variables

bbl-gantt provides a comprehensive set of CSS variables for customizing the appearance of the Gantt chart. You can override these variables in your CSS to match your design system.

```css
:root {
	/* ========== Base Colors ========== */

	/* Primary theme color used for event items, time range indicators, etc. */
	--gantt-main-color: #165dff;

	/* Background color of the Gantt chart canvas */
	--gantt-bg-color: #e5e6eb;

	/* Color for tick lines in the timeline */
	--gantt-tick-color: #86909c;

	/* ========== Header Styles ========== */

	/* Color of tick lines in the header area (inherits from --gantt-tick-color) */
	--gantt-header-tick-color: var(--gantt-tick-color);

	/* Color of text in the header */
	--gantt-header-text-color: #4e5969;

	/* Font size of header text */
	--gantt-header-text-font-size: 14px;

	/* ========== Row Styles ========== */

	/* Color of horizontal lines separating rows (inherits from --gantt-tick-color) */
	--gantt-row-line-color: var(--gantt-tick-color);

	/* Background color of individual rows */
	--gantt-row-bg-color: transparent;

	/* ========== Vertical Scroll Mask ========== */

	/* Background color of the vertical scroll mask overlay */
	--gantt-v-scroll-mask-bg-color: white;

	/* ========== Time Range Indicator ========== */

	/* Color of time range label text displayed when hovering over events (inherits from --gantt-main-color) */
	--gantt-time-range-text-color: var(--gantt-main-color);

	/* Width of time range indicator lines */
	--gantt-time-range-stroke-width: 1;

	/* Color of time range indicator lines (inherits from --gantt-main-color) */
	--gantt-time-range-stroke-color: var(--gantt-main-color);

	/* ========== Current Time Line ========== */

	/* Width of the current time indicator line */
	--gantt-current-time-line-stroke-width: 1;

	/* Color of the current time line */
	--gantt-current-time-line-stroke-color: #ff7d00;

	/* Font size of current time label */
	--gantt-current-time-line-font-size: 13px;

	/* Font weight of current time label */
	--gantt-current-time-line-font-weight: bold;

	/* Dash pattern for current time line (SVG dasharray format) */
	--gantt-current-time-line-stroke-dasharray: 0, 5, 10;

	/* Color of current time text (inherits from --gantt-current-time-line-stroke-color) */
	--gantt-current-time-line-text-color: var(
		--gantt-current-time-line-stroke-color
	);

	/* ========== Event Item Styles ========== */

	/* Font size of event item text */
	--gantt-event-item-font-size: 12px;

	/* Font weight of event item text */
	--gantt-event-item-font-weight: 600;

	/* Text color for rectangle-shaped event items (shape: 'rect') */
	--gantt-event-item-style-rect-text-color: white;

	/* Text color for line-shaped event items (shape: 'line'), inherits from --gantt-main-color */
	--gantt-event-item-style-line-text-color: var(--gantt-main-color);

	/* Background color for rectangle-shaped event items (shape: 'rect', default), inherits from --gantt-main-color */
	--gantt-event-item-style-rect-color: var(--gantt-main-color);

	/* Color for line-shaped event items (shape: 'line'), inherits from --gantt-event-item-style-rect-color */
	--gantt-event-item-style-line-color: var(--gantt-event-item-style-rect-color);

	/* ========== Event Item Resize Handles ========== */

	/* Fill color of resize handles at event item edges */
	--gantt-event-item-resize-color: white;

	/* Border width of resize handles */
	--gantt-event-item-resize-stroke-width: 1;

	/* Border width of left resize handle (inherits from --gantt-event-item-resize-stroke-width) */
	--gantt-event-item-left-resize-stroke-width: var(
		--gantt-event-item-resize-stroke-width
	);

	/* Border width of right resize handle (inherits from --gantt-event-item-resize-stroke-width) */
	--gantt-event-item-right-resize-stroke-width: var(
		--gantt-event-item-resize-stroke-width
	);

	/* Border color of resize handles (inherits from --gantt-event-item-style-rect-color) */
	--gantt-event-item-resize-stroke-color: var(
		--gantt-event-item-style-rect-color
	);

	/* Border color of left resize handle (inherits from --gantt-event-item-resize-stroke-color) */
	--gantt-event-item-left-resize-stroke-color: var(
		--gantt-event-item-resize-stroke-color
	);

	/* Border color of right resize handle (inherits from --gantt-event-item-resize-stroke-color) */
	--gantt-event-item-right-resize-stroke-color: var(
		--gantt-event-item-resize-stroke-color
	);

	/* ========== Scrollbar Styles ========== */

	/* Width of the vertical scrollbar */
	--gantt-scrollbar-width: 12px;

	/* Height of the horizontal scrollbar (inherits from --gantt-scrollbar-width) */
	--gantt-scrollbar-height: var(--gantt-scrollbar-width);

	/* Background clip property for scrollbar thumb */
	--gantt-scrollbar-thumb-bg-clip: padding-box;

	/* Background color of scrollbar thumb (not hovered) */
	--gantt-scrollbar-thumb-bg-color: transparent;

	/* Background color of scrollbar thumb on hover */
	--gantt-scrollbar-thumb-bg-hover-color: rgb(201, 205, 212);

	/* Border style of scrollbar thumb, creates padding around the thumb */
	--gantt-scrollbar-thumb-border: 4px solid transparent;

	/* Border radius of scrollbar thumb */
	--gantt-scrollbar-thumb-border-radius: 7px;
}
```
