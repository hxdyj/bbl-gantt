import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { EventBusEventName, GanttItem, GanttMode, TimeMetric } from "#/index"
import './Base.scss'
import { ganttData } from "../data/ganttData-full"
import { walkData } from "#/utils/data"
import { uid } from "uid"

//@ts-ignore
walkData(ganttData, ({ item, level, parent }) => {
	// item.id = getUID(item.id)
	item.id = uid(6)
	item.events.forEach(ev => {
		ev.id = uid(6)
	})
})


export function Base() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data = useRef(ganttData as unknown as GanttItem[])
	const [timeMetric, setTimeMetric] = useState(30000)
	const [tickWidth, setTickWidth] = useState(30)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			data: data.current,
			makerData: [
				{
					id: uid(6),
					time: '2022-01-01 09:00:00',
					options: {
						tick: {
							fill: '#165DFF',
						}
					},
					svg: '<svg t="1766382814652" class="icon" viewBox="0 0 1048 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2684" width="200" height="200"><path d="M359.966106 800.470016 816.001126 543.319962l35.088998-22.936986-35.725005-21.89097L359.509197 239.925043l0.380006 71.140045 0 442.83L359.966106 800.470016zM414.601114 335.592038 733.773107 521.152 414.601114 706.715034 414.601114 335.592zM524.2752 0.018022C241.516134 0.018022 12.288102 229.245952 12.288102 512.005018c0 112.735027 36.439962 216.958976 98.182042 301.539021l38.667981-40.257024C97.458176 699.231027 67.143168 609.159987 67.143168 512.005018c0-252.46505 204.668006-457.132032 457.132032-457.132032 252.45399 0 457.120973 204.668006 457.120973 457.132032 0 252.460954-204.668006 457.118003-457.120973 457.118003-96.240026 0-185.530982-29.744026-259.189965-80.534016l-34.539008 42.797978c83.15095 58.344038 184.438989 92.594995 293.728973 92.594995 282.755994 0 511.984026-229.220966 511.984026-511.976038C1036.258202 229.245952 807.03017 0.018022 524.2752 0.018022z" p-id="2685"></path></svg>'
				}
			],
			view: {
				showTicks: true,
				showTickText: true,
				showTimeTickText: true,
				showTimeTicks: true,
				headerTickTextTickNeeded: true,
				overrideHeaderTitle: false,
				tickTextAlign({ index }) {
					return index ? 'center' : 'left'
				}
			},
			time: {
				// alginStartTimeToUnitTypeStartTime:false
			},
			column: {
				width: 300,
				timeMetric: 800
			},
			action: {
				headerWheelTimeMetric: true,
				moveOrResizeStep: false,
				enableNewEventItem: false,
				hoverEventShowTimeRange: true,
			}
		}).on(EventBusEventName.event_item_body_click, () => {
			console.log('event_item_body_click')
		})
		return () => {
			gantt.current?.destroy()
		}
	}, [])


	return (
		<div className="page-base">
			<div className="operate-panel h-[fit] py-[16px]">
				<Space size={'large'} wrap>
					<OperateGroup desc="scroll">
						<Button.Group>
							<Button onClick={() => {
								gantt.current?.view.scrollToEarliestItem({
									behavior: 'smooth',
								})
							}}>scrollToEarliestItem</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="render">
						<Button.Group>
							<Button onClick={() => {
								gantt.current?.render.render()
							}}>render</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="time">
						<Select
							autoWidth={{ minWidth: 280, maxWidth: 500 }}
							placeholder='Select time metric'
							value={timeMetric}
							options={[
								{
									label: '18000 ms',
									value: 18000
								},
								{
									label: '30000 ms',
									value: 30000
								},
								{
									label: 'MINUTE',
									value: TimeMetric.MINUTE
								},
								{
									label: 'QUARTER_HOUR',
									value: TimeMetric.QUARTER_HOUR
								},
								{
									label: 'HALF_HOUR',
									value: TimeMetric.HALF_HOUR
								},
								{
									label: 'HOUR',
									value: TimeMetric.HOUR
								},
								{
									label: 'QUARTER_DAY',
									value: TimeMetric.QUARTER_DAY
								},
								{
									label: 'HALF_DAY',
									value: TimeMetric.HALF_DAY
								},
								{
									label: 'DAY',
									value: TimeMetric.DAY
								},
								{
									label: 'WEEK',
									value: TimeMetric.WEEK
								},
								{
									label: 'MONTH',
									value: TimeMetric.MONTH
								},
								{
									label: 'YEAR',
									value: TimeMetric.YEAR
								},
							]}

							addBefore='Time Metric'
							onChange={val => {
								if (val === TimeMetric.YEAR) {
									setTickWidth(100)
								}
								gantt.current?.updateOptions({
									column: {
										width: val === TimeMetric.YEAR ? 100 : undefined,
										timeMetric: val
									}
								})
								setTimeMetric(val)
							}}
						>
						</Select>
					</OperateGroup>
					<OperateGroup desc="tick">
						<InputNumber prefix={<div>Tick Width</div>} value={tickWidth} min={30} max={10000} placeholder="Input tick width" onChange={val => {
							gantt.current?.updateOptions({
								column: {
									width: val
								}
							})
							setTickWidth(val)
						}} />
					</OperateGroup>
					<OperateGroup desc="data">
						<Button.Group>
							<Button onClick={() => {
								console.log(gantt.current?.list)
							}}>Console List</Button>
						</Button.Group>
					</OperateGroup>
				</Space>
			</div>
			<div className="h-[60vh] w-full" ref={containerRef}>
			</div>

		</div>
	)
}
