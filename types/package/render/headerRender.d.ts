import { default as Gantt } from '..';
import { PartRender } from './index';
import { Render } from '../render';
export declare class HeaderRender extends PartRender {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    bindEvent(): void;
    unbindEvent(): void;
    onScroll(event: Event): void;
    private onBodyClick;
    private renderCureentTime;
    render(): void;
    destroy(): void;
}
