import dayjs from "dayjs";
import { _GanttItem, GanttItem } from "..";
import { uid } from "uid";

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
export function initDealData(data: GanttItem[]) {
	let maxTime = -Infinity
	let minTime = Infinity
	let list: _GanttItem[] = []
	walkData(data, ({ item, level, parent }) => {
		item.level = level
		if (parent) {
			item.parent = parent
		}

		let minStart = Infinity
		let maxEnd = -Infinity

		item.events.forEach(ev => {
			ev.start = dayjs(ev.start)
			ev.end = dayjs(ev.end)
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
		maxTime: dayjs(maxTime),
		minTime: dayjs(minTime),
		list
	}
}
