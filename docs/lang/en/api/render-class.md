---
layout: doc
footer: false
---

# Render Class

Class for rendering the Gantt instance, which is responsible for rendering the entire Gantt instance, rendering is divided into four parts: header, ticks, rows, events.

## Constructor

### constructor

Parameters: `(gantt: Gantt)`

Constructor, which takes the Gantt instance as a parameter.

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

## Methods

### render

Renders the entire Gantt instance.

### caculateGanttBox

Calculates the width and height of the entire Gantt instance svg element.

### getYbyIndex

Calculates the y coordinate of the row based on the index.
