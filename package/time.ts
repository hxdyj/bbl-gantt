import dayjs, { Dayjs, ManipulateType, OpUnitType } from "dayjs";
import Gantt, { TimeMetric, TimeScale } from "./index";
export type Tick = {
	time: Dayjs
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY


export class Time {
	ticks: Tick[] = []
	stepTime: number = 0
	constructor(public gantt: Gantt) {
		this.caculateTicks(this.gantt.minTime!, this.gantt.maxTime!)
		console.log(`ticks: `, this.ticks)
		console.log(`stepTime: `, this.stepTime)
	}
	caculateTicks(minTime: Dayjs, maxTime: Dayjs) {
		let startTime = dayjs(minTime)
		let endTime = dayjs(maxTime)
		const { timeMetric, padding } = this.gantt.options.column
		const { fixTimeMetric, params: subtractParams } = timeMetricToDayjsAddParams(timeMetric, padding.left)
		const { params: addParams } = timeMetricToDayjsAddParams(timeMetric, padding.right)
		startTime = startTime.subtract(...subtractParams)
		endTime = endTime.add(...addParams)
		let fixUnit: OpUnitType | null = null
		{

			if (fixTimeMetric == TimeMetric.MINUTE) {
				fixUnit = 'minute'
			}
			if (fixTimeMetric == TimeMetric.HOUR) {
				fixUnit = 'hour'
			}
			if (fixTimeMetric == TimeMetric.DAY) {
				fixUnit = 'day'
			}
			if (fixTimeMetric == TimeMetric.WEEK) {
				fixUnit = 'week'
			}
			if (fixTimeMetric == TimeMetric.YEAR) {
				fixUnit = 'year'
			}

			if (fixUnit) {
				startTime = startTime.startOf(fixUnit)
				if (!endTime.startOf(fixUnit).isSame(endTime)) {
					endTime = endTime.add(1, fixUnit).startOf(fixUnit)
				}
			}
		}
		console.log(`startTime,endTime`, startTime.format(), endTime.format())
		{
			this.ticks = []
			let currentTime = dayjs(startTime)
			const { params } = timeMetricToDayjsAddParams(timeMetric)
			//@ts-ignore
			this.stepTime = dayjs.duration(params[0], params[1] + 's').asMilliseconds()

			while (currentTime.isBefore(endTime)) {
				this.ticks.push({ time: currentTime })
				currentTime = currentTime.add(...params)
			}
			if (currentTime.isSame(endTime)) {
				this.ticks.push({ time: currentTime })
			}
		}
	}
}




export function timeMetricToDayjsAddParams(timeMetric: TimeMetric | number, num = 1): {
	params: [value: number, unit?: ManipulateType]
	fixTimeMetric: TimeScale | null
} {
	if (typeof timeMetric === "number") {
		let fixTimeMetric: TimeScale | null = null
		if (timeMetric < 15 * MINUTE) {
			fixTimeMetric = TimeMetric.MINUTE
		}
		if (timeMetric >= 15 * MINUTE && timeMetric < 6 * HOUR) {
			fixTimeMetric = TimeMetric.HOUR
		}
		if (timeMetric >= 6 * HOUR && timeMetric < 0.5 * WEEK) {
			fixTimeMetric = TimeMetric.DAY
		}
		if (timeMetric >= 0.5 * WEEK && timeMetric < 0.5 * MONTH) {
			fixTimeMetric = TimeMetric.WEEK
		}
		if (timeMetric >= 0.5 * MONTH && timeMetric < 3 * MONTH) {
			fixTimeMetric = TimeMetric.MONTH
		}
		if (timeMetric >= 3 * MONTH) {
			fixTimeMetric = TimeMetric.YEAR
		}
		return { params: [num * timeMetric, "millisecond"], fixTimeMetric }
	} else {
		if (timeMetric === TimeMetric.MINUTE) {
			return { params: [num, 'minute'], fixTimeMetric: TimeMetric.MINUTE }
		}
		if (timeMetric === TimeMetric.QUARTER_HOUR) {
			return { params: [num * 15, 'minute'], fixTimeMetric: TimeMetric.HOUR }
		}
		if (timeMetric === TimeMetric.HOUR) {
			return { params: [num, 'hour'], fixTimeMetric: TimeMetric.HOUR }
		}
		if (timeMetric === TimeMetric.QUARTER_DAY) {
			return { params: [num * 6, 'hour'], fixTimeMetric: TimeMetric.DAY }
		}
		if (timeMetric === TimeMetric.HALF_DAY) {
			return { params: [num * 12, 'hour'], fixTimeMetric: TimeMetric.DAY }
		}
		if (timeMetric === TimeMetric.DAY) {
			return { params: [num, 'day'], fixTimeMetric: TimeMetric.DAY }
		}
		if (timeMetric === TimeMetric.WEEK) {
			return { params: [num * 7, 'day'], fixTimeMetric: TimeMetric.WEEK }
		}
		if (timeMetric === TimeMetric.MONTH) {
			return { params: [num, 'month'], fixTimeMetric: TimeMetric.MONTH }
		}
		if (timeMetric === TimeMetric.YEAR) {
			return { params: [num, 'year'], fixTimeMetric: TimeMetric.YEAR }
		}
	}
	throw new Error("Invalid time metric")
}

