import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender, getStartAndEndTime } from "./eventItem/eventItemRender";
import { EventItemLineStyle } from "./eventItem/eventItemLineStyle";
import { EventItemRectStyle } from "./eventItem/eventItemRectStyle";
import { cloneDeep } from "lodash-es";
import { EventBusEventName } from "../event/const";
import dayjs, { Dayjs } from "dayjs";
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


export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis([
			'onEventItemBodyMouseDown',
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
			this.map.get(event)?.render()
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
		}
	}


	bindEvent() {
		this.gantt.on(EventBusEventName.event_item_body_mouse_down, this.onEventItemBodyMouseDown)
		this.gantt.on(EventBusEventName.event_item_left_resize_mouse_down, this.onEventItemLeftResizeMouseDown)
		this.gantt.on(EventBusEventName.event_item_right_resize_mouse_down, this.onEventItemRightResizeMouseDown)
		this.gantt.container.addEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.addEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.addEventListener('mouseleave', this.onContainerMouseLeave)
	}

	unbindEvent() {
		this.gantt.off(EventBusEventName.event_item_body_mouse_down, this.onEventItemBodyMouseDown)
		this.gantt.off(EventBusEventName.event_item_left_resize_mouse_down, this.onEventItemLeftResizeMouseDown)
		this.gantt.off(EventBusEventName.event_item_right_resize_mouse_down, this.onEventItemRightResizeMouseDown)
		this.gantt.container.removeEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.removeEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.removeEventListener('mouseleave', this.onContainerMouseLeave)

	}

	private mouseDownTime: number = 0

	private startEvent: MouseEvent | null = null
	private itemRender: EventItemRender | null = null

	private tmpItem: EventItemRender | null = null

	private operateType: EventItemOperateType | null = null

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

	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.events}`)[0] || new G().addClass(CssNameKey.events)) as G
		const rows = this.gantt.list
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

	private findNearTick(diffX: number, currentTime: Dayjs) {
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
		this.caculateTmpItemFinalX(diffX, start ? 'left-resize' : 'right-resize')
		this.tmpItem.render()
		this.tmpItem.svgjsInstance.rightResize?.show()
		this.tmpItem.svgjsInstance.leftResize?.show()
		this.gantt.status.eventResizing = true
		document.body.style.cursor = 'ew-resize'
	}

	onTypeResizeMouseUp() {
		if (!this.startEvent || !this.itemRender || !this.tmpItem) return

		const newEventData = cloneDeep(this.tmpItem.options.event)

		if (newEventData.start.isAfter(newEventData.end)) {
			const end = newEventData.end
			newEventData.end = newEventData.start
			newEventData.start = end
		}

		this.itemRender.options.event.start = newEventData.start
		this.itemRender.options.event.end = newEventData.end

		this.startEvent = null
		this.tmpItem?.destroy()
		this.tmpItem = null
		this.itemRender.g.show()
		this.itemRender.render()
		this.itemRender = null
		this.gantt.status.eventResizing = false
		document.body.style.cursor = 'auto'
	}


	onTypeBodyMoveMouseMove(event: MouseEvent) {
		if (!this.startEvent || !this.itemRender) return
		const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)
		const { x: startEventX } = this.gantt.stage.point(this.startEvent.clientX, this.startEvent.clientY)
		let diffX = (eventX - startEventX)

		this.itemRender.g.hide()

		this.createTmpItem()
		this.caculateTmpItemFinalX(diffX, 'body-move')

		if (!this.gantt.options.action.enableMoveOrResizeOutOfEdge) {
			if (!this.tmpItem) return
			const { start, end } = this.itemRender.options.event
			const diff = end.diff(start)

			if (this.tmpItem.options.event.start.isBefore(this.gantt.time.startTime)) {
				this.tmpItem.options.event.start = this.gantt.time.startTime.clone()
				this.tmpItem.options.event.end = this.tmpItem.options.event.start.add(diff, 'millisecond')
			}

			const lastTime = this.gantt.time.stageWidthTime()

			if (this.tmpItem.options.event.end.isAfter(lastTime)) {
				this.tmpItem.options.event.end = lastTime
				this.tmpItem.options.event.start = this.tmpItem.options.event.end.subtract(diff, 'millisecond')
			}
		}

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

		this.itemRender.options.event.start = newEventData.start
		this.itemRender.options.event.end = newEventData.end

		this.startEvent = null
		this.tmpItem?.destroy()
		this.tmpItem = null
		this.itemRender.g.show()
		this.itemRender.render()
		this.itemRender = null
		this.gantt.status.eventMoving = false
	}
}
