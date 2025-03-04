import { ForeignObject, G, Rect, SVG, Text } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from ".";
import dayjs, { Dayjs, UnitType } from "dayjs";
import { EventBindingThis } from "./event";
import { HeaderRender } from "./render/headerRender";
import { TicksRender } from "./render/ticksRender";
import { RowsRender } from "./render/rowsRender";
import { EventsRender } from "./render/eventsRender";
export class Render extends EventBindingThis {
	header: HeaderRender
	ticks: TicksRender
	rows: RowsRender
	events: EventsRender
	constructor(public gantt: Gantt) {
		super()
		this.header = new HeaderRender(this.gantt, this)
		this.ticks = new TicksRender(this.gantt, this)
		this.rows = new RowsRender(this.gantt, this)
		this.events = new EventsRender(this.gantt, this)
		this.render()
		this.gantt.view.scrollToEarliestItem({
			behavior: 'instant',
		})
		this.bindEvent()
	}

	private bindEvent() {
	}

	private unbindEvent() {

	}

	destroy() {
		this.unbindEvent()
		this.header.destroy()
		this.ticks.destroy()
		this.rows.destroy()
		this.events.destroy()
	}


	render() {
		let ganttBox = this.caculateGanttBox()

		const width = Math.max(ganttBox.width, this.gantt.containerRectInfo.width)
		const height = Math.max(ganttBox.height, this.gantt.containerRectInfo.height)

		if (ganttBox.width < this.gantt.containerRectInfo.width) {
			this.gantt.time.caculateTicksByX(this.gantt.containerRectInfo.width)
			ganttBox = this.caculateGanttBox()
		}

		this.gantt.body.style.width = `${width}px`
		this.gantt.body.style.height = `${height}px`

		this.gantt.stage.size(width, height)
		this.gantt.stage.css({
			background: 'var(--gantt-bg-color)'
		})
		this.ticks.render()
		this.rows.render()
		this.events.render()
		this.header.render()
		this.gantt.stage.addTo(this.gantt.body)

	}

	caculateGanttBox() {
		const ticks = this.gantt.time.ticks
		const width = this.gantt.options.column.width * (ticks.length - 2) //减去2的时候，因为最前边和最后边的刻度都不需要显示
		const height = this.gantt.list.length * this.gantt.options.row.height + this.gantt.options.header.height
		return {
			width,
			height
		}
	}

	getXbyTime(time: Dayjs) {
		return (dayjs.duration(time.diff(this.gantt.time.ticks[0].time)).asMilliseconds() / this.gantt.time.stepTime) * this.gantt.options.column.width
	}

	getYbyIndex(index: number) {
		return (index * this.gantt.options.row.height) + this.gantt.options.header.height
	}

	getWidthByTwoTime(time1: Dayjs, time2: Dayjs) {
		const start = dayjs.min(time1, time2)
		const end = dayjs.max(time1, time2)
		return (dayjs.duration(end.diff(start)).asMilliseconds() / this.gantt.time.stepTime) * this.gantt.options.column.width
	}

}
