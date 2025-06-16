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


export function getCssVar(ele?: Element) {
	const computedStyle = getComputedStyle(ele || document.body)
	const scrollBarWidth = parseInt(computedStyle.getPropertyValue('--gantt-scrollbar-width'))
	const scrollBarHeight = parseInt(computedStyle.getPropertyValue('--gantt-scrollbar-height'))
	return {
		scrollBarWidth,
		scrollBarHeight,
	}
}
