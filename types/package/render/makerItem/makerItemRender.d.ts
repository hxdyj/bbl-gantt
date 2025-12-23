import { Render } from '../../render';
import { default as Gantt, GanttMakerItem } from '../../index';
import { Dayjs } from 'dayjs';
declare const PARTS: readonly ["header", "tick"];
export type MakerItemPartType = (typeof PARTS)[number];
export type MakerItemRenderOptions = {
    parts: MakerItemPartType[];
};
export declare class MakerItemRender {
    gantt: Gantt;
    renderer: Render;
    data: GanttMakerItem;
    time: Dayjs;
    x: number;
    constructor(gantt: Gantt, renderer: Render, data: GanttMakerItem);
    getClassPrefix(): string;
    render(options?: MakerItemRenderOptions): void;
    private renderMakerHeaderPart;
    private renderMakerTickPart;
    destroy(): void;
}
export {};
