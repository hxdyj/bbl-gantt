import { EventBindingThis } from '../../event';
import { Rect, Element, G } from '@svgdotjs/svg.js';
import { default as Gantt, _GanttEventItem } from '../..';
import { RenderItemOptions } from '../eventsRender';
import { Render } from '#/render';
export declare abstract class EventItemRender extends EventBindingThis {
    gantt: Gantt;
    renderer: Render;
    options: RenderItemOptions;
    uid: string;
    isRendered: boolean;
    g: G;
    constructor(gantt: Gantt, renderer: Render, options: RenderItemOptions);
    bindEvent(): void;
    unbindEvent(): void;
    onLeftResizeMouseDown(event: Event): void;
    onRightResizeMouseDown(event: Event): void;
    onBodyMouseDown(event: Event): void;
    onBodyMouseEnter(event: Event): void;
    onBodyMouseLeave(event: Event): void;
    svgjsInstance: {
        anchor: Rect | null;
        moveRect: Rect | null;
        leftResize: Rect | null;
        rightResize: Rect | null;
    };
    renderViewAnchor(parent: Element, event: _GanttEventItem, index: number): void;
    render(): void;
    abstract renderItem(): void;
    destroy(): void;
}
export declare function getStartAndEndTime(event: _GanttEventItem): {
    start: import('dayjs').Dayjs;
    end: import('dayjs').Dayjs;
};
