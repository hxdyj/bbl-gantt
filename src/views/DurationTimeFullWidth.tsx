import Gantt, { GanttItem, GanttMode } from "#/index"
import { useEffect, useRef } from "react"
import { ganttData } from "../data/ganttData-duration-test"
import { uid } from "uid"
import { walkData } from "#/utils/data"

//@ts-ignore
walkData(ganttData, ({ item, level, parent }) => {
	// item.id = getUID(item.id)
	item.id = uid(6)
	item.events.forEach(ev => {
		ev.id = uid(6)
	})
})


export function DurationTimeFullWidth() {
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
			column: {
				width: 30 * 5,
				timeMetric: 1000 * 60 * 5
			},
			view: {
				timeFullWidth: true,
				overrideHeaderTitle: false,
				showTimeTicks: true,
				showTimeTickText: true,
				showTicks: false,
				showTickText: false,
				showScrollBar: true,
				headerTickTextTickNeeded: false,
			},
			action: {
				headerWheelTimeMetric: false,
				moveOrResizeStep: true,
				enableCurrentTime: false,
				enableMoveOrResizeOutOfEdge: false
			},

		})

		return () => {
			gantt.current?.destroy()
		}
	}, [])
	return (
		<div className="page-duration-time-full-width">
			<div className="h-[60vh] w-full" ref={containerRef}>
			</div>
		</div>
	)
}
