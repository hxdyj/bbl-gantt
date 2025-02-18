import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender } from "./eventItem/eventItemRender";
import { EventItemLineStyle } from "./eventItem/eventItemLineStyle";
import { EventItemRectStyle } from "./eventItem/eventItemRectStyle";
import { cloneDeep } from "lodash-es";
import { EventBusEventName } from "#/event/const";
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
		this.bindEventThis(['onEventItemBodyMouseDown', 'onContainerMouseMove', 'onContainerMouseUp', 'onContainerMouseLeave'])
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
		this.gantt.container.addEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.addEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.addEventListener('mouseleave', this.onContainerMouseLeave)
	}

	unbindEvent() {
		this.gantt.off(EventBusEventName.event_item_body_mouse_down, this.onEventItemBodyMouseDown)
		this.gantt.container.removeEventListener('mousemove', this.onContainerMouseMove)
		this.gantt.container.removeEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.removeEventListener('mouseleave', this.onContainerMouseLeave)

	}



	private startEvent: MouseEvent | null = null
	private itemRender: EventItemRender | null = null

	private tmpItem: EventItemRender | null = null

	onEventItemBodyMouseDown(args: {
		event: MouseEvent,
		itemRender: EventItemRender
	}) {
		if (this.gantt.status.eventMoving) {
			this.onContainerMouseUp()
			return
		}
		const { event, itemRender } = args
		this.startEvent = event
		this.itemRender = itemRender
	}

	onContainerMouseMove(event: MouseEvent) {
		if (event.button === 0) {
			if (!this.startEvent || !this.itemRender) return
			this.itemRender.g.hide()

			const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)
			const { x: startEventX } = this.gantt.stage.point(this.startEvent.clientX, this.startEvent.clientY)

			const newX = (eventX - startEventX)
			if (!this.tmpItem) {
				//@ts-ignore
				const cls = this.itemRender.__proto__.constructor
				const options = cloneDeep(this.itemRender.options)
				options.event.id = `tmp-${options.event.id}`
				options.bindEvent = false
				this.tmpItem = new cls(this.gantt, this.renderer, options)
			}

			this.tmpItem?.g.transform({
				translate: [newX, 0]
			})
			this.gantt.status.eventMoving = true
		}
	}

	onContainerMouseUp() {

		if (!this.startEvent || !this.itemRender || !this.tmpItem) return
		const { translateX = 0 } = this.tmpItem.g.transform()
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
}
