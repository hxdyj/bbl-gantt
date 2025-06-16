---
layout: doc
footer: false
---

## Initialize Instance

```html
<div id="gantt"></div>
```

```javascript
import Gantt from 'bbl-gantt'
const gantt = new Gantt({
	// options
})
```

## Options

```ts
export type GanttOptions = {
	el: ContainerType //  container element, can be a selector string or HTMLElement object
	mode?: GanttMode // mode, normal or duration
	durationModeOptions?: DurationModeOptions //  only works when mode is 'duration'
	readOnly?: boolean //  is readonly, while true, cannot edit data
	column?: Column // column config
	// row config
	row?: {
		height?: number // row height
	}
	// header config
	header?: {
		height?: number // header height
	}
	// view config
	view?: {
		timeFullWidth?: boolean //Whether the time covers the entire width, and then automatically calculate the gantt.column.timeMetric and gantt.column.width based on the width and start and end times, only taking effect in the mode=duration mode
		headerTimeFormat?: (args: HeaderTimeFormatArgs) => string // time format function
		whileShowScrollReduceScrollBarSize?: boolean // while container show scroll bar, reduce container size
		whileRowsLessContainerAutoReduceHeight?: boolean // while rows height less container auto reduce height
		showScrollBar?: boolean // whether to show scroll bar

		showTicks?: boolean // whether to show ticks
		showTickText?: boolean // whether to show tick text

		showTimeTicks?: boolean // whether to show the time scale ticks
		showTimeTickText?: boolean // whether to show the time scale tick text

		headerTickTextTickNeeded?: boolean // some tick text may overlap, but we only want to show non-overlapping text (set overrideHeaderTitle to true to achieve this), set this property to true to hide the tick without text part

		showEventTimeRange?: boolean // whether to show the event time range
		overrideHeaderTitle?: boolean // whether to override the header title to show non-overlapping text
		/**
		 * event item rect style padding top and bottom value, default is 0.25
		 * >1 unit is percentage, <1 unit is pixel
		 *  */
		eventRectStylePadY?: number
	}
	// action config
	action?: {
		/**
		 * mouse wheel zoom time metric in header
		 * min and max represent the minimum and maximum zoom values, unit is milliseconds
		 *  */
		headerWheelTimeMetric?:
			| boolean
			| {
					min?: number
					max?: number
			  }
		moveOrResizeStep?: boolean // move or resize event step unit by tick
		enableEventMove?: boolean // whether to enable event move
		enableEventResize?: boolean // whether to enable event resize
		enableCurrentTime?: boolean // container click to show current time
		enableMoveOrResizeOutOfEdge?: boolean // whether to enable moving or resizing events outside the edge of the container
		enableNewEventItem?: boolean // whether to enable creating new event item
	}
	data?: GanttItem[] // data
	//format config
	format?: {
		eventItemTime?: (time: Dayjs) => GanttEventItemTime // while normal mode, eventItemTime is a function to format the time in options.data
	}
}

export type Column = {
	width: number // column width
	timeMetric: number | TimeMetric // time metric or milliseconds, represents the time length of each column
	padding: {
		// duration mode is unvalidate, all padding is 0
		// accord to all data, calculate how many columns the data needs to be divided into, the padding represents how many blank columns to leave before and after these columns
		left: number
		right: number
	}
}

export enum TimeMetric {
	SECOND = 'SECOND',
	MINUTE = 'MINUTE',
	QUARTER_HOUR = 'QUARTER_HOUR',
	HALF_HOUR = 'HALF_HOUR',
	HOUR = 'HOUR',
	QUARTER_DAY = 'QUARTER_DAY',
	HALF_DAY = 'HALF_DAY',
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

export type HeaderTimeFormatArgs = {
	gantt: Gantt
	time: Dayjs
	unit: UnitType
	type: 'currentTime' | 'timeRange' | 'tick'
}

export type DurationModeOptions = {
	duration: number // duration length, unit is seconds, decimal point to the third decimal place
}

export type ContainerType = string | HTMLElement

export enum GanttMode {
	Normal = 'normal',
	Duration = 'duration',
}

export type GanttItem = {
	id: string
	name: string
	events: GanttEventItem[]
	children?: GanttItem[]
	bg?: string
	[key: string]: any
}

export type GanttEventItem = {
	id: string
	start: GanttEventItemTime
	end: GanttEventItemTime
	name: string
	shape?: EventShapeType
	color?: string
	textColor?: string
	[key: string]: any
}

export type GanttEventItemTime = string | number | Date | Dayjs

export enum EventShapeType {
	rect = 'rect',
	line = 'line',
}
```
