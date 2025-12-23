import { G, Rect, SVG, Text } from "@svgdotjs/svg.js";
import Gantt, { GanttMode } from "../index";
import dayjs, { Dayjs, UnitType } from "dayjs";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender } from "./eventItem/eventItemRender";
import { EventBusEventName } from "../event/const";
import { throttle } from "lodash-es";

export class HeaderRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis(
			[
				'onScroll',
				'onBodyMouseDown',
				'onBodyMouseUp',
				'onHeaderWheel',
				'_onHeaderWheel',
				'onContainerScroll'
			]
		)
		this.bindEvent()
	}

	bindEvent(): void {
		this.gantt.container.addEventListener('scroll', this.onScroll)
		this.gantt.body.addEventListener('mousedown', this.onBodyMouseDown)
		this.gantt.body.addEventListener('mouseup', this.onBodyMouseUp)
		this.gantt.on(EventBusEventName.container_scroll, this.onContainerScroll)

	}

	unbindEvent(): void {
		this.gantt.container.removeEventListener('scroll', this.onScroll)
		this.gantt.body.removeEventListener('mousedown', this.onBodyMouseDown)
		this.gantt.body.removeEventListener('mouseup', this.onBodyMouseUp)
		this.gantt.off(EventBusEventName.container_scroll, this.onContainerScroll)
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

	onContainerScroll() {
		this.onCurrentTimeExistRender()
	}

	onCurrentTimeExistRender() {
		const { exist, currentTimeX } = this.getCurrentTime()
		if (exist) {
			this.renderCureentTime(currentTimeX)
		}
	}


	onScroll(event: Event) {
		this.g?.transform({
			translate: [0, this.gantt.container.scrollTop]
		}, false)
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
		if (!this.gantt.options.view.showEventTimeRange) return
		if (!tmpItem) return
		const g = (this.gantt.stage.find(`.${CssNameKey.time_range}`)[0] || new G().addClass(CssNameKey.time_range)) as G
		this.timeRange = g

		const moveRectBbox = tmpItem?.svgjsInstance.moveRect?.bbox() || { y: 0 }

		const text = (g.find(`.${CssNameKey.time_range_text}`)[0] || new Text().addClass(CssNameKey.time_range_text)) as Text
		const { start, end } = tmpItem.options.event

		const startTime = dayjs.min(start, end)
		const endTime = dayjs.max(start, end)

		const startTimeFormat = this.gantt.options.view.headerTimeFormat({
			gantt: this.gantt,
			time: startTime,
			unit: this.gantt.time.fixUnit as UnitType,
			type: 'timeRange'
		})

		const endTimeFormat = this.gantt.options.view.headerTimeFormat({
			gantt: this.gantt,
			time: endTime,
			unit: this.gantt.time.fixUnit as UnitType,
			type: 'timeRange'
		})

		text.text(`${startTimeFormat} - ${endTimeFormat}`)

		const textBox = text.bbox()
		const stagePoint = this.gantt.stage.point(event.clientX, event.clientY)
		let textX = stagePoint.x
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
		const height = Math.abs(moveRectBbox.y - textBox.y2)
		rect.size(0.01, height).move(stagePoint.x, textBox.y2)
			.fill('transparent')
		rect.addTo(g)

		g.addTo(this.gantt.stage)
	}

	removeEventTimeRange() {
		this.timeRange?.remove()
	}

	private renderCureentTime(x: number) {
		if (!this.gantt.options.action.enableCurrentTime) return
		const g = (this.gantt.stage.find(`.${CssNameKey.current_time}`)[0] || new G().addClass(CssNameKey.current_time)) as G
		this.currentTimeG = g
		const rect = g.find(`.${CssNameKey.current_time_line}`)[0] || new Rect().addClass(CssNameKey.current_time_line)
		const height = 26
		const rectWidth = 0.01
		rect.size(rectWidth, parseFloat(this.gantt.stage.height() + '') - this.gantt.container.scrollTop - height).move(x + rectWidth, height + this.gantt.container.scrollTop)
			.fill('transparent')
		rect.addTo(g)

		const text = (g.find(`.${CssNameKey.current_time_text}`)[0] || new Text().addClass(CssNameKey.current_time_text)) as Text
		const startTime = this.gantt.time.x2time(x)

		const timeFormat = this.gantt.options.view.headerTimeFormat({
			gantt: this.gantt,
			time: startTime,
			unit: this.gantt.time.fixUnit as UnitType,
			type: 'currentTime'
		})

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

	renderTimeTickText(
		getText: () => Text,
		tickTime: Dayjs,
		g: G,
		getPreText: () => Text,
		preTickId = '',
		index: number = -1
	): Text | null {
		const isDurationMode = this.gantt.options.mode === GanttMode.Duration
		const x = this.gantt.time.time2x(tickTime)
		let text: null | Text = null

		text = getText()
		text.text(this.gantt.options.view.headerTimeFormat({
			gantt: this.gantt,
			time: tickTime,
			unit: this.gantt.time.fixUnit as UnitType,
			type: 'tick'
		}))

		const textAlign = typeof this.gantt.options.view.tickTextAlign === 'function' ? this.gantt.options.view.tickTextAlign({
			time: tickTime,
			index
		}) : this.gantt.options.view.tickTextAlign

		const textBox = text.bbox()
		const textY = (this.gantt.options.header.height - textBox.height) / 2

		const handleAlign = {
			'left': () => {
				text.move(x, textY)

			},
			'center': () => {
				text.move(x - textBox.width / 2, textY)
			}
		}[textAlign]

		handleAlign()

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

	clearHeaderWheelTimer() {
		if (this.headerWheelTimer) {
			clearTimeout(this.headerWheelTimer)
			this.headerWheelTimer = null
		}
	}

	private headerWheelTimer: null | ReturnType<typeof setTimeout> = null

	onHeaderWheel(evt: Event) {
		if (this.gantt.options.action.headerWheelTimeMetric) {
			evt.stopPropagation()
			evt.preventDefault()
			this._onHeaderWheel(evt)
		}
	}

	parentContainerPrePosition: string = ''

	showVScrollMask() {
		const parentContainerComputedStyle = getComputedStyle(this.gantt.parentContainer)
		this.parentContainerPrePosition = parentContainerComputedStyle.position

		// 缩放的时候临时遮住滚动条
		this.gantt.parentContainer.style.position = 'relative'
		this.gantt.v_scroll_mask.style.display = 'block'
	}

	hideVScrollMask() {
		if (this.parentContainerPrePosition) {
			this.gantt.parentContainer.style.position = this.parentContainerPrePosition
			this.parentContainerPrePosition = ''
		}
		this.gantt.v_scroll_mask.style.display = 'none'
	}

	_onHeaderWheel = throttle((evt: Event) => {
		if (this.gantt.options.action.headerWheelTimeMetric) {
			if (this.gantt.options.mode === GanttMode.Duration && this.gantt.options.view.timeFullWidth) {
				return
			}
			const defaultValue = this.gantt.getHeaderWheelTimeMetricLimitDefaultRange()
			//@ts-ignore
			const { min = defaultValue.min, max = defaultValue.max } = this.gantt.options.action.headerWheelTimeMetric || defaultValue
			const { deltaY } = evt as WheelEvent
			const direction = deltaY < 0 ? -1 : 1
			const zoomIntensity = 0.5
			let zoom = Math.exp(direction * zoomIntensity)

			const isDurationMode = this.gantt.options.mode === GanttMode.Duration
			let newValue = (isDurationMode ? this.gantt.options.column.width : this.gantt.time.stepTime) * zoom

			if (direction == -1) {
				newValue = Math.max(newValue, min)
			} else {
				newValue = Math.min(newValue, max)
			}
			this.showVScrollMask()
			this.gantt.updateOptions(
				isDurationMode ?
					{
						column: {
							width: newValue
						}
					}
					:
					{
						column: {
							timeMetric: newValue
						}
					}
			)
			this.clearHeaderWheelTimer()
			this.headerWheelTimer = setTimeout(() => {
				this.gantt.time.onScroll(new Event('scroll'))
				this.clearHeaderWheelTimer()
			}, 0);
		}
		this.gantt.eventBus.emit(EventBusEventName.header_wheel, evt, this.gantt)
	}, 200, {
		leading: true,
		trailing: true
	})

	g: G | null = null

	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.header}`)[0] || new G().addClass(CssNameKey.header)) as G
		this.g = g
		const bgRect = g.find(`.${CssNameKey.header_bg}`)[0] || new Rect().addClass(CssNameKey.header_bg)
		bgRect.size(this.gantt.stage.width(), this.gantt.options.header.height).move(0, 0)

		g.add(bgRect)

		const timeTickTextGroup = g.find(`.${CssNameKey.time_ticks_header_group}`)[0] || new G().addClass(CssNameKey.time_ticks_header_group)

		const ticksIterator = this.gantt.time.getTimeTicksIterator()
		let preTickId = ''
		for (const tickItem of ticksIterator) {
			const { tickTime, index } = tickItem
			const x = this.gantt.time.time2x(tickTime)
			const height = 20
			const idClassName = `tick-time-id-${index}`
			const rect = g.find(`.${idClassName}.${CssNameKey.header_time_tick_item}`)[0] || new Rect().addClass(CssNameKey.header_time_tick_item).addClass(idClassName)
			rect.size(0.2, height).move(x, this.gantt.options.header.height - height)

			const text =
				this.renderTimeTickText(
					() => (g.find(`.${idClassName}.${CssNameKey.header_time_tick_text}`)[0] || new Text().addClass(CssNameKey.header_time_tick_text).addClass(idClassName)) as Text,
					tickTime,
					g,
					() => g.find(`.${preTickId}.${CssNameKey.header_time_tick_text}`)[0] as Text,
					preTickId,
					index
				)

			if (!this.gantt.options.view.showTimeTickText) {
				text?.opacity(0)
				rect?.hide()
			}


			if (!text) {
				continue
			}

			rect.addTo(timeTickTextGroup)
			text.addTo(timeTickTextGroup)
			timeTickTextGroup.addTo(g)


			const { rect: tickRect, rectTimeTick } = this.renderer.ticks.renderTickItem({
				tickTime, index
			})
			if (!this.gantt.options.view.showTimeTicks) {
				tickRect?.hide()
			}
			preTickId = idClassName
		}


		if (this.gantt.options.view.showTickText) {
			this.renderer.ticks.gText?.addTo(g)
		}

		this.renderer.maker?.render({ parts: ['header'] })
		g.addTo(this.gantt.stage)
		g.off('wheel', this.onHeaderWheel)
		g.on('wheel', this.onHeaderWheel)
		this.onCurrentTimeExistRender()
	}


	clear() {
		this.g?.clear()
	}

	destroy(): void {
		this.clearHeaderWheelTimer()
		this.unbindEvent()
		const g = this.gantt.stage.find(`.${CssNameKey.header}`)[0]
		g?.remove()
	}
}
