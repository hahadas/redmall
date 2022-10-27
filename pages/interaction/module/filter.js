let filter = {
	oneFilter:[
		[
			{text: "性别不限", value: -1},
			{text: "男", value: 2},
			{text: "女", value: 3}
		],
		[
			{text: "所有用户", value: -1},
			{text: "普通用户", value: 0},
			{text: "配送员", value: 1}
		]
	],
	twoFilter:[
		[
			{text: "性别不限", value: -1},
			{text: "男", value: 2},
			{text: "女", value: 3}
		],
		[
			{text: "年龄不限", value: 0},
			{text: "18-25", value: "18-25"},
			{text: "25-30", value: "25-30"},
			{text: "30以上", value: "30-999"}
		]
	],
	threeFilter: [
		[
			{text: "全部状态", value: 0},
			{text: "休息中", value: 1},
			{text: "已开工", value: 2},
			{text: "工作中", value: 3}
		],
		[
			{text: "性别不限", value: -1},
			{text: "男", value: 2},
			{text: "女", value: 3}
		],
		[
			{text: "年龄不限", value: 0},
			{text: "18-25", value: "18-25"},
			{text: "25-30", value: "25-30"},
			{text: "30以上", value: "30-999"}
		]
	]
}

export default filter;