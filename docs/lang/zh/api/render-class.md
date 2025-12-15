---
layout: doc
footer: false
---

# Render 类

渲染相关的类，负责渲染整个 Gantt 实例, 渲染主要分为 header、ticks、rows、events 四个部分

## 构造函数

### constructor

```ts
// 构造函数，传入 Gantt 实例
constructor(gantt: Gantt): Render
```

## 实例属性

### gantt

Gantt 实例

### header

HeaderRender 实例, HeaderRender 负责渲染 header 部分

### ticks

TicksRender 实例, TicksRender 负责渲染 ticks 部分

### rows

RowsRender 实例, RowsRender 负责渲染 rows 部分

### events

EventsRender 实例, EventsRender 负责渲染 events 部分

## 实例方法

### render

渲染整个 Gantt 实例

```ts
render(): void
```

### caculateGanttBox

计算整个 Gantt 实例 svg 元素的宽度和高度

```ts
caculateGanttBox(): void
```

### getYbyIndex

根据 index 计算 row 的 y 坐标

```ts
getYbyIndex(index: number): number
```

### destroy

销毁渲染实例，清理所有子渲染器（header、ticks、rows、events）

```ts
destroy(): void
```
