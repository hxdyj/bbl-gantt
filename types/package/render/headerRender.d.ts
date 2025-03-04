import { default as Gantt } from '..';
import { PartRender } from './index';
import { Render } from '../render';
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
    private renderCureentTime;
    render(): void;
    destroy(): void;
}
