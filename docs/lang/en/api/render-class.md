---
layout: doc
footer: false
---

# Render Class

Class for rendering the Gantt instance, which is responsible for rendering the entire Gantt instance, rendering is divided into four parts: header, ticks, rows, events.

## Constructor

### constructor

```ts
// Constructor, which takes the Gantt instance as a parameter
constructor(gantt: Gantt): Render
```

## Instance Properties

### gantt

Gantt instance

### header

HeaderRender instance, which is responsible for rendering the header part.

### ticks

TicksRender instance, which is responsible for rendering the ticks part.

### rows

RowsRender instance, which is responsible for rendering the rows part.

### events

EventsRender instance, which is responsible for rendering the events part.

## Instance Methods

### render

Renders the entire Gantt instance

```ts
render(): void
```

### caculateGanttBox

Calculates the width and height of the entire Gantt instance svg element

```ts
caculateGanttBox(): void
```

### getYbyIndex

Calculates the y coordinate of the row based on the index

```ts
getYbyIndex(index: number): number
```

### destroy

Destroy the render instance and clean up all sub-renderers (header, ticks, rows, events)

```ts
destroy(): void
```
