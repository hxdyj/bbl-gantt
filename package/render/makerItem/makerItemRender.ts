import { Render } from "../../render"
import Gantt, { CssNameKey, GanttMakerItem } from "../../index"
import { SVG } from "@svgdotjs/svg.js"
import dayjs, { Dayjs } from "dayjs"
import { clamp } from "lodash-es"

const PARTS = ['header', 'tick'] as const
export type MakerItemPartType = (typeof PARTS)[number]
export type MakerItemRenderOptions = {
	parts: MakerItemPartType[]
}
export class MakerItemRender {
	time: Dayjs
	x: number
	constructor(public gantt: Gantt, public renderer: Render, public data: GanttMakerItem) {
		this.time = dayjs(this.data.time)
		this.x = this.gantt.time.time2x(this.time)
	}

	getClassPrefix() {
		return `${CssNameKey.maker_item}-${this.data.id}`
	}

	render(options?: MakerItemRenderOptions) {
		const { parts = PARTS } = options || {}
		if (parts.includes('header')) {
			this.renderMakerHeaderPart()
		}
		if (parts.includes('tick')) {
			this.renderMakerTickPart()
		}
	}

	private renderMakerHeaderPart() {
		const svg = SVG(this.data.svg)
		const originHeight = svg.height().valueOf() as number
		const originWidth = svg.width().valueOf() as number
		let height = clamp(originHeight.valueOf() as number, 15, this.gantt.options.header.height * 0.33)
		let width = originWidth / originHeight * height
		const x = this.x - width / 2
		const clampX = clamp(x, 0, this.gantt.body.clientWidth - width)
		svg.size(width, height).move(clampX, this.gantt.options.header.height - height)
		this.renderer.header.g?.add(svg)
	}

	private renderMakerTickPart() {
		this.renderer.ticks.renderTickItem({
			tickTime: this.time,
			index: -1,
			source: 'maker',
			idPrefix: this.getClassPrefix() + '-tick',
			tickItemOptions: this.data.options?.tick
		})
	}

	destroy() {
	}
}
