import { Button, Space } from "@arco-design/web-react"
import { useEffect, useRef } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, TimeMetric } from "#/index"
import './Base.scss'
import { ganttData } from "../data/ganttData"
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

	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			data,
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
						<Button.Group>
							<Button onClick={() => {
								gantt.current?.updateOptions({
									column: {
										// width: 900,
										timeMetric: 30000
									}
								})
							}}>30000</Button>
							<Button onClick={() => {
								gantt.current?.updateOptions({
									column: {
										// width: 900,
										timeMetric: TimeMetric.MINUTE
									}
								})
							}}>minut</Button>

						</Button.Group>


					</OperateGroup>
				</Space>
			</div>
			<div className="h-[60vh] w-full" ref={containerRef}>
			</div>

		</div>
	)
}
