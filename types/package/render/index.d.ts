import { EventBindingThis } from '../event';
import { Render } from '../render';
import { default as Gantt } from '..';
export declare abstract class PartRender extends EventBindingThis {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    abstract render(): void;
    bindEvent(): void;
    unbindEvent(): void;
    abstract destroy(): void;
}
export * from './eventItem/index';
export * from './eventsRender';
export * from './headerRender';
export * from './rowsRender';
export * from './ticksRender';
