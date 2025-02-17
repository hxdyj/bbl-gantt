import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender } from "./eventItem/eventItemRender";
import { EventItemLineStyle } from "./eventItem/eventItemLineStyle";
import { EventItemRectStyle } from "./eventItem/eventItemRectStyle";
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
}



export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
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
	}
}
