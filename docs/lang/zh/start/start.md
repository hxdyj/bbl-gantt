---
layout: doc
footer: false
---

# 开始

## 安装

```shell
npm i bbl-gantt
# 安装 @svgdotjs/svg.js 库，mark-img 依赖它
npm install @svgdotjs/svg.js
```

## 使用

### UMD

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Umd Test</title>
		<!-- 引入样式 -->
		<!-- [!code highlight] -->
		<link rel="stylesheet" href="../dist/style.css" />
		<style>
			html,
			body {
				padding: 0;
				margin: 0;
			}
		</style>
	</head>

	<body>
		<div id="container" style="width: 100vw;height: 100vh;"></div>
		<!-- 引入 @svgdotjs/svg.js 库 -->
		<!-- [!code highlight] -->
		<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@latest/dist/svg.min.js"></script>
		<!-- 引入 mark-img 库 -->
		<script src="../dist/index.umd.js"></script>
		<script>
			const Gantt = window['bbl-gantt'].Gantt
			const gantt = new Gantt({
				el: '#container',
				data: [
					{
						name: '1',
						bg: '#23C343',
						events: [
							{
								name: '1-event-1',
								start: '2022-01-01 09:00:00',
								end: '2022-01-01 09:10:00',
								color: 'yellow',
								textColor: 'yellow',
							},
							{
								name: '1-event-1',
								start: '2022-01-01 09:10:10',
								end: '2022-01-01 09:20:00',
							},
						],
					},
				],
				column: {
					width: 10,
					timeMetric: 18000,
				},
			}).on('init', () => {
				console.log('init')
			})
		</script>
	</body>
</html>
```

### ES

```tsx
import Gantt from 'bbl-gantt'
// 引入样式
import 'bbl-gantt/dist/style.css' // [!code highlight]

const gantt = new Gantt({
	el: '#container',
	data: [
		{
			name: '1',
			bg: '#23C343',
			events: [
				{
					name: '1-event-1',
					start: '2022-01-01 09:00:00',
					end: '2022-01-01 09:10:00',
					color: 'yellow',
					textColor: 'yellow',
				},
				{
					name: '1-event-1',
					start: '2022-01-01 09:10:10',
					end: '2022-01-01 09:20:00',
				},
			],
		},
	],
	column: {
		width: 10,
		timeMetric: 18000,
	},
}).on('init', () => {
	console.log('init')
})
```

## 甘特图图表组成

![](/img/parts.png)

### tick

时间刻度线，这个是自己在 options 里`column.timeMetric` 去设置间隔的

### tick-text

时间刻度线对应在 header 显示的时间

### time-tick

根据 tick 的时间间隔自动算出的合理的整数的时间，比如 30 分钟的间隔这里按小时去间隔渲染，如果是小于 15 分钟且大于 3 秒的间隔，则按分钟去间隔渲染

### time-tick-text

整数时间刻度线对应在 header 显示的时间

### row

行，一行可以有多个事件项

### event-item

事件项，描述一个事件持续的事件长短，目前支持两种样式 `line` 和 `rect`

### time-range-text

当事件项进行改变时间大小、移动、新建时候，显示的这个事件项的时间范围

### current-time

当在甘特图非事件项区域点击时候，显示当前时间
