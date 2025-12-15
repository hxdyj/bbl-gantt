---
layout: doc
footer: false
---

# RowsRender

RowsRender Class is responsible for rendering the rows part of the Gantt instance.

## Constructor

### constructor

Parameters: `(gantt: Gantt, renderer: Render)`

Constructor, receives Gantt instance and Render instance.

## Instance Properties

### gantt

Gantt instance

### renderer

Render instance

### g

Rows part G instance

### lastClickRow

Last clicked row data

## Instance Methods

### render

Renders the entire Rows.

```ts
render(): void
```

### destroy

Destroys the Rows part.

```ts
destroy(): void
```

### deleteRow

Delete a row (canvas and data), if emit is true, the event will be triggered.

```ts
deleteRow(row: GanttItem, emit?: boolean): void
```
