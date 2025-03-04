import { default as dayjs } from 'dayjs';
import { _GanttItem, GanttItem } from '..';
export declare function getUID(): string;
export declare function walkData(data: GanttItem[], callback: (params: {
    item: GanttItem;
    level: number;
    parent: GanttItem | null;
}) => void, level?: number, parent?: GanttItem | null): void;
export declare function initDealData(data: GanttItem[]): {
    maxTime: dayjs.Dayjs | null;
    minTime: dayjs.Dayjs | null;
    list: _GanttItem[];
};
export declare function isInfinity(num: number): boolean;
