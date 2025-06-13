import { EventBindingThis } from "../event";
import type { Render } from "../render";
import type Gantt from "..";

export class PartRender extends EventBindingThis {
	constructor(public gantt: Gantt, public renderer: Render) {
		super()
	}
	render() { }
	bindEvent() { }
	unbindEvent() { }
	destroy() { }
}
