<template>
	<view>
		<view class="address-section" @click="selectAddr">
			<view class="order-content">
				<image :src="staticUrl + 'user/addr.png'" mode="" class="img"></image>
				<view class="cen" v-if="addressData.fullName">
					<view class="top">
						<text class="name">{{ addressData.fullName }}</text>
						<text class="mobile">{{ addressData.mobile }}</text>
					</view>
					<text class="address">{{ addressData.threeAdcode | filterAddr }}{{ addressData.addressDetails }}{{ addressData.addressSupplement }}</text>
				</view>
				<view class="cen" v-else>
					<text>请设置收货地址</text>
				</view>
				<text class="iconfont icon-right">&#xe770;</text>
			</view>
			<image class="a-bg" :src="staticUrl + 'user/addr_bg.png'"></image>
		</view>
		
		<view class="goods-section bg-w">
			<!-- 店铺 -->
			<view class="g-header">
				<image class="logo" :src="orderInfo.storeInfo.logoImage"></image>
				<text class="name">{{orderInfo.storeInfo.name }}</text>
			</view>
			<!-- 商品 -->
			<view class="g-box">
				<view class="g-item">
					<view class="g-item-top">
						<image :src="orderInfo.goodsSku.mainImage || orderInfo.goodsInfo.mainImage"></image>
						<view class="right flex flex-column">
							<text class="title line">{{ orderInfo.goodsInfo.titleName }}</text>
							<text class="spec">{{ orderInfo.goodsSku.skuName }}</text>
							<view class="price-box">
								<text class="price color-red blod">￥{{ orderInfo.goodsSku.skuPrice }}</text>
								<text class="number">x{{ orderInfo.number }}</text>
							</view>
						</view>
					</view>
					<view class="g-cell">
						<text class="label">商品类型</text>
						<text class="txt" v-if="orderInfo.orderType === 1">普通商品</text>
						<text class="txt" v-if="orderInfo.orderType === 2">精品商品</text>
						<text class="txt" v-if="orderInfo.orderType === 3">进货商品</text>
						<text class="txt" v-if="orderInfo.orderType === 11">新人大礼</text>
						<text class="txt" v-if="orderInfo.orderType === 12">限时秒杀</text>
						<text class="txt" v-if="orderInfo.orderType === 13">今日特价</text>
						<text class="txt" v-if="orderInfo.orderType === 14">拼团</text>
						<text class="txt" v-if="orderInfo.orderType === 15">积分大送</text>
					</view>
					<view class="g-cell" v-if="orderInfo.orderType === 3">
						<text class="label">进价百分比</text>
						<text class="txt">{{orderInfo.goodsInfo.boutiqueBuying}}%</text>
					</view>
					<view class="g-cell" v-if="orderInfo.goodsInfo.bonusIntegral">
						<text class="label">获得积分</text>
						<text class="txt">{{((parseInt(((orderInfo.goodsInfo.bonusIntegral/100*orderInfo.goodsSku.skuPrice * orderInfo.number))*100)/100).toFixed(2))*orderInfo.number}}</text>
					</view>
					<!-- 普通商品才可以使用支付组合 -->
					<view class="g-cell" v-if="orderInfo.orderType === 1">
						<text class="label">支付组合</text>
						<block v-if="orderInfo.goodsInfo.paymentCombination === 1">
							<view class="flex flex-column flex-grow">
								<text class="txt">人民币{{orderInfo.goodsInfo.paymentRmb}}%，积分{{100-orderInfo.goodsInfo.paymentRmb}}%</text>
								<text class="txt">开启则需支付{{((orderInfo.goodsInfo.paymentRmb/100*orderInfo.goodsSku.skuPrice)*orderInfo.number).toFixed(2)}}元，{{(((100-orderInfo.goodsInfo.paymentRmb)/100*orderInfo.goodsSku.skuPrice)*orderInfo.number).toFixed(2)}}积分</text>
							</view>
							<switch 
								color="#381895"
								style="transform: scale(0.6); margin-right: -16rpx;"
								@change="switchChange()"/>
						</block>
						<text class="txt" v-else>无</text>
					</view>
					<view class="g-cell" v-if="deliveryMode.length > 0" @click="showPopup()">
						<text class="label">配送方式</text>
						<block v-if="orderInfo.goodsInfo.deliveryNo === 2">
							<text class="txt">{{orderInfo.deliveryNote}}</text>
							<view class="flex flex-align-center select">
								<text class="color-b3">{{orderInfo.deliveryName}}</text>
								<text class="iconfont font38 color-b9">&#xe770;</text>
							</view>
						</block>
						<text class="txt" v-else>无需配送</text>
					</view>
				</view>
				<!-- 普通商品才可以使用优惠券 -->
				<view class="other" v-if="orderInfo.orderType == 1 && orderInfo.discountUserList && orderInfo.discountUserList.length > 0">
					<view class="g-cell" @click="showDiscountPopup()">
						<text class="label">店铺优惠</text>
						<text class="txt">{{orderInfo.discountName}}</text>
						<view class="flex flex-align-center select">
							<text class="color-red" v-if="orderInfo.discountAmount">-¥{{orderInfo.discountAmount}}</text>
							<text class="iconfont font38 color-b9">&#xe770;</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 120rpx;"></view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="font24 color-b9">共{{orderInfo.number}}件，</text>
				<text class="color-b3 font28">合计：</text>
				<view class="flex flex-column">
					<view class="color-red">
						<text class="price">{{ totalPayAmount.toFixed(2) }}</text>
						<text class="price-tip">元</text>
					</view>
					<text class="color-b6 font26" v-if="integral">{{integral.toFixed(2)}}积分</text>
				</view>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		
		<!-- 店铺优惠 -->
		<uni-popup ref="discountPopup" type="bottom">
			<view class="popup">
				<text class="font32 color-b3">店铺优惠</text>
				<radio-group class="cell" @change="radioChangeDiscount">
					<view class="flex flex-between font28 cell-item" v-for="(item, i) in discountList" :key="i">
						<text>{{item.titleName}}</text>
						<text class="grow" v-if="item.discountAmount">¥{{item.discountAmount}}</text>
						<radio :checked="item.checked" :value="item.id" color="#381895" class="radio"/>
					</view>
				</radio-group>
				<button type="primary" class="bg-base btn" @click="confirmDiscount">完成</button>
			</view>
		</uni-popup>
		
		<!-- 配送方式 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<text class="font32 color-b3">配送方式</text>
				<radio-group class="cell" @change="radioChange">
					<view class="flex flex-between font28 cell-item" v-for="(item, i) in deliveryMode" :key="i">
						<text>{{item.name}}</text>
						<text class="grow">{{item.note}}</text>
						<radio :checked="item.checked" :value="item.status" color="#381895" class="radio"/>
					</view>
				</radio-group>
				<button type="primary" class="bg-base btn" @click="confirmMode">完成</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	// import { sendRequestJson } from "@/common/http/api.js"
	import publics from "@/common/utils/public.js"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default{
		components: { uniPopup },
		data(){
			return {
				staticUrl: this.$staticUrl,
				addressData: {},
				orderInfo: [],
				totalPayAmount: 0,
				number: 0,
				integral: 0,
				deliveryMode: [], // 配送方式
				discountList: [], // 优惠券
			}
		},
		filters: {
			filterAddr(code) {
				if (!code) return
				let addrObj = publics.getLngAndLatByCode(code)
				let addrName = ""
				if (addrObj){
					addrObj.map(v=>{
						addrName = addrName + v.name
					})
				}
				return addrName
			}
		},
		onLoad(option) {
			// 获取默认收货地址
			this.$http("GET", url.address.getAddressList).then(res =>{
				if (res.data && res.data.records.length > 0){
					this.addressData = res.data.records[0]
				}
			})
			let commitOrderData = uni.getStorageSync("commitOrderData")
			uni.removeStorageSync("commitOrderData")
			console.log("//////////", commitOrderData)
			if (commitOrderData) {
				this.totalPayAmount = commitOrderData.goodsSku.skuPrice * commitOrderData.number // 商品总额
				if (commitOrderData.orderType === 3) {
					this.totalPayAmount = this.totalPayAmount * (commitOrderData.goodsInfo.boutiqueBuying / 100)
				}
				commitOrderData.totalMoney = this.totalPayAmount
				// 配送方式
				if (commitOrderData.goodsInfo.deliveryNo === 2){
					if (commitOrderData.orderType === 2) { // 精品商品只有平台配送
						this.deliveryMode.push({value: "deliveryPlatform", name: "平台配送", note: "平台配送员配送上门", status: 4})
					} else {
						if (commitOrderData.goodsInfo.deliveryExpress === 1) {
							this.deliveryMode.push({value: "deliveryExpress", name: "快递邮寄", note: "快递物流配送", status: 1})
						}
						if (commitOrderData.goodsInfo.deliveryBusiness === 1) {
							this.deliveryMode.push({value: "deliveryBusiness", name: "商家配送", note: "商家自行配送上门", status: 2})
						}
						if (commitOrderData.goodsInfo.deliveryPlatform === 1 && commitOrderData.orderType !== 3) { // 进货时没有平台配送
							this.deliveryMode.push({value: "deliveryPlatform", name: "平台配送", note: "平台配送员配送上门", status: 4})
						}
						if (commitOrderData.goodsInfo.deliverySelfraising === 1) {
							this.deliveryMode.push({value: "deliverySelfraising", name: "用户自提", note: "到店自取", status: 3})
						}
					}
					if (this.deliveryMode.length > 0) {
						commitOrderData.deliveryName = this.deliveryMode[0].name
						commitOrderData.deliveryNote = this.deliveryMode[0].note
						commitOrderData.deliveryId = this.deliveryMode[0].status
					}
				}
				// 优惠券
				if (commitOrderData.discountUserList.length > 0) {
					let maxArray = commitOrderData.discountUserList.sort((a,b)=>{
						return b.discountAmount - a.discountAmount
					})
					//是否使用优惠券：1=未使用，2=使用
					commitOrderData.couponStatus = 2
					//使用的用户优惠券ID
					commitOrderData.couponUserId = maxArray[0].id
					commitOrderData.discountName = maxArray[0].titleName
					commitOrderData.discountAmount = maxArray[0].discountAmount
					
					//减去优惠券则扣
					this.totalPayAmount = commitOrderData.totalMoney - commitOrderData.discountAmount
				}
				this.orderInfo = commitOrderData
			}
		},
		methods:{
			submit(){
				if (!this.addressData.id) {
					this.$msg('请选择收货地址');
					return;
				}
				if (this.deliveryMode.length > 1) {
					this.$showModal(`配送方式为：${this.orderInfo.deliveryName}，是否确认？`, "提示", res =>{
						if (res.confirm) {
							this.httpReq()
						}
					})
				} else {
					this.httpReq()
				}
			},
			httpReq(){
				uni.showLoading({
					mask: true
				})
				let resultCommitOrders = []
				let params = {
					orderType: this.orderInfo.orderType,
					goodsId: this.orderInfo.goodsId,
					goodsSkuId: this.orderInfo.goodsSkuId,
					groupParentId: this.orderInfo.groupParentId,
					number: this.orderInfo.number,
					receivingAddressId: this.addressData.id,
					couponStatus: this.orderInfo.couponUserId ? 2 : 1, // 是否使用优惠券 1-未使用 2-使用
					couponUserId: this.orderInfo.couponUserId || 0,
					paymentCombination: this.orderInfo.payComposeType || 1, // 支付组合 1-关闭 2-使用
					deliveryMethod: this.orderInfo.deliveryId || 5 // 配送方式
				}
				this.$http("POST", url.order.commitOrder, params).then(res =>{
					uni.redirectTo({
						url: "/pages/order/payment/index?orderId="+res.data.orderId
					})
					uni.hideLoading();
				}).catch((err)=>{
					uni.hideLoading();
					this.$msg(err.msg)
				})
			},
			// 选择收货地址
			selectAddr(){
				this.$navigateTo("/pages/user/address/index?type=1&source=true&id="+this.addressData.id)
			},
			// 支付组合开关
			switchChange(e){
				this.orderInfo.payComposeType = e.detail.value ? 2 : 1
				let integral = (((100-this.orderInfo.goodsInfo.paymentRmb) / 100 * this.orderInfo.goodsSku.skuPrice) * this.orderInfo.number)
				if (e.detail.value) {
					this.integral = integral
					this.totalPayAmount = this.totalPayAmount - this.integral
				} else {
					this.totalPayAmount = this.orderInfo.totalMoney
					this.integral = 0
				}
			},
			// 显示配送方式modal
			showPopup(){
				let deliveryName = this.orderInfo.deliveryName
				this.deliveryMode.map(v =>{
					v.checked = false
					if (v.name === deliveryName) {
						v.checked = true
					}
				})
				this.$forceUpdate()
				this.$refs.popup.open()
			},
			// 选择配送方式
			radioChange(e){
				this.orderInfo.deliveryId = e.detail.value
			},
			// 配送方式modal确认按钮
			confirmMode(){
				let deliveryId = this.orderInfo.deliveryId
				this.deliveryMode.forEach(v =>{
					if (v.status === deliveryId) {
						this.orderInfo.deliveryName = v.name
						this.orderInfo.deliveryNote = v.note
						this.orderInfo.deliveryId = v.status
						this.$forceUpdate()
						return
					}
				})
				this.$refs.popup.close()
			},
			// 显示优惠券modal
			showDiscountPopup(discountPopupOpen) {
				this.discountList = []
				let discountUserList = JSON.parse(JSON.stringify(this.orderInfo.discountUserList))
				let discountName = this.orderInfo.discountName
				discountUserList.push({
					titleName: "不使用优惠",
					discountAmount: 0,
					id: -1
				})
				discountUserList.map(v =>{
					v.checked = false
					if (v.titleName === discountName) {
						v.checked = true
					}
				})
				this.discountList = discountUserList
				this.$refs.discountPopup.open()
			},
			// 选择优惠券
			radioChangeDiscount(e){
				this.orderInfo.couponUserId = parseInt(e.detail.value)
			},
			// 优惠券modal确认按钮
			confirmDiscount(){
				let couponUserId = this.orderInfo.couponUserId
				this.discountList.forEach(v =>{
					if (v.id === couponUserId){
						this.orderInfo.discountName = v.titleName
						this.orderInfo.discountAmount = v.discountAmount
						//使用的用户优惠券ID
						this.orderInfo.couponUserId = v.id
						//是否使用优惠券：1=未使用，2=使用
						this.orderInfo.couponStatus = 2
						return false
					}
				})
				this.totalPayAmount = this.orderInfo.totalMoney - this.orderInfo.discountAmount - this.integral
				this.$refs.discountPopup.close()
			}
		}
	}
