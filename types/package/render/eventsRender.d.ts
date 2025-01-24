import { G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttEventItem } from '..';
import { PartRender } from './index';
import { Render } from '../render';
export declare class EventsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    renderRect(event: _GanttEventItem, index: number, eventIndex: number, g: G): void;
    renderLine(event: _GanttEventItem, index: number, eventIndex: number, g: G): void;
    renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G): void;
    render(): void;
    destroy(): void;
}
