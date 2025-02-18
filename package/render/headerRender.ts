import { G, Rect, Text } from "@svgdotjs/svg.js";
import Gantt from "..";
import { UnitType } from "dayjs";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";

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

	private renderCureentTime(x: number) {
		const g = this.gantt.stage.find(`.${CssNameKey.current_time}`)[0] || new G().addClass(CssNameKey.current_time)
		const rect = g.find(`.${CssNameKey.current_time_line}`)[0] || new Rect().addClass(CssNameKey.current_time_line)
		const height = 26
		rect.size(0.01, parseFloat(this.gantt.stage.height() + '') - this.gantt.container.scrollTop - height).move(x, height + this.gantt.container.scrollTop)
			.fill('transparent')
		rect.addTo(g)

		const text = (g.find(`.${CssNameKey.current_time_text}`)[0] || new Text().addClass(CssNameKey.current_time_text)) as Text

		const timeFormat = this.gantt.time.x2time(x).format('YYYY-MM-DD HH:mm:ss')
		text.text(timeFormat).font({
			size: 13,
			weight: 'bold'
		})
		const textBox = text.bbox()
		text.move(x - textBox.width / 2, 4 + this.gantt.container.scrollTop)
		text.attr({
			style: 'user-select:none;'
		})

		text.addTo(g)
		g.addTo(this.gantt.stage)
	}

	render() {
		const g = this.gantt.stage.find(`.${CssNameKey.header}`)[0] || new G().addClass(CssNameKey.header)
		const bgRect = g.find(`.${CssNameKey.header_bg}`)[0] || new Rect().addClass(CssNameKey.header_bg)
		bgRect.size(this.gantt.stage.width(), this.gantt.options.header.height).move(0, 0)

		g.add(bgRect)
		this.gantt.time.timeTicks.forEach((tick, index) => {
			const x = this.renderer.getXbyTime(tick.time)
			const height = 20
			const idClassName = `tick-id-${index}-${tick.time.valueOf()}`

			const rect = g.find(`.${idClassName}.${CssNameKey.header_time_tick_item}`)[0] || new Rect().addClass(CssNameKey.header_time_tick_item).addClass(idClassName)

			rect.size(0.2, height).move(x, this.gantt.options.header.height - height)
			rect.addTo(g)

			const text = (g.find(`.${idClassName}.${CssNameKey.header_time_tick_text}`)[0] || new Text().addClass(CssNameKey.header_time_tick_text).addClass(idClassName)) as Text

			let getMetric = this.gantt.time.fixUnit as unknown as UnitType

			if (getMetric === 'day') getMetric = 'date'

			let showTimeStr =
				//@ts-ignore
				getMetric === 'week' ? tick.time.week() + ''
					: tick.time.get(getMetric).toString()

			if (getMetric == 'month') {
				showTimeStr = parseInt(showTimeStr) + 1 + ''
			}
			text.text(showTimeStr).font({
				size: 14
			})
			const textBox = text.bbox()
			text.move(x - textBox.width / 2, 26)
			text.attr({
				style: 'user-select:none;'
			})

			text.addTo(g)
		})

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
