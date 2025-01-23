import { G, Rect } from "@svgdotjs/svg.js";
import Gantt from "..";
import { PartRender } from "./index";
import { Render } from "../render";

export class RowsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	render() {
		const gClassName = 'rows'
		const g = this.gantt.stage.find(`.${gClassName}`)[0] || new G().addClass(gClassName)
		const rows = this.gantt.list
		rows.forEach((row, index) => {

			if (row.bg) {
				const bgClassName = `row-bg-${index}`
				const bgRect = g.find(`.${bgClassName}`)[0] || new Rect().addClass(bgClassName).addClass(row.bg)
				bgRect.size(this.gantt.stage.width(), this.gantt.options.row.height).move(0, this.renderer.getYbyIndex(index)).opacity(0.5)
				bgRect.addTo(g)
			}

			const y = this.renderer.getYbyIndex(index)

			const rowIdClassName = `row-id-${index}`
			const rectClassName = `row-line`
			const rect = g.find(`.${rectClassName}.${rowIdClassName}`)[0] || new Rect().addClass(rectClassName).addClass(rowIdClassName)

			rect.size(this.gantt.stage.width(), 0.2).fill('#86909c').move(0, y)

			if (index === 0) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}
}
