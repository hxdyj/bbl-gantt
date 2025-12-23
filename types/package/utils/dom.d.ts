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
export declare function hasScrollbar(element: Element): {
    vertical: boolean;
    horizontal: boolean;
};
/**
 * 优化版：仅遍历一次DOM树，批量获取多个CSS变量的值
 * @param nameList CSS变量名列表（可带/不带--前缀）
 * @param element 起始查找的元素，默认document.body
 * @returns 按nameList顺序返回的结果数组，找不到则为null
 */
export declare function getCssVars(nameList: string[], element?: Element): (string | null)[];
export declare function getScrollBarCssVar(ele?: Element): {
    scrollBarWidth: number;
    scrollBarHeight: number;
};
