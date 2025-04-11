export const ganttData = [
	{
		name: '1',
		bg: '#23C343',
		events: [
			{
				name: '',
				start: 1,
				end: 5,
				color: 'red'
			},
			{
				name: '',
				start: 7,
				end: 15.5,
			},
		],
		children: [
			{
				name: '1.1',
				events: [
					{
						name: '',
						start: 0,
						end: 3.256,
					},
				],
				children: [
					{
						name: '1.1.1',
						events: [
							{
								name: '',
								start: 6,
								end: 8.654,
								color: '#D91AD9',
								textColor: '#D91AD9'
							},
							{
								name: '',
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
								name: '',
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
