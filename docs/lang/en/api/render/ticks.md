---
layout: doc
footer: false
---

# TicksRender

TicksRender Class is responsible for rendering the ticks part of the Gantt instance.

## Constructor

### constructor

Parameters: `(gantt: Gantt, renderer: Render)`

Constructor, receives Gantt instance and Render instance.

## instance properties

### gantt

Gantt instance

### renderer

Render instance

### g

Tikcks part G instance

### gText

Ticks part text G instance

## Instance Methods

### render

Renders the entire Ticks part.

```ts
render(): void
```

### clear

Clears the Ticks part.

```ts
clear(): void
```

### destroy

Destroy the Ticks part.

```ts
destroy(): void
```
