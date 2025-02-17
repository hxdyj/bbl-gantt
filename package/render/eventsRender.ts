import { Circle, Element, G, Rect, SVG } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
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
	callback?: (options: RenderItemCallbackOptions) => void
}

export type RenderItemCallbackOptions = Omit<RenderItemOptions, 'callback'> & {
	g: G,
	context: EventsRender
}

export class EventsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	renderViewAnchor(parent: Element, event: _GanttEventItem, index: number) {
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Element
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).opacity(0)
		anchor.addTo(parent)
	}


	renderItem(options: RenderItemOptions) {
		const { event, index, addTo, gClassName, bodyClassName, callback } = options
		const g = (addTo.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item) as G
		gClassName && g.addClass(gClassName)
		this.renderViewAnchor(g, event, index)
		callback?.({
			...options,
			g,
			context: this
		})
		const body = g.find(`.${CssNameKey.event_body}`)[0]
		if (body) {
			body.addClass(CssNameKey.event_body)
			if (bodyClassName) {
				body.addClass(bodyClassName)
			}
		}
		g.addTo(addTo)
	}

	renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G) {
		if (!event.shape || event.shape === EventShapeType.rect) {
			this.renderItem({
				event,
				index,
				eventIndex,
				addTo: g,
				gClassName: CssNameKey.event_style_rect,
				bodyClassName: CssNameKey.event_style_rect_bar,
				callback: renderRect
			})
		}

		if (event.shape === EventShapeType.line) {
			this.renderItem({
				event,
				index,
				eventIndex,
				addTo: g,
				gClassName: CssNameKey.event_style_line,
				bodyClassName: CssNameKey.event_style_line_line,
				callback: renderLine
			})
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
	}
}



export function renderRect(options: RenderItemCallbackOptions) {
	const { event, index, g, context } = options
	const rect = (g.find(`.${CssNameKey.event_body}`)[0] || new Rect()) as Rect
	const width = context.renderer.getWidthByTwoTime(event.start, event.end)
	const x = context.renderer.getXbyTime(event.start)
	const y = context.renderer.getYbyIndex(index) + (context.gantt.options.row.height / 4)

	const height = context.gantt.options.row.height / 2
	rect.size(width, height)
		.move(x, y).radius(5)
	rect.addTo(g)
	if (event.color) {
		rect.fill(event.color)
	}
	const textG = (g.find(`.${CssNameKey.event_text_g}`)[0] || new G().addClass(CssNameKey.event_text_g)) as G
	const foreignObject = textG.find(`.${CssNameKey.event_text}`)[0] || textG.foreignObject(width, height).addClass(CssNameKey.event_text)
	foreignObject.attr({
		style: 'overflow:visible;'
	})
	foreignObject.clear()
	foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600;">${event.name}</div>`, true))
	foreignObject.move(x, y)
	textG.addTo(g)
}

export function renderLine(options: RenderItemCallbackOptions) {
	const { event, index, g, context } = options
	const rect = (g.find(`.${CssNameKey.event_body}`)[0] || new Rect()) as Rect
	const width = context.renderer.getWidthByTwoTime(event.start, event.end)
	const x = context.renderer.getXbyTime(event.start)
	const height = 4
	const y = context.renderer.getYbyIndex(index) + (context.gantt.options.row.height - height) / 2

	const r = 4
	const circleLeft = (g.find(`.${CssNameKey.event_style_line_circle_left}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_left)) as Circle
	const circleRight = (g.find(`.${CssNameKey.event_style_line_circle_right}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_right)) as Circle

	rect.size(width - 2 * r, height)
		.move(x + r, y)
	rect.addTo(g)

	circleLeft.cx(x + r).cy(y + r / 2).radius(r)
	circleRight.cx(circleLeft.cx() + parseFloat(rect.width() + '')).cy(circleLeft.cy()).radius(r)
	circleLeft.addTo(g)
	circleRight.addTo(g)

	if (event.color) {
		rect.fill(event.color)
		circleLeft.fill(event.color)
		circleRight.fill(event.color)
	}

	let textColor = ''
	if (event.textColor) {
		textColor = `color:${event.textColor};`
	}

	const foreignObject = g.find(`.${CssNameKey.event_text}`)[0] || g.foreignObject(width, height).addClass(CssNameKey.event_text)
	foreignObject.attr({
		style: 'overflow:visible;'
	})
	foreignObject.clear()
	foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600;${textColor}">${event.name}</div>`, true))
	foreignObject.move(x + 3, y - 12)
}
