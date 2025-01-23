import { G, Rect } from "@svgdotjs/svg.js";
import Gantt from "..";
import { PartRender } from "./index";
import { Render } from "../render";

export class TicksRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	render() {
		const gClassName = 'ticks'
		const g = this.gantt.stage.find(`.${gClassName}`)[0] || new G().addClass(gClassName)
		const ticks = this.gantt.time.ticks
		ticks.forEach((tick, index) => {
			const x = index * this.gantt.options.column.width
			const y = this.gantt.options.header.height
			const idClassName = `tick-id-${index}-${tick.time.valueOf()}`
			const rectClassName = `tick-item`

			const rect = g.find(`.${idClassName}.${rectClassName}`)[0] || new Rect().addClass(rectClassName).addClass(idClassName)

			rect.size(0.2, this.gantt.stage.height()).fill('#86909c').move(x, y)
			if (index === 0 || index === ticks.length - 1) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}
}
