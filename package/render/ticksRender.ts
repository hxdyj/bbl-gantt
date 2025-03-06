import { G, Rect } from "@svgdotjs/svg.js";
import Gantt, { GanttMode } from "../index";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { Dayjs } from "dayjs";

export class TicksRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}


	renderTickItem(tickTime: Dayjs, index: number, g?: G) {
		if (!g) {
			g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] as G
		}

		const x = this.gantt.time.time2x(tickTime)
		const y = this.gantt.options.header.height
		const idClassName = `tick-id-${index}-${tickTime.valueOf()}`
		const rect = g.find(`.${idClassName}.${CssNameKey.tick_item}`)[0] || new Rect().addClass(CssNameKey.tick_item).addClass(idClassName)

		rect.size(0.2, this.gantt.stage.height()).move(x, y)
		if (index === 0 || index === this.gantt.time.ticks - 1) {
			// if (this.gantt.options.mode !== GanttMode.Duration) {
			// }
			rect.opacity(0)
		}
		rect.addTo(g)
	}

	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] || new G().addClass(CssNameKey.ticks)) as G
		if (this.gantt.options.mode !== GanttMode.Duration) {
			const ticksIterator = this.gantt.time.getTicksIterator()
			for (const tickItem of ticksIterator) {
				const { tickTime, index } = tickItem
				this.renderTickItem(tickTime, index, g)
			}
		}
		g.addTo(this.gantt.stage)
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0]
		g?.remove()
	}
}
