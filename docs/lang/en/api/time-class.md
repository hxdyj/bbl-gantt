---
layout: doc
footer: false
---

# Time Class

Class for time-related operations, such as calculating the scale of the time axis, calculating the time based on the x coordinate, and calculating the x coordinate based on the time.

## Constructor

### constructor

Parameters: `(gantt: Gantt)`

constructor function, which takes the Gantt instance as a parameter.

## Instance Properties

### gantt

Gantt instance

### ticks

Caculate the number of ticks based on the user-defined column.

### timeTicks

Caculate the time interval between each tick based on the user-defined column.

### stepTime

Transform the user-defined column timeMetric into a step size in milliseconds.

### fixUnit

Find the appropriate unit for adding or subtracting dayjs when the user-defined column timeMetric is fixed.

### fixUnitStepTime

Transform fixUnit into milliseconds.

### startTime

View start time

### endTime

View end time, which is different from the gantt instance's endTime, because the view may be larger than the gantt content, so the view's endTime may be greater than the gantt's endTime.

## Methods

### time2x

Parameters: `(time: Dayjs, startTime?: Dayjs): number`

Calculate the x coordinate based on the time and start time.

### x2time

Parameters: `(x: number, startTime?: Dayjs): Dayjs`

Get time by x

### containerScrollLeftTime

Parameters: `(): Dayjs`

Calculates the time corresponding to the position of the left scroll bar of the container.

### stageWidthTime

Parameters: `(): Dayjs`

Calculates the time corresponding to the width of the stage.

### length2milliseconds

Parameters: `(length: number): number`

Calculates the milliseconds based on the length of the time axis.

### getWidthByTwoTime

Parameters: `(time1: Dayjs, time2: Dayjs): number`

Calculates the width of the time axis based on two times.
