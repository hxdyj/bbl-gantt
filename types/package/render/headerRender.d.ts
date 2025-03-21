import { G, Text } from '@svgdotjs/svg.js';
import { default as Gantt } from '../index';
import { Dayjs } from 'dayjs';
import { PartRender } from './index';
import { Render } from '../render';
import { EventItemRender } from './eventItem/eventItemRender';
export declare class HeaderRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    bindEvent(): void;
    unbindEvent(): void;
    getCurrentTime(): {
        exist: boolean;
        currentTime: import('@svgdotjs/svg.js').Element;
        currentTimeX: number;
    };
    onCurrentTimeExistRender(): void;
    onScroll(event: Event): void;
    private mouseDownTime;
    private onBodyMouseDown;
    private onBodyMouseUp;
    currentTimeG: G | null;
    hideCurrentTime(): void;
    showCurrentTime(): void;
    timeRange: G | null;
    renderEventTimeRange(event: MouseEvent, tmpItem?: EventItemRender | null): void;
    removeEventTimeRange(): void;
    private renderCureentTime;
    renderTimeTickText(getText: () => Text, tickTime: Dayjs, g: G, getPreText: () => Text, preTickId?: string): Text | null;
    onHeaderWheel(evt: Event): void;
    g: G | null;
    render(): void;
    clear(): void;
    destroy(): void;
}
