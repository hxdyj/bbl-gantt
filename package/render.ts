import { ForeignObject, G, Rect, SVG, Text } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem, GanttMode } from "./index";
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
		this.gantt.render?.header?.clear()
		this.gantt.render?.ticks?.clear()

		let ganttBox = this.caculateGanttBox()

		let width = Math.max(ganttBox.width, this.gantt.containerRectInfo.width)
		let height = Math.max(ganttBox.height, this.gantt.containerRectInfo.height)
		if (this.gantt.options.mode === GanttMode.Duration) {
			width = ganttBox.width
		}

		if (this.gantt.options.view.whileRowsLessContainerAutoReduceHeight && ganttBox.width < this.gantt.containerRectInfo.width) {
			this.gantt.time.caculateTicksByX(this.gantt.containerRectInfo.width)
			ganttBox = this.caculateGanttBox()
		}

		this.gantt.body.style.width = `${width}px`
		this.gantt.body.style.height = `${height}px`

		this.gantt.stage.size(width, height)


		if (this.gantt.containerRectInfo.height < this.gantt.parentContainerRectInfo.height && this.gantt.container.style.height.includes('calc')) {
			this.gantt.container.style.height = 'unset'
			this.gantt.container.style.maxHeight = 'unset'
		}
		if (this.gantt.containerRectInfo.width < this.gantt.parentContainerRectInfo.width && this.gantt.container.style.width.includes('calc')) {
			this.gantt.container.style.width = 'unset'
			this.gantt.container.style.maxWidth = 'unset'
		}

		this.ticks.render()
		this.rows.render()
		this.events.render()
		this.header.render()

		const svg = this.gantt.body.querySelector('svg')
		if (svg !== this.gantt.stage.node) {
			this.gantt.body.innerHTML = ''
		}
		this.gantt.stage.addTo(this.gantt.body)
	}

	caculateGanttBox() {
		let count = this.gantt.time.ticks - 1 //-1是因为最前边的刻度在起始位置
		if (this.gantt.options.mode === GanttMode.Duration) {
			count = (this.gantt.options.durationModeOptions.duration * 1000) / this.gantt.time.stepTime
		}

		if (count < 0) count = 0
		const width = this.gantt.options.column.width * count
		const height = this.gantt.list.length * this.gantt.options.row.height + this.gantt.options.header.height
		return {
			width,
			height
		}
	}

	getYbyIndex(index: number) {
		return (index * this.gantt.options.row.height) + this.gantt.options.header.height
	}

}
