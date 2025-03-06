import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender } from "./eventItem/eventItemRender";
import { EventItemLineStyle } from "./eventItem/eventItemLineStyle";
import { EventItemRectStyle } from "./eventItem/eventItemRectStyle";
import { cloneDeep } from "lodash-es";
import { EventBusEventName } from "../event/const";
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



export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis([
			'onEventItemBodyMouseDown',
			'onContainerMouseMove',
			'onContainerMouseUp',
			'onContainerMouseLeave',
			'onEventItemLeftResizeMouseDown',
			'onEventItemRightResizeMouseDown'
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



	private startEvent: MouseEvent | null = null
	private itemRender: EventItemRender | null = null

	private tmpItem: EventItemRender | null = null

	private operateType: 'left-resize' | 'right-resize' | 'body-move' | null = null

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
		this.operateType = 'body-move'
		const { event, itemRender } = args
		this.startEvent = event
		this.itemRender = itemRender
	}




	onContainerMouseMove(event: MouseEvent) {
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

	onTypeResizeMouseMove(event: MouseEvent, start = false) {
		if (!this.startEvent || !this.itemRender) return
		const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)
		const { x: startEventX } = this.gantt.stage.point(this.startEvent.clientX, this.startEvent.clientY)
		const diffX = (eventX - startEventX)
		this.itemRender.g.hide()

		this.createTmpItem()

		if (!this.tmpItem) return
		if (start) {
			this.tmpItem.options.event.start = this.itemRender.options.event.start.add(this.gantt.time.length2milliseconds(diffX), 'millisecond')
		} else {
			this.tmpItem.options.event.end = this.itemRender.options.event.end.add(this.gantt.time.length2milliseconds(diffX), 'millisecond')
		}
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

		const newX = (eventX - startEventX)
		// if (Math.abs(newX) < 5) {
		// 	return console.warn('move too small, less than 5px')
		// }

		this.itemRender.g.hide()

		this.createTmpItem()

		this.tmpItem?.g.transform({
			translate: [newX, 0]
		})
		this.gantt.status.eventMoving = true
	}

	onTypeBodyMoveMouseUp() {
		if (!this.startEvent || !this.itemRender) return
		const { translateX = 0 } = this.tmpItem?.g.transform() || {}
		const anchor = this.itemRender.g.find(`.${CssNameKey.event_anchor}`)[0]
		const oldX = parseFloat(anchor.x().toString())
		const newX = oldX + translateX
		const newTime = this.gantt.time.x2time(newX)

		const { start, end } = this.itemRender.options.event
		const diffTime = end.valueOf() - start.valueOf()
		this.itemRender.options.event.start = newTime
		this.itemRender.options.event.end = newTime.add(diffTime, 'millisecond')
		this.startEvent = null
		this.tmpItem?.destroy()
		this.tmpItem = null
		this.itemRender.g.show()
		this.itemRender.render()
		this.itemRender = null
		this.gantt.status.eventMoving = false
	}
}
