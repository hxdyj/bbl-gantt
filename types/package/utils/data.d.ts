import { default as dayjs } from 'dayjs';
import { _GanttItem, GanttItem, GanttOptions } from '../index';
import { DeepRequired } from 'utility-types';
export declare function getUID(id?: string | number): string;
export declare function walkData(data: GanttItem[], callback: (params: {
    item: GanttItem;
    level: number;
    parent: GanttItem | null;
}) => void | boolean, level?: number, parent?: GanttItem | null): void;
export declare function initDealData(data: GanttItem[], options: DeepRequired<GanttOptions>): {
    maxTime: dayjs.Dayjs | null;
    minTime: dayjs.Dayjs | null;
    list: _GanttItem[];
};
export declare function isInfinity(num: number): boolean;
