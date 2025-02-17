import { CssNameKey } from "#/const/const";
import { EventBindingThis } from "#/event";
import { Rect, Element, G } from "@svgdotjs/svg.js";
import Gantt, { _GanttEventItem } from "../..";
import { RenderItemOptions } from "../eventsRender";
import { Render } from "#/render";

export abstract class EventItemRender extends EventBindingThis {
	isRendered = false
	g: G
	constructor(public gantt: Gantt, public renderer: Render, public options: RenderItemOptions) {
		super()
		const { event, addTo } = options
		this.g = (addTo.find(`#${event.id}`)[0] || new G().id(event.id)).addClass(CssNameKey.event_item) as G
		this.renderItem()
	}

	renderViewAnchor(parent: Element, event: _GanttEventItem, index: number) {
		const anchor = (parent.find(`.${CssNameKey.event_anchor}`)[0] || new Rect().addClass(CssNameKey.event_anchor)) as Element
		anchor.size(1, this.gantt.options.row.height).move(this.renderer.getXbyTime(event.start), this.renderer.getYbyIndex(index)).opacity(0)
		anchor.addTo(parent)
	}

	renderItem() {
		const { event, index, addTo, gClassName, bodyClassName } = this.options
		gClassName && this.g.addClass(gClassName)
		this.renderViewAnchor(this.g, event, index)
		this.render()
		const body = this.g.find(`.${CssNameKey.event_body}`)[0]
		if (body) {
			if (bodyClassName) {
				body.addClass(bodyClassName)
			}
			if (!this.isRendered) {

			}
		}
		if (!this.isRendered) {
			this.g.addTo(addTo)
			this.isRendered = true
		}
	}

	abstract render(): void
}
