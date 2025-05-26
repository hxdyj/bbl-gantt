---
layout: doc
footer: false
---

# 开始

## 安装

```shell
npm i bbl-gantt
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

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Esm Test</title>
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
		<script type="module">
			// import Gantt from 'bbl-gantt'
			import Gantt from '../dist/index.es.js'

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
