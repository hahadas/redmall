<template>
	<view class="main">
		<view class="header flex flex-align-center color-w" :style="{'padding-top': statusBarHeight+'px'}">
			<view class="flex flex-grow" style="justify-content: space-between;">
				<view class="flex flex-align-center" @click="toNav('/pages/setting/personal')">
					<view>
						<image :src="filterImg(avatar)" mode="aspectFill" class="avatar"></image>
					</view>
					<view>
						<view class="flex flex-align-center">
							<text class="font38 line">{{userDetailInfo.nickname}}</text>
						</view>
						<view class="flex flex-align-center">
							<view class="six" v-if="userDetailInfo.distributorIsOpen === 1">
								<text class="font24">配送员</text>
							</view>
							<view class="six" v-if="userDetailInfo.storeIsOpen === 1">
								<text class="font24">商家</text>
							</view>
						</view>
					</view>
				</view>
				<text class="iconfont blod font48" @click="toNav('/pages/setting/index')">&#xe62a;</text>
			</view>
		</view>
		<view class="con">
			<view class="culist history">
				<view class="grod pad">
					<view class="grod-item" @click="toNav('/pages/user/collect')">
						<text>{{cbfcAcountData.collection}}</text>
						<text class="font26">收藏</text>
					</view>
					<view class="grod-item" @click="toNav('/pages/user/focusStores')">
						<text>{{cbfcAcountData.follow}}</text>
						<text class="font26">店铺</text>
					</view>
					<view class="grod-item" @click="toNav('/pages/user/footprint')">
						<text>{{cbfcAcountData.browse}}</text>
						<text class="font26">足迹</text>
					</view>
					<view class="grod-item" @click="toNav('/pages/user/coupon')">
						<text>{{cbfcAcountData.coupon}}</text>
						<text class="font26">优惠券</text>
					</view>
					<view class="grod-item" @click="toNav('/pages/user/cardBag')">
						<text>{{cardsTotal}}</text>
						<text class="font26">卡包</text>
					</view>
				</view>
			</view>
			
			<view class="culist">
				<view class="title flex flex-between" @click="goOrder(false)">
					<text class="blod font30">我的订单</text>
					<view class="flex flex-align-center color-b9">
						<text class="font28">查看更多订单</text>
						<text class="iconfont font38">&#xe770;</text>
					</view>
				</view>
				<view class="grod">
					<view class="grod-item" style="width: 20%;" v-for="(item, i) in cuList" :key="i" @click="goOrder(item.status)">
						<image :src="staticUrl + item.icon" mode="" class="img"></image>
						<text class="color-b5 font26">{{item.name}}</text>
						<text class="tips" v-if="item.tip">{{item.tip>99?'99+':item.tip}}</text>
					</view>
				</view>
			</view>
			<!-- 余额 -->
			<view class="list" @click="toNav('/pages/user/wallet/index')">
				<view class="list-item flex flex-between bg-w">
					<view class="flex flex-align-center">
						<image :src="staticUrl + 'user/balance.png'" mode="" class="icon"></image>
						<text class="font30 blod">我的余额</text>
					</view>
					<view class="flex flex-align-center color-b6">
						<text class="font30">{{ balance }}元</text>
						<text class="iconfont font40">&#xe770;</text>
					</view>
				</view>
			</view>
			<!-- 图片 -->
			<view class="carousel-section">
				<view class="carousel" @click="toAgent">
					<image :src="staticUrl + 'user/agent_use1.png'" v-if="userDetailInfo.distributorIsOpen === 1" mode="scaleToFill" class="img"/>
					<image :src="staticUrl + 'user/agent_1.png'" v-else mode="scaleToFill" class="img"/>
				</view>
				<view class="carousel" @click="toMerchants">
					<image :src="staticUrl + 'user/merchants_use.png'" v-if="userDetailInfo.storeIsOpen === 1" mode="scaleToFill" class="img"/>
					<image :src="staticUrl + 'user/merchants.png'" v-else mode="scaleToFill" class="img"/>
				</view>
			</view>
			<!-- 我的服务 -->
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">我的服务</text>
				</view>
				<view class="flex flex-column">
					<view class="grod">
						<!-- #ifndef H5 -->
						<view class="grod-item" @click="scanCode">
							<text class="iconfont" style="font-size: 56rpx;margin-bottom: 10rpx; color: #cc920c;">&#xe647;</text>
							<text class="color-b5 font26">扫一扫</text>
						</view>
						<!-- #endif -->
						<view class="grod-item" @click="toNav('/pages/user/team')">
							<image :src="staticUrl + 'user/share.png'" mode="" class="img"></image>
							<text class="color-b5 font26">我的分享</text>
							<text class="tips" v-if="teamTotal">{{teamTotal>99?'99+':teamTotal}}</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/user/invite')">
							<image :src="staticUrl + 'user/invite.png'" mode="" class="img"></image>
							<text class="color-b5 font26">邀请好友</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/user/address/index?type=1')">
							<image :src="staticUrl + 'user/address.png'" mode="" class="img"></image>
							<text class="color-b5 font26">地址管理</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/setting/personal')">
							<image :src="staticUrl + 'user/personal.png'" mode="" class="img"></image>
							<text class="color-b5 font26">个人资料</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/setting/index')">
							<image :src="staticUrl + 'user/set.png'" mode="" class="img"></image>
							<text class="color-b5 font26">系统设置</text>
						</view>
						<view class="grod-item" @click="onContact">
							<image :src="staticUrl + 'user/evaluate.png'" mode="" class="img"></image>
							<text class="color-b5 font26">联系客服</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 第三方 -->
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">第三方服务</text>
				</view>
				<view class="flex flex-column">
					<view class="grod">
						<view class="grod-item" v-if="showThreeItem('third_party_services_credit_card')" @click="toNav('three/creditCard')">
							<text class="iconfont icon" style="color: #d75a1b;">&#xe657;</text>
							<text class="color-b5 font26">还信用卡</text>
							<text class="color-b9 font26">{{getScale("third_party_services_credit_card")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_pay_phone_bill')" @click="toNav('three/phoneBill')">
							<view class="iconfont icon" style="color: #d75a1b;">&#xe664;</view>
							<text class="color-b5 font26">充话费</text>
							<text class="color-b9 font26">{{getScale("third_party_services_pay_phone_bill")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_recharge_oil_card')" @click="toNav('three/oilCard')">
							<view class="iconfont icon" style="color: #00b173;">&#xe684;</view>
							<text class="color-b5 font26">油卡充值</text>
							<text class="color-b9 font26">{{getScale("third_party_services_recharge_oil_card")}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
				
		<!-- 弹框 -->
		<modal v-if="showModal">
			<image :src="advertData.ossUrl" mode="widthFix" @click="imgJump"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="showModal = false">&#xe64a;</text>
		</modal>
		
		<!-- 福利红包 -->
		<red-envelopes v-for="(item, i) in redList" :key="i" :data="item" :type="3" :bottom="i === 0 ? 100 : i*80+100"></red-envelopes>
	</view>
</template>

<script>
	import { mapMutations } from "vuex"
	import modal from "@/components/modal.vue"
	import redEnvelopes from "@/components/red-envelopes.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		components:{ modal, redEnvelopes, uniPopup },
		data(){
			return {
				userDetailInfo: {},
				staticUrl: this.$staticUrl,
				avatar: this.$staticUrl + "user/avatar.png",
				cuList:[
					{name: "待付款", tip: 0, icon: "user/payment.png", status: 2},
					{name: "待收货", tip: 0, icon: "user/harvest.png", status: 3},
					{name: "评价", tip: 0, icon: "user/evaluate.png", status: 4},
					{name: "已完成", tip: 0, icon: "user/harvest.png", status: 5},
					{name: "退款/售后", tip: 0, icon: "user/refund.png", status: 6}
				],
				servicePhone: "",
				statusBarHeight: getApp().statusBarHeight,
				cbfcAcountData: {},
				teamTotal: 0,
				balance: 0,
				cardsTotal: 0,
				showModal: false,
				advertData: false,
				redList: [],
				mobileList: [],
				threeData: [],
			}
		},
		onPullDownRefresh() {
			this.init()
		},
		onLoad() {
			// 广告弹框
			this.$http("GET", url.cms.advertisingMap, {position: 8}).then(res =>{
				if (res.data && res.data.length > 0) {
					this.advertData = res.data[0]
					if (this.advertData.popupMode === 2) {
						if (!publics.advertShowToStorage(this.advertData.id)) {
							this.showModal = true
						}
					} else {
						this.showModal = true
					}
				}
			})
		},
		onShow() {
			this.init()
			this.getRedBagList()
		},
		onBackPress(){
			//隐藏到后台，不退出app
			let main = plus.android.runtimeMainActivity();
			main.moveTaskToBack(false);
			return true;
		},
		methods:{
			...mapMutations(["setUserInfo"]),
			// 红包福利
			getRedBagList(){
				this.$http("GET", url.cms.redEnvelopesList).then(res =>{
					this.redList = res.data
					if (res.data.length > 0) {
						this.redList.map(v =>{
							v.show = true
						})
					}
				})
			},
			init(){
				// 获取收藏、足迹、关注、优惠券数量
				this.$http("GET", url.user.cbfcAcount).then(res =>{
					this.cbfcAcountData = res.data
				})
				// 获取订单状态数量
				this.$http("GET", url.order.getOrderAmount).then(res =>{
					this.cuList[0].tip = res.data.unpaid
					this.cuList[1].tip = res.data.ongoing
					this.cuList[2].tip = res.data.evaluated
					this.cuList[3].tip = res.data.completed
					this.cuList[4].tip = res.data.refund
				})
				// 获取团队总数
				this.$http("GET", url.user.getTeamList, {pageSize: 1}).then(res =>{
					this.teamTotal = res.data.total
				})
				// 获取卡包总数
				this.$http("GET", url.user.getUserCards, {pageSize: 1}).then(res =>{
					this.cardsTotal = res.data.total
				})
				// 获取用户信息
				this.getUserInfo()
				// 获取钱包余额
				this.$http('GET', url.user.getWalletInfo).then(res =>{
					this.balance = res.data.balance
				})
				// 获取客服信息
				this.$http("GET", url.common.customerService).then(res =>{
					let mobileList = res.data.mobile
					mobileList.map(v => { v.type = "电话"})
					let qqList = res.data.qq
					qqList.map(v => { v.type = "QQ"})
					let wechatList = res.data.wechat
					wechatList.map(v => { v.type = "微信"})
					this.mobileList = wechatList.concat(qqList).concat(mobileList)
				})
				// 获取第三方服务比例
				this.$http("GET", url.common.threeProportion).then(res => {
					this.threeData = res.data
				})
			},
			getUserInfo(){
				this.$http("GET", url.user.getUserInfoBasic).then(res =>{
					this.setUserInfo(res.data)
					this.userDetailInfo = res.data
					this.avatar = res.data.headPortrait
					if (!this.avatar && res.data.userResources) {
						let userResources = res.data.userResources
						userResources.forEach(v =>{
							if (v.type === 0){
								this.avatar = v.ossUrl
								return
							}
						})
					}
					uni.stopPullDownRefresh()
				})
			},
			getScale(code){
				if (!code || this.threeData.length === 0) return 
				let scale = null
				this.threeData.forEach(v => {
					if (v.keyCode === code) {
						scale = v.remarks
						return
					}
				})
				return scale
			},
			showThreeItem(code){
				if (!code || this.threeData.length === 0) return
				let show = false
				this.threeData.forEach(v => {
					if (v.keyCode === code) {
						show = v.keyValue === "1" ? true : false
						return
					}
				})
				return show
			},
			filterImg(img){
				return publics.filterImgUrl(img, 1)
			},
			callPhoto(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			goUser(imAccount){
				this.$navigateTo("/pages/interaction/user?userId="+imAccount)
				this.closePopup()
			},
			toAgent(){
				if (this.userDetailInfo.distributorIsOpen === 1) {
					this.toNav("/pages/agent/index")
				} else {
					this.$http("GET", url.distributor.getApplyInfo).then(res =>{
						// status: 1=审核中，2=审核通过，3=审核失败
						if (!res.data) {
							this.toNav("/pages/agent/apply")
						} else if (res.data.status === 2) {
							this.toNav("/pages/agent/index")
						} else {
							uni.setStorageSync("examineData", res.data)
							this.toNav("/pages/merchants/settleIn/result")
						}
					})
				}
			},
			toMerchants(){
				if (this.userDetailInfo.storeIsOpen) {
					this.toNav("/pages/merchants/home")
				} else {
					this.$http("GET", url.store.getApplyInfo).then(res =>{
						// status: 1=审核中，2=审核通过，3=审核失败
						if (!res.data) {
							this.toNav("/pages/merchants/settleIn/step")
						} else if (res.data.status === 2) { // 审核通过
							this.toNav("/pages/merchants/home")
						} else if (res.data.status === 1){ // 审核中
							uni.setStorageSync("examineData", res.data)
							this.toNav("/pages/merchants/settleIn/result")
						} else { //审核失败
							uni.setStorageSync("examineData", res.data)
							this.toNav("/pages/merchants/settleIn/result")
						}
					})
				}
			},
			// 客服电话
			onContact(){
				if (this.mobileList.length === 0) return
				let _this = this
				let itemList = []
				let phoneList = []
				this.mobileList.map(v => {
					itemList.push(`[${v.type}]${v.name}(${v.keyValue})`)
					phoneList.push(v.keyValue)
				})
				uni.showActionSheet({
					itemList: itemList,
					success(res) {
						if (itemList[res.tapIndex].indexOf("QQ") > -1) {
							_this.$onCopy(phoneList[res.tapIndex])
							_this.$msg("QQ号已复制, 请打开QQ添加客服联系", 2000)
						} else if (itemList[res.tapIndex].indexOf("微信") > -1){
							_this.$onCopy(phoneList[res.tapIndex])
							_this.$msg("微信号已复制, 请打开微信添加客服联系", 2000)
						} else {
							uni.makePhoneCall({
							    phoneNumber: phoneList[res.tapIndex]
							});
						}
					}
				})
			},
			// 扫一扫
			scanCode(){
				let _this = this
				uni.scanCode({
					scanType: ["qrCode"],
				    success: function (res) {
				        console.log('条码内容：' + res.result);
						let result = res.result
						// 判断内容是url,并且存在data
						if ((result.indexOf("https") > -1 || result.indexOf("http") > -1) && result.indexOf("data") > -1){
							let reg = new RegExp("(^|&)data=([^&]*)(&|$)");
							let json = result.substr(1).match(reg)
							try{
								let r = JSON.parse(json[2])
								if (r && r.type && r.data) {
									if (r.type === 99) {
										_this.$navigateTo("/pages/interaction/user?userId="+r.data)
									} else {
										uni.setStorageSync("codeResultData", r)
										_this.$navigateTo("scan/index")
									}
								} else {
									_this.$msg("暂不支持扫码该类型二维码，目前只支持扫商户收款码付款", 5000)
								}
							}catch(err){
								_this.$msg("暂不支持扫码该类型二维码，目前只支持扫商户收款码付款", 5000)
							}
						} else {
							_this.$msg("暂不支持扫码该类型二维码，目前只支持扫商户收款码付款", 5000)
						}
				    }
				});
			},
			goOrder(status){
				let url = "/pages/order/index"
				if (status){
					url = url + "?status="+status
				}
				this.toNav(url)
			},
			toNav(path){
				this.$navigateTo(path)
			},
			imgJump(){
				this.showModal = false
				this.$http("POST", url.cms.clickAdvertisingMap, {id: this.advertData.id})
				publics.advertOption(this.advertData.operationCode, this.advertData.operationValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		min-height: 100vh;
		background-color: #f8f8f8;
		padding-bottom: 50rpx;
	}
	.header{
		height: 300rpx;
		padding: 0 50rpx 150rpx;
		background: url(https://hejiume-public.oss-cn-chengdu.aliyuncs.com/app/user/header.png) center center no-repeat;
		background-size: cover;
		.avatar{
			width: 150rpx;
			height: 150rpx;
			background-color: white;
			border-radius: 50%;
			margin-right: 30rpx;
		}
		.six{
			margin-top: 10rpx;
			margin-right: 10rpx;
			border-radius: 10rpx;
			padding: 0 10rpx 10rpx;
			line-height: 28rpx;
			// background: linear-gradient(to bottom, #a60ab8 0%, #5c04c3 100%);
			border: 2rpx solid white;
		}
		.yellow{
			background: linear-gradient(to bottom, #b69700 0%, #c66d00 100%);
		}
		.green{
			background: linear-gradient(to bottom, #38b948 0%, #238300 100%);
		}
		.orange{
			background: linear-gradient(to bottom, #be5b00 0%, #ff9400 100%);
		}
		.redd{
			background: linear-gradient(to bottom, #dc4839 0%, #e20b3b 100%);
		}
	}
	.con{
		padding: 0 30rpx;
		margin-top: -240rpx;
		.culist{
			background-color: white;
			border-radius: 16rpx;
			padding-top: 20rpx;
			margin-bottom: 20rpx;
			.title{
				padding: 0 30rpx;
				border-bottom: 2rpx solid #eee;
				padding-bottom: 20rpx;
			}
			.pad{
				padding: 30rpx 0;
			}
			.grod{
				border-radius: 14rpx;
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 30rpx;
				&-item{
					width: 20%;
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					position: relative;
					.img{
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 10rpx;
					}
					.icon{
						font-size: 50rpx;
						margin-bottom: 10rpx;
					}
					.tips{
						position: absolute;
						left: 80rpx;
						top: -20rpx;
						color: white;
						font-size: 24rpx;
						padding: 0 14rpx;
						border-radius: 50rpx;
						z-index: 9;
						background-color: #CA0400;
					}
				}
			}
			.flex-start{
				padding: 30rpx 0 0;
				.grod-item{
					justify-content: flex-start !important;
					margin-bottom: 30rpx;
				}
			}
		}
		.history{
			padding-top: 0;
			background-color: rgba($color: #fff, $alpha: 0) !important;
			color: white;
			margin: 0;
			// margin-bottom: 50rpx;
		}
		.list{
			margin-bottom: 20rpx;
			&-item{
				height: 110rpx;
				padding: 0 30rpx;
				border-radius: 14rpx;
				margin-bottom: 10rpx;
				.icon{
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
			}
			
		}
		.carousel-section {
			margin-bottom: 20rpx;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.carousel {
				width: 48%;
				height: 220upx;
				.img{
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
		
			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
		.third {
			padding-bottom: 100rpx;
			.title{
				margin-bottom: 20rpx;
				.xian{
					margin: 0 40rpx;
					color: #C0C0C0;
					font-size: 30rpx;
				}
			}
			.grid{
				flex-flow: wrap;
				display: flex;
				background-color: white;
				border-radius: 14rpx;
				&-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 226rpx;
					padding: 30rpx 0;
					border-right: 2rpx solid #f5f5f5;
					border-bottom: 2rpx solid #f5f5f5;
					.icon{
						font-size: 50rpx;
					}
					.name{
						margin-top: 10rpx;
						font-size: 28rpx;
						color: #666666;
					}
				}
			}
		}
	}
	.popup{
		width: 600rpx;
		background-color: white;
		padding: 30rpx;
		border-radius: 16rpx;
		.img{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		.btn{
			font-size: 24rpx;
			color: #381895;
			border: 2rpx solid #381895;
			border-radius: 6rpx;
			padding: 4rpx 20rpx;
		}
	}
</style>
