import url from "@/common/http/url.js"
import publics from "@/common/utils/public.js"
export default{
	filters: {
		filterAddr(code) {
			if (!code) return
			return publics.getAddressByThreeCode(code)
		},
		filterDelivery(type){
			switch(type){
				case 1:
					return "物流配送";
					break;
				case 2:
					return "商家自行配送";
					break;
				case 3:
					return "用户自提";
					break;
				case 4:
					return "平台天使配送";
					break;
				default:
					return "无";
			}
		},
		filterPayType(val){
			switch(val){
				case 1:
					return "余额钱包";
					break;
				case 2:
					return "微信";
					break;
				case 3:
					return "支付宝";
					break;
				case 4:
					return "消费卡";
					break;
				default:
					return "其他";
			}
		}
	},
	methods: {
		filterImg(img) {
			return publics.filterImgUrl(img, 3)
		},
		// 配送状态
		deliveryStatus(row){
			let str = "待收货"
			if (row.deliveryMethod === 1) { // 物流配送
				if (row.deliveryLogisticsStatus === 1) {
					str = "待发货"
				} else if (row.deliveryLogisticsStatus === 2){
					str = "已发货"
				} else{
					str = "已收货"
				}
			} else if (row.deliveryMethod === 2){ // 商家配送
				if (row.deliveryBusinessStatus === 1) {
					str = "待送货"
				} else if (row.deliveryBusinessStatus === 2){
					str = "配送中"
				} else{
					str = "已送达"
				}
			} else if (row.deliveryMethod === 3){ // 用户自提
				if (row.deliveredRaisingStatus === 1) {
					str = "待取货"
				} else{
					str = "已取货"
				}
			} else if (row.deliveryMethod === 4){ // 平台配送
				if (row.deliveryPlatformStatus === 1 && row.orderType !== 2) { // 普通商品时，未选择配送员/等待配送员接单
					str = "等待天使接单"
				} else if (row.deliveryPlatformStatus === 1 && row.orderType === 2){ // 精品商品时，已选择配送员/等待配送员接单
					str = "请选择天使"
				} else if (row.deliveryPlatformStatus === 2){ // 已选择配送员/等待配送员接单，商品是精品商品时才存在该状态
					str = "已选择天使"
				} else if (row.deliveryPlatformStatus === 3){
					str = "已接单"
				} else if (row.deliveryPlatformStatus === 4){
					str = "配送中"
				} else{
					str = "已送达"
				}
			}
			return str
		},
		// 判断当前订单是否可以退款
		judgeRefund(row){
			if (row.deliveryMethod === 1 && row.deliveryLogisticsStatus === 1) { // 物流配送
				return true
			}
			if (row.deliveryMethod === 2 && row.deliveryBusinessStatus === 1) { // 商家配送
				return true
			}
			if (row.deliveryMethod === 3 && row.deliveredRaisingStatus === 1) { // 用户自提
				return true
			}
			if (row.deliveryMethod === 4 && row.deliveryPlatformStatus === 1) { // 平台配送
				return true
			}
		},
		// 判断订单是否可以收货
		judgeReceiv(row){
			if (row.deliveryMethod === 1 && row.deliveryLogisticsStatus === 2) { // 物流配送
				return true
			}
			if (row.deliveryMethod === 2 && row.deliveryBusinessStatus === 2) { // 商家配送
				return true
			}
			if (row.deliveryMethod === 3 && row.deliveredRaisingStatus === 1) { // 用户自提
				return true
			}
			if (row.deliveryMethod === 4 && row.deliveryPlatformStatus === 4) { // 平台配送
				return true
			}
		},
		// 申请退款
		onRefund(row){
			let data = {
				orderId: row.id,
				userType: 1, // 1-用户退款 2-商家退款
				goodsId: row.goodsId,
				goodsName: row.goodsName,
				goodsImage: row.skuImage || row.goodsImage,
				skuName: row.skuName,
				price: row.totalPrice,
				number: row.number,
				toImAccount: row.storeInfo.imAccount,// 商家imAccount
				identity: row.storeInfo.imAccount , // 身份标示
			}
			uni.setStorageSync("refundData", data)
			this.$navigateTo(`/pages/merchants/order/refund`)
		},
		// 确认收货
		confimDelivery(id, func){
			let _this = this
			this.$showModal('确认该商品已收到?','确认收货', res=>{
				if(res.confirm){
					_this.$http("POST", url.order.confirmReceipt, {orderId: id}).then(res =>{
						_this.$msg(res.data)
						_this[func]()
					})
				}
			})
			
		},
		// 支付订单
		payOrder(row){
			let data = {
				goodsId: row.goodsId,
				goodsImage: row.skuImage || row.goodsImage,
				goodsName: row.goodsName,
				skuName: row.skuName,
				price: row.unitPrice,
				number: row.number,
				orderType: row.orderType,
				toImAccount: row.storeInfo.imAccount,
				orderId: row.id
			}
			uni.setStorageSync("orderData", data)
			this.$navigateTo('/pages/order/payment/index')
		},
		// 去评价
		toEvaluate(orderId) {
			this.$navigateTo('evaluate?orderId=' + orderId)
		},
		// 删除订单
		delOrder(id, back){
			let _this = this
			this.$showModal("是否确认删除当前订单", "提示", res => {
				if (res.confirm) {
					_this.$http("POST", url.order.delUserOrder, {orderId: id}).then(res => {
						_this.$msg(res.data)
						if (back) { // 详情页回退
							_this.$navigateBack()
						} else {	// 列表页刷新数据
							_this.getStatusNum()
						}
					})
				}
			})
		},
	}
}