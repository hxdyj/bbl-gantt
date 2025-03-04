import { default as Gantt } from '.';
import { Dayjs } from 'dayjs';
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
    getXbyTime(time: Dayjs): number;
    getYbyIndex(index: number): number;
    getWidthByTwoTime(time1: Dayjs, time2: Dayjs): number;
}
