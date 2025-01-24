import { Dayjs, ManipulateType, OpUnitType } from 'dayjs';
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
    x2time(x: number): Dayjs;
    caculateTicks(minTime: Dayjs, maxTime: Dayjs): void;
}
export declare function timeMetricToDayjsAddParams(timeMetric: TimeMetric | number, num?: number): {
    params: [value: number, unit?: ManipulateType];
    fixTimeMetric: TimeScale | null;
};
