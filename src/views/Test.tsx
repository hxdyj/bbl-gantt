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


export function Test() {
	let gantt = useRef<Gantt | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const data = useRef<GanttItem[]>(ganttData as unknown as GanttItem[])
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		gantt.current = new Gantt({
			el: containerRef.current,
			mode: GanttMode.Duration,
			durationModeOptions: {
				duration: 60 * 10 // 10 min
				// duration: 5 * 60 * 60 // 10 hours
			},
			header: {
				height: 30
			},
			data: [],
			view: {
				showScrollBar: false,
				timeFullWidth: true,
				showTicks: false,
				showTickText: false,
				showTimeTicks: true,
				showTimeTickText: true,
				headerTickTextTickNeeded: true,
				whileRowsLessContainerAutoReduceHeight: true,
				// whileShowScrollReduceScrollBarSize: true,
			},
			action: {
				enableCurrentTime: false,
				enableMoveOrResizeOutOfEdge: false
			},
		})

		return () => {
			gantt.current?.destroy()
		}
	}, [])
	return (
		<div className="page-duration-time-full-width flex items-start">
			<div className="w-[500px] h-[30px] overflow-hidden">
				<div className="w-full" ref={containerRef}>
				</div>
			</div>
		</div>
	)
}
