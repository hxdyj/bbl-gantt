import { G, Rect } from "@svgdotjs/svg.js";
import Gantt from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";

export class RowsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	render() {
		const g = this.gantt.stage.find(`.${CssNameKey.rows}`)[0] || new G().addClass(CssNameKey.rows)
		const rows = this.gantt.list

		rows.forEach((row, index) => {

			if (row.bg) {
				const bgClassName = `row-bg-${row.id}`
				const bgRect = g.find(`.${bgClassName}`)[0] || new Rect().addClass(bgClassName).addClass(row.bg)
				bgRect.size(this.gantt.stage.width(), this.gantt.options.row.height).move(0, this.renderer.getYbyIndex(index)).opacity(0.5)
				bgRect.addTo(g)
			}

			const y = this.renderer.getYbyIndex(index)

			const rect = g.find(`.${CssNameKey.row_line}.${row.id}`)[0] || new Rect().addClass(CssNameKey.row_line).addClass(row.id)

			rect.size(this.gantt.stage.width(), 0.2).move(0, y)

			if (index === 0) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}

	destroy(): void {
		const g = this.gantt.stage.find(`.${CssNameKey.rows}`)[0]
		g?.remove()
	}
}
