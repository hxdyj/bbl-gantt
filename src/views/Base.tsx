import { Button, Space } from "@arco-design/web-react"
import { useEffect, useRef } from "react"
import { OperateGroup } from "../components/OperateGroup"
import Gantt, { GanttItem, TimeMetric } from "#/index"

export function Base() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data: GanttItem[] = [
		{
			name: '1',
			events: [
				{
					name: '1-event-1',
					start: '2022-01-01 09:00:00',
					end: '2022-01-01 09:40:00',
				},
			],
			children: [
				{
					name: '1.1',
					events: [
						{
							name: '1.1-event-1',
							start: '2022-01-01 09:10:00',
							end: '2022-01-01 09:20:00',
						},
					],
					children: [
						{
							name: '1.1.1',
							events: [
								{
									name: '1.1.1-event-1',
									start: '2022-01-01 09:15:00',
									end: '2022-01-01 09:20:00',
								},
								{
									name: '1.1.1-event-2',
									start: '2022-01-01 09:25:00',
									end: '2022-01-01 09:30:00',
								},
							],
							children: []
						},
						{
							name: '1.1.2',
							events: [
								{
									name: '1.1.2-event-1',
									start: '2022-01-01 09:15:00',
									end: '2022-01-01 09:20:00',
								},
								{
									name: '1.1.2-event-2',
									start: '2022-01-01 09:25:00',
									end: '2022-01-01 09:30:00',
								},
							],
							children: []
						}
					]
				},
				{
					name: '1.2',
					events: [
						{
							name: '1.2-event-1',
							start: '2022-01-01 09:10:00',
							end: '2022-01-01 09:20:00',
						},
					],
					children: [
						{
							name: '1.2.1',
							events: [
								{
									name: '1.2.1-event-1',
									start: '2022-01-01 09:15:00',
									end: '2022-01-01 09:20:00',
								},
								{
									name: '1.2.1-event-2',
									start: '2022-01-01 09:25:00',
									end: '2022-01-01 09:30:00',
								},
							],
							children: []
						},
						{
							name: '1.2.2',
							events: [
								{
									name: '1.2.2-event-1',
									start: '2022-01-01 09:15:00',
									end: '2022-01-01 09:20:00',
								},
								{
									name: '1.2.2-event-2',
									start: '2022-01-01 09:25:00',
									end: '2022-01-01 09:30:00',
								},
							],
							children: []
						}
					]
				},
			]
		},
		{
			name: '2',
			events: [],
			children: [
				{
					name: '2.1',
					events: [],
					children: [
						{
							name: '2.1.1',
							events: [],
							children: []
						},
						{
							name: '2.1.2',
							events: [],
							children: []
						}
					]
				}
			]
		},
	]
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
					<OperateGroup desc="">
						<Button.Group>
							{/* <Button onClick={() => {
								imgMark.current?.moveTo('center')
							}}>center</Button> */}
						</Button.Group>
					</OperateGroup>
				</Space>
			</div>
			<div className="h-[60vh] w-full" ref={containerRef}>
			</div>

		</div>
	)
}
