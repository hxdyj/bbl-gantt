---
layout: doc
footer: false
---

# EventsRender

EventsRender 类，负责渲染 events 部分

## 构造函数

### constructor

参数：`(gantt: Gantt, renderer: Render)`

构造函数，传入 Gantt 实例和渲染器实例

## 实例属性

### gantt

Gantt 实例

### renderer

Render 实例

### g

Events 部分的 G 实例

## 实例方法

### render

渲染整个 Ticks

### destroy

销毁 Ticks 部分

### removeEvent

参数：`(event: GanttEventItem)`

画布上移除某个事件项

### deleteEvent

参数：`(event: GanttEventItem, emit=false)`

删除某个事件项(画布+数据)，如果 emit 为 true，则触发事件
