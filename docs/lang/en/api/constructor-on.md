---
layout: doc
footer: false
---

## Events

Gantt instance can listen to events.

### init

Callback parameters: `(gantt: Gantt)`

Triggered when the instance is initialized.

### container_scroll

Callback parameters: `(e: Event, gantt: Gantt)`

Triggered when the instance container is scrolled.

### header_wheel

Callback parameters: `(e:Event,gantt:Gantt)`

Mouse wheel zooming in the header area triggers this event.

### event_item_body_mouse_down

Callback parameters: `(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt)`

Triggered when the mouse button is pressed on the event item body area.

### event_item_body_context_menu

Callback parameters: `(event: Event, eventItem: GanttEventItem, gantt: Gantt)`

Triggered when the right mouse button is clicked on the event item body area.

### event_item_body_click

Callback parameters: `(event:Event,eventItem:GanttEventItem,gantt:Gantt)`

Triggered when the event item body area is clicked.

### event_item_left_resize_mouse_down

Callback parameters: `(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt)`

Triggered when the left resize area of the event item is clicked.

### event_item_right_resize_mouse_down

Callback parameters: `(data:{ event:MouseEvent, itemRender:EventItemRender },gantt:Gantt)`

Triggered when the right resize area if event item is clicked.

### event_item_add

Callback parameters: `(data:{ item:EventItemRender, row:GanttItem, rowIndex:number },gantt:Gantt)`

Triggered when an event item is added to the Gantt.

### row_click

Callback parameters: `(evt:Event, data: { row:GanttItem, rowIndex:number }, gantt:Gantt)`

Triggered when a row is clicked.
