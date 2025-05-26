import Gantt, { GanttItem } from "#/index"
import { useEffect, useRef } from "react"

export function GanttHeaderTest() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
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
							textColor: 'yellow'
						},
						{
							name: '1-event-1',
							start: '2022-01-01 09:10:10',
							end: '2022-01-01 09:20:00',
						},
					],
				}
			],
			column: {
				width: 10,
				timeMetric: 18000
			},
		})
		return () => {
			gantt.current?.destroy()
		}
	}, [])
	return (
		<div className="page-gantt-header-test w-[100vw] h-[100vh]" ref={containerRef}>
		</div>
	)
}
