---
layout: doc
footer: false
---

# HeaderRender

Header Render Class is responsible for rendering the header part of the Gantt instance.

## Constructor

### constructor

Parameters: `(gantt: Gantt, renderer: Render)`

Constructor, receives Gantt instance and Render instance.

## Instance Properties

### gantt

Gantt instance

### renderer

Render instance

### currentTimeG

Current time G instance

### timeRange

Time range G instance

### g

Header G instance

## Methods

### render

Renders the entire Header.

```ts
render(): void
```

### clear

Clears the Header part.

```ts
clear(): void
```

### destroy

Destroys the Header part.

```ts
destroy(): void
```

### showCurrentTime

Shows the current time.

```ts
showCurrentTime(): void
```

### hideCurrentTime

Hides the current time.

```ts
hideCurrentTime(): void
```
