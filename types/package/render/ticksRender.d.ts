import { G, Text } from '@svgdotjs/svg.js';
import { default as Gantt } from '../index';
import { PartRender } from './index';
import { Render } from '../render';
import { Dayjs } from 'dayjs';
export type TickItemOptions = {
    fill?: string;
    width?: number;
};
export declare class TicksRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    g: G | null;
    gText: G | null;
    constructor(gantt: Gantt, renderer: Render);
    renderTickItem(options: {
        tickTime: Dayjs;
        index?: number;
        source?: 'header' | 'ticks' | 'maker';
        idPrefix?: string;
        preTickId?: string;
        g?: G;
        textG?: G;
        tickItemOptions?: TickItemOptions;
    }): {
        idClassName: string;
        text: Text | null;
        rect: import('@svgdotjs/svg.js').Element;
        rectTimeTick: import('@svgdotjs/svg.js').Element | null;
    };
    render(): void;
    clear(): void;
    destroy(): void;
}
