import { CssNameKey } from "#/const/const";
import { EventBindingThis } from "#/event";
import { Rect, Element, G } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "../..";
import { RenderItemOptions } from "../eventsRender";
import { Render } from "#/render";
import { uid } from 'uid';
import { EventBusEventName } from "#/event/const";

export abstract class EventItemRender extends EventBindingThis {
	uid: string
	isRendered = false
	g: G
	constructor(public gantt: Gantt, public renderer: Render, public options: RenderItemOptions) {
		super()
		const { event, addTo } = options
		this.uid = `event-item-` + uid(6)
		this.g = (addTo.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item) as G
		this.bindEventThis(['onBodyMouseDown', 'onBodyMouseEnter', 'onBodyMouseLeave'])
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
		const evt = event as MouseEvent
		const { leftResize, rightResize } = this.svgjsInstance
		leftResize?.show()
		rightResize?.show()
	}

	onBodyMouseLeave(event: Event) {
		const evt = event as MouseEvent
		const { leftResize, rightResize } = this.svgjsInstance
		leftResize?.hide()
		rightResize?.hide()
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
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Rect
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).opacity(0)
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

			const width = this.renderer.getWidthByTwoTime(event.start, event.end)
			const height = this.gantt.options.row.height
			const x = this.renderer.getXbyTime(event.start)
			const y = this.renderer.getYbyIndex(index)

			const moveRect = (this.g.find(`.${CssNameKey.event_move_rect}`)[0] || new Rect().addClass(CssNameKey.event_move_rect)) as Rect
			moveRect.size(width, height).move(x, y).fill('transparent').addTo(this.g)

			const leftResize = (this.g.find(`.${CssNameKey.event_left_reisze}`)[0] || new Rect().addClass(CssNameKey.event_left_reisze).addClass(CssNameKey.event_reisze)) as Rect
			const rightResize = (this.g.find(`.${CssNameKey.event_right_reisze}`)[0] || new Rect().addClass(CssNameKey.event_right_reisze).addClass(CssNameKey.event_reisze)) as Rect

			const resizeWidth = 6
			const resizeHeight = height / 4
			const resizeY = y + (height - resizeHeight) / 2
			leftResize.size(resizeWidth, resizeHeight).move(x, resizeY).radius(3).hide()
			rightResize.size(resizeWidth, resizeHeight).move(x + width - resizeWidth, resizeY).radius(3).hide()

			leftResize.addTo(this.g)
			rightResize.addTo(this.g)

			this.svgjsInstance.moveRect = moveRect
			this.svgjsInstance.leftResize = leftResize
			this.svgjsInstance.rightResize = rightResize

			if (!this.isRendered) {
				moveRect.on('mousedown', this.onBodyMouseDown)
				moveRect.on('mouseenter', this.onBodyMouseEnter)
				moveRect.on('mouseleave', this.onBodyMouseLeave)
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
