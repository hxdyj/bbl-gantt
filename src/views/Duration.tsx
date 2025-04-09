import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, GanttMode, TimeMetric } from "#/index"
import { ganttData } from "../data/ganttData-duration-test"


export function Duration() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data: GanttItem[] = ganttData as unknown as GanttItem[]
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			mode: GanttMode.Duration,
			durationModeOptions: {
				duration: 5 * 60 * 60 // 10 hours
			},
			data,
			// header: {
			// 	height: 30
			// },
			column: {
				width: 30 * 5,
				timeMetric: 1000 * 60 * 5
			},
			view: {
				overrideHeaderTitle: false,
				showTimeTicks: false,
				showTimeTickText: false,
				showTicks: true,
				showTickText: true,
				showScrollBar: true,
				headerTickTextTickNeeded: false,
			},
			action: {
				moveOrResizeStep: true,
				enableCurrentTime: false,
				enableMoveOrResizeOutOfEdge: false
			},

		}).on('container_wheel', (e: any) => {
			console.log('on container_wheel', e)
		}).on('init', (list: any) => {
			console.log('on init', list)
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
