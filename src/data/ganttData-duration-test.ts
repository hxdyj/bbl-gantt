
export const ganttData = [
	{
		name: '1',
		bg: '#23C343',
		events: [
			{
				name: '订机票',
				start: 0,
				end: 500,
			},
			{
				name: '订酒店',
				start: 700,
				end: 1550,
			},
		],
		children: [
			{
				name: '1.1',
				events: [
					{
						name: '飞行中',
						start: 0,
						end: 325,
					},
				],
				children: [
					{
						name: '1.1.1',
						events: [
							{
								name: '到达北京',
								start: 800,
								end: 1500,
								color: '#D91AD9',
								textColor: '#D91AD9'
							},
							{
								name: '休息',
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
								name: '吃饭',
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

