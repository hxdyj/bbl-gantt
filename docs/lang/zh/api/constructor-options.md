---
layout: doc
footer: false
---

## 初始化实例

```html
<div id="gantt"></div>
```

```javascript
import Gantt from 'bbl-gantt'
const gantt = new Gantt({
	// options
})
```

## Options

```ts
export type GanttOptions = {
	el: ContainerType // 容器元素，可以是选择器字符串或 HTMLElement 对象
	mode?: GanttMode // 模式，normal 表示普通模式，duration 表示持续时间模式
	durationModeOptions?: DurationModeOptions // 仅在 mode=duration 模式下生效
	readOnly?: boolean // 是否只读，只读模式下无法编辑数据
	column?: Column // 列配置
	// 行配置
	row?: {
		height?: number // 行高
	}
	// 头部配置
	header?: {
		height?: number // 头部高度
	}
	// 视图配置
	view?: {
		timeFullWidth?: boolean //是否时间铺满整个宽度，然后按照宽度和起止时间自动计算 gantt.column.timeMetric 和 gantt.column.width, 仅在 mode=duration 模式下生效
		headerTimeFormat?: (args: HeaderTimeFormatArgs) => string //格式化时间显示
		whileShowScrollReduceScrollBarSize?: boolean // 当展示滚动条的时候容器是否减去滚动条的大小
		whileRowsLessContainerAutoReduceHeight?: boolean //当行数小于容器高度的时候是否自动减少容器高度
		showScrollBar?: boolean //是否展示滚动条

		showTicks?: boolean //是否展示刻度
		showTickText?: boolean //是否展示刻度文字

		showTimeTicks?: boolean //是否展示时间度量的刻度
		showTimeTickText?: boolean //是否展示时间度量的刻度文字

		headerTickTextTickNeeded?: boolean //有些刻度文字会重叠，但是我们只想展示不重叠的文字（设置overrideHeaderTitle为true即可），设置此属性为true会将没有文字部分的刻度隐藏

		showEventTimeRange?: boolean //是否展示事件的时间范围
		overrideHeaderTitle?: boolean //是否覆盖头部重叠的文字
		/**
		 * event item 矩形样式的 padding-top 和 padding-bottom 值，默认是 0.25
		 * <1认为是百分比，>1认为是像素
		 *  */
		eventRectStylePadY?: number
		eventItemTimeFormat?: (time: Dayjs) => GanttEventItemTime // 当 normal 模式 eventItem 时间改变时候，格式化 options.data 中的时间的格式
	}
	//操作配置
	action?: {
		/**
		 * 鼠标在header上是否可以缩放度量时间
		 * min 和 max 表示缩放的最小最大值，单位是毫秒
		 *  */
		headerWheelTimeMetric?:
			| boolean
			| {
					min?: number
					max?: number
			  }
		moveOrResizeStep?: boolean //移动事件和调整事件大小是否以tick为单位移动
		enableEventMove?: boolean //是否允许事件移动
		enableEventResize?: boolean //是否允许事件调整大小
		enableCurrentTime?: boolean //容器点击是否允许显示当前时间
		enableMoveOrResizeOutOfEdge?: boolean //是否允许移动或调整大小超出边界
		enableNewEventItem?: boolean //是否允许新增事件项
	}
	data?: GanttItem[] //数据
}

export type Column = {
	width: number //每列的宽度
	timeMetric: number | TimeMetric //毫秒数或者时间度量，代表每列的时间长度
	padding: {
		//duration模式不生效，都为0
		//根据所有数据算出整个数据需要划分为多少列，这里的padding代表在这些列的前后要留多少空白列
		left: number
		right: number
	}
}

export enum TimeMetric {
	SECOND = 'SECOND',
	MINUTE = 'MINUTE',
	QUARTER_HOUR = 'QUARTER_HOUR',
	HALF_HOUR = 'HALF_HOUR',
	HOUR = 'HOUR',
	QUARTER_DAY = 'QUARTER_DAY',
	HALF_DAY = 'HALF_DAY',
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

export type HeaderTimeFormatArgs = {
	gantt: Gantt
	time: Dayjs
	unit: UnitType
	type: 'currentTime' | 'timeRange' | 'tick'
}

export type DurationModeOptions = {
	duration: number //总时长 以秒为单位，小数后三位为毫秒 如：56.321
}

export type ContainerType = string | HTMLElement

export enum GanttMode {
	Normal = 'normal',
	Duration = 'duration',
}

export type GanttItem = {
	id: string
	name: string
	events: GanttEventItem[]
	children?: GanttItem[]
	bg?: string
	[key: string]: any
}

export type GanttEventItem = {
	id: string
	start: GanttEventItemTime
	end: GanttEventItemTime
	name: string
	shape?: EventShapeType
	color?: string
	textColor?: string
	[key: string]: any
}

export type GanttEventItemTime = string | number | Date | Dayjs

export enum EventShapeType {
	rect = 'rect',
	line = 'line',
}
```
