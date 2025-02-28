import dayjs, { Dayjs, ManipulateType, OpUnitType } from "dayjs";
import Gantt, { TimeMetric, TimeScale } from "./index";
import { last } from "lodash-es";
export type Tick = {
	time: Dayjs
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY


export class Time {
	ticks: Tick[] = [] // 用户划分的column算出的ticks
	timeTicks: Tick[] = [] // 按照时间度量的ticks
	stepTime: number = 0
	fixUnit: OpUnitType | null = null
	constructor(public gantt: Gantt) {
		this.init()
		console.log(`ticks: `, this.ticks)
		console.log(`timeTicks: `, this.timeTicks)
		console.log(`stepTime: `, this.stepTime)
	}

	init() {
		const startTime = this.gantt.minTime || dayjs()
		this.caculateTicks(startTime, this.gantt.maxTime || this.x2time(this.gantt.containerRectInfo.width))
	}


	getNoneEventStartTime() {
		return dayjs().startOf(this.fixUnit!)
	}

	x2time(x: number, startTime?: Dayjs): Dayjs {
		let _startTime = startTime || this.ticks[0]?.time
		if (!_startTime) {
			_startTime = this.getNoneEventStartTime()
		}
		return _startTime.add((x / this.gantt.options.column.width) * this.stepTime, 'millisecond')
	}

	x2milliseconds(x: number): number {
		return (x / this.gantt.options.column.width) * this.stepTime
	}

	caculateTicks(minTime: Dayjs, maxTime: Dayjs) {
		let startTime = dayjs(minTime)
		let endTime = dayjs(maxTime)
		const { timeMetric, padding } = this.gantt.options.column
		const { fixTimeMetric, params: subtractParams } = timeMetricToDayjsAddParams(timeMetric, padding.left)
		const { params: addParams } = timeMetricToDayjsAddParams(timeMetric, padding.right)

		if (this.gantt.minTime) {
			startTime = startTime.subtract(...subtractParams)
			endTime = endTime.add(...addParams)
		}

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
			if (fixTimeMetric == TimeMetric.MONTH) {
				fixUnit = 'month'
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
		this.fixUnit = fixUnit
		console.log(`startTime,endTime`, startTime.format(), endTime.format())
		console.log(`fixUnit`, fixUnit)
		{
			this.ticks = []
			const { params } = timeMetricToDayjsAddParams(timeMetric)
			//@ts-ignore
			this.stepTime = dayjs.duration(params[0], params[1] + 's').asMilliseconds()
			stepTime({
				startTime,
				endTime,
				step: params,
				callback: (time) => {
					this.ticks.push({ time })
				}
			})

		}

		{
			this.timeTicks = []

			stepTime({
				startTime,
				endTime,
				step: [1, fixUnit!],
				callback: (time) => {
					this.timeTicks.push({ time })
				}
			})

		}
	}

	caculateTicksByEndTime(endTime: Dayjs) {
		if (!endTime.startOf(this.fixUnit!).isSame(endTime)) {
			//@ts-ignore
			endTime = endTime.add(1, this.fixUnit!).startOf(this.fixUnit!)
		}

		const lastTick = last(this.ticks)
		if (!lastTick || lastTick.time.valueOf() < endTime.valueOf()) {
			stepTime({
				startTime: last(this.ticks)?.time || this.getNoneEventStartTime(),
				endTime,
				step: [this.stepTime, 'millisecond'],
				callback: (time) => {
					if (time.isSame(last(this.ticks).time)) return
					this.ticks.push({ time })
				},
			})

			stepTime({
				startTime: last(this.timeTicks)?.time || this.getNoneEventStartTime(),
				endTime,
				///@ts-ignore
				step: [1, this.fixUnit!],
				callback: (time) => {
					if (time.isSame(last(this.timeTicks).time)) return
					this.timeTicks.push({ time })
				}
			})

		}
	}

	caculateTicksByX(x: number) {
		this.caculateTicksByEndTime(this.x2time(x))
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
		if (timeMetric === TimeMetric.HALF_HOUR) {
			return { params: [num * 30, 'minute'], fixTimeMetric: TimeMetric.HOUR }
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



function stepTime(params: {
	startTime: Dayjs,
	endTime: Dayjs,
	step: [value: number, unit?: dayjs.ManipulateType | undefined],
	callback: (time: Dayjs) => void
	name?: string
}) {
	const { startTime, endTime, step, callback } = params
	if (startTime.isSame(endTime)) return
	let currentTime = dayjs(startTime)
	while (currentTime.isBefore(endTime)) {
		callback(currentTime)
		currentTime = currentTime.add(...step)
	}
	if (!startTime.isSame(endTime) && currentTime.isSame(endTime)) {
		callback(currentTime)
	}
}
