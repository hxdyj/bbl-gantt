import { ContainerType } from "../index"


export function getElement(el: ContainerType): HTMLElement {
	if (typeof el === 'string') {
		return document.querySelector(el) as HTMLElement
	}
	return el
}

export function getContainerInfo(el: ContainerType) {
	let ele = getElement(el)
	let containerRectInfo = ele.getBoundingClientRect()
	const containerInfo = {
		top: containerRectInfo.top,
		right: containerRectInfo.right,
		bottom: containerRectInfo.bottom,
		left: containerRectInfo.left,
		width: containerRectInfo.width,
		height: containerRectInfo.height,
		x: containerRectInfo.x,
		y: containerRectInfo.y,
	}
	return containerInfo
}

export function createOrGetEle(className: string, parent: HTMLElement, tagName: string = 'div'): HTMLElement {
	let ele = parent.querySelector(`.${className}`)
	if (ele) return ele as HTMLElement
	ele = document.createElement(tagName)
	ele.classList.add(className)
	parent.appendChild(ele)
	return ele as HTMLElement
}


export function hasScrollbar(element: Element) {
	// 检查垂直滚动条
	const hasVerticalScroll = element.scrollHeight > element.clientHeight;

	// 检查水平滚动条
	const hasHorizontalScroll = element.scrollWidth > element.clientWidth;

	return {
		vertical: hasVerticalScroll,
		horizontal: hasHorizontalScroll
	}
}



/**
 * 优化版：仅遍历一次DOM树，批量获取多个CSS变量的值
 * @param nameList CSS变量名列表（可带/不带--前缀）
 * @param element 起始查找的元素，默认document.body
 * @returns 按nameList顺序返回的结果数组，找不到则为null
 */
export function getCssVars(nameList: string[], element?: Element): (string | null)[] {
	// 2. 初始化结果数组，默认值为null（未找到）
	const result: (string | null)[] = new Array(nameList.length).fill(null);
	// 标记是否所有变量都已找到（用于提前终止遍历）
	let allFound = false;

	// 3. 仅遍历一次DOM树，批量获取所有变量
	let currentElement: Element | null = element || document.body;
	while (currentElement && !allFound) {
		const computedStyle = getComputedStyle(currentElement);

		// 遍历所有未找到的变量，尝试从当前元素获取值
		for (let i = 0; i < nameList.length; i++) {
			if (result[i] === null) { // 只处理还没找到值的变量
				const value = computedStyle.getPropertyValue(nameList[i]).trim();
				if (value) {
					result[i] = value;
				}
			}
		}

		// 检查是否所有变量都已找到，若全部找到则提前退出遍历
		allFound = result.every(val => val !== null);
		// 向上查找父元素
		currentElement = currentElement.parentElement;
	}

	// 4. 最后检查:root（仅处理仍未找到的变量）
	if (!allFound) {
		const rootStyle = getComputedStyle(document.documentElement);
		for (let i = 0; i < nameList.length; i++) {
			if (result[i] === null) {
				const rootValue = rootStyle.getPropertyValue(nameList[i]).trim();
				if (rootValue) {
					result[i] = rootValue;
				}
			}
		}
	}

	return result;
}


export function getScrollBarCssVar(ele?: Element) {
	const [scrollBarWidth, scrollBarHeight] = getCssVars(['--gantt-scrollbar-width', '--gantt-scrollbar-height'], ele)
	return {
		scrollBarWidth: Number(scrollBarWidth),
		scrollBarHeight: Number(scrollBarHeight),
	}
}
