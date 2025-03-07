import { G, Rect, Text } from "@svgdotjs/svg.js";
import Gantt, { GanttMode } from "../index";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { Dayjs } from "dayjs";

export class TicksRender extends PartRender {
	gText: G | null = null
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}


	renderTickItem(tickTime: Dayjs, index: number, g?: G, preTickId = '') {
		if (!g) {
			g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] as G
		}

		const x = this.gantt.time.time2x(tickTime)
		const y = this.gantt.options.header.height
		const idClassName = `tick-id-${index}-${tickTime.valueOf()}`
		const rect = g.find(`.${idClassName}.${CssNameKey.tick_item}`)[0] || new Rect().addClass(CssNameKey.tick_item).addClass(idClassName)

		rect.size(0.2, this.gantt.stage.height()).move(x, y)
		if (index === 0 || index === this.gantt.time.ticks - 1) {
			if (this.gantt.options.mode !== GanttMode.Duration) {
				rect.opacity(0)
			}
		}

		rect.addTo(g)

		const text = this.renderer.header.renderTimeTickText(
			() => (g.find(`.${idClassName}.${CssNameKey.header_tick_text}`)[0] || new Text().addClass(CssNameKey.header_tick_text).addClass(idClassName)) as Text,
			tickTime,
			g,
			() => g.find(`.${preTickId}.${CssNameKey.header_tick_text}`)[0] as Text,
			preTickId
		)

		return {
			idClassName,
			text
		}
	}




	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] || new G().addClass(CssNameKey.ticks)) as G
		const gText = (this.gantt.stage.find(`.${CssNameKey.ticks_text_group}`)[0] || new G().addClass(CssNameKey.ticks_text_group)) as G
		this.gText = gText

		if (this.gantt.options.view.showTicks) {
			const ticksIterator = this.gantt.time.getTicksIterator()
			let preTickId = ''
			for (const tickItem of ticksIterator) {
				const { tickTime, index } = tickItem
				if (this.gantt.options.view.showTickText) {
					const { idClassName, text } = this.renderTickItem(tickTime, index, gText, preTickId)
					if (text) {
						preTickId = idClassName
						text.addTo(gText)
					}
				}
			}
		}
		g.addTo(this.gantt.stage)
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0]
		g?.remove()
	}
}
