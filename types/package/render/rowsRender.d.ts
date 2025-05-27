import { G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttItem } from '..';
import { PartRender } from './index';
import { Render } from '../render';
export declare class RowsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    bindEvent(): void;
    unbindEvent(): void;
    renderRow(row: _GanttItem, index?: number): void;
    deleteRow(row: _GanttItem, emit?: boolean): void;
    g: G | null;
    render(): void;
    private getEventRowInfo;
    private addEventItem;
    private bgRectMouseDownEvent;
    onBgRectMouseDown(evt: Event): void;
    onBgRectMouseMove(evt: Event): void;
    lastClickRow: _GanttItem | null;
    onContainerMouseUp(evt: Event): void;
    onContainerMouseLeave(evt: Event): void;
    destroy(): void;
}
