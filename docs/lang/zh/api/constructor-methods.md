---
layout: doc
footer: false
---

## 实例方法

### updateOptions

```ts
// 更新实例的配置项
updateOptions(options: Partial<Omit<GanttOptions, 'el'>>): void
```

### destroy

```ts
// 销毁实例,清理所有事件监听和资源
destroy(): void
```

### on

```ts
// 绑定实例事件,目前实例可监听的事件参考文档 [事件](/api/constructor-on)
on(...rest: any): void
```

参考 eventemitter3 的 on 方法

### off

```ts
// 取消绑定实例事件
off(...rest: any): void
```

参考 eventemitter3 的 off 方法
