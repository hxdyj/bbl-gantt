import { G, Rect, Text } from "@svgdotjs/svg.js";
import Gantt, { GanttMode } from "../index";
import dayjs, { Dayjs, UnitType } from "dayjs";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { FORMAT_FULL_TIME, formatDuration } from "#/utils/time";
import { EventItemRender } from "./eventItem/eventItemRender";

export class HeaderRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis(['onScroll', 'onBodyMouseDown', 'onBodyMouseUp'])
		this.bindEvent()
	}

	bindEvent(): void {
		this.gantt.container.addEventListener('scroll', this.onScroll)
		this.gantt.body.addEventListener('mousedown', this.onBodyMouseDown)
		this.gantt.body.addEventListener('mouseup', this.onBodyMouseUp)

	}

	unbindEvent(): void {
		this.gantt.container.removeEventListener('scroll', this.onScroll)
		this.gantt.body.removeEventListener('mousedown', this.onBodyMouseDown)
		this.gantt.body.removeEventListener('mouseup', this.onBodyMouseUp)

	}

	getCurrentTime() {
		const currentTime = this.gantt.stage.find(`.${CssNameKey.current_time_line}`)[0]
		const exist = !!currentTime
		return {
			exist: exist,
			currentTime,
			currentTimeX: exist ? parseFloat(currentTime.x() + '') : NaN
		}
	}

	onCurrentTimeExistRender() {
		const { exist, currentTimeX } = this.getCurrentTime()
		if (exist) {
			this.renderCureentTime(currentTimeX)
		}
	}

	onScroll(event: Event) {
		this.render()
	}

	private mouseDownTime: number = 0

	private onBodyMouseDown(e: MouseEvent) {
		this.mouseDownTime = e.timeStamp
	}

	private onBodyMouseUp(e: MouseEvent) {
		if (this.mouseDownTime && e.timeStamp - this.mouseDownTime < 150) {
			if (!this.gantt.status.eventMoving) {
				const { x } = this.gantt.stage.point(e.clientX, e.clientY)
				this.renderCureentTime(x)
			}
		}
		this.mouseDownTime = 0
	}

	currentTimeG: G | null = null

	hideCurrentTime() {
		this.currentTimeG?.opacity(0)
	}

	showCurrentTime() {
		this.currentTimeG?.opacity(1)
	}

	timeRange: G | null = null

	renderEventTimeRange(event: MouseEvent, tmpItem?: EventItemRender | null) {
		if (!tmpItem) return
		const g = (this.gantt.stage.find(`.${CssNameKey.time_range}`)[0] || new G().addClass(CssNameKey.time_range)) as G
		this.timeRange = g
		const { translateX = 0 } = tmpItem?.g?.transform() || {}
		const bbox = tmpItem?.g.find(`.${CssNameKey.event_body}`)[0]?.bbox()
		const startX = bbox.x
		const endX = startX + bbox.width
		if (!bbox) return

		const text = (g.find(`.${CssNameKey.time_range_text}`)[0] || new Text().addClass(CssNameKey.time_range_text)) as Text

		const startTime = this.gantt.time.x2time(startX + translateX)
		const endTime = this.gantt.time.x2time(endX + translateX)

		const formatStr = 'YYYY-MM-DD HH:mm:ss'
		let textContent = `${startTime.format(formatStr)} - ${endTime.format(formatStr)}`
		text.text(textContent)
		const textBox = text.bbox()
		let textX = this.gantt.stage.point(event.clientX, event.clientY).x
		// let textX = x - textBox.width / 2
		let textPad = 10

		if (textX < 0) textX = textPad
		if ((textX + textBox.width) > this.gantt.body.clientWidth) {
			textX = this.gantt.body.clientWidth - textBox.width - textPad
		}
		text.move(textX, 4 + this.gantt.container.scrollTop)
		text.attr({
			style: 'user-select:none;'
		})
		text.addTo(g)


		const rect = g.find(`.${CssNameKey.time_range_line}`)[0] || new Rect().addClass(CssNameKey.time_range_line)
		const height = Math.abs(bbox.y - textBox.y)
		const pad = 8
		rect.size(0.01, height - pad).move(textX, this.gantt.container.scrollTop + textBox.height + pad)
			.fill('transparent')
		rect.addTo(g)

		g.addTo(this.gantt.stage)
	}

	removeEventTimeRange() {
		this.timeRange?.remove()
	}

	private renderCureentTime(x: number) {
		const g = (this.gantt.stage.find(`.${CssNameKey.current_time}`)[0] || new G().addClass(CssNameKey.current_time)) as G
		this.currentTimeG = g
		const rect = g.find(`.${CssNameKey.current_time_line}`)[0] || new Rect().addClass(CssNameKey.current_time_line)
		const height = 26
		rect.size(0.01, parseFloat(this.gantt.stage.height() + '') - this.gantt.container.scrollTop - height).move(x, height + this.gantt.container.scrollTop)
			.fill('transparent')
		rect.addTo(g)

		const text = (g.find(`.${CssNameKey.current_time_text}`)[0] || new Text().addClass(CssNameKey.current_time_text)) as Text

		const timeFormat = this.gantt.options.mode === GanttMode.Duration ? formatDuration(dayjs.duration(this.gantt.time.x2time(x).diff(this.gantt.time.startTime, 'ms'), 'ms').format('H:m:s.SSS')) : this.gantt.time.x2time(x).format('YYYY-MM-DD HH:mm:ss')
		text.text(timeFormat)
		const textBox = text.bbox()
		let textX = x - textBox.width / 2
		let textPad = 10

		if (textX < 0) textX = textPad
		if ((textX + textBox.width) > this.gantt.body.clientWidth) {
			textX = this.gantt.body.clientWidth - textBox.width - textPad
		}
		text.move(textX, 4 + this.gantt.container.scrollTop)
		text.attr({
			style: 'user-select:none;'
		})

		text.addTo(g)
		g.addTo(this.gantt.stage)

	}

	renderTimeTickText(getText: () => Text, tickTime: Dayjs, g: G, getPreText: () => Text, preTickId = ''): Text | null {
		const isDurationMode = this.gantt.options.mode === GanttMode.Duration
		const x = this.renderer.getXbyTime(tickTime)
		let text: null | Text = null

		text = getText()
		text.text(this.gantt.options.view.headerTimeFormat({
			gantt: this.gantt,
			time: tickTime,
			unit: this.gantt.time.fixUnit as UnitType
		}))

		const textBox = text.bbox()
		text.move(isDurationMode ? x : x - textBox.width / 2, 26)
		text.attr({
			style: 'user-select:none;'
		})

		if (!this.gantt.options.view.overrideHeaderTitle) {
			if (preTickId) {
				const preText = getPreText()
				if (preText) {
					const preBox = preText.bbox()
					const textBox = text.bbox()
					if (textBox.x < preBox.x2 + preBox.width) {
						return null
					}
				}
			}
		}
		return text
	}

	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.header}`)[0] || new G().addClass(CssNameKey.header)) as G
		const bgRect = g.find(`.${CssNameKey.header_bg}`)[0] || new Rect().addClass(CssNameKey.header_bg)
		bgRect.size(this.gantt.stage.width(), this.gantt.options.header.height).move(0, 0)

		g.add(bgRect)

		const ticksIterator = this.gantt.time.getTimeTicksIterator()
		let preTickId = ''
		for (const tickItem of ticksIterator) {
			const { tickTime, index } = tickItem
			const x = this.renderer.getXbyTime(tickTime)
			const height = 20
			const idClassName = `tick-id-${index}-${tickTime.valueOf()}`

			const rect = g.find(`.${idClassName}.${CssNameKey.header_time_tick_item}`)[0] || new Rect().addClass(CssNameKey.header_time_tick_item).addClass(idClassName)
			rect.size(0.2, height).move(x, this.gantt.options.header.height - height)

			const text = this.gantt.options.view.showTimeTickText ?
				this.renderTimeTickText(
					() => (g.find(`.${idClassName}.${CssNameKey.header_time_tick_text}`)[0] || new Text().addClass(CssNameKey.header_time_tick_text).addClass(idClassName)) as Text,
					tickTime,
					g,
					() => g.find(`.${preTickId}.${CssNameKey.header_time_tick_text}`)[0] as Text,
					preTickId)
				: null
			if (!text) continue

			rect.addTo(g)
			text.addTo(g)
			if (this.gantt.options.view.showTimeTicks) {
				this.renderer.ticks.renderTickItem(tickTime, index)
			}
			preTickId = idClassName
		}

		this.renderer.ticks.gText?.addTo(g)

		g.transform({
			translate: [0, this.gantt.container.scrollTop]
		}, false)
		g.addTo(this.gantt.stage)

		this.onCurrentTimeExistRender()
	}

	destroy(): void {
		this.unbindEvent()
		const g = this.gantt.stage.find(`.${CssNameKey.header}`)[0]
		g?.remove()
	}
}
