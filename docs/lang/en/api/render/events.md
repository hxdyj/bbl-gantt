---
layout: doc
footer: false
---

# EventsRender

EventRender Class is responsible for rendering the events part of the Gantt instance.

## Constructor

### constructor

Parameters: `(gantt: Gantt, renderer: Render)`

constructor function, which takes the Gantt instance and renderer instance as parameters.

## Instance Properties

### gantt

Gantt instance

### renderer

Render instance

### g

The G instance of the events part

## Instance Methods

### render

Renders the entire events part.

### destroy

Destroys the events part.

### removeEvent

Parameters: `(event: GanttEventItem)`

Removes an event item from the canvas.

### deleteEvent

Parameters: `(event: GanttEventItem, emit=false)`

Delete an event item (canvas and data), if emit is true, the event will be triggered.

### updateEventItem

Parameters: `eventOrId: GanttEventItem | string, newData: DeepPartial<Omit<GanttEventItem, 'id'>>, needRender = true`

Updates an event item, if needRender is true, the canvas will be re-rendered.
