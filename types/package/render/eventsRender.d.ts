import { G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttEventItem } from '..';
import { PartRender } from './index';
import { Render } from '../render';
import { EventItemRender } from './eventItem/eventItemRender';
export declare enum EventShapeType {
    rect = "rect",
    line = "line"
}
export type RenderItemOptions = {
    event: _GanttEventItem;
    index: number;
    eventIndex: number;
    addTo: G;
    gClassName?: string;
    bodyClassName?: string;
    bindEvent?: boolean;
};
export declare class EventsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    map: WeakMap<_GanttEventItem, EventItemRender>;
    renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G): void;
    bindEvent(): void;
    unbindEvent(): void;
    private startEvent;
    private itemRender;
    private tmpItem;
    private operateType;
    onEventItemLeftResizeMouseDown(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
    onEventItemRightResizeMouseDown(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
    onEventItemBodyMouseDown(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
    onContainerMouseMove(event: MouseEvent): void;
    onContainerMouseUp(): void;
    onContainerMouseLeave(): void;
    render(): void;
    destroy(): void;
    private createTmpItem;
    onTypeResizeMouseMove(event: MouseEvent, start?: boolean): void;
    onTypeResizeMouseUp(): void;
    onTypeBodyMoveMouseMove(event: MouseEvent): void;
    onTypeBodyMoveMouseUp(): void;
}
