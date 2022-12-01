/**
 * 该文件为固定选择列表
 * */
export default{
	// 用户
	userTypeList: [
		{name: "普通用户", value: 1},
		{name: "配送员", value: 2},
		{name: "商家", value: 3}
	],
	// 收款类型
	collectionList: [
		{name: "支付宝", value: 0},
		{name: "微信", value: 1},
		{name: "银行卡", value: 3}
	],
	// 性别
	genderList: [
		{name: "男", value: 2},
		{name: "女", value: 3}
	],
	// 学历
	educationList: [
		{name: "小学", value: 1},
		{name: "初中", value: 2},
		{name: "高中", value: 3},
		{name: "中专", value: 4},
		{name: "大专", value: 5},
		{name: "本科", value: 6},
		{name: "硕士", value: 7},
		{name: "博士", value: 8}
	],
	// 商品状态
	goodsStatusList: [
		{name: "已上架", value: 1},
		{name: "已下架", value: 4},
		{name: "审核中", value: 10},
		{name: "审核失败", value: 2},
		{name: "商品违规", value: 3},
		// {name: "待提交", value: 20},
	],
	// 物流配送订单类型
	logisticsList: [
		{name: "待发货", value: 1},
		{name: "已发货", value: 2},
		{name: "已收货", value: 3}
	],
	// 商家配送订单类型
	businessList: [
		{name: "待送货", value: 1},
		{name: "配送中", value: 2},
		{name: "已送达", value: 3}
	],
	// 平台配送订单类型
	platformList: [
		{name: "待接单", value: 1},
		{name: "已接单", value: 3},
		{name: "配送中", value: 4},
		{name: "已送达", value: 5}
	],
	// 自提配送订单类型
	extractionList: [
		{name: "待取货", value: 1},
		{name: "已取货", value: 2}
	],
	// 商家订单类型
	merchantsOrderList: [
		{name: "待付款", value: 1},
		{name: "待评价", value: 4},
		{name: "已完成", value: 5},
		{name: "已退款", value: 10},
		{name: "已关闭", value: 11}
	],
	// 拼团订单类型
	collateList: [
		{name: "拼团中", value: 1},
		{name: "拼团成功", value: 2}
	],
	// 用户钱包类型
	walletType: [
		{name: "余额钱包", value: 1},
		{name: "微信", value: 2},
		{name: "支付宝", value: 3},
		{name: "消费卡", value: 4},
		{name: "积分钱包", value: 5}
	],
	// 商品类型
	goodsTypeList: [
		{name: "普通商品", value: 1},
		{name: "精品商品", value: 2},
		{name: "进货商品", value: 3},
		{name: "新人大礼", value: 11},
		{name: "限时秒杀", value: 12},
		{name: "今日特价", value: 13},
		{name: "拼团", value: 14},
		{name: "积分大送", value: 15}
	]
}