import { default as Gantt, Render } from '..';
import { MakerItemRender, MakerItemRenderOptions } from './makerItem/makerItemRender';
import { PartRender } from './PartRender';
export declare class MakerRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    instanceMap: Map<string, MakerItemRender>;
    constructor(gantt: Gantt, renderer: Render);
    render(options?: MakerItemRenderOptions): void;
    destroy(): void;
}
