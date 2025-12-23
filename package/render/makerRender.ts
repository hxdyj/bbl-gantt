import Gantt, { GanttMakerItem, Render } from "..";
import { MakerItemRender, MakerItemRenderOptions } from "./makerItem/makerItemRender";
import { PartRender } from "./PartRender";

export class MakerRender extends PartRender {
	instanceMap = new Map<string, MakerItemRender>()
	constructor(public gantt: Gantt, public renderer: Render) {
		super(gantt, renderer)
	}

	render(options?: MakerItemRenderOptions): void {
		this.gantt.options.makerData.forEach(item => {
			let instance = this.instanceMap.get(item.id)
			if (!instance) {
				instance = new MakerItemRender(this.gantt, this.renderer, item)
				this.instanceMap.set(item.id, instance)
			}
			instance.render(options)
		})
	}

	destroy(): void {
		this.instanceMap.forEach(instance => {
			instance.destroy()
		})
		this.instanceMap.clear()
	}
}
