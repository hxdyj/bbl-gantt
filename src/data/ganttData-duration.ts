export const ganttData = [
	{
		name: '1',
		bg: 'red-group',
		events: [
			{
				name: '1-event-1',
				start: '2022-01-01 09:00:00',
				end: '2022-01-01 09:10:00',
			},
			{
				name: '1-event-2',
				start: '2022-01-01 09:11:00',
				end: '2022-01-01 09:20:00',
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
								color: '#D91AD9',
								textColor: '#D91AD9'
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
						],
						children: []
					}
				]
			},
		]
	},
]
