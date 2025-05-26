---
layout: doc
footer: false
---

# View 类

视图操作的类

## 构造函数

### constructor

参数：`(gantt: Gantt)`

构造函数，传入 Gantt 实例

## 实例属性

### gantt

插件所属的 Gantt 实例

## 方法

### scrollToID

参数：`(id: string, options?: ScrollToOptions)`

滚动到指定 id 的元素的位置

### scrollToItem

参数：`(itemId: string, options?: ScrollToOptions)`

滚动到指定 itemId 的元素的位置

### scrollToEvent

参数：`(eventId: string, options?: ScrollToOptions)`

滚动到指定 eventId 的元素的位置

### scrollToEarliestItem

参数：`(options?: ScrollToOptions)`

滚动到最早的元素的位置
