import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, TimeMetric } from "#/index"
import { ganttData } from "../data/ganttData-full"
import { getUID, walkData } from "#/utils/data"

walkData(ganttData as unknown as GanttItem[], ({ item }) => {
	item.id = getUID()
	item.events.forEach(event => {
		event.id = getUID()
	})
})

export function Duration() {
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
		<div className="page-duration">
			<div className="operate-panel h-[fit] py-[16px]">
				<Space size={'large'} wrap>
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
