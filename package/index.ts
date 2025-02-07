import { G, SVG, Svg } from "@svgdotjs/svg.js";
import EventEmitter from "eventemitter3";
import { EventBindingThis } from "./event";
import { EventBusEventName } from "./event/const";
import duration from "dayjs/plugin/duration"
import minMax from "dayjs/plugin/minMax"
import weekOfYear from "dayjs/plugin/weekOfYear"
import dayjs from "dayjs";
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
import './style.scss'
import { EventShapeType } from './render/eventsRender';
export enum TimeMetric {
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

export type TimeScale = keyof Pick<typeof TimeMetric, 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>

export type Column = {
	width: number   //每列的宽度
	timeMetric: number | TimeMetric  //毫秒数或者时间度量，代表每列的时间长度
	padding: {  //根据所有数据算出整个数据需要划分为多少列，这里的padding代表在这些列的前后要留多少空白列
		left: number,
		right: number,
	}
}

export type ContainerType = string | HTMLElement
export type GanttOptions = {
	el: ContainerType
	column?: DeepPartial<Column>
	row?: {
		height: number
	}
	header?: {
		height: number
	}
	data: GanttItem[]
}


export const defaultGanttOptions: DeepPartial<GanttOptions> = {
	data: [],
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
	container: HTMLElement;
	body: HTMLElement;
	stage: Svg;
	eventBus = new EventEmitter()
	private destroyed = false
	createTime: number
	options: DeepRequired<GanttOptions>
	containerRectInfo: ReturnType<typeof getContainerInfo>
	view: View
	time: Time
	render: Render
	constructor(options: GanttOptions) {
		super()
		this.id = uid(6)
		options.data = cloneDeep(options.data || [])
		this.options = defaultsDeep(options, defaultGanttOptions)
		if (!this.options.el) {
			throw new Error('Container must be provided')
		}
		this.container = getElement(this.options.el as ContainerType)

		this.body = createOrGetEle(CssNameKey.body, this.container)
		ganttManager.addNewInstance(this)

		this.createTime = Date.now()

		if (!this.container) {
			throw new Error('Container not found')
		}

		this.container.classList.add(CssNameKey.container)

		this.containerRectInfo = getContainerInfo(this.container)
		this.container.style.maxWidth = `100%`
		this.container.style.height = `${this.containerRectInfo.height}px`
		this.container.style.overflow = 'auto'
		console.log('init containerRectInfo', this.id, this.containerRectInfo)
		this.stage = SVG()
		this.bindEventThis([])
		this.init()
		this.time = new Time(this)
		this.view = new View(this)
		this.render = new Render(this)
		this.bindEvent()
	}


	minTime: Dayjs | null = null
	maxTime: Dayjs | null = null

	protected init() {
		if (this.destroyed) return
		const { minTime, maxTime, list } = initDealData(this.options.data)
		this.minTime = minTime
		this.maxTime = maxTime
		this.list = list
		console.log(`init deal data`, minTime, maxTime, cloneDeep(list))
		// this.eventBus.emit(EventBusEventName.init, this)
	}

	bindEvent() {
		this.containerResizeObserver.observe(this.container)
	}

	unbindEvent() {
		this.containerResizeObserver.disconnect()
	}


	updateOptions(options: Partial<Omit<GanttOptions, 'el'>>) {
		this.destroy()
		this.destroyed = false
		const constructor = Object.getPrototypeOf(this).constructor
		const _options = defaultsDeep(options, this.options)
		Object.assign(this, omit(new constructor(_options), 'uid'))
	}

	protected containerResizeObserverCallback: ResizeObserverCallback = (entries: any) => {
		if (entries[0]?.target === this.container) {
			this.containerRectInfo = getContainerInfo(this.container)
			if (Date.now() - this.createTime < 300) {
				console.log('inital resize')
				this.time.init()
			}
			this.render.render()
			console.log('containerResizeObserverCallback', this.containerRectInfo, Date())
		}
	}

	protected containerResizeObserver = new ResizeObserver(this.containerResizeObserverCallback)


	destroy() {
		this.destroyed = true
		this.unbindEvent()
		this.eventBus.removeAllListeners()
		this.render.destroy()
		this.stage.remove()
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
