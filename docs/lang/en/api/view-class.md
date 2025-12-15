---
layout: doc
footer: false
---

# View Class

Operate the view of the Gantt

## Constructor

### constructor

```ts
// Constructor, passing the Gantt instance
constructor(gantt: Gantt): View
```

## Instance Properties

### gantt

Gantt instance

## Instance Methods

### scrollToID

```ts
// Scrolls to the position of the element with the specified ID.
scrollToID(id: string, options?: ScrollToOptions): void
```

### scrollToItem

```ts
// Scrolls to the position of the element with the specified item ID.
scrollToItem(itemId: string, options?: ScrollToOptions): void
```

### scrollToEvent

```ts
// Scrolls to the position of the element with the specified event ID.
scrollToEvent(eventId: string, options?: ScrollToOptions): void
```

### scrollToEarliestItem

```ts
// Scrolls to the position of the earliest item.
scrollToEarliestItem(options?: ScrollToOptions): void
```
