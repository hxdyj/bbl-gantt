import { default as Gantt } from '..';
import { PartRender } from './index';
import { Render } from '../render';
export declare class RowsRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    render(): void;
    destroy(): void;
}
