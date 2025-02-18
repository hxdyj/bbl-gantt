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
		this.bindEventThis(['onBodyMouseDown'])

		this.g = (addTo.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item) as G
		this.render()
		this.bindEvent()
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


	renderViewAnchor(parent: Element, event: _GanttEventItem, index: number) {
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Element
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).opacity(0)
		anchor.addTo(parent)
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

			const moveRect = (this.g.find(`.${CssNameKey.event_move_rect}`)[0] || new Rect().addClass(CssNameKey.event_move_rect)) as Rect
			moveRect.size(this.renderer.getWidthByTwoTime(event.start, event.end), this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).fill('transparent').addTo(this.g)
			if (!this.isRendered) {
				moveRect.on('mousedown', this.onBodyMouseDown)
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
