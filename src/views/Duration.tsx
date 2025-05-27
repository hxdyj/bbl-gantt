import { Button, Input, InputNumber, Select, Space } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, GanttMode, GanttOptions, TimeMetric } from "#/index"
import { ganttData } from "../data/ganttData-duration-test"


export function Duration() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data = useRef<GanttItem[]>(ganttData as unknown as GanttItem[])
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			mode: GanttMode.Duration,
			durationModeOptions: {
				duration: 5 * 60 * 60 // 10 hours
			},
			data: data.current,
			// header: {
			// 	height: 30
			// },
			column: {
				width: 30 * 5,
				timeMetric: 1000 * 60 * 5
			},
			view: {
				overrideHeaderTitle: false,
				showTimeTicks: true,
				showTimeTickText: true,
				showTicks: false,
				showTickText: false,
				showScrollBar: true,
				headerTickTextTickNeeded: false,
			},
			action: {
				headerWheelTimeMetric: true,
				moveOrResizeStep: true,
				enableCurrentTime: false,
				enableMoveOrResizeOutOfEdge: false
			},

		}).on('container_scroll', (e: any) => {
			// console.log('on container_scroll', e)
		}).on('init', (list: any) => {
			console.log('on init', list)
		}).on('event_item_body_context_menu', (e, item) => {
			console.log('event_item_body_context_menu', e, item)
			gantt.current?.render.events.deleteEvent(item)
		}).on('event_item_body_click', (e, item, gantt) => {
			console.log('event_item_body_click', e, item, gantt)
		}).on('row_click', (e, item, gantt: Gantt) => {
			console.log('row_click', e, item, gantt)
			item.row.bg = '#23C343'
			const preClickRow = gantt.render.rows.lastClickRow
			if (preClickRow) {
				preClickRow.bg = 'transparent'
				gantt.render.rows.renderRow(preClickRow)
			}
			gantt.render.rows.renderRow(item.row)
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
							<Button onClick={() => {
								console.log(data.current)
							}}>Console Data</Button>
							<Button onClick={() => {
								console.log(gantt.current?.options.data)
								console.log(`isEqual:`, data.current === gantt.current?.options.data)
							}}>Gantt Option Data</Button>

							<Button onClick={() => {
								const rowItem = data.current?.[0]?.children[0]
								gantt.current?.render.rows.deleteRow(rowItem)
							}}>Delete Row</Button>

						</Button.Group>
					</OperateGroup>
				</Space>
			</div>
			<div className="h-[60vh] w-full" ref={containerRef}>
			</div>

		</div>
	)
}
