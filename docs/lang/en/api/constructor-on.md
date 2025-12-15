---
layout: doc
footer: false
---

## Events

Gantt instance can listen to events.

### init

```ts
// Triggered when the instance is initialized.
(gantt: Gantt) => void
```

### container_scroll

```ts
// Triggered when the instance container is scrolled.
(e: Event, gantt: Gantt) => void
```

### header_wheel

```ts
// Mouse wheel zooming in the header area triggers this event.
(e: Event, gantt: Gantt) => void
```

### event_item_body_mouse_down

```ts
// Triggered when the mouse button is pressed on the event item body area.
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_context_menu

```ts
// Triggered when the right mouse button is clicked on the event item body area.
(event: Event, eventItem: GanttEventItem, gantt: Gantt) => void
```

### event_item_body_click

```ts
// Triggered when the event item body area is clicked.
(event: Event, eventItem: GanttEventItem, gantt: Gantt) => void
```

### event_item_body_mouse_enter

```ts
// Triggered when mouse enters the event item body area
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_over

```ts
// Triggered when mouse hovers over the event item body area
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_move

```ts
// Triggered when mouse moves in the event item body area
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_leave

```ts
// Triggered when mouse leaves the event item body area
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_left_resize_mouse_down

```ts
// Triggered when the left resize area of the event item is clicked.
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_right_resize_mouse_down

```ts
// Triggered when the right resize area if event item is clicked.
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_add

```ts
// Triggered when an event item is added to the Gantt.
(data: { item: EventItemRender, row: GanttItem, rowIndex: number }, gantt: Gantt) => void
```

### event_item_delete

```ts
// Triggered when an event item is deleted from the Gantt.
(data: { event: GanttEventItem, item: GanttItem, parent: GanttItem }, gantt: Gantt) => void
```

### row_click

```ts
// Triggered when a row is clicked.
(evt: Event, data: { row: GanttItem, rowIndex: number }, gantt: Gantt) => void
```

### row_delete

```ts
// Triggered when a row is deleted from the Gantt.
(row: GanttItem, gantt: Gantt) => void
```
