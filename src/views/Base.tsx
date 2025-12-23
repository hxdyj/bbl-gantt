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
							width: 1
						}
					},
					svg: '<svg t="1766477049280" class="icon" viewBox="0 0 1048 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2477" width="200" height="200"><path d="M359.966106 800.470016 816.001126 543.319962l35.088998-22.936986-35.725005-21.89097L359.509197 239.925043l0.380006 71.140045 0 442.83L359.966106 800.470016zM414.601114 335.592038 733.773107 521.152 414.601114 706.715034 414.601114 335.592zM524.2752 0.018022C241.516134 0.018022 12.288102 229.245952 12.288102 512.005018c0 112.735027 36.439962 216.958976 98.182042 301.539021l38.667981-40.257024C97.458176 699.231027 67.143168 609.159987 67.143168 512.005018c0-252.46505 204.668006-457.132032 457.132032-457.132032 252.45399 0 457.120973 204.668006 457.120973 457.132032 0 252.460954-204.668006 457.118003-457.120973 457.118003-96.240026 0-185.530982-29.744026-259.189965-80.534016l-34.539008 42.797978c83.15095 58.344038 184.438989 92.594995 293.728973 92.594995 282.755994 0 511.984026-229.220966 511.984026-511.976038C1036.258202 229.245952 807.03017 0.018022 524.2752 0.018022z" p-id="2478" fill="#165DFF"></path></svg>'
				},
				{
					id: uid(6),
					time: '2022-01-01 09:00:02',
					options: {
						tick: {
							fill: '#165DFF',
							width: 1
						}
					},
					svg: '<svg t="1766467711259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7991" width="200" height="200"><path d="M212.992 526.336 212.992 526.336 212.992 526.336 215.04 526.336 212.992 526.336Z" p-id="7992" fill="#165DFF"></path><path d="M817.152 202.752 817.152 202.752C737.28 122.88 628.736 75.776 509.952 75.776c-118.784 0-229.376 49.152-307.2 126.976l0 0c-77.824 77.824-126.976 186.368-126.976 307.2 0 118.784 49.152 229.376 126.976 307.2 77.824 79.872 188.416 126.976 307.2 126.976 120.832 0 229.376-49.152 307.2-126.976 79.872-77.824 126.976-186.368 126.976-307.2C946.176 389.12 897.024 280.576 817.152 202.752zM770.048 770.048c-65.536 65.536-157.696 108.544-260.096 108.544-102.4 0-194.56-40.96-260.096-108.544C184.32 704.512 141.312 612.352 141.312 509.952s40.96-194.56 108.544-260.096C317.44 184.32 409.6 141.312 509.952 141.312c100.352 0 192.512 40.96 258.048 106.496l2.048 2.048c65.536 65.536 108.544 157.696 108.544 260.096S837.632 704.512 770.048 770.048z" p-id="7993" fill="#165DFF"></path><path d="M724.992 296.96 724.992 296.96 296.96 296.96 296.96 724.992 724.992 724.992 724.992 296.96Z" p-id="7994" fill="#165DFF"></path></svg>'
				},
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
