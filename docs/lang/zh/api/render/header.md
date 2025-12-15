---
layout: doc
footer: false
---

# HeaderRender 类

HeaderRender 类，负责渲染 header 部分

## 构造函数

### constructor

参数：`(gantt: Gantt, renderer: Render)`

构造函数，传入 Gantt 实例和 Render 实例

## 实例属性

### gantt

Gantt 实例

### renderer

Render 实例

### currentTimeG

当前时间的 G 实例

### timeRange

事件时间范围的 G 实例

### g

Header 部分的 G 实例

## 方法

### render

渲染整个 Header

```ts
render(): void
```

### clear

清除 Header 部分

```ts
clear(): void
```

### destroy

销毁 Header 部分

```ts
destroy(): void
```

### showCurrentTime

显示当前时间

```ts
showCurrentTime(): void
```

### hideCurrentTime

隐藏当前时间

```ts
hideCurrentTime(): void
```
