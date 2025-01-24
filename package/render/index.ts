import { EventBindingThis } from "../event";
import { Render } from "../render";
import Gantt from "..";

export abstract class PartRender extends EventBindingThis {
	constructor(public gantt: Gantt, public renderer: Render) {
		super()
	}

	abstract render(): void

	bindEvent() { }

	unbindEvent() { }

	abstract destroy(): void
}
