import { G, Text } from '@svgdotjs/svg.js';
import { default as Gantt } from '../index';
import { PartRender } from './index';
import { Render } from '../render';
import { Dayjs } from 'dayjs';
export declare class TicksRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    g: G | null;
    gText: G | null;
    constructor(gantt: Gantt, renderer: Render);
    renderTickItem(tickTime: Dayjs, index: number, preTickId?: string, g?: G, textG?: G): {
        idClassName: string;
        text: Text | null;
    };
    render(): void;
    clear(): void;
    destroy(): void;
}
