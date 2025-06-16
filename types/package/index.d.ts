import { Svg } from '@svgdotjs/svg.js';
import { default as EventEmitter } from 'eventemitter3';
import { EventBindingThis } from './event';
import { UnitType, Dayjs } from 'dayjs';
import { getContainerInfo } from './utils/dom';
import { DeepPartial } from '@arco-design/web-react/es/Form/store';
import { View } from './view';
import { DeepRequired } from 'utility-types';
import { Time } from './time';
import { Render } from './render';
import { EventShapeType } from './render/eventsRender';
export declare enum TimeMetric {
    SECOND = "SECOND",
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
export type TimeScale = keyof Pick<typeof TimeMetric, 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>;
export type Column = {
    width: number;
    timeMetric: number | TimeMetric;
    padding: {
        left: number;
        right: number;
    };
};
export declare enum GanttMode {
    Normal = "normal",
    Duration = "duration"
}
export type ContainerType = string | HTMLElement;
export type DurationModeOptions = {
    duration: number;
};
export type HeaderTimeFormatArgs = {
    gantt: Gantt;
    time: Dayjs;
    unit: UnitType;
    type: 'currentTime' | 'timeRange' | 'tick';
};
export type _GanttOptions = {
    readOnly?: boolean;
    column?: DeepPartial<Column>;
    row?: {
        height?: number;
    };
    header?: {
        height?: number;
    };
    view?: {
        headerTimeFormat?: (args: HeaderTimeFormatArgs) => string;
        whileShowScrollReduceScrollBarSize?: boolean;
        whileRowsLessContainerAutoReduceHeight?: boolean;
        showScrollBar?: boolean;
        showTicks?: boolean;
        showTickText?: boolean;
        showTimeTicks?: boolean;
        showTimeTickText?: boolean;
        headerTickTextTickNeeded?: boolean;
        showEventTimeRange?: boolean;
        overrideHeaderTitle?: boolean;
        eventRectStylePadY?: number;
    };
    action?: {
        headerWheelTimeMetric?: boolean | {
            min?: number;
            max?: number;
        };
        moveOrResizeStep?: boolean;
        enableEventMove?: boolean;
        enableEventResize?: boolean;
        enableCurrentTime?: boolean;
        enableMoveOrResizeOutOfEdge?: boolean;
        enableNewEventItem?: boolean;
    };
    data?: GanttItem[];
    format?: {
        eventItemTime?: (time: Dayjs) => GanttEventItemTime;
    };
};
export type NormalModeGanttOptions = _GanttOptions & {
    mode?: GanttMode.Normal;
};
export type DurationModeGanttOptions = _GanttOptions & {
    mode: GanttMode.Duration;
    durationModeOptions: DurationModeOptions;
    view?: _GanttOptions['view'] & {
        timeFullWidth?: boolean;
    };
};
export type GanttOptions = (NormalModeGanttOptions | DurationModeGanttOptions) & {
    el: ContainerType;
};
export declare const defaultGanttOptions: DeepPartial<GanttOptions>;
export declare class GanttManager {
    ganttEleInstanceWeakMap: WeakMap<HTMLElement, Gantt>;
    idInstanceMap: Map<string, Gantt>;
    addNewInstance(instance: Gantt): void;
    removeInstance(instance: Gantt): void;
}
export declare const ganttManager: GanttManager;
export type GanttEventItemTime = string | number | Date | Dayjs;
export type GanttEventItem = {
    id: string;
    start: GanttEventItemTime;
    end: GanttEventItemTime;
    name: string;
    shape?: EventShapeType;
    color?: string;
    textColor?: string;
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
    id: string;
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
    parentContainer: HTMLElement;
    container: HTMLElement;
    body: HTMLElement;
    stage: Svg;
    eventBus: EventEmitter<string | symbol, any>;
    private destroyed;
    createTime: number;
    status: {
        eventMoving: boolean;
        eventResizing: boolean;
        addEventIteming: boolean;
    };
    options: DeepRequired<GanttOptions> & {
        mode: GanttMode;
    };
    parentContainerRectInfo: ReturnType<typeof getContainerInfo>;
    containerRectInfo: ReturnType<typeof getContainerInfo>;
    view: View;
    time: Time;
    render: Render;
    constructor(options: GanttOptions);
    initOptions(options: GanttOptions, defaultOptions?: DeepPartial<GanttOptions>): DeepRequired<GanttOptions> & {
        mode: GanttMode;
    };
    minTime: Dayjs | null;
    maxTime: Dayjs | null;
    updateColumnByTimeFullWidth(): void;
    protected init(): void;
    private onContainerScroll;
    bindEvent(): void;
    unbindEvent(): void;
    getHeaderWheelTimeMetricLimitDefaultRange(options?: GanttOptions): {
        min: number;
        max: number;
    };
    caculateContainerInfo(): void;
    updateOptions(options?: Partial<Omit<GanttOptions, 'el'>>): void;
    protected parentContainerResizeObserverCallback: ResizeObserverCallback;
    protected parentContainerResizeObserver: ResizeObserver;
    destroy(): void;
    on(...rest: any): this;
    off(...rest: any): this;
}
export default Gantt;
export * from './const/index';
export * from './event/index';
export * from './render/index';
export * from './utils/index';
export * from './render';
export * from './time';
export * from './view';
