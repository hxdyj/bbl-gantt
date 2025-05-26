---
layout: doc
footer: false
---

# Time 类

时间相关的类，计算时间轴的刻度，根据 x 坐标计算时间，根据时间计算 x 坐标等

## 构造函数

### constructor

参数：`(gantt: Gantt)`

构造函数，传入 Gantt 实例

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

## 方法

### time2x

参数：`(time: Dayjs, startTime?: Dayjs): number`

根据时间和开始时间计算 x 坐标

### x2time

参数：`(x: number, startTime?: Dayjs): Dayjs`

根据 x 坐标和开始时间计算时间

### containerScrollLeftTime

参数：`(): Dayjs`

计算当前 container 左侧滚动条的位置对应的时间

### stageWidthTime

参数：`(): Dayjs`

计算 stage 宽度对应的时间

### length2milliseconds

参数：`(length: number): number`

根据长度计算毫秒数

### getWidthByTwoTime

参数：`(time1: Dayjs, time2: Dayjs): number`

根据两个时间计算出时间之间的宽度
