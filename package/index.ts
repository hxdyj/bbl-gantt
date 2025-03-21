import { G, SVG, Svg } from "@svgdotjs/svg.js";
import EventEmitter from "eventemitter3";
import { EventBindingThis } from "./event";
import { EventBusEventName } from "./event/const";
import duration from "dayjs/plugin/duration"
import minMax from "dayjs/plugin/minMax"
import weekOfYear from "dayjs/plugin/weekOfYear"
import dayjs, { UnitType } from "dayjs";
dayjs.extend(duration)
dayjs.extend(minMax)
dayjs.extend(weekOfYear)
import { CssNameKey } from "./const/const";
import { uid } from 'uid'
import { createOrGetEle, getContainerInfo, getElement } from "./utils/dom";
import { DeepPartial } from "@arco-design/web-react/es/Form/store";
import { cloneDeep, defaultsDeep, omit } from "lodash-es";
import { initDealData } from "./utils/data";
import { Dayjs } from "dayjs";
import { View } from "./view";
import { DeepRequired } from 'utility-types'
import { Time } from "./time";
import { Render } from "./render";
import { EventShapeType } from './render/eventsRender';
import { FORMAT_FULL_TIME, formatDuration, getDurationStartTime } from "./utils/time";
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

export type TimeScale = keyof Pick<typeof TimeMetric, 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>

export type Column = {
	width: number   //每列的宽度
	timeMetric: number | TimeMetric  //毫秒数或者时间度量，代表每列的时间长度
	padding: {  //根据所有数据算出整个数据需要划分为多少列，这里的padding代表在这些列的前后要留多少空白列
		left: number,
		right: number,
	}
}

export enum GanttMode {
	Normal = 'normal',
	Duration = 'duration'
}

export type ContainerType = string | HTMLElement


export type DurationModeOptions = {
	duration: number //总时长 以秒为单位，小数后三位为毫秒 如：56.321
}

export type HeaderTimeFormatArgs = {
	gantt: Gantt,
	time: Dayjs,
	unit: UnitType,
	type: 'currentTime' | 'timeRange' | 'tick'
}


export type __GanttOptions = {
	readOnly?: boolean
	column?: DeepPartial<Column>
	row?: {
		height?: number
	}
	header?: {
		height?: number
	}
	view?: {
		headerTimeFormat?: (args: HeaderTimeFormatArgs) => string
		showScrollBar?: boolean
		showTicks?: boolean
		showTickText?: boolean
		showTimeTicks?: boolean
		showTimeTickText?: boolean
		showEventTimeRange?: boolean
		overrideHeaderTitle?: boolean
		eventRectStylePadY?: number,
	},
	action?: {
		enableEventMove?: boolean
		enableEventResize?: boolean
		enableCurrentTime?: boolean
		enableMoveOrResizeOutOfEdge?: boolean
	}
	data?: GanttItem[]
}

export type _GanttOptions =
	(__GanttOptions & {
		mode: GanttMode.Normal
	})
	|
	(__GanttOptions & {
		mode: GanttMode.Duration,
		durationModeOptions: DurationModeOptions
	})


export type GanttOptions = _GanttOptions & {
	el: ContainerType
}

