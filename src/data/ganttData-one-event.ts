export const ganttData = [
	{
		name: '1',
		bg: '#23C343',
		events: [
			{
				name: '1-event-1',
				start: '2022-01-01 09:00:00',
				end: '2022-01-01 09:10:00',
				shape: 'line',
				color: 'yellow',
				textColor: 'yellow'
			},
		],
		children: [
			{
				name: '1.1',
				events: [

				],
				children: [
					{
						name: '1.1.1',
						events: [

						],
						children: []
					},
					{
						name: '1.1.2',
						events: [

						],
						children: []
					}
				]
			},
			{
				name: '1.2',
				events: [

				],
				children: [
					{
						name: '1.2.1',
						events: [

						],
						children: []
					},
					{
						name: '1.2.2',
						events: [

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
