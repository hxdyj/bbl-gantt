import { default as dayjs } from 'dayjs';
export declare const FORMAT_FULL_TIME = "YYYY-MM-DD hh:mm:ss:SSS";
export declare function getDurationStartTime(addSeconds?: number): dayjs.Dayjs;
export declare function formatDuration(str: string): string;
