import { EventBindingThis } from '../event';
import { Render } from '../render';
import { default as Gantt } from '..';
export declare class PartRender extends EventBindingThis {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    render(): void;
    bindEvent(): void;
    unbindEvent(): void;
    destroy(): void;
}
