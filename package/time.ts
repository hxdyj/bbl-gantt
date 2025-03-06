import dayjs, { Dayjs, ManipulateType, OpUnitType } from "dayjs";
import Gantt, { GanttMode, TimeMetric, TimeScale } from "./index";
import { FORMAT_FULL_TIME } from "./utils/time";
export type Tick = {
	time: Dayjs
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY


export class Time {
	// ticks: Tick[] = [] // 用户划分的column算出的ticks
	// timeTicks: Tick[] = [] // 按照时间度量的ticks
	ticks = 0 // 用户划分的column算出的ticks
	timeTicks = 0 // 按照时间度量的ticks
	stepTime: number = 0
	fixUnit: OpUnitType | null = null
	startTime: Dayjs
	endTime: Dayjs
	constructor(public gantt: Gantt) {
		console.group('New Time Class')
		const { startTime, endTime } = this.init()
		this.startTime = startTime
		this.endTime = endTime
		console.log(`ticks: `, this.ticks)
		console.log(`timeTicks: `, this.timeTicks)
		console.log(`stepTime: `, this.stepTime)
		console.log(`startTime: `, this.startTime.format(FORMAT_FULL_TIME))
		console.log(`endTime: `, this.endTime.format(FORMAT_FULL_TIME))
		console.groupEnd()
	}

	init() {
		const startTime = this.gantt.minTime || dayjs()
		return this.caculateTicks(startTime, this.gantt.maxTime || this.x2time(this.gantt.containerRectInfo.width))
	}


	getTimeTickByIndex(index: number) {
		if (index < 0 || (this.ticks && index > (this.ticks - 1))) {
			throw new Error('tick index outof range')
		}
		const startTime = this.getTickByIndex(0)
		//@ts-ignore
		return startTime.add(index, this.fixUnit)
	}

	lastTimeTick() {
		return this.getTimeTickByIndex(this.timeTicks - 1)
	}

	getTimeTicksIterator() {
		let that = this
		function* iterator() {
			let index = 0
			while (index < that.timeTicks) {
				yield {
					tickTime: that.getTimeTickByIndex(index),
					index
				}
				index++
			}
		}
		return iterator()
	}


	getTickByIndex(index: number) {
		if (index < 0 || (this.ticks && index > (this.ticks - 1))) {
			throw new Error('tick index outof range')
		}
		return this.startTime.add(index * this.stepTime, 'millisecond')
	}

	lastTick() {
		return this.getTickByIndex(this.ticks - 1)
	}

	getTicksIterator() {
		let that = this
		function* iterator() {
			let index = 0
			while (index < that.ticks) {
				yield {
					tickTime: that.getTickByIndex(index),
					index
				}
				index++
			}
		}
		return iterator()
	}


	getNoneEventStartTime() {
		return dayjs().startOf(this.fixUnit!)
	}

	time2x(time: Dayjs, startTime?: Dayjs): number {
		let _startTime = startTime || this.getTickByIndex(0)
		if (!_startTime) {
			_startTime = this.getNoneEventStartTime()
		}
		return ((time.valueOf() - _startTime.valueOf()) / this.stepTime) * this.gantt.options.column.width
	}

	x2time(x: number, startTime?: Dayjs): Dayjs {
		let _startTime = startTime || this.getTickByIndex(0)
		if (!_startTime) {
			_startTime = this.getNoneEventStartTime()
		}
		return _startTime.add((x / this.gantt.options.column.width) * this.stepTime, 'millisecond')
	}

	length2milliseconds(length: number): number {
		return (length / this.gantt.options.column.width) * this.stepTime
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

			if (fixTimeMetric == TimeMetric.SECOND) {
				fixUnit = 'second'
			}
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
				if (this.gantt.options.mode != GanttMode.Duration) {
					if (!endTime.startOf(fixUnit).isSame(endTime)) {
						endTime = endTime.add(1, fixUnit).startOf(fixUnit)
					}
				}
			}
		}
		this.fixUnit = fixUnit
		console.log(`startTime,endTime`, startTime.format(FORMAT_FULL_TIME), endTime.format(FORMAT_FULL_TIME))
		console.log(`fixUnit`, fixUnit)

		{
			console.group('caculateTicks')
			this.ticks = 0
			const { params } = timeMetricToDayjsAddParams(timeMetric)
			//@ts-ignore
			this.stepTime = dayjs.duration(params[0], params[1] + 's').asMilliseconds()
			stepTime({
				startTime,
				endTime,
				step: params,
				callback: (time) => {
					this.ticks++
					console.log(time.format(FORMAT_FULL_TIME))
				}
			})
			console.groupEnd()

		}

		{
			this.timeTicks = 0
			// if (this.gantt.options.mode == GanttMode.Duration) {

			// } else {

			// }

			stepTime({
				startTime,
				endTime,
				step: [1, fixUnit!],
				callback: (time) => {
					this.timeTicks++
				}
			})
		}

		return {
			startTime, endTime
		}
	}

	caculateTicksByEndTime(endTime: Dayjs) {
		if (this.gantt.options.mode == GanttMode.Duration) return
		if (!endTime.startOf(this.fixUnit!).isSame(endTime)) {
			//@ts-ignore
			endTime = endTime.add(1, this.fixUnit!).startOf(this.fixUnit!)
		}

		const lastTick = this.lastTick()

		if (!lastTick || lastTick.valueOf() < endTime.valueOf()) {
			stepTime({
				startTime: this.lastTick() || this.getNoneEventStartTime(),
				endTime,
				step: [this.stepTime, 'millisecond'],
				callback: (time) => {
					if (time.isSame(this.lastTick())) return
					this.ticks++
				},
			})

			stepTime({
				startTime: this.lastTimeTick() || this.getNoneEventStartTime(),
				endTime,
				///@ts-ignore
				step: [1, this.fixUnit!],
				callback: (time) => {
					if (time.isSame(this.lastTimeTick())) return
					this.timeTicks++
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

		if (timeMetric < 0.5 * MINUTE) {
			fixTimeMetric = TimeMetric.SECOND
		}

		if (timeMetric >= 0.5 * MINUTE && timeMetric < 15 * MINUTE) {
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
		if (timeMetric === TimeMetric.SECOND) {
			return { params: [num, 'second'], fixTimeMetric: TimeMetric.SECOND }
		}
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