export const defaultGanttOptions: DeepPartial<GanttOptions> = {
	readOnly: false,
	data: [],
	mode: GanttMode.Normal,
	column: {
		width: 80,
		timeMetric: TimeMetric.HOUR,
		padding: {
			left: 4,
			right: 4
		}
	},
	row: {
		height: 60
	},
	header: {
		height: 70
	},
	view: {
		showScrollBar: true,
		showTicks: true,
		showTickText: false,
		showTimeTicks: false,
		showEventTimeRange: true,
		showTimeTickText: true,
		overrideHeaderTitle: true,
		/**
		 * <1认为是百分比，>1认为是像素
		 *  */
		eventRectStylePadY: 0.25,
		headerTimeFormat({ gantt, time, unit, type }: HeaderTimeFormatArgs) {


			if (type === 'currentTime') {
				return gantt.options.mode === GanttMode.Duration ? formatDuration(dayjs.duration(time.diff(gantt.time.startTime, 'ms'), 'ms').format('H:m:s.SSS')) : time.format('YYYY-MM-DD HH:mm:ss')
			}


			if (unit === 'day') unit = 'date'
			let showTimeStr = ''



			if (gantt.options.mode === GanttMode.Normal) {
				//@ts-ignore
				if (unit === 'week') {
					showTimeStr = `${time.format('YYYY')}-${time.week()}周`
				} else {
					// showTimeStr = time.get(unit).toString()
					if (unit == 'month') {
						showTimeStr = time.format('YYYY-MM')
					}

					if (unit == 'date') {
						showTimeStr = time.format('YYYY-MM-DD')
					}

					if (unit == 'hour') {
						showTimeStr = time.format('MM-DD/HH')
					}

					if (unit == 'minute') {
						showTimeStr = time.format('DD/HH:mm')
					}

					if (unit == 'second') {
						showTimeStr = time.format('HH:mm:ss')
					}
				}
			}

			if (gantt.options.mode === GanttMode.Duration) {
				let formatStr = 'HH:mm:ss'
				if (type == 'timeRange') {
					formatStr = 'HH:mm:ss.SSS'
				}
				const durationObj = dayjs.duration(time.diff(gantt.time.startTime, 'ms'), 'ms')
				showTimeStr = durationObj.format(formatStr)
			}
			return showTimeStr
		}
	},
	action: {
		enableEventMove: true,
		enableEventResize: true,
		enableCurrentTime: true,
		enableMoveOrResizeOutOfEdge: true,
	}
}
export class GanttManager {
	ganttEleInstanceWeakMap: WeakMap<HTMLElement, Gantt> = new WeakMap()
	idInstanceMap: Map<string, Gantt> = new Map()
	addNewInstance(instance: Gantt) {
		if (this.ganttEleInstanceWeakMap.has(instance.container)) {
			const oldInstance = this.ganttEleInstanceWeakMap.get(instance.container)
			oldInstance?.destroy()
		}
		this.idInstanceMap.set(instance.id, instance)
		this.ganttEleInstanceWeakMap.set(instance.container, instance)
	}
	removeInstance(instance: Gantt) {
		this.idInstanceMap.delete(instance.id)
		this.ganttEleInstanceWeakMap.delete(instance.container)
	}
}

export const ganttManager = new GanttManager()

export type GanttEventItem = {
	id: string //必须是字母开头 因为是用来做css里id或者class的
	start: string | number | Date | Dayjs
	end: string | number | Date | Dayjs
	name: string
	shape?: EventShapeType
	color?: string
	textColor?: string
	[key: string]: any
}
export type _GanttEventItem = Omit<GanttEventItem, 'start' | 'end'> & {
	start: Dayjs
	end: Dayjs
}

export type _GanttItem = Omit<GanttItem, 'events'> & {
	events: _GanttEventItem[]
}

export type GanttItem = {
	id: string //必须是字母开头 因为是用来做css里id或者class的
	name: string
	events: GanttEventItem[]
	children?: GanttItem[]
	bg?: string
	[key: string]: any
}

export class Gantt extends EventBindingThis {
	id: string;
	data: GanttItem[] = []
	list: _GanttItem[] = []
	parentContainer: HTMLElement;
	container: HTMLElement;
	body: HTMLElement;
	stage: Svg;
	eventBus = new EventEmitter()
	private destroyed = false
	createTime: number
	status: {
		eventMoving: boolean
		eventResizing: boolean
	} = {
			eventMoving: false,
			eventResizing: false
		}

	options: DeepRequired<GanttOptions>
	parentContainerRectInfo: ReturnType<typeof getContainerInfo>
	containerRectInfo: ReturnType<typeof getContainerInfo>
	view: View
	time: Time
	render: Render
	constructor(options: GanttOptions) {
		super()
		console.group('New Gantt')
		this.id = uid(6)
		if (options.readOnly) {
			const userAction = options.action
			const readOnlyAction: __GanttOptions['action'] = {
				enableEventMove: false,
				enableEventResize: false,
				enableCurrentTime: false,
				enableMoveOrResizeOutOfEdge: false,
			}
			const mergedAction = defaultsDeep({}, userAction, readOnlyAction)
			options.action = mergedAction
		}


		options.data = cloneDeep(options.data || [])

		this.options = defaultsDeep({}, options, defaultGanttOptions)


		if (!this.options.el) {
			throw new Error('Container must be provided')
		}
		this.parentContainer = getElement(this.options.el as ContainerType)



		this.container = createOrGetEle(CssNameKey.container, this.parentContainer)

		if (!this.options.view.showScrollBar) {
			this.container.classList.add('no-scroll-bar')
		}

		this.body = createOrGetEle(CssNameKey.body, this.container)
		ganttManager.addNewInstance(this)

		this.createTime = Date.now()

		if (!this.container) {
			throw new Error('Container not found')
		}


		if (options.mode == GanttMode.Duration) {
			if (!options.column?.padding) {
				this.options.column.padding.left = 0
				this.options.column.padding.right = 0
			}

			this.container.classList.add(CssNameKey.duration_mode)
		}

		this.parentContainerRectInfo = getContainerInfo(this.parentContainer)
		this.containerRectInfo = getContainerInfo(this.container)
		this.caculateContainerInfo()

		console.log('init containerRectInfo', this.id)
		this.stage = SVG()
		this.bindEventThis([])
		this.init()
		this.time = new Time(this)
		this.view = new View(this)
		this.render = new Render(this)
		this.bindEvent()
		console.groupEnd()

	}


