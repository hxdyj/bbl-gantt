---
layout: doc
footer: false
---

# Time 类

时间相关的类，计算时间轴的刻度，根据 x 坐标计算时间，根据时间计算 x 坐标等

## 构造函数

### constructor

```ts
// 构造函数，传入 Gantt 实例
constructor(gantt: Gantt): Time
```

## 实例属性

### gantt

Gantt 实例

### ticks

用户划分的 column 算出的 ticks 数量

### timeTicks

用户划分的 column 算出的 ticks 数量

### stepTime

将用户划分的 column timeMetric 统一转换成毫秒数的步长

### fixUnit

根据用户划分的 column timeMetric 找到合适的 dayjs 添加或者减少时候的单位

### fixUnitStepTime

fixUnit 转换成毫秒数

### startTime

视图开始时间

### endTime

视图结束时间，和 gantt 实例的 endTime 不同点在于，视图有时候可能大，gantt 内容填充不满，所以视图的 endTime 可能比 gantt 的 endTime 大

## 实例方法

### time2x

```ts
// 根据时间和开始时间计算 x 坐标
time2x(time: Dayjs, startTime?: Dayjs): number
```

### x2time

```ts
// 根据 x 坐标和开始时间计算时间
x2time(x: number, startTime?: Dayjs): Dayjs
```

### containerScrollLeftTime

```ts
// 计算当前 container 左侧滚动条的位置对应的时间
containerScrollLeftTime(): Dayjs
```

### stageWidthTime

```ts
// 计算 stage 宽度对应的时间
stageWidthTime(): Dayjs
```

### length2milliseconds

```ts
// 根据长度计算毫秒数
length2milliseconds(length: number): number
```

### getWidthByTwoTime

```ts
// 根据两个时间计算出时间之间的宽度
getWidthByTwoTime(time1: Dayjs, time2: Dayjs): number
```

### dayjs2duration

```ts
// 将 Dayjs 时间对象转换为 duration 格式（秒为单位）
dayjs2duration(time: Dayjs): number
```

### getTickByIndex

```ts
// 根据刻度索引获取对应的时间
getTickByIndex(index: number): Dayjs
```

### getTimeTickByIndex

```ts
// 根据时间刻度索引获取对应的时间
getTimeTickByIndex(index: number): Dayjs
```

### lastTick

```ts
// 获取最后一个刻度的时间
lastTick(): Dayjs
```

### lastTimeTick

```ts
// 获取最后一个时间刻度的时间
lastTimeTick(): Dayjs
```

### getTicksIterator

```ts
// 获取刻度迭代器，用于遍历可视区域内的刻度
getTicksIterator(): Generator
```

### getTimeTicksIterator

```ts
// 获取时间刻度迭代器，用于遍历可视区域内的时间刻度
getTimeTicksIterator(): Generator
```

### getNoneEventStartTime

```ts
// 获取无事件时的开始时间
getNoneEventStartTime(): Dayjs
```
