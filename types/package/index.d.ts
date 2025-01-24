import { Svg } from '@svgdotjs/svg.js';
import { default as EventEmitter } from 'eventemitter3';
import { EventBindingThis } from './event';
import { getContainerInfo } from './utils/dom';
import { DeepPartial } from '@arco-design/web-react/es/Form/store';
import { Dayjs } from 'dayjs';
import { View } from './view';
import { DeepRequired } from 'utility-types';
import { Time } from './time';
import { Render } from './render';
export declare enum TimeMetric {
    MINUTE = "MINUTE",
    QUARTER_HOUR = "QUARTER_HOUR",
    HALF_HOUR = "HALF_HOUR",
    HOUR = "HOUR",
    QUARTER_DAY = "QUARTER_DAY",
    HALF_DAY = "HALF_DAY",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
}
export type TimeScale = keyof Pick<typeof TimeMetric, 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>;
export type Column = {
    width: number;
    timeMetric: number | TimeMetric;
    padding: {
        left: number;
        right: number;
    };
};
export type ContainerType = string | HTMLElement;
export type GanttOptions = {
    el: ContainerType;
    column?: DeepPartial<Column>;
    row?: {
        height: number;
    };
    header?: {
        height: number;
    };
    data: GanttItem[];
};
export declare const defaultGanttOptions: DeepPartial<GanttOptions>;
export declare class GanttManager {
    ganttEleInstanceWeakMap: WeakMap<HTMLElement, Gantt>;
    idInstanceMap: Map<string, Gantt>;
    addNewInstance(instance: Gantt): void;
    removeInstance(instance: Gantt): void;
}
export declare const ganttManager: GanttManager;
export type GanttEventItem = {
    start: string | number | Date | Dayjs;
    end: string | number | Date | Dayjs;
    name: string;
    [key: string]: any;
};
export type _GanttEventItem = Omit<GanttEventItem, 'start' | 'end'> & {
    start: Dayjs;
    end: Dayjs;
};
export type _GanttItem = Omit<GanttItem, 'events'> & {
    events: _GanttEventItem[];
};
export type GanttItem = {
    name: string;
    events: GanttEventItem[];
    children?: GanttItem[];
    bg?: string;
    [key: string]: any;
};
export declare class Gantt extends EventBindingThis {
    id: string;
    data: GanttItem[];
    list: _GanttItem[];
    container: HTMLElement;
    body: HTMLElement;
    stage: Svg;
    eventBus: EventEmitter<string | symbol, any>;
    private destroyed;
    createTime: number;
    options: DeepRequired<GanttOptions>;
    containerRectInfo: ReturnType<typeof getContainerInfo>;
    view: View;
    time: Time;
    render: Render;
    constructor(options: GanttOptions);
    minTime: Dayjs | null;
    maxTime: Dayjs | null;
    protected init(): void;
    bindEvent(): void;
    unbindEvent(): void;
    destroy(): void;
    protected draw(): void;
    on(...rest: any): this;
    off(...rest: any): this;
}
export default Gantt;
