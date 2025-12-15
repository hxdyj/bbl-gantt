---
layout: doc
footer: false
---

## 事件

Gantt 实例可以监听的事件

### init

```ts
// 实例初始化完成
(gantt: Gantt) => void
```

### container_scroll

```ts
// 实例 container 滚动时触发
(e: Event, gantt: Gantt) => void
```

### header_wheel

```ts
// 鼠标在 header 区域 wheel 缩放触发
(e: Event, gantt: Gantt) => void
```

### event_item_body_mouse_down

```ts
// 事件项 body 区域鼠标按下时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_context_menu

```ts
// 事件项 body 区域右键点击时触发
(event: Event, eventItem: GanttEventItem, gantt: Gantt) => void
```

### event_item_body_click

```ts
// 事件项 body 区域点击时触发
(event: Event, eventItem: GanttEventItem, gantt: Gantt) => void
```

### event_item_body_mouse_enter

```ts
// 鼠标进入事件项 body 区域时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_over

```ts
// 鼠标悬停在事件项 body 区域时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_move

```ts
// 鼠标在事件项 body 区域移动时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_body_mouse_leave

```ts
// 鼠标离开事件项 body 区域时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_left_resize_mouse_down

```ts
// 事件项左侧 resize 区域鼠标按下时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_right_resize_mouse_down

```ts
// 事件项右侧 resize 区域鼠标按下时触发
(data: { event: MouseEvent, itemRender: EventItemRender }, gantt: Gantt) => void
```

### event_item_add

```ts
// 事件项添加时触发
(data: { item: EventItemRender, row: GanttItem, rowIndex: number }, gantt: Gantt) => void
```

### event_item_delete

```ts
// 事件项删除时触发
(data: { event: GanttEventItem, item: GanttItem, parent: GanttItem }, gantt: Gantt) => void
```

### row_click

```ts
// 行点击时触发
(evt: Event, data: { row: GanttItem, rowIndex: number }, gantt: Gantt) => void
```

### row_delete

```ts
// 行删除时触发
(row: GanttItem, gantt: Gantt) => void
```
