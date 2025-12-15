---
layout: doc
footer: false
---

## Instance Methods

### updateOptions

```ts
// Updates the configuration of the instance
updateOptions(options: Partial<Omit<GanttOptions, 'el'>>): void
```

### destroy

```ts
// Destroy the instance, clean up all event listeners and resources
destroy(): void
```

### on

```ts
// Binds instance events, which are currently available for the instance can be found in the documentation [Events](/en/api/constructor-on)
on(...rest: any): void
```

Refer to the on method of eventemitter3

### off

```ts
// Cancel event binding
off(...rest: any): void
```

Refer to the off method of eventemitter3
