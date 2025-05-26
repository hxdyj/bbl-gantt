---
layout: doc
footer: false
---

# View Class

Operate the view of the Gantt

## Constructor

### constructor

Parameters: `(gantt: Gantt)`

Constructor, passing the Gantt instance

## Instance Properties

### gantt

Gantt instance

## Methods

### scrollToID

Parameters: `(id: string, options?: ScrollToOptions)`

Scrolls to the position of the element with the specified ID.

### scrollToItem

Parameters: `(itemId: string, options?: ScrollToOptions)`

Scrolls to the position of the element with the specified item ID.

### scrollToEvent

Parameters: `(eventId: string, options?: ScrollToOptions)`

Scrolls to the position of the element with the specified event ID.

### scrollToEarliestItem

Parameters: `(options?: ScrollToOptions)`

Scrolls to the position of the earliest item.
