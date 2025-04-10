import { CssNameKey } from "../../const/const";
import { Circle, Rect, SVG } from "@svgdotjs/svg.js";
import { EventItemRender, getStartAndEndTime } from "./eventItemRender";




export class EventItemLineStyle extends EventItemRender {
	renderItem(): void {
		const { event, index } = this.options
		const { start, end } = getStartAndEndTime(event)
		const rect = (this.g.find(`.${CssNameKey.event_body}`)[0] || new Rect().addClass(CssNameKey.event_body)) as Rect
		const width = this.renderer.getWidthByTwoTime(start, end)
		const x = this.renderer.getXbyTime(start)
		const height = 4
		const y = this.renderer.getYbyIndex(index) + (this.gantt.options.row.height - height) / 2

		const r = 4
		const circleLeft = (this.g.find(`.${CssNameKey.event_style_line_circle_left}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_left)) as Circle
		const circleRight = (this.g.find(`.${CssNameKey.event_style_line_circle_right}`)[0] || new Circle().addClass(CssNameKey.event_style_line_circle_right)) as Circle
		let rectWidth = width - 2 * r
		if (rectWidth < 0) rectWidth = 0
		rect.size(rectWidth, height)
			.move(x + r, y)
		rect.addTo(this.g)

		circleLeft.cx(x + r).cy(y + r / 2).radius(r)
		circleRight.cx(circleLeft.cx() + parseFloat(rect.width() + '')).cy(circleLeft.cy()).radius(r)
		circleLeft.addTo(this.g)
		circleRight.addTo(this.g)
		if (event.color) {
			rect.fill(event.color)
			circleLeft.fill(event.color)
			circleRight.fill(event.color)
		}

		let textColor = ''
		if (event.textColor) {
			textColor = `color:${event.textColor};`
		}
		const foreignObjectHeight = 10
		const foreignObject = this.g.find(`.${CssNameKey.event_text}`)[0] || this.g.foreignObject(width, foreignObjectHeight).addClass(CssNameKey.event_text)
		foreignObject.width(width)
		foreignObject.height(foreignObjectHeight)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		foreignObject.clear()
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;overflow:hidden;white-space:nowrap;${textColor}">${event.name}</div>`, true))
		foreignObject.move(x + 3, y - foreignObjectHeight - 6)
	}
}
