import { default as dayjs, Dayjs, ManipulateType, OpUnitType } from 'dayjs';
import { default as Gantt, TimeMetric, TimeScale } from './index';
export type Tick = {
    time: Dayjs;
};
export declare class Time {
    gantt: Gantt;
    ticks: Tick[];
    timeTicks: Tick[];
    stepTime: number;
    fixUnit: OpUnitType | null;
    constructor(gantt: Gantt);
    init(): void;
    getNoneEventStartTime(): dayjs.Dayjs;
    x2time(x: number, startTime?: Dayjs): Dayjs;
    length2milliseconds(x: number): number;
    caculateTicks(minTime: Dayjs, maxTime: Dayjs): void;
    caculateTicksByEndTime(endTime: Dayjs): void;
    caculateTicksByX(x: number): void;
}
export declare function timeMetricToDayjsAddParams(timeMetric: TimeMetric | number, num?: number): {
    params: [value: number, unit?: ManipulateType];
    fixTimeMetric: TimeScale | null;
};
