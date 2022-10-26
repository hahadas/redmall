<template>
	<view class="main">
		<view class="header flex flex-align-center color-w" :style="{'padding-top': statusBarHeight+'px'}">
			<view class="flex flex-grow" style="justify-content: space-between;">
				<view class="flex flex-align-center" @click="toNav('/pages/user/setting/personal')">
					<view>
						<image :src="filterImg(avatar)" mode="aspectFill" class="avatar"></image>
					</view>
					<view>
						<view class="flex flex-align-center">
							<text class="font38 line">{{userDetailInfo.nickname}}</text>
							<!-- <text class="iconfont" v-if="userDetailInfo.gender === 1">&#xe621;</text>
							<text class="iconfont" v-if="userDetailInfo.gender === 2">&#xe622;</text>
							<text class="font32">{{userDetailInfo.age}}</text> -->
						</view>
						<view class="flex flex-align-center">
							<view class="six" v-if="userDetailInfo.distributorIsOpen === 1">
								<text class="font24">慈善天使</text>
							</view>
							<view class="redd six" v-if="userDetailInfo.storeIsOpen === 1">
								<text class="font24">商家</text>
							</view>
							<view class="yellow six" v-if="userDetailInfo.roleManagerLevel !== 0">
								<text class="font24">{{userDetailInfo.roleManagerLevel | filterRoleManager}}</text>
							</view>
							<view class="green six" v-if="userDetailInfo.roleTalentLevel !== 0">
								<text class="font24">{{userDetailInfo.roleTalentLevel | filterRoleTalent}}</text>
							</view>
							<view class="orange six" v-if="userDetailInfo.roleAgentLevel !== 0">
								<text class="font24">{{userDetailInfo.roleAgentLevel | filterRoleAgent}}</text>
							</view>
						</view>
						<!-- <text class="font30">{{userDetailInfo.phone}}</text> -->
						<!-- <view class="flex flex-align-center">
							<text class="font34 line">{{userDetailInfo.personalizedSignature || "未设置个性签名"}}</text>
							<text class="iconfont font40" style="margin-left: 10rpx;">&#xe63c;</text>
						</view> -->
					</view>
				</view>
				<text class="iconfont blod font48" @click="toNav('/pages/user/setting/index')">&#xe62a;</text>
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
				<view class="grod pad">
					<view class="grod-item" style="width: 20%;" v-for="(item, i) in cuList" :key="i" @click="goOrder(item.status)">
						<image :src="item.icon" mode="" class="img"></image>
						<text class="color-b5 font26">{{item.name}}</text>
						<text class="tips" v-if="item.tip">{{item.tip>99?'99+':item.tip}}</text>
					</view>
				</view>
			</view>
			<!-- 关注 -->
			<!-- <view class="grod" style="flex-wrap: nowrap;">
				<view class="grod-item" @click="toNav('/pages/user/balance')">
					<text class="color-b6 font36">{{ userDetailInfo.blance || 0 }}</text>
					<text class="color-b5 font26">关注</text>
				</view>
				<view class="grod-item" @click="toNav('/pages/user/balance')">
					<text class="color-b6 font36">{{ userDetailInfo.banceJingPing || 0 }}</text>
					<text class="color-b5 font26">粉丝</text>
				</view>
				<view class="grod-item" @click="toNav('/pages/user/balance')">
					<text class="color-b6 font36">{{ userDetailInfo.blanceIntegration || 0 }}</text>
					<text class="color-b5 font26">发布</text>
				</view>
				<view class="grod-item bor-no" @click="toNav('/pages/user/balance')">
					<text class="color-b6 font36">{{userDetailInfo.blanceXiaoFei || 0}}</text>
					<text class="color-b5 font26">最近来访</text>
				</view>
			</view> -->
			<!-- 余额 -->
			<view class="list" @click="toNav('/pages/user/wallet/index')">
				<view class="list-item flex flex-between bg-w">
					<view class="flex flex-align-center">
						<image src="/static/user/balance.png" mode="" class="icon"></image>
						<text class="font30 blod">我的余额</text>
					</view>
					<view class="flex flex-align-center color-b6">
						<text class="font30">{{ balance }}元</text>
						<text class="iconfont font40">&#xe770;</text>
					</view>
				</view>
			</view>
			<!-- 图片 -->
			<view class="carousel-section" v-if="configData.agentAndStore">
				<view class="carousel" @click="toAgent">
					<image src="/static/user/agent_use2.png" v-if="userDetailInfo.distributorIsOpen === 1" mode="scaleToFill" class="img"/>
					<image src="/static/user/agent_2.png" v-else mode="scaleToFill" class="img"/>
				</view>
				<view class="carousel" @click="toMerchants">
					<image src="/static/user/merchants_use.png" v-if="userDetailInfo.storeIsOpen === 1" mode="scaleToFill" class="img"/>
					<image src="/static/user/merchants.png" v-else mode="scaleToFill" class="img"/>
					
				</view>
			</view>
			<!-- 我的服务 -->
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">我的服务</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod" style="margin-bottom: 40rpx;">
						<view class="grod-item" @click="scanCode">
							<text class="iconfont" style="font-size: 56rpx;margin-bottom: 10rpx; color: #cc920c;">&#xe647;</text>
							<text class="color-b5 font26">扫一扫</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/user/team')">
							<image src="/static/user/share.png" mode="" class="img"></image>
							<text class="color-b5 font26">我的分享</text>
							<text class="tips" v-if="teamTotal">{{teamTotal>99?'99+':teamTotal}}</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/user/invite')">
							<image src="/static/user/invite.png" mode="" class="img"></image>
							<text class="color-b5 font26">邀请好友</text>
						</view>
						<view class="grod-item" @click="toNav('/pages/user/address/index?type=1')">
							<image src="/static/user/address.png" mode="" class="img"></image>
							<text class="color-b5 font26">地址管理</text>
						</view>
						<!-- <view class="grod-item" @click="toNav('/pages/notice/index?keyType=all_public_notice')">
							<image src="/static/user/notice.png" mode="" class="img"></image>
							<text class="color-b5 font26">通知</text>
						</view> -->
						<view class="grod-item" @click="toNav('/pages/user/setting/personal')">
							<image src="/static/user/personal.png" mode="" class="img"></image>
							<text class="color-b5 font26">个人资料</text>
						</view>
						
					</view>
					<view class="grod">
						<view class="grod-item" @click="toNav('/pages/user/setting/index')">
							<image src="/static/user/set.png" mode="" class="img"></image>
							<text class="color-b5 font26">系统设置</text>
						</view>
						<view class="grod-item" v-if="userDetailInfo.roleAgentLevel" @click="toNav('/pages/user/region/index')">
							<image src="/static/user/agent.png" mode="" class="img"></image>
							<text class="color-b5 font26">区域代理</text>
						</view>
						<view class="grod-item" @click="onContact">
							<image src="/static/user/evaluate.png" mode="" class="img"></image>
							<text class="color-b5 font26">联系客服</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 第三方 -->
			<view class="culist" v-if="configData.three">
				<view class="title flex flex-between">
					<text class="blod font32">第三方服务</text>
				</view>
				<view class="flex flex-column">
					<view class="grod flex-start">
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
						<view class="grod-item" v-if="showThreeItem('third_party_services_calculus')" @click="contact()">
							<view class="iconfont icon" style="color: #DA6C3F;">&#xe7de;</view>
							<text class="color-b5 font26">微积分</text>
							<text class="color-b9 font26">{{getScale("third_party_services_calculus")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_depository_interest')" @click="toNav('/pages/user/deposit/index')">
							<view class="iconfont icon" style="color: #dbab00;">&#xe726;</view>
							<text class="color-b5 font26">存托权益</text>
							<text class="color-b9 font26">{{getScale("third_party_services_depository_interest")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_exchange_goods')" @click="showToast(true)">
							<view class="iconfont icon" style="color: #a2a4a4;">&#xe665;</view>
							<text class="color-b5 font26">兑换商品</text>
							<text class="color-b9 font26">{{getScale("third_party_services_exchange_goods")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_charge_for_water_and_electricity')" @click="showToast(true)">
							<view class="iconfont icon" style="color: #a2a4a4;">&#xe668;</view>
							<text class="color-b5 font26">缴水电费</text>
							<text class="color-b9 font26">{{getScale("third_party_services_charge_for_water_and_electricity")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_crowd_funding')" @click="showToast(true)">
							<view class="iconfont icon" style="color: #a2a4a4;">&#xe810;</view>
							<text class="color-b5 font26">众筹</text>
							<text class="color-b9 font26">{{getScale("third_party_services_crowd_funding")}}</text>
						</view>
						<view class="grod-item" v-if="showThreeItem('third_party_services_digital_capital_factory')" @click="showToast(true)">
							<view class="iconfont icon" style="color: #a2a4a4;">&#xe667;</view>
							<text class="color-b5 font26">数资工厂</text>
							<text class="color-b9 font26">{{getScale("third_party_services_digital_capital_factory")}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 推荐人信息 -->
		<uni-popup ref="popup" type="center">
			<view class="popup">
				<view class="flex flex-align-center">
					<view @click="goUser(recommendInfo.imAccount)">
						<image :src="recommendInfo.headPortrait" mode="" class="img"></image>
					</view>
					<view class="flex flex-column font28" style="width: 100%;">
						<!-- <text class="color-b3">{{recommendInfo.nickname}}</text> -->
						<view>
							<text class="color-b6">昵&ensp;&ensp;称：</text>
							<text>{{recommendInfo.nickname}}</text>
						</view>
						<view style="margin:6rpx 0">
							<text class="color-b6">性&ensp;&ensp;别：</text>
							<text>{{recommendInfo.gender | filterGender}}</text>
						</view>
						<view class="flex flex-between" style="margin-bottom: 6rpx;">
							<view>
								<text class="color-b6">手机号：</text>
								<text>{{recommendInfo.username}}</text>
							</view>
							<text class="btn" @click="callPhoto(recommendInfo.username)">拨打</text>
						</view>
						<view class="flex flex-between">
							<view>
								<text class="color-b6">推荐码：</text>
								<text>{{recommendInfo.recommendCode}}</text>
							</view>
							<text class="btn" @click="$onCopy(recommendInfo.recommendCode)">复制</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flex flex-center" style="margin-top: 30rpx;" @click="closePopup">
				<icon type="cancel" color="#fff" size="28" />
			</view>
		</uni-popup>
		
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
				avatar: "/static/user/avatar.png",
				cuList:[
					{name: "待付款", tip: 0, icon: "/static/user/payment.png", status: 2},
					{name: "待收货", tip: 0, icon: "/static/user/harvest.png", status: 3},
					{name: "评价", tip: 0, icon: "/static/user/evaluate.png", status: 4},
					{name: "已完成", tip: 0, icon: "/static/user/harvest.png", status: 5},
					{name: "退款/售后", tip: 0, icon: "/static/user/refund.png", status: 6}
				],
				servicePhone: "",
				statusBarHeight: getApp().statusBarHeight,
				platform: uni.getSystemInfoSync().platform,
				cbfcAcountData: {},
				teamTotal: 0,
				balance: 0,
				cardsTotal: 0,
				showModal: false,
				advertData: false,
				redList: [],
				mobileList: [],
				threeData: [],
				configData: {
					agentAndStore: false,
					three: false
				},
				recommendInfo: {}
			}
		},
		filters:{
			filterRoleManager(val){
				switch(val){
					case 1:
						return "普通掌柜";
					case 2:
						return "中级掌柜";
					case 3:
						return "高级掌柜";
					default:
						return
				}
			},
			filterRoleTalent(val){
				switch(val){
					case 1:
						return "初级达人";
					case 2:
						return "中级达人";
					case 3:
						return "高级达人";
					case 4:
						return "至尊达人";
					default:
						return
				}
			},
			filterRoleAgent(val){
				switch(val){
					case 1:
						return "省代理";
					case 2:
						return "市代理";
					case 3:
						return "区代理";
					default:
						return
				}
			},
			filterGender(val){
				switch(val){
					case 2:
						return "男";
					case 3:
						return "女";
					default:
						return "未设置"
				}
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
				// 获取模块配置
				this.$http("GET", url.common.personalCenterModule).then(res => {
					// one-配送员和商家入口 two-第三方服务
					if (this.platform !== "ios" && this.platform !== "android") {
						this.configData.three = true
						this.configData.agentAndStore = true
					} else {
						console.log(this.platform)
						res.data.map(v => {
							if (v.keyCode === ("personal_center_module_two_"+this.platform)) {
								if (v.keyValue === "1") {
									this.configData.three = false
								} else if (v.keyValue && v.keyValue !== "1") {
									let list = v.keyValue.split(",")
									let version = plus.runtime.version
									if (list.includes(version)){
										this.configData.three = false
									} else {
										this.configData.three = true
									}
								} else {
									this.configData.three = true
								}
							}
							if (v.keyCode === ("personal_center_module_one_"+this.platform) && v.keyValue) {
								if (v.keyValue === "1") {
									this.configData.agentAndStore = false
								} else if (v.keyValue && v.keyValue !== "1") {
									let list = v.keyValue.split(",")
									let version = plus.runtime.version
									if (list.includes(version)){
										this.configData.agentAndStore = false
									} else {
										this.configData.agentAndStore = true
									}
								} else {
									this.configData.agentAndStore = true
								}
							}
						})
					}
					
				
					// if (this.platform === "ios") {
					// 	res.data.map(v => {
					// 		if (v.keyCode === "personal_center_module_two_ios") {
					// 			this.configData.three = v.keyValue === "1" ? true : false
					// 		}
					// 		if (v.keyCode === "personal_center_module_one_ios") {
					// 			this.configData.agentAndStore = v.keyValue === "1" ? true : false
					// 		}
					// 	})
					// } else if (this.platform === "android") {
					// 	res.data.map(v => {
					// 		if (v.keyCode === "personal_center_module_two_android") {
					// 			this.configData.three = v.keyValue === "1" ? true : false
					// 		}
					// 		if (v.keyCode === "personal_center_module_one_android") {
					// 			this.configData.agentAndStore = v.keyValue === "1" ? true : false
					// 		}
					// 	})
					// } else { // 网页版默认显示
					// 	this.configData.three = true
					// 	this.configData.agentAndStore = true
					// }
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
			showToast(status){
				this.$msg('本模块即将开通，敬请期待～')
			},
			contact(){
				let _this = this
				uni.showModal({
					title: "微积分",
					content: "请联系您的【喝酒么App】的上级推荐用户",
					confirmText: "查看联系方式",
					success(res) {
						if (res.confirm) {
							_this.$http("GET", url.user.getRecommendInfo).then(r => {
								if (r.data) {
									_this.recommendInfo = r.data
									_this.$refs.popup.open()
								} else {
									_this.$msg("您没有推荐人～")
								}
							})
						}
					}
				})
			},
			closePopup(){
				this.$refs.popup.close()
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
		background: url(../../static/user/header.png) center center no-repeat;
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
			background: linear-gradient(to bottom, #a60ab8 0%, #5c04c3 100%);
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
				&-item{
					width: 20%;
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
