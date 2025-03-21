import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, GanttMode, TimeMetric } from "#/index"
import { ganttData } from "../data/ganttData-duration"


export function Duration() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data: GanttItem[] = ganttData as unknown as GanttItem[]
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			// readOnly: true,
			el: containerRef.current,
			mode: GanttMode.Duration,
			durationModeOptions: {
				duration: 10 * 60 * 60 // 10 hours
			},
			header: {
				height: 0
			},
			// readOnly: true,
			view: {
				// overrideHeaderTitle: false,
				// showTimeTicks: true,
				// showTicks: false,
				showTimeTicks: false,
				showTicks: true,
				showTickText: false,
				showTimeTickText: false,
				showEventTimeRange: false,
				whileShowScrollReduceScrollBarSize: false,
				// whileRowsLessContainerAutoReduceHeight: false
				// showScrollBar: false
			},
			data,
			column: {
				width: 30,
				timeMetric: 600
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
