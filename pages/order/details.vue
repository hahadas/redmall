<template>
	<view>
		<!-- 状态 -->
		<view class="bg-base flex flex-center flex-column header">
			<block v-if="orderInfo.status === 1">
				<text class="font30">待付款</text>
				<text class="font24">{{payExpireTime}}将自动关闭</text>
			</block>
			<block v-if="orderInfo.status === 10">
				<text class="font30">已退款</text>
				<text class="font24">{{refundObj.identityType === 1 ? '您' : '商家'}}已操作退款</text>
			</block>
			<text v-if="orderInfo.status === 2">未支付完成</text>
			<text v-if="orderInfo.status === 3">{{deliveryStatus(orderInfo)}}</text>
			<text v-if="orderInfo.status === 4">待评价</text>
			<text v-if="orderInfo.status === 5">已完成</text>
			<text v-if="orderInfo.status === 11">已关闭</text>
		</view>
		<!-- 用户的收货地址，用户自提时不显示 -->
		<view class="address-section" v-if="orderInfo.deliveryMethod !== 3">
			<view class="order-content">
				<image src="/static/user/addr.png" mode="" class="img"></image>
				<view class="cen">
					<view class="flex flex-between">
						<view class="top">
							<text class="name">{{ orderInfo.userFullName }}</text>
							<text class="mobile">{{ orderInfo.userMobile }}</text>
						</view>
						<text class="color-purple font28" v-if="isCanEditAddr(orderInfo)" @click="editAddress">修改</text>
					</view>
					<text class="address">{{ orderInfo.userThreeAdcode | filterAddr}}{{ orderInfo.userAddressDetails }}{{ orderInfo.userAddressSupplement }}</text>
				</view>
			</view>
			<image class="a-bg" src="/static/user/addr_bg.png"></image>
		</view>
		<!-- 配送信息 -->
		<view class="distribution" v-if="orderInfo.status === 3 || orderInfo.status === 4 || orderInfo.status === 5">
			<block v-if="orderInfo.deliveryMethod === 1">
				<text class="title">物流配送</text>
				<view class="flex flex-between font30" style="margin-bottom: 10rpx;" v-if="orderInfo.deliveryLogisticsCompanyName">
					<text class="color-b3" style="margin-right: 10rpx;">物流公司</text>
					<text class="color-b6 flex-grow">{{orderInfo.deliveryLogisticsCompanyName}}</text>
				</view>
				<view class="flex flex-between font30" style="margin-bottom: 20rpx;" v-if="orderInfo.deliveryLogisticsOrderNumber">
					<text class="color-b3" style="margin-right: 10rpx;">物流单号</text>
					<text class="color-b6 flex-grow">{{orderInfo.deliveryLogisticsOrderNumber}}</text>
					<text class="color-purple" @click="$onCopy(orderInfo.deliveryLogisticsOrderNumber)">复制</text>
				</view>
				<uni-steps :options="logisticsOption" active-color="#381895" :active="logisticsActive"></uni-steps>
			</block>
			<block v-if="orderInfo.deliveryMethod === 2">
				<view class="flex flex-between">
					<text class="title">商家配送</text>
					<!-- 配送中，显示送达码 -->
					<text class="code" v-if="orderInfo.deliveryBusinessStatus === 2" @click="$onCopy(orderInfo.deliveryBusinessCode)">送达码: {{orderInfo.deliveryBusinessCode}}</text>
				</view>
				<view class="flex flex-between" style="margin-bottom: 20rpx;">
					<view class="flex flex-column flex-grow">
						<text class="font30">发货人：{{orderInfo.storeFullName || storeInfo.name}}</text>
						<text class="font28 color-b6">联系电话：{{orderInfo.storeMobile || storeInfo.mobile}}</text>
					</view>
				</view>
				<uni-steps :options="businessOption" active-color="#381895" :active="businessActive"></uni-steps>
				<map class="map" :latitude="storeInfo.lat" :longitude="storeInfo.lng" @markertap="toMap" :markers="[{
					latitude: storeInfo.lat,
					longitude: storeInfo.lng,
					id: 2,
					iconPath: '/static/icon_position.png'
				}]"></map>
			</block>
			<block v-if="orderInfo.deliveryMethod === 3">
				<view class="flex flex-between">
					<text class="title">用户自提</text>
					<text class="code" @click="$onCopy(orderInfo.deliveredRaisingCode)">取货码: {{orderInfo.deliveredRaisingCode}}</text>
				</view>
				<view class="flex flex-between">
					<view class="flex flex-column flex-grow">
						<text class="font30">发货人：{{orderInfo.storeFullName || storeInfo.name}}</text>
						<text class="font28 color-b6">联系电话：{{orderInfo.storeMobile || storeInfo.mobile}}</text>
					</view>
					<!-- <view>
						<text class="btn" @click="toChat(storeInfo.imAccount, 1)">消息</text>
						<text class="btn" @click="callPhone(orderInfo.storeMobile||storeInfo.mobile)">拨打</text>
					</view> -->
				</view>
				<map class="map" :latitude="storeInfo.lat" :longitude="storeInfo.lng" @markertap="toMap" :markers="[{
					latitude: storeInfo.lat,
					longitude: storeInfo.lng,
					id: 2,
					iconPath: '/static/icon_position.png'
				}]"></map>
			</block>
			<block v-if="orderInfo.deliveryMethod === 4">
				<view class="flex flex-between">
					<text class="title">平台配送</text>
					<text class="code" v-if="orderInfo.deliveryPlatformStatus === 4" @click="$onCopy(orderInfo.deliveryPlatformServiceCode)">确认码: {{orderInfo.deliveryPlatformServiceCode}}</text>
				</view>
				<view class="flex flex-between" style="margin-bottom: 20rpx;" v-if="orderInfo.deliveryPlatformStatus !== 1">
					<image :src="deliveryUserInfo.headPortrait" mode="" class="img" @click="jumpToUser"></image>
					<view class="flex flex-column flex-grow">
						<text class="font30">{{deliveryUserInfo.nickname}}</text>
						<text class="font28 color-b6" v-if="isDeliveryPhone(orderInfo)">{{deliveryUserInfo.mobile}}</text>
					</view>
					<view>
						<text class="btn" @click="toChat(deliveryUserInfo.imAccount, 2)">消息</text>
						<text class="btn" v-if="isDeliveryPhone(orderInfo)" @click="callPhone(deliveryUserInfo.mobile)">拨打</text>
					</view>
				</view>
				<uni-steps :options="agentOption" active-color="#381895" :active="agentActive"></uni-steps>
				<view class="flex flex-center" style="margin: 20rpx 0;" v-if="distance">
					<text class="font28 color-purple">距离我{{distance}}</text>
				</view>
				<map class="map" 
					:latitude="deliveryUserInfo.showLat" :longitude="deliveryUserInfo.showLng" v-if="orderInfo.deliveryPlatformStatus === 3 || orderInfo.deliveryPlatformStatus === 4"
					@markertap="toMap" :markers="[{
					latitude: deliveryUserInfo.showLat,
					longitude: deliveryUserInfo.showLng,
					id: 2,
					iconPath: '/static/icon_position.png'
				}]"></map>
				<view class="flex flex-center" style="margin-top: 20rpx;" v-if="orderInfo.orderType === 2">
					<button type="primary" size="mini" class="bg-base" v-if="orderInfo.deliveryPlatformStatus === 1" @click="selectAgent()">选择配送员</button>
					<button type="primary" size="mini" class="bg-base" :disabled="btnLoading" :loading="btnLoading" v-if="orderInfo.deliveryPlatformStatus === 2" @click="cancelDelivery()">取消配送</button>
				</view>
			</block>
		</view>
		<!-- 商品信息 -->
		<view class="goods bg-w">
			<view class="flex flex-between store" @tap="jumpTo('store', storeInfo.id)">
				<image :src="filterImg(storeInfo.logoImage)" mode="" class="img"></image>
				<view class="flex-grow">
					<text class="font32 color-b3">{{storeInfo.name}}</text>
					<text class="iconfont color-b9 font38">&#xe770;</text>
				</view>
				<view>
					<text class="btn" @tap.stop="toChat(storeInfo.imAccount, 3)">客服</text>
					<text class="btn" @tap.stop="callPhone(orderInfo.storeMobile || storeInfo.mobile)">拨打</text>
				</view>
			</view>
			<view class="goods-item">
				<view class="flex cen" @click="jumpTo('details', orderInfo.goodsId)">
					<view><image :src="filterImg(orderInfo.skuImage || orderInfo.goodsImage)" mode="" class="pic"></image></view>
					<view class="flex flex-column flex-grow">
						<text class="color-b3 line line-2 font32">{{orderInfo.goodsName}}</text>
						<text class="spec">{{orderInfo.skuName}}</text>
					</view>
					<view class="flex flex-column flex-align-end" style="margin-left: 10rpx;">
						<text class="color-b3 font32">¥{{orderInfo.unitPrice}}</text>
						<text class="color-b9 font26">x{{orderInfo.number}}</text>
					</view>
				</view>
				<view class="grid" v-if="orderInfo.paymentCombination === 2">
					<text class="label">组合支付</text>
					<text class="color-b9">人民币{{orderInfo.paymentRmb}}%，积分{{orderInfo.paymentIntegral}}</text>
				</view>
				<view class="grid">
					<text class="label">配送方式</text>
					<text class="color-b9">{{orderInfo.deliveryMethod | filterDelivery}}</text>
				</view>
			</view>
			<view class="flex flex-between cell font26 color-b9">
				<text>商品总价</text>
				<text>¥{{orderInfo.totalPrice}}</text>
			</view>
			<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.orderType === 3">
				<text>进价百分比</text>
				<text>{{orderInfo.boutiqueBuying}}%</text>
			</view>
			<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.payIntegralAmount">
				<text>积分</text>
				<text>{{orderInfo.payIntegralAmount}}</text>
			</view>
			<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.couponStatus === 2">
				<text>优惠券</text>
				<text>¥{{orderInfo.couponAmount}}</text>
			</view>
			<view class="flex flex-between cell font32">
				<text>实付款</text>
				<text class="color-purple">¥{{orderInfo.payRmbAmount}}</text>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="goods bg-w">
			<text class="font34">订单信息</text>
			<!-- <view class="flex flex-align-center li">
				<text class="label">订单备注：</text>
				<text class="note">发啦卡减肥啦卡发觉啦放假啦肥路上的</text>
			</view> -->
			<view class="flex flex-align-center li">
				<text class="label">订单类型：</text>
				<text>{{orderInfo.orderType | filterType}}</text>
			</view>
			<view class="flex flex-align-center li" v-if="orderInfo.orderType === 1 && orderInfo.bonusIntegral">
				<text class="label">赠送积分：</text>
				<text>{{orderInfo.bonusIntegral}}%-{{(orderInfo.bonusIntegral*orderInfo.totalPrice).toFixed(2)}}积分</text>
			</view>
			<view class="flex flex-between li">
				<text class="label">订单编号：</text>
				<text class="flex-grow">{{orderInfo.orderNumber}}</text>
				<text class="color-purple" @click="$onCopy(orderInfo.orderNumber.toString())">复制</text>
			</view>
			<view class="flex flex-align-center li" v-if="orderInfo.rmbPayOrderNumber">
				<text class="label">商户单号：</text>
				<text class="flex-grow">{{orderInfo.rmbPayOrderNumber}}</text>
				<text class="color-purple" @click="$onCopy(orderInfo.rmbPayOrderNumber.toString())">复制</text>
			</view>
			<view class="flex flex-align-center li">
				<text class="label">支付方式：</text>
				<text>{{orderInfo.rmbPayType | filterPayType}}</text>
			</view>
			<view class="flex flex-align-center li">
				<text class="label">创建时间：</text>
				<text>{{orderInfo.createTime}}</text>
			</view>
			<view class="flex flex-align-center li" v-if="orderInfo.rmbPayTime">
				<text class="label">付款时间：</text>
				<text>{{orderInfo.rmbPayTime}}</text>
			</view>
			<view class="flex flex-align-center li" v-if="refundObj.reasonContent">
				<text class="label">退款原因：</text>
				<text>{{refundObj.reasonContent}}</text>
			</view>
			<view class="flex flex-align-center li" v-if="refundObj.createTime">
				<text class="label">退款时间：</text>
				<text>{{refundObj.createTime}}</text>
			</view>
		</view>
		<!-- 评价信息 -->
		<view class="evaluate flex flex-column" v-if="orderInfo.status === 5">
			<view class="flex flex-between" style="margin-bottom: 20rpx;">
				<text class="font34">评价信息</text>
				<text class="font30 color-b6" v-if="goodsEvaluate.status === 1">审核中</text>
				<text class="font30 color-b6" v-if="goodsEvaluate.status === 2">评价成功</text>
				<text class="font30 color-b6" v-if="goodsEvaluate.status === 3">评价违规</text>
			</view>
			<block v-if="goodsEvaluate.evaluateDistributionScore">
				<view class="flex">
					<image :src="orderInfo.deliveryUserInfo.headPortrait" mode="" class="avatar" @click="jumpToUser()"></image>
					<view class="flex flex-column">
						<text>{{orderInfo.deliveryUserInfo.nickname}}</text>
						<uni-rate :size="15" :margin="4" :value="goodsEvaluate.evaluateDistributionScore" readonly></uni-rate>
					</view>
				</view>
				<text class="font28 color-b9">评价配送员：<text class="color-b3">{{goodsEvaluate.evaluateDistributionComment || "用户未评论配送员"}}</text></text>
				<view class="imgs" v-if="goodsEvaluate.evaluateDistributionImages">
					<image :src="item" mode="" class="pic" v-for="(item, index) in goodsEvaluate.evaluateDistributionImages" :key="index" @click="viewImg(goodsEvaluate.evaluateDistributionImages, item)"></image>
				</view>
			</block>
			<text class="font28 color-b9">评价商品：<text class="color-b3">{{goodsEvaluate.evaluateGoodsComment || "用户未评论商品"}}</text></text>
			<view class="flex flex-align-center">
				<text class="font28 color-b9">评分：</text>
				<uni-rate :size="15" :margin="4" :value="goodsEvaluate.evaluateGoodsScore" readonly></uni-rate>
			</view>
			<view class="imgs" v-if="goodsEvaluate.evaluateGoodsImages">
				<image :src="item" mode="" class="pic" v-for="(item, index) in goodsEvaluate.evaluateGoodsImages" :key="index" @click="viewImg(goodsEvaluate.evaluateGoodsImages, item)"></image>
			</view>
			<text class="font28 color-b9">评价时间：<text class="color-b3">{{goodsEvaluate.createTime}}</text></text>
		</view>
		<!-- 占位 -->
		<view style="height: 120rpx;"></view>
		<!-- 操作按钮 -->
		<view class="fixed flex flex-space-end">
			<text class="button base" @click="payOrder(orderInfo)" v-if="orderInfo.status === 1 || orderInfo.status === 2">立即支付</text>
			<text class="button base" v-if="orderInfo.status === 4" @tap.stop="toEvaluate(orderInfo.id)">立即评价</text>
			<text class="button base" @click="confimDelivery(id, 'getOrderInfo')" v-if="orderInfo.status === 3 && judgeReceiv(orderInfo)">确认收货</text>
			<block v-if="orderInfo.status === 3 && judgeRefund(orderInfo)">
				<text class="button base" @click="onRefund(orderInfo)">申请退款</text>
			</block>
			<text class="button base" v-if="orderInfo.status === 1 || orderInfo.status === 5 || orderInfo.status === 10 || orderInfo.status === 11" @click="delOrder(id, true)">删除订单</text>
		</view>
		<!-- 取货码/确认码 -->
		<uni-popup ref="popup">
			<view class="popup">
				<text class="color-purple font48" v-if="orderInfo.deliveryMethod === 3">{{orderInfo.deliveredRaisingCode}}</text>
				<text class="color-purple font48" v-if="orderInfo.deliveryMethod === 4">{{orderInfo.deliveryPlatformServiceCode}}</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import { computeLngLatDistance } from "@/common/utils/index.js"
	import mix from "./mix.js"
	import imMix from "./imMix.js"
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	let timer = null
	export default{
		components: {uniSteps, uniPopup, uniRate},
		mixins: [mix, imMix],
		data(){
			return {
				btnLoading: false,
				id: "",
				orderInfo: {},
				storeInfo: {},
				payExpireTime: "",
				refundObj: {},
				// 物流配送
				logisticsOption: [
					{title: "待发货"},
					{title: "已发货"},
					{title: "已收货"}
				],
				logisticsActive: 0,
				// 商家配送
				businessOption: [
					{title: "待送货"},
					{title: "配送中"},
					{title: "已送达"}
				],
				businessActive: 0,
				// 平台配送
				agentOption: [
					{title: "已接单"},
					{title: "配送中"},
					{title: "已送达"}
				],
				agentActive: 0,
				goodsEvaluate: {},
				// 配送员信息
				deliveryUserInfo: {},
				distance: ""
			}
		},
		filters: {
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
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		onHide() {
			this.clearCountDown()
		},
		onUnload() {
			this.clearCountDown()
		},
		methods:{
			init(){
				this.logisticsOption = [
					{title: "待发货"},
					{title: "已发货"},
					{title: "已收货"}
				]
				this.businessOption = [
					{title: "待送货"},
					{title: "配送中"},
					{title: "已送达"}
				]
				this.agentOption = [
					{title: "已接单"},
					{title: "配送中"},
					{title: "已送达"}
				]
				this.getOrderInfo()
			},
			getOrderInfo(){
				this.$http("GET", url.order.getOrderInfoById, {orderId: this.id}).then(res =>{
					this.orderInfo = res.data
					this.storeInfo = res.data.storeInfo
					if (res.data.goodsEvaluate) {
						this.goodsEvaluate = res.data.goodsEvaluate
						this.goodsEvaluate.evaluateGoodsScore = res.data.goodsEvaluate.evaluateGoodsScore / 2
					}
					if (res.data.refundList && res.data.refundList.length > 0) {
						this.refundObj = res.data.refundList[0]
					}
					if (res.data.payExpireTime) {
						let time = res.data.payExpireTime.split(" ")[1]
						let ms = time.split(":")
						this.payExpireTime = ms[0]+"时"+ms[1]+"分"
					}
					// 物流配送
					if (res.data.deliveryMethod === 1) {
						this.logisticsOption[0].desc = this.splitTime(res.data.createTime)
						this.logisticsOption[1].desc = this.splitTime(res.data.deliveryLogisticsDeliverTime) || ""
						this.logisticsOption[2].desc = this.splitTime(res.data.confirmReceiptTime) || ""
						this.logisticsActive = res.data.deliveryLogisticsStatus - 1
					}
					// 商家配送
					if (res.data.deliveryMethod === 2) {
						this.businessOption[0].desc = this.splitTime(res.data.createTime)
						this.businessOption[1].desc = this.splitTime(res.data.deliveryBusinessDeliveredTime) || ""
						this.businessOption[2].desc = this.splitTime(res.data.confirmReceiptTime) || ""
						this.businessActive = res.data.deliveryBusinessStatus - 1
					}
					// 平台配送
					if (res.data.deliveryMethod === 4) {
						if (res.data.orderType === 1) { // 普通商品
							this.agentOption.unshift({title: "等待配送员接单", desc: this.splitTime(res.data.createTime)})
							if (res.data.deliveryPlatformStatus === 1) {
								this.agentActive = res.data.deliveryPlatformStatus - 1
							} else {
								this.agentActive = res.data.deliveryPlatformStatus - 2
							}
						} else if (res.data.orderType === 2) {
							this.agentOption.unshift({
								title: "请选择配送员", desc: this.splitTime(res.data.createTime)}, 
								{title: "已选择配送员", desc: this.splitTime(res.data.deliveryPlatformSelectTime)})
							this.agentActive = res.data.deliveryPlatformStatus - 1
						}
						let length = this.agentOption.length
						this.agentOption[length-3].desc = this.splitTime(res.data.deliveryPlatformOrderTime) || ""
						this.agentOption[length-2].desc = this.splitTime(res.data.deliveryPlatformPickedTime) || ""
						this.agentOption[length-1].desc = this.splitTime(res.data.confirmReceiptTime) || ""
						this.deliveryUserInfo = res.data.deliveryUserInfo || {}
						// 已接单或配送中时，计时器开始获取配送员经纬度，更新配送员位置，暂时注释
						// if (res.data.deliveryPlatformStatus === 3 || res.data.deliveryPlatformStatus === 4) { // 已接单/配送中
						// 	this.countDown()
						// 	this.sessionOperation()
						// } else {
						// 	this.clearCountDown()
						// }
					}
					this.$forceUpdate()
					uni.stopPullDownRefresh()
				})
			},
			splitTime(time){
				if (!time) return ""
				let split = time.split(":")
				return split[0] + ":" + split[1]
			},
			countDown(){
				let _this = this
				let deliveryLat = this.deliveryUserInfo.showLat || this.orderInfo.deliveryUserInfo.showLat
				let deliveryLng = this.deliveryUserInfo.showLng || this.orderInfo.deliveryUserInfo.showLng
				this.distance = computeLngLatDistance(deliveryLat, deliveryLng, this.orderInfo.userLat, this.orderInfo.userLng)
				this.clearCountDown()
				timer = setInterval(()=>{
					_this.$http("GET", url.user.getUserInfoById, {toImAccount: _this.deliveryUserInfo.imAccount}).then(res =>{
						_this.deliveryUserInfo = res.data
					})
				}, 10000)
			},
			clearCountDown(){
				this.distance = ""
				if (timer) {
					clearInterval(timer)
					timer = null
				}
			},
			
			// showPopup(code){
			// 	// #ifdef H5
			// 	this.$refs.popup.open()
			// 	// #endif
			// 	// #ifdef APP-PLUS
			// 	uni.$emit('page-popup', {// 向 popup 传递消息
			// 		code: code
			// 	});
			// 	const subNVue = uni.getSubNVueById('popup');// 通过 id 获取 nvue 子窗体 
			// 	subNVue.show('zoom-fade-out', 250);// 打开 nvue 子窗体
			// 	// #endif
			// },
			
			// 判断是否可以修改地址
			// 1、未付款；
			// 2、已付款，并且是精品订单并且未有配送员接单时可修改，就是平台配送状态deliveryPlatformStatus = 1的时候可以操作
			// 3、已付款，非精品订单，未发货前可修改【暂时不支持，保留位置等以后用到再说】
			isCanEditAddr(item){
				if (item.status === 1 || item.status === 2) {
					return true
				}
				if (item.status === 3 && item.orderType === 2 && item.deliveryPlatformStatus === 1) {
					return true
				}
				// if (item.status === 3 && item.orderType !== 2 && (
				// 	(item.deliveryMethod === 1 && item.deliveryLogisticsStatus === 1) ||  // 物流未发货
				// 	(item.deliveryMethod === 2 && item.deliveryBusinessStatus === 1) ||	// 商家未发货
				// 	(item.deliveryMethod === 4 && item.deliveryPlatformStatus === 1))){	// 平台未接单
				// 	return true
				// }
			},
			// 是否隐藏配送元手机号码和点击拨号
			// 如果是精品订单，平台配送，已选择配送员则隐藏订单中的配送员手机号，和拨号按钮
			isDeliveryPhone(row){
				if (row.orderType === 2 && row.deliveryMethod === 4 && row.deliveryPlatformStatus === 2) {
					return false
				}
				return true
			},
			// 修改收货地址
			editAddress(){
				this.$navigateTo(`/pages/user/address/index?orderId=${this.orderInfo.id}&&editAddr=true`)
			},
			toChat(imAccount, type){
				this.$navigateTo(`/pages/interaction/im-chat?type=${type}&&id=${imAccount}`)
			},
			// 拨打电话
			callPhone(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 查看地图
			toMap(){
				let _this = this
				uni.openLocation({
					latitude: _this.storeInfo.lat,
					longitude: _this.storeInfo.lng,
					address: _this.storeInfo.addressDetails + _this.storeInfo.addressSupplement
				});
			},
			// 取消配送员为我配送
			cancelDelivery(){
				this.btnLoading = true
				let toImAccount = this.deliveryUserInfo.imAccount
				this.sessionOperation(toImAccount, 2)
				this.$http("POST", url.distributor.cancelDistributor, {orderId: this.id}).then(res =>{
					this.$msg(res.data)
					this.init()
					// #ifdef APP-PLUS
					// 发送一条消息，判断对方是否在线
					this.isOtherOnline(toImAccount, "userCancel")
					
					// 发送消息给对方
					let goodsInfo = {
						orderId: this.id,
						goodsId: this.orderInfo.goodsId, // 商品id
						goodsImage: this.orderInfo.skuImage || this.orderInfo.goodsImage, // 商品图片
						goodsName: this.orderInfo.goodsName,
						skuName: this.orderInfo.skuName,
						price: this.orderInfo.totalPrice,
						status: 2 , // 1-邀请对方接单，用户和配送员都可操作取消 2-用户取消配送 3-配送员取消接单 4-配送员接单
						identity: toImAccount, // 配送配送员imAccount
					}
					this.sendMsgToOther(toImAccount, goodsInfo, 6, 2, ()=>{
						this.editDBData(goodsInfo.orderId, goodsInfo.status)
					})
					// #endif
					this.btnLoading = false
				}).catch(()=>{
					this.btnLoading = false
				})
			},
			// 选择配送员
			selectAgent(){
				let data = {
					orderId: this.id,
					goodsId: this.orderInfo.goodsId,
					goodsImage: this.orderInfo.skuImage || this.orderInfo.goodsImage,
					goodsName: this.orderInfo.goodsName,
					skuName: this.orderInfo.skuName,
					price: this.orderInfo.totalPrice
				}
				uni.setStorageSync("agentData", data)
				this.$navigateTo('agentList')
			},
			viewImg(list, img){
				uni.previewImage({
					urls: list,
					current:img
				})
			},
			jumpTo(path, id){
				this.$navigateTo(`/pages/home/${path}?id=${id}`)
			},
			jumpToUser(){
				this.$navigateTo(`/pages/interaction/user?userId=${this.deliveryUserInfo.imAccount}`)
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		height: 100rpx;
		border-radius: 0 0 30rpx 30rpx;
		margin-bottom: 20rpx;
		color: white;
	}
	.address-section {
		padding: 30upx;
		background: #fff;
		position: relative;
		.order-content {
			display: flex;
			align-items: center;
		}
		.img{
			width: 60rpx;
			height: 60rpx;
		}
		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 32upx;
			color: #303133;
			margin-left: 20rpx;
		}
		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}
		.address {
			margin-top: 10upx;
			margin-right: 20upx;
			color: #909399;
		}
		.icon-right {
			font-size: 44upx;
			color: #909399;
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
	.distribution{
		background-color: white;
		padding: 20rpx;
		margin-top: 20rpx;
		.title{
			margin-bottom: 20rpx;
			display: block;
			border-left: 6rpx solid #381895;
			padding-left: 20rpx;
		}
		.img{
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 10rpx;
		}
		.code{
			border: 2rpx solid #381895;
			border-radius: 50rpx;
			padding: 6rpx 30rpx;
			font-size: 24rpx;
			color: #381895;
		}
		
		.map{
			width: 100%;
			height: 250rpx;
			margin-top: 10rpx;
		}
	}
	.btn{
		border-radius: 8rpx;
		width: 130rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border:2rpx solid #381895;
		font-size: 24rpx;
		color: #381895;
		display: inline-block;
		margin-left: 10rpx;
	}
	.goods{
		margin-top: 20rpx;
		padding: 20rpx;
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
			.cen{
				margin-bottom: 20rpx;
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
			.grid{
				margin-bottom: 20rpx;
				font-size: 28rpx;
				.label{
					width: 180rpx;
					margin-right: 20rpx;
					text-align: right;
					display: inline-block;
				}
			}
		}
		.cell{
			margin-top: 10rpx;
		}
		.li{
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #666666;
			.label{
				width: 160rpx;
			}
			.note{
				width: 500rpx;
			}
		}
	}
	.evaluate{
		background-color: white;
		padding: 20rpx;
		margin-top: 20rpx;
		.avatar{
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 10rpx;
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
		
		.button{
			font-size: 26rpx;
			border: 2rpx solid #aeadaf;
			padding: 10rpx 26rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			color: #666;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
		.base{
			color: #381895;
			border: 2rpx solid #381895;
		}
	}
	.popup{
		background-color: white;
		width: 500rpx;
		height: 200rpx;
		display: flex;
		border-radius: 20rpx;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
</style>
