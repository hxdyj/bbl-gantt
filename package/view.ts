import { defaultsDeep, find, last, minBy } from "lodash-es";
import Gantt, { _GanttItem, TimeMetric } from ".";
import { CssNameKey } from "./const/const";
import { Rect } from "@svgdotjs/svg.js";
import { getUID } from "./utils/data";

export type Point = [number, number]

export type Box = {
	x: number
	y: number
	width: number
	height: number
}


export function pointInBox(point: Point, box: Box): boolean {
	return point[0] >= box.x && point[0] <= box.x + box.width && point[1] >= box.y && point[1] <= box.y + box.height
}

/*
	操作视图的类，以及计算视图相关的信息
*/
export class View {
	constructor(public gantt: Gantt) {

	}

	scrollToID(id: string, options: ScrollToOptions = {}) {
		const _options = defaultsDeep(options, {
			behavior: 'smooth',
		})
		const ele = this.gantt.stage.findOne(`#${getUID(id)}`)
		const anchor = ele?.findOne(`.${CssNameKey.event_anchor}`) as Rect
		if (!anchor) return
		// anchor?.scrollIntoView(_options)
		const viewBox: Box = {
			x: this.gantt.container.scrollLeft,
			y: this.gantt.container.scrollTop,
			width: this.gantt.container.clientWidth,
			height: this.gantt.container.clientHeight
		}

		const point: Point = [parseFloat(anchor.x() + ''), parseFloat(anchor.y() + '')]
		if (!pointInBox(point, viewBox)) {
			this.gantt.container.scrollTo({
				left: parseFloat(anchor.x() + '') - (this.gantt.options.column.width * 2 > this.gantt.containerRectInfo.width ? this.gantt.containerRectInfo.width * 0.1 : this.gantt.options.column.width),
				top: parseFloat(anchor.y() + '') - this.gantt.options.header.height,
				behavior: _options.behavior
			})
		}
	}

	scrollToItem(itemId: string, options: ScrollToOptions = {}) {
		const item = find(this.gantt.list, (i: _GanttItem) => i.id === itemId)
		if (!item?.events[0]) return
		this.scrollToEvent(item.events[0].id, options)
	}

	scrollToEvent(eventId: string, options: ScrollToOptions = {}) {
		this.scrollToID(eventId, options)
	}

	scrollToEarliestItem(options: ScrollToOptions = {}) {
		const item = minBy(this.gantt.list, (i: _GanttItem) => i.minStart)
		if (!item) return
		this.scrollToItem(item.id, options)
	}


}
