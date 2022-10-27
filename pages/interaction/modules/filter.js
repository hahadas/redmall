let filter = {
	oneFilter:[
		{
			name: "性别", 
			type: "hierarchy", 
			submenu: [
				{name: "全部", value: -1},
				{name: "男", value: 2},
				{name: "女", value: 3}
			]
		},
		// {
		// 	name: "由近到远", 
		// 	type: "hierarchy", 
		// 	submenu: [
		// 		{name: "由近到远", value: 0},
		// 		{name: "由远到近", value: 1}
				
		// 	]
		// },
		{
			name: "用户", 
			type: "hierarchy", 
			submenu: [
				{name: "全部", value: -1},
				{name: "普通用户", value: 0},
				{name: "配送员", value: 1}
			]
		}
	],
	twoFilter:[
		{
			name: "性别", 
			type: "hierarchy",
			submenu: [
				{name: "全部", value: 0},
				{name: "男", value: 2},
				{name: "女", value: 3}
			]
		},
		{
			name: "年龄", 
			type: "hierarchy",
			submenu: [
				{name: "年龄不限", value: 0},
				{name: "18-25", value: "18-25"},
				{name: "25-30", value: "25-30"},
				{name: "30以上", value: "30-999"}
				
			]
		}
	],
	threeFilter: [
		{
			name: "状态", 
			type: "hierarchy",
			submenu: [
				{name: "全部", value: 0},
				{name: "休息中", value: 1},
				{name: "已开工", value: 2},
				{name: "工作中", value: 3}
			]
		},
		{
			name: "性别", 
			type: "hierarchy",
			submenu: [
				{name: "性别不限", value: 0},
				{name: "男", value: 2},
				{name: "女", value: 3}
			]
		},
		{
			name: "年龄", 
			type: "hierarchy",
			submenu: [
				{name: "年龄不限", value: 0},
				{name: "18-25", value: "18-25"},
				{name: "25-30", value: "25-30"},
				{name: "30以上", value: "30-999"}
				
			]
		},
		// {
		// 	// name: "筛选", 
		// 	type: "filter", 
		// 	submenu: [
		// 		{name: "性别", submenu: [
		// 			{name: "男", value: 1},
		// 			{name: "女", value: 2}
		// 		]}
		// 	]
		// }
	]
}

export default filter;