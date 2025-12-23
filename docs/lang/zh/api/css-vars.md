---
layout: doc
footer: false
---

# CSS 变量

bbl-gantt 提供了一套完整的 CSS 变量用于自定义甘特图的外观。你可以在 CSS 中覆盖这些变量以匹配你的设计系统。

```css
:root {
	/* ========== 基础颜色 ========== */

	/* 主题色，用于事件项默认颜色、时间范围指示器等 UI 元素 */
	--gantt-main-color: #165dff;

	/* 甘特图画布背景色 */
	--gantt-bg-color: #e5e6eb;

	/* 时间轴刻度线颜色 */
	--gantt-tick-color: #86909c;

	/* 刻度线宽度 */
	--gantt-tick-width: 0.2;

	/* 标记刻度线宽度（继承自 --gantt-tick-width） */
	--gantt-tick-maker-width: var(--gantt-tick-width);

	/* ========== 表头样式 ========== */

	/* 表头区域刻度线颜色（继承自 --gantt-tick-color） */
	--gantt-header-tick-color: var(--gantt-tick-color);

	/* 表头文本颜色 */
	--gantt-header-text-color: #4e5969;

	/* 表头文本字号 */
	--gantt-header-text-font-size: 14px;

	/* ========== 行样式 ========== */

	/* 行分隔线颜色（继承自 --gantt-tick-color） */
	--gantt-row-line-color: var(--gantt-tick-color);

	/* 单个行的背景色 */
	--gantt-row-bg-color: transparent;

	/* ========== 垂直滚动遮罩 ========== */

	/* 垂直滚动遮罩层的背景色，用于覆盖滚动条区域 */
	--gantt-v-scroll-mask-bg-color: white;

	/* ========== 时间范围指示器 ========== */

	/* 时间范围标签文本颜色，鼠标悬停在事件上时显示（继承自 --gantt-main-color） */
	--gantt-time-range-text-color: var(--gantt-main-color);

	/* 时间范围指示线宽度 */
	--gantt-time-range-stroke-width: 1;

	/* 时间范围指示线颜色（继承自 --gantt-main-color） */
	--gantt-time-range-stroke-color: var(--gantt-main-color);

	/* ========== 当前时间线 ========== */

	/* 当前时间指示线宽度 */
	--gantt-current-time-line-stroke-width: 1;

	/* 当前时间线颜色 */
	--gantt-current-time-line-stroke-color: #ff7d00;

	/* 当前时间标签字号 */
	--gantt-current-time-line-font-size: 13px;

	/* 当前时间标签字重 */
	--gantt-current-time-line-font-weight: bold;

	/* 当前时间线虚线样式 (SVG dasharray 格式) */
	--gantt-current-time-line-stroke-dasharray: 0, 5, 10;

	/* 当前时间文本颜色（继承自 --gantt-current-time-line-stroke-color） */
	--gantt-current-time-line-text-color: var(
		--gantt-current-time-line-stroke-color
	);

	/* ========== 事件项样式 ========== */

	/* 事件项文本字号 */
	--gantt-event-item-font-size: 12px;

	/* 事件项文本字重 */
	--gantt-event-item-font-weight: 600;

	/* 矩形形状事件项的文本颜色（shape: 'rect'） */
	--gantt-event-item-style-rect-text-color: white;

	/* 线条形状事件项的文本颜色（shape: 'line'），继承自 --gantt-main-color */
	--gantt-event-item-style-line-text-color: var(--gantt-main-color);

	/* 矩形形状事件项的背景色（shape: 'rect'，默认），继承自 --gantt-main-color */
	--gantt-event-item-style-rect-color: var(--gantt-main-color);

	/* 线条形状事件项的颜色（shape: 'line'），继承自 --gantt-event-item-style-rect-color */
	--gantt-event-item-style-line-color: var(--gantt-event-item-style-rect-color);

	/* ========== 事件项调整手柄 ========== */

	/* 调整手柄的填充色，用于事件项边缘的调整大小手柄 */
	--gantt-event-item-resize-color: white;

	/* 调整手柄的边框宽度 */
	--gantt-event-item-resize-stroke-width: 1;

	/* 左侧调整手柄的边框宽度（继承自 --gantt-event-item-resize-stroke-width） */
	--gantt-event-item-left-resize-stroke-width: var(
		--gantt-event-item-resize-stroke-width
	);

	/* 右侧调整手柄的边框宽度（继承自 --gantt-event-item-resize-stroke-width） */
	--gantt-event-item-right-resize-stroke-width: var(
		--gantt-event-item-resize-stroke-width
	);

	/* 调整手柄的边框颜色（继承自 --gantt-event-item-style-rect-color） */
	--gantt-event-item-resize-stroke-color: var(
		--gantt-event-item-style-rect-color
	);

	/* 左侧调整手柄的边框颜色（继承自 --gantt-event-item-resize-stroke-color） */
	--gantt-event-item-left-resize-stroke-color: var(
		--gantt-event-item-resize-stroke-color
	);

	/* 右侧调整手柄的边框颜色（继承自 --gantt-event-item-resize-stroke-color） */
	--gantt-event-item-right-resize-stroke-color: var(
		--gantt-event-item-resize-stroke-color
	);

	/* ========== 滚动条样式 ========== */

	/* 垂直滚动条宽度 */
	--gantt-scrollbar-width: 12px;

	/* 水平滚动条高度（继承自 --gantt-scrollbar-width） */
	--gantt-scrollbar-height: var(--gantt-scrollbar-width);

	/* 滚动条滑块的背景裁剪属性 */
	--gantt-scrollbar-thumb-bg-clip: padding-box;

	/* 滚动条滑块的背景色（未悬停状态） */
	--gantt-scrollbar-thumb-bg-color: transparent;

	/* 滚动条滑块悬停时的背景色 */
	--gantt-scrollbar-thumb-bg-hover-color: rgb(201, 205, 212);

	/* 滚动条滑块的边框样式，用于在滑块周围创建内边距 */
	--gantt-scrollbar-thumb-border: 4px solid transparent;

	/* 滚动条滑块的圆角半径 */
	--gantt-scrollbar-thumb-border-radius: 7px;
}
```
