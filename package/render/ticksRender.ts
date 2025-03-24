import { G, Rect, Text } from "@svgdotjs/svg.js";
import Gantt, { GanttMode } from "../index";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { Dayjs } from "dayjs";

export class TicksRender extends PartRender {
	g: G | null = null
	gText: G | null = null
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}


	renderTickItem(tickTime: Dayjs, index: number, idPrefix = `tick-time-id-`, preTickId = '', g?: G, textG?: G) {
		if (!g) {
			g = this.g!
		}
		if (!textG) {
			textG = this.gText!
		}

		const x = this.gantt.time.time2x(tickTime)
		const y = this.gantt.options.header.height
		const idClassName = `${idPrefix}-${index}`
		const rect = g.find(`.${idClassName}.${CssNameKey.tick_item}`)[0] || new Rect().addClass(CssNameKey.tick_item).addClass(idClassName)

		rect.size(0.2, this.gantt.stage.height()).move(x, y)
		if (index === 0 || index === this.gantt.time.ticks - 1) {
			if (this.gantt.options.mode !== GanttMode.Duration) {
				rect.opacity(0)
			}
		}

		rect.addTo(g)
		let text = null
		if (textG) {
			const newText = this.renderer.header.renderTimeTickText(
				() => (textG.find(`.${idClassName}.${CssNameKey.header_tick_text}`)[0] || new Text().addClass(CssNameKey.header_tick_text).addClass(idClassName)) as Text,
				tickTime,
				textG,
				() => textG.find(`.${preTickId}.${CssNameKey.header_tick_text}`)[0] as Text,
				preTickId
			)
			text = newText
		}

		return {
			idClassName,
			text,
			rect
		}
	}


	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.ticks}`)[0] || new G().addClass(CssNameKey.ticks)) as G
		const gText = (this.gantt.stage.find(`.${CssNameKey.ticks_text_group}`)[0] || new G().addClass(CssNameKey.ticks_text_group)) as G
		this.gText = gText
		this.g = g
		const ticksIterator = this.gantt.time.getTicksIterator()
		let preTickId = ''
		for (const tickItem of ticksIterator) {
			const { tickTime, index } = tickItem
			const { idClassName, text, rect } = this.renderTickItem(tickTime, index, `tick-id-`, preTickId, g, gText)
			if (!this.gantt.options.view.showTicks) {
				rect?.hide()
			}

			if (!this.gantt.options.view.showTickText) {
				text?.opacity(0)
			}

			if (text) {
				preTickId = idClassName
				text.addTo(gText)
			}

		}
		if (!this.gantt.stage.has(g)) g.addTo(this.gantt.stage)
	}

	clear() {
		this.g?.clear()
		this.gText?.clear()
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.ticks}`)[0]
		g?.remove()
	}
}
