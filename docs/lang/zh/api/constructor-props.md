---
layout: doc
footer: false
---

## 实例属性

### id

当前实例的唯一标识符

### parentContainer

当前实例的 options 设置的元素

### container

当前实例的容器元素，用来处理滚动相关的容器，在 parentContainer 下

### body

当前实例的 svg 画布包裹的容器，在 container 容器下

### stage

当前实例的 svg 画布对象

### parentContainerRectInfo

当前实例的 parentContainer 元素的矩形信息

### containerRectInfo

当前实例的 container 元素的矩形信息

### data

当前实例的原始数据

### list

当前实例的处理后的数据，包含了每个任务的开始结束时间，颜色等信息

### options

当前实例的配置项

### status

```ts
export type Status = {
	eventMoving: boolean //事件是否正在移动事件
	eventResizing: boolean //事件是否正在调整大小
	addEventIteming: boolean //是否正在新增事件项
}
```

当前实例状态

### eventBus

当前实例的事件总线对象

### view

当前实例的[视图对象](/api/view-class)

### time

当前实例的[时间对象](/api/time-class)

### render

当前实例的[渲染对象](/api/render-class)

### minTime

当前实例的根据数据计算出的最小时间，Dayjs 对象

### maxTime

当前实例的根据数据计算出的最大时间，Dayjs 对象

### createTime

当前实例的创建时间
