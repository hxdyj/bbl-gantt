
export const ganttData = [
	{
		name: '1',
		bg: '#86909c',
		events: [
			{
				name: '1-event-1',
				start: '2022-01-01 09:00:00',
				end: '2022-01-01 09:00:01',
				shape: 'line',
				color: 'yellow',
				textColor: 'yellow'
			},
			{
				name: '1-event-1',
				start: '2022-01-01 09:00:02',
				end: '2022-01-01 09:00:04',
				shape: 'line'
			},
			{
				name: '1-event-1',
				start: '2022-01-01 09:25:00',
				end: '2022-01-01 09:30:00',
				shape: 'line',
				color: '#FF7D00',
				textColor: '#FF7D00'
			},
		],
		children: [
			{
				name: '1.1',
				events: [
					{
						name: '1.1-event-1',
						start: '2022-01-01 09:00:01',
						end: '2022-01-01 09:00:03',
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
