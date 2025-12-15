---
layout: doc
footer: false
---

# View 类

视图操作的类

## 构造函数

### constructor

```ts
// 构造函数，传入 Gantt 实例
constructor(gantt: Gantt): View
```

## 实例属性

### gantt

插件所属的 Gantt 实例

## 实例方法

### scrollToID

```ts
// 滚动到指定 id 的元素的位置
scrollToID(id: string, options?: ScrollToOptions): void
```

### scrollToItem

```ts
// 滚动到指定 itemId 的元素的位置
scrollToItem(itemId: string, options?: ScrollToOptions): void
```

### scrollToEvent

```ts
// 滚动到指定 eventId 的元素的位置
scrollToEvent(eventId: string, options?: ScrollToOptions): void
```

### scrollToEarliestItem

```ts
// 滚动到最早的元素的位置
scrollToEarliestItem(options?: ScrollToOptions): void
```
