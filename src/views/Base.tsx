import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, TimeMetric } from "#/index"
import './Base.scss'
import { ganttData } from "../data/ganttData-full"
import { getUID, walkData } from "#/utils/data"

walkData(ganttData as unknown as GanttItem[], ({ item }) => {
	item.id = getUID()
	item.events.forEach(event => {
		event.id = getUID()
	})
})

export function Base() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data: GanttItem[] = ganttData as unknown as GanttItem[]
	const [timeMetric, setTimeMetric] = useState(30000)
	const [tickWidth, setTickWidth] = useState(30)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			data,
			view: {
				showTicks: true,
				showTickText: true,
				showTimeTickText: false,
				overrideHeaderTitle: false
			},
			column: {
				width: 30,
				timeMetric: 30000
			}
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
