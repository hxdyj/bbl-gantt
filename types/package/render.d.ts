import { default as Gantt } from './index';
import { EventBindingThis } from './event';
import { HeaderRender } from './render/headerRender';
import { TicksRender } from './render/ticksRender';
import { RowsRender } from './render/rowsRender';
import { EventsRender } from './render/eventsRender';
export declare class Render extends EventBindingThis {
    gantt: Gantt;
    header: HeaderRender;
    ticks: TicksRender;
    rows: RowsRender;
    events: EventsRender;
    constructor(gantt: Gantt);
    private bindEvent;
    private unbindEvent;
    destroy(): void;
    render(): void;
    caculateGanttBox(): {
        width: number;
        height: number;
    };
    getYbyIndex(index: number): number;
}
