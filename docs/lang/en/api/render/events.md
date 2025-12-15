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

```ts
render(): void
```

### destroy

Destroys the events part.

```ts
destroy(): void
```

### removeEvent

Removes an event item from the canvas.

```ts
removeEvent(event: GanttEventItem): void
```

### deleteEvent

Delete an event item (canvas and data), if emit is true, the event will be triggered.

```ts
deleteEvent(event: GanttEventItem, emit?: boolean): void
```

### updateEventItem

Updates an event item, if needRender is true, the canvas will be re-rendered.

```ts
updateEventItem(eventOrId: GanttEventItem | string, newData: DeepPartial<Omit<GanttEventItem, 'id'>>, needRender?: boolean): void
```
