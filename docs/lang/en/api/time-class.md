---
layout: doc
footer: false
---

# Time Class

Class for time-related operations, such as calculating the scale of the time axis, calculating the time based on the x coordinate, and calculating the x coordinate based on the time.

## Constructor

### constructor

```ts
// constructor function, which takes the Gantt instance as a parameter
constructor(gantt: Gantt): Time
```

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

## Instance Methods

### time2x

```ts
// Calculate the x coordinate based on the time and start time
time2x(time: Dayjs, startTime?: Dayjs): number
```

### x2time

```ts
// Get time by x
x2time(x: number, startTime?: Dayjs): Dayjs
```

### containerScrollLeftTime

```ts
// Calculates the time corresponding to the position of the left scroll bar of the container
containerScrollLeftTime(): Dayjs
```

### stageWidthTime

```ts
// Calculates the time corresponding to the width of the stage
stageWidthTime(): Dayjs
```

### length2milliseconds

```ts
// Calculates the milliseconds based on the length of the time axis
length2milliseconds(length: number): number
```

### getWidthByTwoTime

```ts
// Calculates the width of the time axis based on two times
getWidthByTwoTime(time1: Dayjs, time2: Dayjs): number
```

### dayjs2duration

```ts
// Convert Dayjs time object to duration format (in seconds)
dayjs2duration(time: Dayjs): number
```

### getTickByIndex

```ts
// Get the tick time by tick index
getTickByIndex(index: number): Dayjs
```

### getTimeTickByIndex

```ts
// Get the time tick by time tick index
getTimeTickByIndex(index: number): Dayjs
```

### lastTick

```ts
// Get the last tick time
lastTick(): Dayjs
```

### lastTimeTick

```ts
// Get the last time tick
lastTimeTick(): Dayjs
```

### getTicksIterator

```ts
// Get ticks iterator for traversing ticks within the visible area
getTicksIterator(): Generator
```

### getTimeTicksIterator

```ts
// Get time ticks iterator for traversing time ticks within the visible area
getTimeTicksIterator(): Generator
```

### getNoneEventStartTime

```ts
// Get the start time when there are no events
getNoneEventStartTime(): Dayjs
```
