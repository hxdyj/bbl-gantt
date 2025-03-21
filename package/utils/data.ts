import dayjs from "dayjs";
import { _GanttItem, GanttItem, GanttMode, GanttOptions } from "../index";
import { uid } from "uid";
import { DeepRequired } from "utility-types";
import { getDurationStartTime } from "./time";
export function getUID() {
	return `gantt-uid-${uid(6)}`
}

//深度优先遍历数据
export function walkData(
	data: GanttItem[],
	callback: (params: {
		item: GanttItem,
		level: number,
		parent: GanttItem | null
	}) => void, level = 0, parent: GanttItem | null = null) {
	data.forEach(item => {
		callback({
			item,
			level,
			parent
		})
		if (item.children) {
			walkData(item.children, callback, level + 1, item)
		}
	})
}


/*
1. 获取最大时间和最小时间
2. 将嵌套的数组展开成一维数组
*/
export function initDealData(data: GanttItem[], options: DeepRequired<GanttOptions>) {
	let maxTime = -Infinity
	let minTime = Infinity
	let list: _GanttItem[] = []

	const isDuration = options.mode == GanttMode.Duration

	walkData(data, ({ item, level, parent }) => {
		item.id = `gantt-${item.id}`
		item.level = level
		if (parent) {
			item.parent = parent
		}

		let minStart = Infinity
		let maxEnd = -Infinity

		item.events.forEach(ev => {
			ev.id = `gantt-${ev.id}`
			ev.start = isDuration ? getDurationStartTime(ev.start as number) : dayjs(ev.start)
			ev.end = isDuration ? getDurationStartTime(ev.end as number) : dayjs(ev.end)
			if (ev.start.valueOf() < minStart.valueOf()) {
				minStart = ev.start.valueOf()
			}
			if (ev.end.valueOf() > maxEnd) {
				maxEnd = ev.end.valueOf()
			}
		})

		item.minStart = minStart
		item.maxEnd = maxEnd

		if (minStart < minTime) {
			minTime = minStart
		}

		if (maxEnd > maxTime) {
			maxTime = maxEnd
		}

		list.push(item as _GanttItem)
	})

	return {
		maxTime: isInfinity(maxTime) ? null : dayjs(maxTime),
		minTime: isInfinity(minTime) ? null : dayjs(minTime),
		list
	}
}


export function isInfinity(num: number) {
	return num === Infinity || num === -Infinity
}
