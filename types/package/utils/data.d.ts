import { default as dayjs } from 'dayjs';
import { _GanttItem, GanttItem } from '..';
export declare function walkData(data: GanttItem[], callback: (params: {
    item: GanttItem;
    level: number;
    parent: GanttItem | null;
}) => void, level?: number, parent?: GanttItem | null): void;
export declare function initDealData(data: GanttItem[]): {
    maxTime: dayjs.Dayjs;
    minTime: dayjs.Dayjs;
    list: _GanttItem[];
};
