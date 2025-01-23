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
