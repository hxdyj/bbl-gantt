---
layout: doc
footer: false
---

# RowsRender

RowsRender 类，负责渲染 rows 部分

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

Rows 部分的 G 实例

### lastClickRow

上一次点击的 row 数据

## 实例方法

### render

渲染整个 Rows

```ts
render(): void
```

### destroy

销毁 Rows 部分

```ts
destroy(): void
```

### deleteRow

删除某个 row(画布+数据)，如果 emit 为 true，则触发事件

```ts
deleteRow(row: GanttItem, emit?: boolean): void
```