	minTime: Dayjs | null = null
	maxTime: Dayjs | null = null

	protected init() {
		if (this.destroyed) return
		const { minTime, maxTime, list } = initDealData(this.options.data, this.options)
		this.minTime = minTime
		this.maxTime = maxTime

		if (this.options.mode == GanttMode.Duration) {
			this.minTime = getDurationStartTime()
			this.maxTime = getDurationStartTime(this.options.durationModeOptions.duration)
			console.log('Duration min max time', this.minTime.format(FORMAT_FULL_TIME), this.maxTime.format(FORMAT_FULL_TIME))
		}

		this.list = list
		console.log(`init deal data`, minTime, maxTime, cloneDeep(list))
		// this.eventBus.emit(EventBusEventName.init, this)
	}

	bindEvent() {
		this.parentContainerResizeObserver.observe(this.parentContainer)
	}

	unbindEvent() {
		this.parentContainerResizeObserver.disconnect()
	}


	caculateContainerInfo() {
		const contentHeight = this.list.length * this.options.row.height + this.options.header.height
		console.log('contentHeight', this.list.length, contentHeight)
		if (!this.parentContainerRectInfo.height) {
			this.parentContainer.style.height = `${contentHeight}px`
		}

		this.parentContainerRectInfo = getContainerInfo(this.parentContainer)
		this.containerRectInfo = getContainerInfo(this.container)


		let finalHeight = this.list.length ? contentHeight : this.parentContainerRectInfo.height

		const documentBodyComputedStyle = getComputedStyle(document.body)

		// const scrollBarWidth = parseInt(documentBodyComputedStyle.getPropertyValue('--gantt-scrollbar-width'));
		const scrollBarHeight = this.options.view.showScrollBar ? parseInt(documentBodyComputedStyle.getPropertyValue('--gantt-scrollbar-height')) : 0;

		const containerReduceScrollBarHeight = this.containerRectInfo.height - scrollBarHeight

		if (this.list.length && containerReduceScrollBarHeight > contentHeight) {
			finalHeight = contentHeight
		}

		if (
			(this.containerRectInfo.height
				&& this.parentContainerRectInfo.height
				&& containerReduceScrollBarHeight > this.parentContainerRectInfo.height)
			||
			(finalHeight > this.parentContainerRectInfo.height)
		) {
			finalHeight = this.parentContainerRectInfo.height
		}


		this.containerRectInfo.height = finalHeight

		let containerWidth = `${this.parentContainerRectInfo.width}px`
		let containerHeight = `${this.containerRectInfo.height}px`

		if (this.options.view.showScrollBar) {
			containerWidth = `calc(${containerWidth} - var(--gantt-scrollbar-width))`
			containerHeight = `calc(${containerHeight} - var(--gantt-scrollbar-height))`
		}

		this.container.style.height = containerHeight
		this.container.style.maxHeight = containerHeight
		this.container.style.width = containerWidth
		this.container.style.maxWidth = containerWidth
	}


	updateOptions(options: Partial<Omit<GanttOptions, 'el'>>) {
		this.destroy()
		this.destroyed = false
		const constructor = Object.getPrototypeOf(this).constructor
		const _options = defaultsDeep(options, this.options)
		Object.assign(this, omit(new constructor(_options), 'uid'))
	}

	protected parentContainerResizeObserverCallback: ResizeObserverCallback = (entries: any) => {
		if (entries[0]?.target === this.parentContainer) {
			this.parentContainerRectInfo = getContainerInfo(this.parentContainer)
			this.caculateContainerInfo()
			if (Date.now() - this.createTime < 300) {
				console.log('inital resize')
				this.time.init()
			}
			this.render.render()
			console.log('parentContainerResizeObserverCallback', this.parentContainerRectInfo, Date())
		}
	}

	protected parentContainerResizeObserver = new ResizeObserver(this.parentContainerResizeObserverCallback)


	destroy() {
		this.destroyed = true
		this.unbindEvent()
		this.eventBus.removeAllListeners()
		this.time?.destroy()
		this.render?.destroy()
		this.stage?.remove()
		ganttManager.removeInstance(this)
	}

	protected draw() {
		this.eventBus.emit(EventBusEventName.draw, this)
	}

	on(...rest: any) {
		this.eventBus.on.apply(this.eventBus, rest)
		return this
	}

	off(...rest: any) {
		this.eventBus.off.apply(this.eventBus, rest)
		return this
	}
}

export default Gantt
