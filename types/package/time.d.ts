import { default as dayjs, Dayjs, ManipulateType, OpUnitType } from 'dayjs';
import { default as Gantt, TimeMetric, TimeScale } from './index';
import { EventBindingThis } from './event';
export type Tick = {
    time: Dayjs;
};
export declare class Time extends EventBindingThis {
    gantt: Gantt;
    ticks: number;
    timeTicks: number;
    stepTime: number;
    fixUnit: OpUnitType | null;
    fixUnitStepTime: number;
    startTime: Dayjs;
    endTime: Dayjs;
    private preInViewBoxTickIndexRange;
    private inViewBoxTickIndexRange;
    private preInViewBoxTimeTickIndexRange;
    private inViewBoxTimeTickIndexRange;
    constructor(gantt: Gantt);
    init(): {
        startTime: dayjs.Dayjs;
        endTime: dayjs.Dayjs;
    };
    bindEvent(): void;
    unbindEvent(): void;
    destroy(): void;
    caculateInViewBoxTickIndexRange(): void;
    caculateInViewBoxTimeTickIndexRange(): void;
    onScroll: import('lodash').DebouncedFuncLeading<(event: Event) => void>;
    getTimeTickByIndex(index: number): dayjs.Dayjs;
    lastTimeTick(): dayjs.Dayjs;
    getTimeTicksIterator(): Generator<{
        tickTime: dayjs.Dayjs;
        index: number;
    }, void, unknown>;
    getTickByIndex(index: number): dayjs.Dayjs;
    lastTick(): dayjs.Dayjs;
    getTicksIterator(): Generator<{
        tickTime: dayjs.Dayjs;
        index: number;
    }, void, unknown>;
    getNoneEventStartTime(): dayjs.Dayjs;
    dayjs2duration(time: Dayjs): number;
    time2x(time: Dayjs, startTime?: Dayjs): number;
    x2time(x: number, startTime?: Dayjs): Dayjs;
    getWidthByTwoTime(time1: Dayjs, time2: Dayjs): number;
    containerScrollLeftTime(): dayjs.Dayjs;
    stageWidthTime(): dayjs.Dayjs;
    length2milliseconds(length: number): number;
    caculateTicks(minTime: Dayjs, maxTime: Dayjs): {
        startTime: dayjs.Dayjs;
        endTime: dayjs.Dayjs;
    };
    caculateTicksByEndTime(endTime: Dayjs): void;
    caculateTicksByX(x: number): void;
}
export declare function timeMetricToDayjsAddParams(timeMetric: TimeMetric | number, num?: number): {
    params: [value: number, unit?: ManipulateType];
    fixTimeMetric: TimeScale | null;
};
