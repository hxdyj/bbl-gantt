---
layout: doc
footer: false
---

## 事件

Gantt 实例可以监听的事件

### init

回调参数：`(gantt:Gantt)`

实例初始化完成

### container_scroll

回调参数：`(e:Event,gantt:Gantt)`

实例 container 滚动时触发

### header_wheel

回调参数：`(e:Event,gantt:Gantt)`

鼠标在 header 区域 wheel 缩放触发

### event_item_body_mouse_down

回调参数：`(data:{ event:MouseEvent, itemRender:EventItemRender },gantt:Gantt)`

事件项 body 区域鼠标按下时触发

### event_item_body_context_menu

回调参数：`(event:Event,eventItem:GanttEventItem,gantt:Gantt)`

事件项 body 区域右键点击时触发

### event_item_body_click

回调参数：`(event:Event,eventItem:GanttEventItem,gantt:Gantt)`

事件项 body 区域点击时触发

### event_item_left_resize_mouse_down

回调参数：`(data:{ event:MouseEvent, itemRender:EventItemRender },gantt:Gantt)`

事件项左侧 resize 区域鼠标按下时触发

### event_item_right_resize_mouse_down

回调参数：`(data:{ event:MouseEvent, itemRender:EventItemRender },gantt:Gantt)`

事件项右侧 resize 区域鼠标按下时触发

### event_item_add

回调参数：`(data:{ item:EventItemRender, row:GanttItem, rowIndex:number },gantt:Gantt)`

事件项添加时触发

### event_item_delete

回调参数：`(data: { event:GanttEventItem, item:GanttItem, parent:GanttItem }, gantt:Gantt)`

事件项删除时触发

### row_click

回调参数：`(evt:Event, data: { row:GanttItem, rowIndex:number }, gantt:Gantt)`

行点击时触发

### row_delete

回调参数：`(row:GanttItem, gantt:Gantt)`

行删除时触发
