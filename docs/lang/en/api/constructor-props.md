---
layout: doc
footer: false
---

## Instance Properties

### id

The unique identifier of the current instance.

### parentContainer

The element specified in the options of the current instance.

### container

Current instance container element, used to handle scroll-related containers, under parentContainer

### body

Current instance svg canvas wrapper container, under container

### stage

Current instance's SVG canvas object.

### parentContainerRectInfo

The rectangular information of the parentContainer element of the current instance.

### containerRectInfo

The rectangular information of the container element of the current instance.

### data

Current instance's original data.

### list

Current instance's processed data, containing the start and end time of each task, color, etc.

### options

Current instance's configuration item.

### status

```ts
export type Status = {
	eventMoving: boolean // event is moving
	eventResizing: boolean // event is resizing
	addEventIteming: boolean // adding event item
}
```

Current instance status.

### eventBus

Current instance's event bus object.

### view

Current instance's [view object](/en/api/view-class).

### time

Current instance's [time object](/en/api/time-class).

### render

Current instance's [rendering object](/en/api/view-class).

### minTime

The minimum time calculated based on the data of the current instance, in Dayjs object format.

### maxTime

The maximum time calculated based on the data of the current instance, in Dayjs object format.

### createTime

The creation time of the current instance.
