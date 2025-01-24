import { ContainerType } from '../index';
export declare function getElement(el: ContainerType): HTMLElement;
export declare function getContainerInfo(el: ContainerType): {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
    x: number;
    y: number;
};
export declare function createOrGetEle(className: string, parent: HTMLElement, tagName?: string): HTMLElement;
