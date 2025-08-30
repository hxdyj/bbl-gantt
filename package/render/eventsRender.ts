import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem, GanttEventItem, GanttEventItemTime, GanttItem, GanttMode } from "../index";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender, getStartAndEndTime } from "./eventItem/eventItemRender";
import { EventItemLineStyle } from "./eventItem/eventItemLineStyle";
import { EventItemRectStyle } from "./eventItem/eventItemRectStyle";
import { cloneDeep } from "lodash-es";
import { EventBusEventName } from "../event/const";
import dayjs, { Dayjs } from "dayjs";
import { formatDataTimeToDayjs, walkData } from "../utils/data";
import { DeepPartial } from "utility-types";
export enum EventShapeType {
	rect = 'rect',
	line = 'line'
}

export type RenderItemOptions = {
	event: _GanttEventItem,
	index: number,
	eventIndex: number,
	addTo: G,
	gClassName?: string
	bodyClassName?: string
	bindEvent?: boolean
}
export type EventItemOperateType = 'left-resize' | 'right-resize' | 'body-move'

export type FindOptionEventItemResult = {
	item: GanttItem
	parent: GanttItem | null
	event: _GanttEventItem
	eventOrigin?: GanttEventItem
	eventIndex: number
}
export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis([
			'onEventItemBodyMouseDown',
			'onEventItemBodyMouseEnter',
			'onEventItemBodyMouseMove',
			'onEventItemBodyMouseLeave',
			'onContainerMouseMove',
			'onContainerMouseUp',
			'onContainerMouseLeave',
			'onEventItemLeftResizeMouseDown',
			'onEventItemRightResizeMouseDown',
			'autoScroll',
		])
		this.bindEvent()
	}

	map: WeakMap<_GanttEventItem, EventItemRender> = new WeakMap()

	renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		let gClassName = undefined
		let bodyClassName = undefined
		if (!event.shape || event.shape === EventShapeType.rect) {
			gClassName = CssNameKey.event_style_rect
			bodyClassName = CssNameKey.event_style_rect_bar
		}
		if (event.shape === EventShapeType.line) {
			gClassName = CssNameKey.event_style_line
			bodyClassName = CssNameKey.event_style_line_line
		}

		if (this.map.has(event)) {
			const renderItem = this.map.get(event)
			renderItem?.render()
			return renderItem || null
		} else {
			const options: RenderItemOptions = {
				event,
				index,
				eventIndex,
				addTo: g,
				gClassName,
				bodyClassName
			}
			const eventItemRender = event.shape === EventShapeType.line ? new EventItemLineStyle(this.gantt, this.renderer, options) : new EventItemRectStyle(this.gantt, this.renderer, options)
			this.map.set(event, eventItemRender)
			return eventItemRender
		}
	}


	findOptionDataEvent(event: _GanttEventItem): null | FindOptionEventItemResult {
		let result: FindOptionEventItemResult | null = null
		walkData(this.gantt.options.data, (({ item, parent, level }) => {
			let eventIndex = parent?.events.findIndex(e => e.id === event.id)
			if (eventIndex !== void 0 && eventIndex > -1) {
				result = {
					item,
					parent,
					event,
					eventOrigin: parent?.events[eventIndex],
					eventIndex,
				}
				return false
			}
		}))
		return result
	}

	deleteEvent(event: _GanttEventItem, emit = false) {
		this.removeEvent(event)
		const index = this.gantt.list.findIndex(row => row.events.find(e => e.id === event.id))
		if (index > -1) {
			const row = this.gantt.list[index]
			const eventIndex = row.events.findIndex(e => e.id === event.id)
			row.events.splice(eventIndex, 1)

			const optionDataEvent = this.findOptionDataEvent(event)
			if (optionDataEvent) {
				const { item, parent } = optionDataEvent
				parent?.events.splice(eventIndex, 1)
				emit && this.gantt.eventBus.emit(EventBusEventName.event_item_delete, {
					item,
					parent,
					event,
				}, this.gantt)
			}
		}
	}

	removeEvent(event: _GanttEventItem) {
		const renderItem = this.map.get(event)
		renderItem?.destroy()
		this.map.delete(event)
	}

	bindEvent() {
		this.gantt.on(EventBusEventName.event_item_body_mouse_down, this.onEventItemBodyMouseDown)
		this.gantt.on(EventBusEventName.event_item_body_mouse_enter, this.onEventItemBodyMouseEnter)
		this.gantt.on(EventBusEventName.event_item_body_mouse_move, this.onEventItemBodyMouseMove)
		this.gantt.on(EventBusEventName.event_item_body_mouse_leave, this.onEventItemBodyMouseLeave)
		this.gantt.on(EventBusEventName.event_item_left_resize_mouse_down, this.onEventItemLeftResizeMouseDown)
		this.gantt.on(EventBusEventName.event_item_right_resize_mouse_down, this.onEventItemRightResizeMouseDown)
		this.gantt.container.addEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.addEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.addEventListener('mouseleave', this.onContainerMouseLeave)
	}

	unbindEvent() {
		this.gantt.off(EventBusEventName.event_item_body_mouse_down, this.onEventItemBodyMouseDown)
		this.gantt.off(EventBusEventName.event_item_body_mouse_enter, this.onEventItemBodyMouseEnter)
		this.gantt.off(EventBusEventName.event_item_body_mouse_move, this.onEventItemBodyMouseMove)
		this.gantt.off(EventBusEventName.event_item_body_mouse_leave, this.onEventItemBodyMouseLeave)
		this.gantt.off(EventBusEventName.event_item_left_resize_mouse_down, this.onEventItemLeftResizeMouseDown)
		this.gantt.off(EventBusEventName.event_item_right_resize_mouse_down, this.onEventItemRightResizeMouseDown)
		this.gantt.container.removeEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.removeEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.removeEventListener('mouseleave', this.onContainerMouseLeave)

	}

	private startEvent: MouseEvent | null = null
	private itemRender: EventItemRender | null = null

	private tmpItem: EventItemRender | null = null

	private operateType: EventItemOperateType | null = null

	isHovering = false

	onEventItemBodyMouseEnter(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		if (!this.gantt.options.action.hoverEventShowTimeRange || this.operateType || this.isHovering) return
		this.itemRender = args.itemRender
		this.renderer.header.renderEventTimeRange(args.event, this.itemRender)
		this.isHovering = true
	}

	onEventItemBodyMouseMove(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		if (this.isHovering) {
			this.renderer.header.renderEventTimeRange(args.event, this.itemRender)
		}
	}

	cancelHovering() {
		if (!this.isHovering) return
		this.itemRender = null
		this.renderer.header.removeEventTimeRange()
		this.isHovering = false
	}

	onEventItemBodyMouseLeave(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		if (this.operateType) return
		this.cancelHovering()
	}

	onEventItemLeftResizeMouseDown(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		this.operateType = 'left-resize'
		const { event, itemRender } = args
		this.startEvent = event
		this.itemRender = itemRender
	}

	onEventItemRightResizeMouseDown(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		this.operateType = 'right-resize'
		const { event, itemRender } = args
		this.startEvent = event
		this.itemRender = itemRender
	}

	onEventItemBodyMouseDown(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		this.cancelHovering()
		if (!this.gantt.options.action.enableEventMove) return
		this.operateType = 'body-move'
		const { event, itemRender } = args
		this.startEvent = event
		this.itemRender = itemRender
	}

	onContainerMouseMove(event: MouseEvent) {
		if (!this.startEvent) return
		if (Math.abs(event.offsetX - this.startEvent.offsetX) > 1) {
			this.renderer.header.hideCurrentTime()
			this.renderer.header.renderEventTimeRange(
				event,
				this.tmpItem
			)
		}
		if (this.operateType === 'body-move') {
			this.onTypeBodyMoveMouseMove(event)
		}

		if (this.operateType === 'left-resize') {
			this.onTypeResizeMouseMove(event, true)
		}

		if (this.operateType === 'right-resize') {
			this.onTypeResizeMouseMove(event)
		}
	}

	onContainerMouseUp() {
		if (this.operateType === 'body-move') {
			this.onTypeBodyMoveMouseUp()
		}

		if (this.operateType === 'left-resize') {
			this.onTypeResizeMouseUp()
		}

		if (this.operateType === 'right-resize') {
			this.onTypeResizeMouseUp()
		}
		this.operateType = null
		this.renderer.header.showCurrentTime()
		this.renderer.header.removeEventTimeRange()
	}

	onContainerMouseLeave() {
		this.onContainerMouseUp()
	}

	g: G | null = null
	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.events}`)[0] || new G().addClass(CssNameKey.events)) as G
		this.g = g
		const rows = this.gantt.list
		console.log('events render', cloneDeep(rows))
		rows.forEach((row, index) => {
			row.events.forEach((event, eventIndex) => {
				this.renderEvent(event, index, eventIndex, g)
			})
		})
		g.addTo(this.gantt.stage)
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.events}`)[0]
		g?.remove()
		const rows = this.gantt.list
		rows.forEach((row) => {
			row.events.forEach((event) => {
				this.map.delete(event)
			})
		})
		this.unbindEvent()
	}

	private createTmpItem() {
		if (!this.itemRender) return
		if (!this.tmpItem) {
			//@ts-ignore
			const cls = this.itemRender.__proto__.constructor
			const options = cloneDeep(this.itemRender.options)
			options.event.id = `tmp-${options.event.id}`
			options.bindEvent = false
			this.tmpItem = new cls(this.gantt, this.renderer, options)
		}
	}

	private caculateDiffXTime(diffX: number, currentTime: Dayjs) {
		return currentTime.add(this.gantt.time.length2milliseconds(diffX), 'millisecond')
	}

	findNearTick(diffX: number, currentTime: Dayjs) {
		const time = this.caculateDiffXTime(diffX, currentTime)
		const index = (
			(time.valueOf() - this.gantt.time.startTime.valueOf()) /
			//@ts-ignore
			(this.gantt.options.view.showTicks ? this.gantt.time.stepTime : this.gantt.time.fixUnitStepTime)
		)
		const finalIndex = Math.round(index)
		const tickInfo = this.gantt.options.view.showTicks ? this.gantt.time.getTickByIndex(finalIndex) : this.gantt.time.getTimeTickByIndex(finalIndex)
		return tickInfo
	}

	private caculateTmpItemFinalX(diffX: number, type: EventItemOperateType) {
		if (!this.startEvent || !this.itemRender) return
		if (!this.tmpItem) return
		const isStep = this.gantt.options.action.moveOrResizeStep &&
			(
				(this.gantt.options.view.showTicks && !this.gantt.options.view.showTimeTicks) ||
				(!this.gantt.options.view.showTicks && this.gantt.options.view.showTimeTicks)
			)

		const caculateFunc = isStep ? this.findNearTick.bind(this) : this.caculateDiffXTime.bind(this)
		if (type === 'body-move') {
			const oldStart = this.tmpItem.options.event.start
			this.tmpItem.options.event.start = caculateFunc(diffX, this.itemRender.options.event.start)

			const startDiff = this.tmpItem.options.event.start.valueOf() - oldStart.valueOf()
			this.tmpItem.options.event.end = this.tmpItem.options.event.end.add(startDiff, 'millisecond')
		} else {
			if (type === 'left-resize') {
				const result = caculateFunc(diffX, this.itemRender.options.event.start)
				if (!result.isSame(this.itemRender.options.event.end)) {
					this.tmpItem.options.event.start = result
				}
			} else {
				const result = caculateFunc(diffX, this.itemRender.options.event.end)
				if (!result.isSame(this.itemRender.options.event.start)) {
					this.tmpItem.options.event.end = result
				}
			}
		}
	}

	onTypeResizeMouseMove(event: MouseEvent, start = false) {
		if (!this.startEvent || !this.itemRender) return
		const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)
		const { x: startEventX } = this.gantt.stage.point(this.startEvent.clientX, this.startEvent.clientY)
		const diffX = (eventX - startEventX)
		this.itemRender.g.hide()
		this.createTmpItem()
		if (!this.tmpItem) return
		const operateType = start ? 'left-resize' : 'right-resize'
		this.caculateTmpItemFinalX(diffX, operateType)

		this.fixOutOfEdge(operateType)

		this.tmpItem.render()
		this.tmpItem.svgjsInstance.rightResize?.show()
		this.tmpItem.svgjsInstance.leftResize?.show()
		this.gantt.status.eventResizing = true
		document.body.style.cursor = 'ew-resize'
	}

	updateEventItem(eventOrId: _GanttEventItem | string, newData: DeepPartial<Omit<_GanttEventItem | GanttEventItem, 'id'>>, needRender = true) {

		const isDuration = this.gantt.options.mode === GanttMode.Duration

		if (newData.start != void 0 && !dayjs.isDayjs(newData.start)) {
			newData.start = formatDataTimeToDayjs(newData.start, isDuration)
		}

		if (newData.end != void 0 && !dayjs.isDayjs((newData.end))) {
			newData.end = formatDataTimeToDayjs(newData.end, isDuration)
		}

		let listEvent: _GanttEventItem | undefined = void 0
		if (typeof eventOrId === 'string') {
			listEvent = this.gantt.list.find(row => row.events.find(e => e.id === eventOrId))?.events.find(e => e.id === eventOrId)
		} else {
			listEvent = eventOrId
		}

		if (listEvent) {
			const optionDataEvent = this.findOptionDataEvent(listEvent)
			Object.assign(listEvent, newData)
			optionDataEvent && Object.assign(optionDataEvent, {
				...newData,
				...this.formatEventDataTime(newData)
			})
			needRender && this.map.get(listEvent)?.render()
		}
	}

	formatEventDataTime(newData: DeepPartial<Omit<_GanttEventItem, 'id'>>) {
		const isDuration = this.gantt.options.mode === GanttMode.Duration
		const timeObj: {
			start?: GanttEventItemTime
			end?: GanttEventItemTime
		} = {}

		if (newData?.start != void 0) {
			timeObj.start = isDuration ? this.gantt.time.dayjs2duration(newData.start as Dayjs) : this.gantt.options.format.eventItemTime(newData.start as Dayjs)
		}

		if (newData?.end != void 0) {
			timeObj.end = isDuration ? this.gantt.time.dayjs2duration(newData.end as Dayjs) : this.gantt.options.format.eventItemTime(newData.end as Dayjs)
		}
		return timeObj
	}

	onTypeResizeMouseUp() {
		if (!this.startEvent || !this.itemRender || !this.tmpItem) return

		const newEventData = cloneDeep(this.tmpItem.options.event)

		if (newEventData.start.isAfter(newEventData.end)) {
			const end = newEventData.end
			newEventData.end = newEventData.start
			newEventData.start = end
		}

		this.updateEventItem(this.itemRender.options.event, {
			start: newEventData.start,
			end: newEventData.end
		}, false)

		this.startEvent = null
		this.tmpItem?.destroy()
		this.tmpItem = null
		this.itemRender.g.show()
		this.itemRender.render()
		this.itemRender = null
		this.gantt.status.eventResizing = false
		document.body.style.cursor = 'auto'
	}

	fixOutOfEdge(type: EventItemOperateType) {
		if (!this.itemRender) return
		if (!this.gantt.options.action.enableMoveOrResizeOutOfEdge) {
			if (!this.tmpItem) return
			const { start, end } = this.itemRender.options.event
			const diff = end.diff(start)

			if (this.tmpItem.options.event.start.isBefore(this.gantt.time.startTime)) {
				if (type === 'left-resize' || type === 'body-move') {
					this.tmpItem.options.event.start = this.gantt.time.startTime.clone()
				}
				if (type == 'body-move') {
					this.tmpItem.options.event.end = this.tmpItem.options.event.start.add(diff, 'millisecond')
				}
			}

			const lastTime = this.gantt.time.stageWidthTime()

			if (this.tmpItem.options.event.start.isAfter(lastTime)) {
				this.tmpItem.options.event.start = lastTime.clone()
			}

			if (this.tmpItem.options.event.end.isAfter(lastTime)) {
				if (type === 'right-resize' || type === 'body-move') {
					this.tmpItem.options.event.end = lastTime.clone()
				}
				if (type == 'body-move') {
					this.tmpItem.options.event.start = this.tmpItem.options.event.end.subtract(diff, 'millisecond')
				}
			}

			if (this.tmpItem.options.event.end.isBefore(this.gantt.time.startTime)) {
				this.tmpItem.options.event.end = this.gantt.time.startTime.clone()
			}

		}
	}

	onTypeBodyMoveMouseMove(event: MouseEvent) {
		if (!this.startEvent || !this.itemRender) return
		const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)
		const { x: startEventX } = this.gantt.stage.point(this.startEvent.clientX, this.startEvent.clientY)
		let diffX = (eventX - startEventX)

		this.itemRender.g.hide()

		this.createTmpItem()
		this.caculateTmpItemFinalX(diffX, 'body-move')

		this.fixOutOfEdge('body-move')

		this.tmpItem?.render()
		this.tmpItem?.svgjsInstance.rightResize?.show()
		this.tmpItem?.svgjsInstance.leftResize?.show()
		this.gantt.status.eventMoving = true
	}

	onTypeBodyMoveMouseUp() {
		if (!this.startEvent || !this.itemRender || !this.tmpItem) return

		const newEventData = cloneDeep(this.tmpItem.options.event)

		if (newEventData.start.isAfter(newEventData.end)) {
			const end = newEventData.end
			newEventData.end = newEventData.start
			newEventData.start = end
		}

		this.updateEventItem(this.itemRender.options.event, {
			start: newEventData.start,
			end: newEventData.end
		}, false)

		this.startEvent = null
		this.tmpItem?.destroy()
		this.tmpItem = null
		this.itemRender.g.show()
		this.itemRender.render()
		this.itemRender = null
		this.gantt.status.eventMoving = false
	}
}
