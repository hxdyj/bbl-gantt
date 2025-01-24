import { G, Rect } from "@svgdotjs/svg.js";
import Gantt from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";

export class TicksRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	render() {
		const g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] || new G().addClass(CssNameKey.ticks)
		const ticks = this.gantt.time.ticks
		ticks.forEach((tick, index) => {
			const x = index * this.gantt.options.column.width
			const y = this.gantt.options.header.height
			const idClassName = `tick-id-${index}-${tick.time.valueOf()}`

			const rect = g.find(`.${idClassName}.${CssNameKey.tick_item}`)[0] || new Rect().addClass(CssNameKey.tick_item).addClass(idClassName)

			rect.size(0.2, this.gantt.stage.height()).move(x, y)
			if (index === 0 || index === ticks.length - 1) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0]
		g?.remove()
	}
}
