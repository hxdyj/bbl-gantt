import { default as Gantt } from '.';
export type Point = [number, number];
export type Box = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function pointInBox(point: Point, box: Box): boolean;
export declare class View {
    gantt: Gantt;
    constructor(gantt: Gantt);
    scrollToID(id: string, options?: ScrollToOptions): void;
    scrollToItem(itemId: string, options?: ScrollToOptions): void;
    scrollToEvent(eventId: string, options?: ScrollToOptions): void;
    scrollToEarliestItem(options?: ScrollToOptions): void;
}
