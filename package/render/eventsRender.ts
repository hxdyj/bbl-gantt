import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";

export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	renderViewAnchor(parent: Element, event: _GanttEventItem, index: number) {
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Element
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).opacity(0)
		anchor.addTo(parent)
	}

	renderRect(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		const _g = (g.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item).addClass(CssNameKey.event_style_rect) as G

		this.renderViewAnchor(_g, event, index)

		const rect = (_g.find(`.${CssNameKey.event_style_rect_bar}`)[0] || new Rect().addClass(CssNameKey.event_style_rect_bar)) as Rect
		const width = this.renderer.getWidthByTwoTime(event.start, event.end)
		const x = this.renderer.getXbyTime(event.start)
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height / 4)

		const height = this.gantt.options.row.height / 2
		rect.size(width, height)
			.move(x, y).radius(5)
		rect.addTo(_g)

		const foreignObject = _g.find(`.${CssNameKey.event_text}`)[0] || _g.foreignObject(width, height).addClass(CssNameKey.event_text)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;color:white;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600">${event.name}</div>`, true))
		foreignObject.move(x, y)
		_g.addTo(g)
	}

	renderLine(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		const _g = (g.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item).addClass(CssNameKey.event_style_line) as G

		this.renderViewAnchor(_g, event, index)

		const rect = (_g.find(`.${CssNameKey.event_style_line_line}`)[0] || new Rect().addClass(CssNameKey.event_style_line_line)) as Rect
		const width = this.renderer.getWidthByTwoTime(event.start, event.end)
		const x = this.renderer.getXbyTime(event.start)
		const height = 4
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height - height) / 2

		const r = 4
		const circleLeft = (_g.find(`.${CssNameKey.event_style_line_circle_left}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_left)) as Circle
		const circleRight = (_g.find(`.${CssNameKey.event_style_line_circle_right}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_right)) as Circle

		rect.size(width - 2 * r, height)
			.move(x + r, y)
		rect.addTo(_g)

		circleLeft.cx(x + r).cy(y + r / 2).radius(r)
		circleRight.cx(circleLeft.cx() + parseFloat(rect.width() + '')).cy(circleLeft.cy()).radius(r)
		circleLeft.addTo(_g)
		circleRight.addTo(_g)

		const foreignObject = _g.find(`.${CssNameKey.event_text}`)[0] || _g.foreignObject(width, height).addClass(CssNameKey.event_text)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600">${event.name}</div>`, true))
		foreignObject.move(x + 3, y - 12)
		_g.addTo(g)
	}

	renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		this.renderLine(event, index, eventIndex, g)
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
	}
}
