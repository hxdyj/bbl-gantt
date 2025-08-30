import { G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttEventItem, GanttEventItem, GanttEventItemTime, GanttItem } from '../index';
import { PartRender } from './index';
import { Render } from '../render';
import { EventItemRender } from './eventItem/eventItemRender';
import { default as dayjs, Dayjs } from 'dayjs';
import { DeepPartial } from 'utility-types';
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
export type FindOptionEventItemResult = {
    item: GanttItem;
    parent: GanttItem | null;
    event: _GanttEventItem;
    eventOrigin?: GanttEventItem;
    eventIndex: number;
};
export declare class EventsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    map: WeakMap<_GanttEventItem, EventItemRender>;
    renderEvent(event: _GanttEventItem, index: number, eventIndex: number, g: G): EventItemRender | null;
    findOptionDataEvent(event: _GanttEventItem): null | FindOptionEventItemResult;
    deleteEvent(event: _GanttEventItem, emit?: boolean): void;
    removeEvent(event: _GanttEventItem): void;
    bindEvent(): void;
    unbindEvent(): void;
    private startEvent;
    private itemRender;
    private tmpItem;
    private operateType;
    isHovering: boolean;
    onEventItemBodyMouseEnter(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
    onEventItemBodyMouseMove(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
    cancelHovering(): void;
    onEventItemBodyMouseLeave(args: {
        event: MouseEvent;
        itemRender: EventItemRender;
    }): void;
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
    updateEventItem(eventOrId: _GanttEventItem | string, newData: DeepPartial<Omit<_GanttEventItem | GanttEventItem, 'id'>>, needRender?: boolean): void;
    formatEventDataTime(newData: DeepPartial<Omit<_GanttEventItem, 'id'>>): {
        start?: GanttEventItemTime;
        end?: GanttEventItemTime;
    };
    onTypeResizeMouseUp(): void;
    fixOutOfEdge(type: EventItemOperateType): void;
    onTypeBodyMoveMouseMove(event: MouseEvent): void;
    onTypeBodyMoveMouseUp(): void;
}
