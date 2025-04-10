import { CssNameKey } from "../../const/const";
import { EventBindingThis } from "../../event";
import { Rect, Element, G } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "../..";
import { RenderItemOptions } from "../eventsRender";
import { Render } from "../../render";
import { uid } from 'uid';
import { EventBusEventName } from "../../event/const";

export abstract class EventItemRender extends EventBindingThis {
	uid: string
	isRendered = false
	g: G
	constructor(public gantt: Gantt, public renderer: Render, public options: RenderItemOptions) {
		super()
		const { event, addTo } = options
		this.uid = `event-item-` + uid(6)
		this.g = (addTo.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item) as G
		if (!this.gantt.options.action.enableEventMove) {
			this.g.addClass('no-move')
		}
		if (!this.gantt.options.action.enableEventResize) {
			this.g.addClass('no-resize')
		}
		this.bindEventThis(['onBodyMouseDown', 'onBodyMouseEnter', 'onBodyMouseLeave', 'onLeftResizeMouseDown', 'onRightResizeMouseDown', 'onBodyContextMenu'])
		this.render()
		const { bindEvent = true } = options || {}
		if (bindEvent) {
			this.bindEvent()
		}
	}

	bindEvent() {
	}

	unbindEvent() {
	}

	onLeftResizeMouseDown(event: Event) {
		const evt = event as MouseEvent
		if (evt.button === 0) {
			this.gantt.eventBus.emit(EventBusEventName.event_item_left_resize_mouse_down, {
				event,
				itemRender: this
			})
		}
	}

	onRightResizeMouseDown(event: Event) {
		const evt = event as MouseEvent
		if (evt.button === 0) {
			this.gantt.eventBus.emit(EventBusEventName.event_item_right_resize_mouse_down, {
				event,
				itemRender: this
			})
		}
	}

	onBodyMouseDown(event: Event) {
		const evt = event as MouseEvent
		if (evt.button === 0) {
			this.gantt.eventBus.emit(EventBusEventName.event_item_body_mouse_down, {
				event,
				itemRender: this
			})
		}
	}

	onBodyMouseEnter(event: Event) {
		if (this.gantt.status.eventResizing || this.gantt.status.eventMoving) return
		const evt = event as MouseEvent
		const { leftResize, rightResize } = this.svgjsInstance
		leftResize?.show()
		rightResize?.show()
	}

	onBodyMouseLeave(event: Event) {
		if (this.gantt.status.eventResizing || this.gantt.status.eventMoving) return
		const evt = event as MouseEvent
		const { leftResize, rightResize } = this.svgjsInstance
		leftResize?.hide()
		rightResize?.hide()
	}

	onBodyContextMenu(event: Event) {
		event.preventDefault()
		this.gantt.eventBus.emit(EventBusEventName.event_item_body_context_menu, event, this.options.event, this.gantt)
	}

	svgjsInstance: {
		anchor: Rect | null
		moveRect: Rect | null
		leftResize: Rect | null
		rightResize: Rect | null
	} = {
			anchor: null,
			moveRect: null,
			leftResize: null,
			rightResize: null
		}
	renderViewAnchor(parent: Element, event: _GanttEventItem, index: number) {
		const { start, end } = getStartAndEndTime(event)
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Rect
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(start), this.renderer.getYbyIndex(index)).opacity(0)
		anchor.addTo(parent)
		this.svgjsInstance.anchor = anchor
	}

	render() {
		const { event, index, addTo, gClassName, bodyClassName } = this.options
		gClassName && this.g.addClass(gClassName)
		this.renderViewAnchor(this.g, event, index)
		this.renderItem()
		const body = this.g.find(`.${CssNameKey.event_body}`)[0]
		if (body) {
			if (bodyClassName) {
				body.addClass(bodyClassName)
			}
			const { start, end } = getStartAndEndTime(event)

			const width = this.renderer.getWidthByTwoTime(start, end)
			const height = this.gantt.options.row.height
			const x = this.renderer.getXbyTime(start)
			const y = this.renderer.getYbyIndex(index)
			let moveRect: Rect | null = null
			moveRect = (this.g.find(`.${CssNameKey.event_move_rect}`)[0] || new Rect().addClass(CssNameKey.event_move_rect)) as Rect
			moveRect.size(width, height).move(x, y).fill('transparent').addTo(this.g)
			let leftResize: Rect | null = null
			let rightResize: Rect | null = null

			if (this.gantt.options.action.enableEventResize) {
				leftResize = (this.g.find(`.${CssNameKey.event_left_reisze}`)[0] || new Rect().addClass(CssNameKey.event_left_reisze).addClass(CssNameKey.event_reisze)) as Rect
				rightResize = (this.g.find(`.${CssNameKey.event_right_reisze}`)[0] || new Rect().addClass(CssNameKey.event_right_reisze).addClass(CssNameKey.event_reisze)) as Rect
				const resizeWidth = 8
				const resizeHeight = height / 3
				const resizeY = y + (height - resizeHeight) / 2
				const resizeBorderRadius = 3
				leftResize.size(resizeWidth, resizeHeight).move(x, resizeY).radius(resizeBorderRadius).hide()
				rightResize.size(resizeWidth, resizeHeight).move(x + width - resizeWidth, resizeY).radius(resizeBorderRadius).hide()

				leftResize.addTo(this.g)
				rightResize.addTo(this.g)
			}



			this.svgjsInstance.moveRect = moveRect
			this.svgjsInstance.leftResize = leftResize
			this.svgjsInstance.rightResize = rightResize

			if (!this.isRendered) {

				moveRect?.on('mousedown', this.onBodyMouseDown)
				moveRect?.on('mouseenter', this.onBodyMouseEnter)
				moveRect?.on('mouseleave', this.onBodyMouseLeave)
				moveRect?.on('contextmenu', this.onBodyContextMenu)
				leftResize?.on('mousedown', this.onLeftResizeMouseDown)
				leftResize?.on('mouseenter', this.onBodyMouseEnter)
				leftResize?.on('mouseleave', this.onBodyMouseLeave)

				rightResize?.on('mousedown', this.onRightResizeMouseDown)
				rightResize?.on('mouseenter', this.onBodyMouseEnter)
				rightResize?.on('mouseleave', this.onBodyMouseLeave)
			}
		}
		if (!this.isRendered) {
			this.g.addTo(addTo)
			this.isRendered = true
		}
	}

	abstract renderItem(): void

	destroy() {
		this.unbindEvent()
		this.g.remove()
	}
}


export function getStartAndEndTime(event: _GanttEventItem) {
	const { start, end } = event
	const isStartAfterEnd = start.isAfter(end)

	if (isStartAfterEnd) {
		return {
			start: end.clone(),
			end: start.clone()
		}
	} else {
		return {
			start: start.clone(),
			end: end.clone()
		}
	}
}