</script>

<style scoped lang="scss">
	.address-section {
		padding: 30upx;
		background: #fff;
		position: relative;
		.order-content {
			display: flex;
			align-items: center;
			.img{
				width: 50rpx;
				height: 50rpx;
			}
			.cen {
				display: flex;
				flex-direction: column;
				flex: 1;
				font-size: 32upx;
				color: #303133;
				margin-left: 20rpx;
				.name {
					font-size: 34upx;
					margin-right: 24upx;
				}
				.address {
					margin-top: 16upx;
					margin-right: 20upx;
					color: #909399;
				}
			}
			.icon-right {
				font-size: 44upx;
				color: #909399;
			}
		}
		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}
	.goods-section {
		margin-top: 16upx;
		border-radius: 20rpx;
		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
			.logo {
				display: block;
				width: 50upx;
				height: 50upx;
				border-radius: 6px;
			}
				
			.name {
				font-size: 30upx;
				color: #333;
				margin-left: 24upx;
			}
		}
		.g-box{
			overflow: hidden;
			padding: 20upx 30upx;
			.g-item{
				display: flex;
				flex-direction: column;
				&-top {
					display: flex;
					margin-bottom: 30rpx;
					image {
						flex-shrink: 0;
						display: block;
						width: 140upx;
						height: 140upx;
						border-radius: 10upx;
					}
					.right {
						flex: 1;
						padding-left: 24upx;
						overflow: hidden;
					}
					.title {
						font-size: 28upx;
						color: #303133;
					}
					.spec {
						background-color: #F8F8F8;
						color: #bcbbbd;
						font-size: 24rpx;
						padding: 10rpx;
						margin-top: 4rpx;
						border-radius: 8rpx;
						align-self: flex-start;
					}
					.price-box {
						display: flex;
						align-items: center;
						font-size: 32upx;
						color: #303133;
						padding-top: 10upx;
						.price {
							margin-bottom: 4upx;
							font-size: 30rpx;
						}
						.number {
							font-size: 24upx;
							color: #8a8e94;
							margin-left: 20upx;
						}
					}
				}
			}
			.g-cell{
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				.label{
					width: 140upx;
					margin-right: 24rpx;
					color: #333333;
					text-align: right;
				}
				.txt{
					flex-grow: 1;
					color: #999;
				}
				.select{
					margin-left: 24rpx;
				}
			}
			.other{
				border-top: 2rpx solid #fbf9fd;
				padding-top: 30rpx;
			}
		}
	}
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		.price-content {
			padding-left: 30upx;
			display: flex;
			align-items: center;
			.price-tip {
				margin-left: 8upx;
			}
			.price {
				font-size: 34upx;
			}
		}
		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: #381895;
		}
	}
	.popup{
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		align-items: center;
		justify-content: center;
		.cell{
			width: 710rpx;
			&-item{
				margin-top: 50rpx;
				.grow{
					margin-left: 20rpx;
					flex-grow: 1;
				}
				.radio{
					transform: scale(0.7);
				}
			}
		}
		.btn{
			width: 710rpx;
			margin-top: 50rpx;
			border-radius: 50rpx;
		}
	}
</style>
