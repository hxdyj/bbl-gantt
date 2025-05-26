import { G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttEventItem } from '..';
import { PartRender } from './index';
import { Render } from '../render';
import { EventItemRender } from './eventItem/eventItemRender';
import { default as dayjs, Dayjs } from 'dayjs';
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
export type EventItemOperateType = 'left-resize' | 'right-resize' | 'body-move';
export declare class EventsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    map: WeakMap<_GanttEventItem, EventItemRender>;
    renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G): EventItemRender | null;
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
    g: G | null;
    render(): void;
    destroy(): void;
    private createTmpItem;
    private caculateDiffXTime;
    findNearTick(diffX: number, currentTime: Dayjs): dayjs.Dayjs;
    private caculateTmpItemFinalX;
    onTypeResizeMouseMove(event: MouseEvent, start?: boolean): void;
    onTypeResizeMouseUp(): void;
    fixOutOfEdge(type: EventItemOperateType): void;
    onTypeBodyMoveMouseMove(event: MouseEvent): void;
    onTypeBodyMoveMouseUp(): void;
}
