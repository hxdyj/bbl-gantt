import { G, Rect, Text } from "@svgdotjs/svg.js";
import Gantt from "..";
import { UnitType } from "dayjs";
import { PartRender } from "./index";
import { Render } from "../render";

export class HeaderRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis(['onScroll', 'onBodyClick'])
		this.bindEvent()
	}

	bindEvent(): void {
		this.gantt.container.addEventListener('scroll', this.onScroll)
		this.gantt.body.addEventListener('click', this.onBodyClick)

	}
	unbindEvent(): void {
		this.gantt.container.removeEventListener('scroll', this.onScroll)
		this.gantt.body.removeEventListener('click', this.onBodyClick)

	}

	onScroll(event: Event) {
		this.render()
		const currentTime = this.gantt.stage.find('.g-current-time-line')[0]
		if (currentTime) {
			this.renderCureentTime(parseFloat(currentTime.x() + ''))
		}
	}

	private onBodyClick(e: MouseEvent) {
		const { x } = this.gantt.stage.point(e.clientX, e.clientY)
		this.renderCureentTime(x)
	}


	private renderCureentTime(x: number) {
		const className = 'g-current-time'
		const g = this.gantt.stage.find(`.${className}`)[0] || new G().addClass(className)
		const lineClassName = 'g-current-time-line'
		const rect = g.find(`.${lineClassName}`)[0] || new Rect().addClass(lineClassName)
		const height = 26
		rect.size(0.01, parseFloat(this.gantt.stage.height() + '') - this.gantt.container.scrollTop - height).move(x, height + this.gantt.container.scrollTop)
			.fill('transparent').stroke({ width: 1, color: '#FF7D00', dasharray: '0,5,10' })

		rect.addTo(g)

		const textClassName = 'g-current-time-text'
		const text = (g.find(`.${textClassName}`)[0] || new Text().addClass(textClassName)) as Text

		const timeFormat = this.gantt.time.x2time(x).format('YYYY-MM-DD HH:mm:ss')
		text.text(timeFormat).font({
			size: 13,
			weight: 'bold'
		}).fill('#FF7D00')
		const textBox = text.bbox()
		text.move(x - textBox.width / 2, 4 + this.gantt.container.scrollTop)
		text.attr({
			style: 'user-select:none;'
		})

		text.addTo(g)
		g.addTo(this.gantt.stage)
	}

	render() {
		const gClassName = 'header'
		const g = this.gantt.stage.find(`.${gClassName}`)[0] || new G().addClass(gClassName)

		const bgClassName = 'header-bg'
		const bgRect = g.find(`.${bgClassName}`)[0] || new Rect().addClass(bgClassName)
		bgRect.size(this.gantt.stage.width(), this.gantt.options.header.height).move(0, 0)
			.fill('#e5e6eb')

		g.add(bgRect)
		this.gantt.time.timeTicks.forEach((tick, index) => {
			const x = this.renderer.getXbyTime(tick.time)
			const height = 20
			const idClassName = `tick-id-${index}-${tick.time.valueOf()}`

			const rectClassName = 'time-tick-item'
			const rect = g.find(`.${idClassName}.${rectClassName}`)[0] || new Rect().addClass(rectClassName).addClass(idClassName)

			rect.size(0.2, height).move(x, this.gantt.options.header.height - height)
				.fill('#86909c')
			rect.addTo(g)

			const textClassName = 'time-tick-text'
			const text = (g.find(`.${idClassName}.${textClassName}`)[0] || new Text().addClass(textClassName).addClass(idClassName)) as Text

			text.text(tick.time.get(this.gantt.time.fixUnit as unknown as UnitType).toString()).font({
				size: 14
			}).fill('#4e5969')
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
	}
}
