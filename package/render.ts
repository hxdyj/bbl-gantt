import { ForeignObject, G, Rect, SVG, Text } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from ".";
import dayjs from "dayjs";
export class Render {

	constructor(public gantt: Gantt) {
		this.render()
	}

	render() {
		const containerBox = this.caculateContainerBox()
		this.gantt.body.style.width = `${containerBox.width}px`
		this.gantt.body.style.height = `${containerBox.height}px`
		this.gantt.stage.size(containerBox.width, containerBox.height)
		this.gantt.stage.css({
			background: '#e5e6eb'
		})
		this.renderTicks()
		this.renderRows()
		this.renderEvents()
		this.gantt.stage.addTo(this.gantt.body)
	}

	caculateContainerBox() {
		const ticks = this.gantt.time.ticks
		const width = this.gantt.options.column.width * (ticks.length - 1)
		const height = this.gantt.list.length * this.gantt.options.row.height
		return {
			width,
			height
		}
	}

	renderTicks() {
		const g = new G()
		g.addClass('ticks')
		const ticks = this.gantt.time.ticks
		ticks.forEach((tick, index) => {
			const x = index * this.gantt.options.column.width
			const y = 0
			const rect = new Rect()
			rect.size(0.2, this.gantt.stage.height()).fill('#86909c').move(x, y).addClass('tick-item')
			if (index === 0 || index === ticks.length - 1) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}

	renderRows() {
		const g = new G()
		g.addClass('rows')
		const rows = this.gantt.list
		rows.forEach((row, index) => {
			const y = index * this.gantt.options.row.height
			const rect = new Rect()
			rect.size(this.gantt.stage.width(), 0.2).fill('#86909c').move(0, y).addClass('row-line')
			if (index === 0) {
				rect.opacity(0)
			}
			rect.addTo(g)
		})
		g.addTo(this.gantt.stage)
	}

	renderEvents() {
		const g = new G()
		g.addClass('events')
		const rows = this.gantt.list
		rows.forEach((row, index) => {
			row.events.forEach(event => {
				this.renderEvent(event, index, g)
			})
		})
		g.addTo(this.gantt.stage)
	}

	renderEvent(event: _GanttEventItem, index: number, g: G) {
		const rect = new Rect()
		const stepTime = this.gantt.time.stepTime
		const columnWidth = this.gantt.options.column.width
		const width = (dayjs.duration(event.end.diff(event.start)).asMilliseconds() / stepTime) * columnWidth
		console.log('111', width)

		const x = (dayjs.duration(event.start.diff(this.gantt.time.ticks[0].time)).asMilliseconds() / stepTime) * columnWidth
		const y = (index * this.gantt.options.row.height) + (this.gantt.options.row.height / 4)
		const height = this.gantt.options.row.height / 2
		rect.size(width, height).fill('#165DFF')
			.move(x, y).addClass('event-item').radius(5)
		rect.addTo(g)

		const foreignObject = g.foreignObject(width, height)
		foreignObject.attr({
			style: 'overflow:visible;'
		})
		// const body = document.createElement('body')
		foreignObject.add(SVG(`<div class="h-full flex items-center w-full" style="padding:0 6px;color:white;overflow:visible;white-space:nowrap;font-size:12px;font-weight:600">${event.name}</div>`, true))
		foreignObject.move(x, y).addClass('event-text')
		// text.text(event.name).font({
		// 	size: 12,
		// 	family: 'Arial',
		// 	weight: 'bold'
		// }).move(x, y - 14).addClass('event-text').fill('white').width(width)

		// text.addTo(g)
	}
}
