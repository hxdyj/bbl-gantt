import { Circle, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";

export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	renderRect(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		const id = `event-item-${index}-${eventIndex}`
		const _g = (g.find(`.${id}`)[0] || new G().addClass(id)) as G
		const rect = (_g.find('rect')[0] || new Rect().addClass('event-item')) as Rect
		const width = this.renderer.getWidthByTwoTime(event.start, event.end)
		const x = this.renderer.getXbyTime(event.start)
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height / 4)

		const height = this.gantt.options.row.height / 2
		rect.size(width, height).fill('#165DFF')
			.move(x, y).radius(5)
		rect.addTo(_g)
		const textClassName = 'event-text'
		const foreignObject = _g.find(`.${textClassName}`)[0] || _g.foreignObject(width, height).addClass(textClassName)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;color:white;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600">${event.name}</div>`, true))
		foreignObject.move(x, y)
		_g.addTo(g)
	}

	renderLine(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		const id = `event-item-${index}-${eventIndex}`
		const _g = (g.find(`.${id}`)[0] || new G().addClass(id)) as G
		const rect = (_g.find('rect')[0] || new Rect().addClass('event-item')) as Rect
		const width = this.renderer.getWidthByTwoTime(event.start, event.end)
		const x = this.renderer.getXbyTime(event.start)
		const height = 4
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height - height) / 2

		const r = 4
		const circleLeftClassName = 'event-circle-left'
		const circleRightClassName = 'event-circle-right'
		const circleLeft = (_g.find(`.${circleLeftClassName}`)[0] || new Circle().addClass(circleLeftClassName)) as Circle
		const circleRight = (_g.find(`.${circleRightClassName}`)[0] || new Circle().addClass(circleRightClassName)) as Circle

		rect.size(width - 2 * r, height).fill('#165DFF')
			.move(x + r, y)
		rect.addTo(_g)

		circleLeft.cx(x + r).cy(y + r / 2).radius(r).fill('#165DFF')
		circleRight.cx(circleLeft.cx() + parseFloat(rect.width() + '')).cy(circleLeft.cy()).radius(r).fill('#165DFF')
		circleLeft.addTo(_g)
		circleRight.addTo(_g)

		const textClassName = 'event-text'
		const foreignObject = _g.find(`.${textClassName}`)[0] || _g.foreignObject(width, height).addClass(textClassName)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;color:#165DFF;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600">${event.name}</div>`, true))
		foreignObject.move(x + 3, y - 12)
		_g.addTo(g)
	}

	renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		this.renderLine(event, index, eventIndex, g)
	}

	render() {
		const gClassName = 'events'
		const g = (this.gantt.stage.find(`.${gClassName}`)[0] || new G().addClass(gClassName)) as G
		const rows = this.gantt.list
		rows.forEach((row, index) => {
			row.events.forEach((event, eventIndex) => {
				this.renderEvent(event, index, eventIndex, g)
			})
		})
		g.addTo(this.gantt.stage)
	}
}
