import { EventBindingThis } from '../event';
import { Render } from '../render';
import { default as Gantt } from '..';
export declare class PartRender<RenderOptions = any> extends EventBindingThis {
    gantt: Gantt;
    renderer: Render;
    constructor(gantt: Gantt, renderer: Render);
    render(options?: RenderOptions): void;
    bindEvent(): void;
    unbindEvent(): void;
    /**
     * Clear all rendered content without destroying the renderer.
     * Subclasses should override this to clear their specific SVG groups.
     */
    clear(): void;
    destroy(): void;
}
