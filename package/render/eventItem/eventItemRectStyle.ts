import { CssNameKey } from "#/const/const";
import { Circle, G, Rect, SVG } from "@svgdotjs/svg.js";
import { EventItemRender, getStartAndEndTime } from "./eventItemRender";

export class EventItemRectStyle extends EventItemRender {
	renderItem(): void {
		const { event, index } = this.options
		const { start, end } = getStartAndEndTime(event)

		const rect = (this.g.find(`.${CssNameKey.event_body}`)[0] || new Rect().addClass(CssNameKey.event_body)) as Rect
		const width = this.renderer.getWidthByTwoTime(start, end)
		const x = this.renderer.getXbyTime(start)
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height / 4)

		const height = this.gantt.options.row.height / 2
		rect.size(width, height)
			.move(x, y).radius(5)
		rect.addTo(this.g)
		if (event.color) {
			rect.fill(event.color)
		}
		const textG = (this.g.find(`.${CssNameKey.event_text_g}`)[0] || new G().addClass(CssNameKey.event_text_g)) as G
		const foreignObject = textG.find(`.${CssNameKey.event_text}`)[0] || textG.foreignObject(width, height).addClass(CssNameKey.event_text)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.clear()
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600;">${event.name}</div>`, true))
		foreignObject.move(x, y)
		textG.addTo(this.g)
	}
}
