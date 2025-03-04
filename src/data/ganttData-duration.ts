export const ganttData = [
	{
		name: '1',
		bg: 'red-group',
		events: [
			{
				name: '1-event-1',
				start: 1,
				end: 5,
			},
			{
				name: '1-event-2',
				start: 7,
				end: 15.5,
			},
		],
		children: [
			{
				name: '1.1',
				events: [
					{
						name: '1.1-event-1',
						start: 0,
						end: 3.256,
					},
				],
				children: [
					{
						name: '1.1.1',
						events: [
							{
								name: '1.1.1-event-1',
								start: 6,
								end: 8.654,
								color: '#D91AD9',
								textColor: '#D91AD9'
							},
							{
								name: '1.1.1-event-2',
								start: 9,
								end: 30,
							},
						],
						children: []
					},
					{
						name: '1.1.2',
						events: [
							{
								name: '1.1.2-event-1',
								start: 5,
								end: 15,
							},
						],
						children: []
					}
				]
			},
		]
	},
]
