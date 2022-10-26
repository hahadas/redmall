<template>
	<view>
		<text class="tips" v-if="orderInfo.orderType === 2">该商品自己提供，商品以及配送收益都归自己</text>
		<view class="list" v-if="orderInfo.orderType === 1">
			<text class="title">商家地址</text>
			<view class="flex flex-between">
				<view class="flex flex-column font32">
					<text class="color-b5">{{orderInfo.storeFullName || orderInfo.storeInfo.name}} {{orderInfo.storeMobile || orderInfo.storeInfo.mobile}}</text>
					<text>{{orderInfo.storeThreeAdcode | filterAddr}}{{orderInfo.storeAddressDetails}}{{orderInfo.storeAddressSupplement}}</text>
				</view>
				<view @click="goMap(orderInfo,'business')"><image src="/static/user/addr.png" mode="" class="addr"></image></view>
			</view>
		</view>
		<view class="list">
			<text class="title">配送地址</text>
			<view class="flex flex-between">
				<view class="flex flex-column font32">
					<text class="color-b5">{{orderInfo.userFullName}} {{orderInfo.userMobile}}</text>
					<text>{{orderInfo.userThreeAdcode | filterAddr}}{{orderInfo.userAddressDetails}}{{orderInfo.userAddressSupplement}}</text>
				</view>
				<view @click="goMap(orderInfo,'user')"><image src="/static/user/addr.png" mode="" class="addr"></image></view>
			</view>
		</view>
		<view class="list">
			<text class="title">商品信息</text>
			<view class="goods">
				<view class="flex flex-align-center store" v-if="orderInfo.storeInfo">
					<image :src="orderInfo.storeInfo.logoImage" mode="" class="img"></image>
					<text class="font32 color-b3">{{orderInfo.storeInfo.name}}</text>
					<text class="iconfont color-b9 font38">&#xe770;</text>
				</view>
				<view class="goods-item">
					<view><image :src="orderInfo.skuImage || orderInfo.goodsImage" mode="" class="pic"></image></view>
					<view class="flex flex-column flex-grow">
						<text class="color-b3 line line-2 font32">{{orderInfo.goodsName}}</text>
						<text class="spec">{{orderInfo.skuName}}</text>
					</view>
					<view class="flex flex-column flex-align-end" style="margin-left: 10rpx;">
						<text class="color-b3 font32">¥{{orderInfo.totalPrice}}</text>
						<text class="color-b9 font26">x{{orderInfo.number}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="list">
			<text class="title">订单信息</text>
			<view class="flex flex-align-center cell">
				<text class="label">商品总额：</text>
				<text>¥{{orderInfo.totalPrice}}</text>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">预计佣金：</text>
				<text class="blod color-purple">¥{{orderInfo.deliveryPlatformMoney}}</text>
			</view>
			<!-- 普通商品，并且天使已接单或配送中 -->
			<view class="flex flex-align-center cell" v-if="orderInfo.orderType === 1 && !isHistory && (orderInfo.deliveryPlatformStatus === 3 || orderInfo.deliveryPlatformStatus === 4)">
				<text class="label" v-if="orderInfo.deliveryPlatformStatus === 3">取&ensp;货&ensp;码：</text>
				<text class="label" v-if="orderInfo.deliveryPlatformStatus === 4">取&ensp;消&ensp;码：</text>
				<text class="flex-grow">{{orderInfo.deliveryPlatformCode}}</text>
				<text class="color-purple" @click="$onCopy(orderInfo.deliveryPlatformCode.toString())">复制</text>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">订单类型：</text>
				<text>{{orderInfo.orderType | filterType}}</text>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.orderType === 1 && orderInfo.bonusIntegral">
				<text class="label">赠送积分：</text>
				<text>{{orderInfo.bonusIntegral}}%-{{(orderInfo.bonusIntegral*orderInfo.totalPrice).toFixed(2)}}积分</text>
			</view>
			<view class="flex flex-between cell">
				<text class="label">订单编号：</text>
				<text class="flex-grow">{{orderInfo.orderNumber}}</text>
				<text class="color-purple" @click="$onCopy(orderInfo.orderNumber.toString())">复制</text>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.rmbPayOrderNumber">
				<text class="label">商户单号：</text>
				<text class="flex-grow">{{orderInfo.rmbPayOrderNumber}}</text>
				<text class="color-purple" @click="$onCopy(orderInfo.rmbPayOrderNumber.toString())">复制</text>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">支付方式：</text>
				<text>{{orderInfo.rmbPayType | filterPayType}}</text>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">创建时间：</text>
				<text>{{orderInfo.createTime}}</text>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.rmbPayTime">
				<text class="label">付款时间：</text>
				<text>{{orderInfo.rmbPayTime}}</text>
			</view>
		</view>
		<view class="list" v-if="orderInfo.deliveryPlatformEvaluate">
			<text class="title">评价信息</text>
			<view class="flex flex-align-center cell">
				<text class="label">商品评分：</text>
				<uni-rate :size="15" :margin="4" :value="orderInfo.goodsEvaluate.evaluateGoodsScore / 2" readonly></uni-rate>
			</view>
			<view class="flex cell">
				<text><text class="label">评价商品：</text>{{orderInfo.goodsEvaluate.evaluateGoodsComment}}</text>
			</view>
			<view class="flex flex-align-center cell">
				<view class="imgs" v-if="orderInfo.goodsEvaluate.evaluateGoodsImages">
					<image :src="item" mode="" class="pic" v-for="(item, index) in orderInfo.goodsEvaluate.evaluateGoodsImages" :key="index" @click="viewImg(orderInfo.goodsEvaluate.evaluateGoodsImages, item)"></image>
				</view>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionScore">
				<text class="label">天使评分：</text>
				<uni-rate :size="15" :margin="4" :value="orderInfo.goodsEvaluate.evaluateDistributionScore" readonly></uni-rate>
			</view>
			<view class="flex cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionComment">
				<text><text class="label">评价天使：</text>{{orderInfo.goodsEvaluate.evaluateDistributionComment}}</text>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionImages">
				<view class="imgs">
					<image :src="item" mode="" class="pic" v-for="(item, index) in orderInfo.goodsEvaluate.evaluateDistributionImages" :key="index" @click="viewImg(orderInfo.goodsEvaluate.evaluateDistributionImages, item)"></image>
				</view>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">评价时间：</text>
				<text>{{orderInfo.goodsEvaluate.createTime}}</text>
			</view>
		</view>
		<!-- 占位 -->
		<view style="height: 120rpx;"></view>
		<!-- 操作按钮 -->
		<view class="fixed flex flex-space-end">
			<text class="btn" @click="confirmOrder()" v-if="orderInfo.deliveryPlatformStatus === 1">确认接单</text>
			<text 
				class="btn" @click="openModal()" 
				v-if="orderInfo.deliveryPlatformStatus !== 5 && orderInfo.deliveryPlatformStatus !== 1">
				取消配送</text>
			<text class="btn" @click="confirmPickup()" v-if="orderInfo.deliveryPlatformStatus === 3">确认取货</text>
			<text class="btn" @click="showPopup()" v-if="orderInfo.deliveryPlatformStatus === 4">确认送达</text>
		</view>
		<!-- 确认送达 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<text class="title">确认送达</text>
				<view class="form">
					<text>确认码</text>
					<input type="number" :maxlength="6" v-model="deliveryPlatformServiceCode" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
				</view>
				<view class="flex flex-align-center flex-space-around">
					<button type="default" class="btn" @click="closePopup">取消</button>
					<button type="primary" class="btn bg-base" @click="onConfirm">确认</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 取消配送弹框 -->
		<uni-popup ref="canCelPopup" type="dialog">
		    <uni-popup-dialog 
				mode="input" 
				title="取消配送"
				placeholder="取消配送原因"
				@confirm="cancelOrder"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue"
	export default{
		components: {
			uniRate, uniPopup, uniPopupDialog
		},
		data(){
			return {
				isHistory: false,
				id: "",
				orderUserId: "",
				orderInfo: {},
				toUserInfo: {},
				deliveryPlatformServiceCode: ""
			}
		},
		filters:{
			filterAddr(code) {
				if (!code) return
				return publics.getAddressByThreeCode(code)
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
					case 3:
						return "平台卡包";
						break;
					default:
						return "其他";
				}
			},
			filterType(val){
				let value = "其他"
				selectOptions.goodsTypeList.forEach(v => {
					if (v.value === val) {
						value = v.name
						return
					}
				})
				return value
			}
		},
		onLoad(opt) {
			this.id = opt.id
			this.orderUserId = opt.orderUserId
			if (opt.isHistory){
				this.isHistory = true
			}
			this.getInfo()
		},
		onPullDownRefresh() {
			this.getInfo()
		},
		methods: {
			getInfo(){
				let path = url.distributor.getOrderDetailsById
				let params = {
					orderId: this.id, 
					orderUserId: this.orderUserId
				}
				if (this.isHistory){
					path = url.distributor.historyOrderDetails
					params = {
						id: this.id,
						userId: this.orderUserId
					}
				}
				this.$http("GET", path, params).then(res =>{
					this.orderInfo = res.data.order || res.data
					if (res.data.toUserInfo) {
						this.toUserInfo = res.data.toUserInfo
					}
					uni.stopPullDownRefresh()
				}).catch(()=>{
					uni.stopPullDownRefresh()
				})
			},
			// 确认接单
			confirmOrder(){
				let toImAccount = this.toUserInfo.imAccount
				if (this.orderInfo.orderType === 2) {
					this.sessionOperation(toImAccount, 0)
				}
				this.$http("POST", url.distributor.confirmReceiptOrder, {orderId: this.id}).then(()=>{
					this.$msg(res.data)
					
					// #ifdef APP-PLUS
					if (this.orderInfo.orderType === 2) {
						// 发送一条消息，判断对方是否在线
						this.isOtherOnline(toImAccount, "agentConfirm")
						// 发送消息给对方
						let goodsInfo = {
							orderId: this.orderInfo.id,
							goodsId: this.orderInfo.goodsId,
							goodsImage: this.orderInfo.skuImage || this.orderInfo.goodsImage,
							goodsName: this.orderInfo.goodsName,
							skuName: this.orderInfo.skuName,
							price: this.orderInfo.totalPrice,
							number: this.orderInfo.number,
							status: 4, // 1-邀请对方接单，用户和天使都可操作取消 2-用户取消配送 3-天使取消接单 4-天使接单
							identity: this.userInfo.imAccount, // 配送天使的imAccount
						}
						this.sendMsgToOther(toImAccount, goodsInfo, 6, 0, ()=>{
							this.editDBData(goodsInfo.orderId, goodsInfo.status)
						})
					}
					// #endif
					
					this.getInfo()
				})
			},
			// 显示取消配送弹框
			openModal(){
				this.$refs.canCelPopup.open()
			},
			// 取消配送
			cancelOrder(done, value){
				if (!value) return this.$msg("请输入取消配送理由")
				let toImAccount = this.toUserInfo.imAccount
				this.sessionOperation(toImAccount, 0)
				this.$http("POST", url.distributor.cancelReceiptOrder, {orderId: this.id}).then(()=>{
					this.$msg(res.data)
					done()
					// #ifdef APP-PLUS
					// 发送一条消息，判断对方是否在线
					this.isOtherOnline(toImAccount, "agentCancel")
					// 发送消息给对方
					let goodsInfo = {
						orderId: this.orderInfo.id,
						goodsId: this.orderInfo.goodsId,
						goodsImage: this.orderInfo.skuImage || this.orderInfo.goodsImage,
						goodsName: this.orderInfo.goodsName,
						skuName: this.orderInfo.skuName,
						price: this.orderInfo.totalPrice,
						number: this.orderInfo.number,
						status: 3, // 1-邀请对方接单，用户和天使都可操作取消 2-用户取消配送 3-天使取消接单 4-天使接单
						identity: this.userInfo.imAccount, // 配送天使的imAccount
						reason: value
					}
					this.sendMsgToOther(toImAccount, goodsInfo, 6, 0, ()=>{
						this.editDBData(goodsInfo.orderId, goodsInfo.status)
					})
					// #endif
					
					this.getInfo()
				})
			},
			// 确认取货
			confirmPickup(){
				let _this = this
				this.$showModal("是否确认当前商品已取得", "提示", res=>{
					if (res.confirm) {
						_this.$http("POST", url.distributor.confirmPickUp, {orderId: _this.id}).then(()=>{
							_this.getInfo()
						})
					}
				})
			},
			// 确认送达
			onConfirm(){
				this.closePopup()
				uni.showLoading({
					mask:true
				})
				let params = {
					orderId: this.id,
					deliveryPlatformServiceCode: this.deliveryPlatformServiceCode
				}
				this.$http("POST", url.distributor.confirmService, params).then(res =>{
					uni.hideLoading()
					this.$msg(res.data)
					this.getInfo()
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			showPopup(){
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			goMap(row, type){
				let lat = row.storeLat
				let lng = row.storeLng
				let address = row.storeAddressDetails + row.storeAddressSupplement
				if (type === "user") {
					lat = row.userLat
					lng = row.userLng
					address = row.userAddressDetails + row.userAddressSupplement
				}
				uni.openLocation({
					latitude:lat,
					longitude:lng,
					address: address
				})
			},
			viewImg(list, img){
				uni.previewImage({
					urls: list,
					current:img
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.tips{
		background-color: rgba($color: #381895, $alpha: 0.3);
		color: #381895;
		padding: 10rpx 20rpx;
		font-size: 26rpx;
		width: 710rpx;
		display: block;
		text-align: center;
	}
	.list{
		background-color: white;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		.title{
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
			border-left: 8rpx solid #381895;
			padding-left: 20rpx;
			margin-bottom: 20rpx;
			display: block;
		}
	}
	.addr{
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
	}
	.goods{
		.store{
			margin-bottom: 30rpx;
			.img{
				width: 50rpx;
				height: 50rpx;
				border-radius: 4rpx;
				margin-right: 10rpx;
			}
		}
		&-item{
			display: flex;
			.pic{
				width: 180rpx;
				height: 180rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}
			.spec{
				background-color: #F8F8F8;
				color: #bcbbbd;
				font-size: 24rpx;
				padding: 10rpx;
				margin-top: 4rpx;
				border-radius: 8rpx;
				align-self: flex-start;
			}
		}
	}
	.cell{
		margin-bottom: 20rpx;
		font-size: 28rpx;
		color: #666666;
		.label{
			width: 160rpx;
		}
		.note{
			width: 500rpx;
		}
		.imgs{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 10rpx;
			.pic{
				width: 160rpx;
				height: 160rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				border-radius: 10rpx;
			}
		}
	}
	.fixed{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background-color: #FFFFFF;
		border-top: 2rpx solid #f0f0f0;
		.btn{
			font-size: 26rpx;
			border: 2rpx solid #381895;
			padding: 10rpx 26rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			color: #381895;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}
	.popup{
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx;
		.title{
			display: block;
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		.form{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 20rpx;
			color: #333333;
		}
		.btn{
			width: 40%;
		}
	}
</style>
