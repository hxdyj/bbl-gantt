import { EventBindingThis } from "../event";
import { Render } from "../render";
import Gantt from "..";

export class PartRender extends EventBindingThis {
	constructor(public gantt: Gantt, public renderer: Render) {
		super()
	}
	render() { }
	bindEvent() { }
	unbindEvent() { }
	destroy() { }
}

export * from './eventItem/index'
export * from './eventsRender'
export * from './headerRender'
export * from './rowsRender'
export * from './ticksRender'

