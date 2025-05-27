import { getUID, walkData } from "#/utils/data"
import { uid } from "uid"

export const ganttData = [
	{
		name: '1',
		bg: '#23C343',
		events: [
			{
				name: '行进机动',
				start: 0,
				end: 500,
			},
			{
				name: 'l大森撒',
				start: 700,
				end: 1550,
			},
		],
		children: [
			{
				name: '1.1',
				events: [
					{
						name: '234234',
						start: 0,
						end: 325,
					},
				],
				children: [
					{
						name: '1.1.1',
						events: [
							{
								name: '温热我惹我',
								start: 800,
								end: 1500,
								color: '#D91AD9',
								textColor: '#D91AD9'
							},
							{
								name: 'e挼e热',
								start: 1600,
								end: 3000,
							},
						],
						children: []
					},
					{
						name: '1.1.2',
						events: [
							{
								name: '惹我惹我',
								start: 500,
								end: 1500,
							},
						],
						children: []
					}
				]
			},
		]
	},
]

//@ts-ignore
walkData(ganttData, ({ item, level, parent }) => {
	// item.id = getUID(item.id)
	item.id = uid(6)
	item.events.forEach(ev => {
		ev.id = uid(6)
	})
})
