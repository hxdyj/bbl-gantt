import { G, Rect } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem, _GanttItem } from "..";
import { PartRender } from "./index";
import { Render } from "../render";
import { CssNameKey } from "../const/const";
import { EventItemRender } from "./eventItem/eventItemRender";
import { getUID } from "../utils/data";
import { EventBusEventName } from "#/event/const";

export class RowsRender extends PartRender {
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
		this.bindEventThis([
			'onBgRectMouseDown',
			'onBgRectMouseMove',
			'onContainerMouseUp',
			'onContainerMouseLeave',
		])
		this.bindEvent()
	}


	bindEvent(): void {
		this.gantt.container.addEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.addEventListener('mouseleave', this.onContainerMouseLeave)
	}

	unbindEvent(): void {
		this.gantt.container.removeEventListener('mouseup', this.onContainerMouseUp)
		this.gantt.container.removeEventListener('mouseleave', this.onContainerMouseLeave)
	}


	renderRow(row: _GanttItem, index?: number) {
		if (index === void 0) {
			index = this.gantt.list.findIndex(item => item.id === row.id)
		}
		const g = this.g!
		const bgClassName = `row-bg-${row.id}`
		const bgRect = g.find(`.${bgClassName}`)[0] || new Rect().addClass('row-bg').addClass(bgClassName)
		bgRect.size(this.gantt.stage.width(), this.gantt.options.row.height).move(0, this.renderer.getYbyIndex(index))
		bgRect.attr('style', `fill: ${row.bg || 'transparent'};`)
		bgRect.attr('data-row-id', row.id)
		bgRect.addTo(g)

		bgRect.off('mousedown', this.onBgRectMouseDown)
		bgRect.off('mousemove', this.onBgRectMouseMove)

		bgRect.on('mousedown', this.onBgRectMouseDown)
		bgRect.on('mousemove', this.onBgRectMouseMove)

		const y = this.renderer.getYbyIndex(index)

		const rect = g.find(`.${CssNameKey.row_line}.${row.id}`)[0] || new Rect().addClass(CssNameKey.row_line).addClass(row.id)

		rect.size(this.gantt.stage.width(), 0.2).move(0, y)

		if (index === 0) {
			rect.opacity(0)
		}
		rect.addTo(g)
	}

	g: G | null = null

	render() {
		const g = (this.gantt.stage.find(`.${CssNameKey.rows}`)[0] || new G().addClass(CssNameKey.rows)) as G
		this.g = g

		const rows = this.gantt.list

		rows.forEach((row, index) => {
			this.renderRow(row, index)
		})
		g.addTo(this.gantt.stage)
	}

	private getEventRowInfo(evt: Event) {
		const event = evt as MouseEvent
		const ele = event.target as SVGRectElement
		const rowId = ele.getAttribute('data-row-id')
		const rowIndex = this.gantt.list.findIndex(row => row.id === rowId)
		const row = this.gantt.list[rowIndex]
		return {
			event,
			row,
			rowIndex
		}
	}

	private addEventItem: EventItemRender | null = null
	private bgRectMouseDownEvent: Event | null = null

	onBgRectMouseDown(evt: Event) {
		this.bgRectMouseDownEvent = evt
	}
	onBgRectMouseMove(evt: Event) {
		const { event, row, rowIndex } = this.getEventRowInfo(evt)
		const downEvent = this.bgRectMouseDownEvent as MouseEvent
		if (!downEvent) return
		if (this.gantt.options.action.enableNewEventItem &&
			(event.clientX - downEvent.clientX) != 0 && !this.addEventItem
		) {
			const { x: eventX } = this.gantt.stage.point(event.clientX, event.clientY)

			const xTime = this.gantt.time.x2time(eventX)
			const time = this.gantt.options.action.moveOrResizeStep ?
				this.renderer.events.findNearTick(0, xTime)
				: xTime

			const newEventData: _GanttEventItem = {
				id: getUID(),
				start: time.clone(),
				end: time.clone(),
				rowId: row.id,
				name: 'new'
			}

			this.addEventItem = this.renderer.events.renderEvent(newEventData, rowIndex, row.events.length, this.renderer.events.g!)!
			this.renderer.events.onEventItemRightResizeMouseDown({
				event,
				itemRender: this.addEventItem
			})
			this.gantt.status.addEventIteming = true
		}

		if (this.gantt.status.addEventIteming) {
			this.renderer.events.onTypeResizeMouseMove(event)
		}
	}


	lastClickRow: _GanttItem | null = null
	onContainerMouseUp(evt: Event) {
		if (!this.bgRectMouseDownEvent) return
		const { row, rowIndex } = this.getEventRowInfo(this.bgRectMouseDownEvent)
		if (evt.timeStamp - this.bgRectMouseDownEvent.timeStamp <= 300) {
			this.gantt.eventBus.emit(EventBusEventName.row_click, evt, {
				row,
				rowIndex
			}, this.gantt)

			this.lastClickRow = row
		}

		if (this.gantt.status.addEventIteming) {
			if (!this.addEventItem) return


			this.renderer.events.onTypeResizeMouseUp()
			const { start, end } = this.addEventItem.options.event

			if (start.isSame(end)) {
				this.addEventItem.destroy()
			} else {
				const eventItemData = this.addEventItem.options.event
				row.events.push(eventItemData)


				this.gantt.eventBus.emit(EventBusEventName.event_item_add, {
					item: this.addEventItem,
					row,
					rowIndex
				}, this.gantt)
			}

			this.addEventItem = null
			this.gantt.status.addEventIteming = false
		}
		this.bgRectMouseDownEvent = null

	}

	onContainerMouseLeave(evt: Event) {
		this.onContainerMouseUp(evt)
	}

	destroy(): void {
		this.unbindEvent()
		const g = this.gantt.stage.find(`.${CssNameKey.rows}`)[0]
		g?.remove()
	}
}
