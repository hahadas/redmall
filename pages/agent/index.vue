<template>
	<view>
		<view class="header">
			<!-- #ifdef MP-WEIXIN -->
			<view :style="{height: wxBtnHeight + 'px'}"></view>
			<!-- #endif -->
			<view class="header-item flex flex-between">
				<text class="iconfont icon" @click="$navigateBack()">&#xe771;</text>
				<view class="tabs">
					<view class="tab" :class="{'active': current === i}" v-for="(item, i) in tabs" :key="i" @click="tabsChange(i)">
						<text class="name">{{item.name}}<text v-if="item.total">({{item.total}})</text></text>
						<text class="xian"></text>
					</view>
				</view>
				<text class="iconfont icon" @click="showDrawer">&#xe61a;</text>
			</view>
		</view>
		<swiper :current="current" @change="swiperChange" :style="{height: (scrollHeight-45-statusBarHeight)+'px'}">
			<swiper-item style="height: 100%;" v-for="(tab, index) in tabs" :key="index">
				<you-scroll @onPullDown="onPullDown" @onLoadMore="loadMore">
					<view class="scroll">
						<view class="flex flex-center flex-column work" v-if="!checked">
							<image src="https://hejiume-public.oss-cn-chengdu.aliyuncs.com/app/work.png" mode="" class="img"></image>
							<text class="color-b9 font28">休息中，开启工作后可接单</text>
							<button type="primary" class="btn" @click="switchChange(null)">开始工作</button>
						</view>
						<view class="grid" v-else>
							<view class="grid-item" v-for="(item, i) in tab.list" :key="i" @click="goDetail(item)">
								<view class="title">
									<text class="color-b6 font32">{{item.createTime}}</text>
									<text class="color-purple font34">¥{{item.deliveryPlatformMoney}}</text>
								</view>
								<text class="line">{{item.goodsName}}</text>
								<view class="cell">
									<text class="font30 line">
										<text class="color-purple iconfont font24 icon">&#xe630;</text>
										<text class="color-purple" v-if="item.orderType === 2">精品商品请自身供货</text>
										<text class="color-b9" v-else>{{item.storeAddressDetails}}{{item.storeAddressSupplement}}</text>
									</text>
								</view>
								<view class="cell">
									<text class="font30 blod line">
										<text class="color-yellow iconfont font24 icon">&#xe630;</text>
										<text>{{item.userFullName}}</text>
									</text>
									<text class="line font30 blod">{{item.userAddressDetails}}{{item.userAddressSupplement}}</text>
								</view>
								<view class="flex flex-center" style="margin-top: 20rpx;">
									<button type="primary" size="mini" class="bg-base" v-if="item.deliveryPlatformStatus === 1 || item.deliveryPlatformStatus === 2" 
										@tap.stop="confirmOrder(item)">确认接单</button>
									<button type="primary" size="mini" class="bg-base" v-if="item.deliveryPlatformStatus === 3"
										@tap.stop="confirmPickup(item.id)">确认取货</button>
									<button type="primary" size="mini" class="bg-base" v-if="item.deliveryPlatformStatus === 4"
										@tap.stop="showPopup(item.id)">确认送达</button>
									<!-- <button type="primary" size="mini" class="bg-base" v-if="item.deliveryPlatformStatus !== 5 && item.deliveryPlatformStatus !== 1" 
										@tap.stop="openModal(item)">取消配送</button> -->
								</view>
							</view>
							<uni-load-more :status="tab.loading"></uni-load-more>
						</view>
					</view>
				</you-scroll>
			</swiper-item>
		</swiper>
		<!-- 左侧菜单 -->
		<uni-drawer ref="drawer" mode="left">
		    <scroll-view scroll-y class="drawer" :style="{height: scrollHeight+'px'}">
		        <view class="top">
					<view class="flex flex-between" @tap="jumpTo('/pages/setting/personal')">
						<view><image :src="userData.headPortrait" mode="" class="avatar"></image></view>
						<view class="flex flex-column flex-grow">
							<text class="font30 line">{{userData.nickname}}</text>
						</view>
						<text class="iconfont">&#xe770;</text>
					</view>
					<view class="flex flex-between today font28">
						<text>配送员钱包</text>
						<text>¥{{balance||0}}</text>
					</view>
				</view>
				<view class="flex flex-between status">
					<text class="color-b3 font28">{{checked?'工作中':'休息中'}}</text>
					<switch :checked="checked" @change="switchChange" style="transform: scale(0.8);"/>
				</view>
				<view class="addr" v-if="userData.showAddress">
					<image src="/static/user/addr.png" mode="" class="icon"></image>
					<text class="color-b6 font28">{{userData.showAddress}}</text>
				</view>
				<view class="list">
					<view class="list-item" @tap="jumpTo('/pages/user/wallet/index?type=2')">
						<text class="iconfont icon">&#xe61c;</text>
						<text class="name">我的钱包</text>
					</view>
					<view class="list-item" @tap="jumpTo('deposit?title='+depositTitle)">
						<text class="iconfont icon">&#xe719;</text>
						<text class="name">{{depositTitle}}</text>
					</view>
					<view class="list-item" @tap="jumpTo('orderHistory')">
						<text class="iconfont icon">&#xe75f;</text>
						<text class="name">历史订单</text>
					</view>
					<view class="list-item" @tap="jumpTo('stock')">
						<text class="iconfont icon">&#xe603;</text>
						<text class="name">库存管理</text>
					</view>
					<view class="list-item" @tap="jumpTo('/pages/setting/personal')">
						<text class="iconfont icon">&#xe60e;</text>
						<text class="name">个人信息</text>
					</view>
					<view class="list-item" @tap="jumpTo('/pages/notice/index')">
						<text class="iconfont icon">&#xe68a;</text>
						<text class="name">系统通知</text>
					</view>
				</view>
		    </scroll-view>
		</uni-drawer>
		
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
		
		<!-- 弹框 -->
		<modal v-if="showModal">
			<image :src="advertData.ossUrl" mode="widthFix" @click="imgJump"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="showModal = false">&#xe64a;</text>
		</modal>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import imMix from "../order/imMix.js"
	import modal from "@/components/modal.vue"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue"
	import youScroll from '@/components/you-scroll'
	export default{
		components: { vTabs, uniDrawer, uniLoadMore, uniPopup, uniPopupDialog, youScroll, modal },
		mixins: [imMix],
		data(){
			return {
				// tabs: ["待接单", "已接单", "普通订单大厅"],
				tabs: [
					{ name: "待接单", status: 1, total: 0, loading: "loading", list: [], pageSize: 1 },
					{ name: "接单中", status: 2, total: 0, loading: "loading", list: [], pageSize: 1 },
					{ name: "普通订单大厅", loading: "loading", list: []}
				],
				current: 0,
				statusBarHeight: getApp().statusBarHeight,
				scrollHeight: 0,
				checked: false,
				userData: {},
				pageSize: 1,
				list: [],
				loading: "loading",
				generalList: [],
				advertData: {},
				showModal: false,
				balance: 0,
				orderInfo: {},
				depositTitle: "配送定金",
				orderId: null,
				deliveryPlatformServiceCode: "",
				// #ifdef MP-WEIXIN
				wxBtnHeight: 0,
				// #endif
			}
		},
		onShow() {
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.wxBtnHeight = wx.getMenuButtonBoundingClientRect().height
			// #endif
			this.getUserInfo()
			this.getWalletInfo()
			this.getDepositTitle()
			// 广告弹框
			this.$http("GET", url.cms.advertisingMap, {position: 9}).then(res =>{
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
		methods:{
			// 获取配送押金标题
			getDepositTitle(){
				this.$http("GET", url.common.distributorDepositConfig).then(res => {
					this.depositTitle = res.data.keyValue
				})
			},
			getWalletInfo(){
				this.$http('GET', url.user.getWalletInfo).then(res =>{
					this.balance = res.data.distributorBalance
				})
			},
			getUserInfo(type){
				this.$http("GET", url.user.getUserInfoBasic).then(res =>{
					this.userData = res.data
					if (res.data.distributorWorkStatus !== 1) {
						this.checked = true
					}
					this.getList('add', 1)
					this.getList('add', 2)
				})
			},
			getList(type, status, done){
				if (!this.checked) return
				let obj = status ? this.tabs[status - 1] : this.tabs[this.current]
				if (type === 'add') {
					if (obj.loading === 'nomore') {
						return;
					}
					obj.loading = 'loading';
				} else {
					obj.pageSize = 1
					obj.list = []
					obj.loading = 'more';
				}
				let params = {
					orderStatus: status || obj.status,
					pageSize: obj.pageSize
				}
				this.$http("GET", url.distributor.distributorWorkOrder, params).then(res =>{
					obj.list = obj.list.concat(res.data.records)
					obj.total = res.data.total
					if (obj.list.length < res.data.total) {
						obj.loading = "more"
						obj.pageSize++
					} else {
						obj.loading = "nomore"
					}
					this.$nextTick(function(){
						this.tabs[params.orderStatus - 1] = obj
					})
					uni.stopPullDownRefresh()
					if (typeof done === "function") done()
				})
			},
			getGeneralList(done){
				this.tabs[this.current].loading = "loading"
				this.$http("GET", url.distributor.generalOrderList, {pageNum: this.tabs[this.current].list.length}).then(res =>{
					this.tabs[this.current].list = this.tabs[this.current].list.concat(res.data)
					if (this.tabs[this.current].list.length < 12) {
						this.tabs[this.current].loading = "nomore"
					} else {
						this.tabs[this.current].loading = "more"
					}
					uni.stopPullDownRefresh()
					if (typeof done === "function") done()
				})
			},
			onPullDown(done){
				if (this.current === 2) {
					this.tabs[this.current].list = []
					this.getGeneralList(done)
				} else {
					this.getList('refresh', null, done)
				}
			},
			loadMore(){
				if (this.current === 2) {
					this.getGeneralList()
				} else {
					this.getList('add', null)
				}
			},
			//获取订单中的用户会话信息
			getOrderUserConversationInfo(orderInfo, callBack){
				let params = {
					orderId: orderInfo.id, 
					orderUserId: orderInfo.userId
				}
				this.$http("GET", url.distributor.getOrderDetailsById, params).then(res =>{
					if (res.data.toUserConversation) {
						callBack(res.data.toUserConversation)
					}else{
						callBack(null)
					}
				}).catch(()=>{
					callBack(null)
				})
			},
			// 确认接单, 普通订单接单时暂不发送消息给对方
			confirmOrder(row){
				//获取订单中的用户会话信息
				this.getOrderUserConversationInfo(row,(userConversation)=>{
					//设置会话,加判断是防止自己给自己发信息，是不允许的
					if(userConversation){
						this.setSessionOperation(userConversation)
					}
					
					this.$http("POST", url.distributor.confirmReceiptOrder, {orderId: row.id}).then((res)=>{
						this.$msg(res.data)
						// #ifdef APP-PLUS
						if (userConversation){//(this.current !== 2)，加判断是防止自己给自己发信息，是不允许的
							// 发送一条消息，判断对方是否在线
							this.isOtherOnline(row.userOrderImAccount, "agentConfirm")
							
							// 发送消息给对方，邀请对方接单
							let goodsInfo = {
								orderId: row.id,
								goodsId: row.goodsId,
								goodsImage: row.skuImage || row.goodsImage,
								goodsName: row.goodsName,
								skuName: row.skuName,
								price: row.totalPrice,
								number: row.number,
								status: 4 ,// 1-邀请对方接单，用户和配送员都可操作取消 2-用户取消配送 3-配送员取消接单 4-配送员接单
								identity: this.userData.imAccount, // 配送配送员的imAccount
							}
							this.sendMsgToOther(row.userOrderImAccount, goodsInfo, 6, 2, ()=>{
								this.editDBData(goodsInfo.orderId, goodsInfo.status)
							})
						}
						// #endif
						this.onPullDown(false)
					})
				})
			},
			// 显示取消配送弹框
			openModal(row){
				this.orderInfo = row
				this.$refs.canCelPopup.open()
			},
			// 取消配送
			cancelOrder(done, value){
				if (!value) return this.$msg("请输入取消配送理由")
				let row = this.orderInfo
				let toImAccount = row.userOrderImAccount
				
				//获取订单中的用户会话信息
				this.getOrderUserConversationInfo(row,(userConversation)=>{
					//设置会话,加判断是防止自己给自己发信息，是不允许的
					if(userConversation){
						this.setSessionOperation(userConversation)
					}
					
					this.$http("POST", url.distributor.cancelReceiptOrder, {orderId: row.id}).then((res)=>{
						done()
						this.$msg(res.data)
						// #ifdef APP-PLUS
						//加判断是防止自己给自己发信息，是不允许的
						if(userConversation){
							// 发送一条消息，判断对方是否在线
							this.isOtherOnline(toImAccount, "agentCancel")
							// 发送消息给对方
							let goodsInfo = {
								orderId: row.id,
								goodsId: row.goodsId,
								goodsImage: row.skuImage || row.goodsImage,
								goodsName: row.goodsName,
								skuName: row.skuName,
								price: row.totalPrice,
								number: row.number,
								status: 3, // 1-邀请对方接单，用户和配送员都可操作取消 2-用户取消配送 3-配送员取消接单 4-配送员接单
								identity: this.userData.imAccount, // 配送配送员的imAccount
								reason: value
							}
							this.sendMsgToOther(toImAccount, goodsInfo, 6, 2, ()=>{
								this.editDBData(goodsInfo.orderId, goodsInfo.status)
							})
						}
						// #endif
						this.getList('refresh', null)
					})
				})
			},
			// 确认取货
			confirmPickup(id){
				let _this = this
				this.$showModal("是否确认当前商品已取得", "提示", res=>{
					if (res.confirm) {
						_this.$http("POST", url.distributor.confirmPickUp, {orderId: id}).then(()=>{
							_this.onPullDown(false)
						})
					}
				})
			},
			// 确认送达
			onConfirm(){
				let _this = this
				
				this.closePopup()
				uni.showLoading({
					mask:true
				})
				let params = {
					orderId: this.orderId,
					deliveryPlatformServiceCode: this.deliveryPlatformServiceCode
				}
				this.$http("POST", url.distributor.confirmService, params).then(res =>{
					uni.hideLoading()
					_this.deliveryPlatformServiceCode = ''
					_this.getList('refresh', null)
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			showPopup(orderId){
				this.orderId = orderId
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			goDetail(row){
				this.$navigateTo('detail?id='+row.id+'&orderUserId='+row.userId)
			},
			jumpTo(path){
				this.$navigateTo(path)
			},
			showDrawer(){
				this.$refs.drawer.open()
				this.getWalletInfo()
			},
			switchChange(e){
				if (e) {
					this.checked = e.detail.value
				} else {
					this.checked = true
				}
				this.$http("POST", url.distributor.updateWorkStatus).then(res=>{
					this.onPullDown(false)
				}).catch(()=>{
					this.checked = !this.checked
				})
			},
			tabsChange(i){
				this.current = i
			},
			swiperChange(e){
				this.current = e.detail.current
				if (this.current === 2) {
					this.tabs[this.current].list = []
					this.getGeneralList(false)
				} else {
					this.getList('add', null, false)
				}
			},
			imgJump(){
				this.showModal = false
				this.$http("POST", url.cms.clickAdvertisingMap, {id: this.advertData.id})
				publics.advertOption(this.advertData.operationCode, this.advertData.operationValue)
			},
		}
	}
</script>

<style scoped lang="scss">
	.header{
		background-color: #FFFFFF;
		padding: 0 20rpx;
		padding-top: var(--status-bar-height);
		&-item{
			height: 90rpx;	
		}
		.icon{
			font-size: 56rpx;
		}
		.tabs{
			display: flex;
			align-items: center;
			.tab{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 0 20rpx;
				.name{
					font-size: 30rpx;
					color: #666666;
					margin-bottom: 10rpx;
				}
				.xian{
					height: 6rpx;
					width: 40rpx;
				}
			}
			.active .name{
				font-size: 36rpx;
				color: #000000;
			}
			.active .xian{
				background-color: #381895;
			}
		}
	}
	.scroll{
		height: 100%;
		.work{
			margin-top: 50rpx;
			.img{
				width: 500rpx;
				height: 300rpx;
				margin-bottom: 10rpx;
			}
			.btn{
				border-radius: 50rpx;
				width: 300rpx;
				margin-top: 20rpx;
			}
		}
		.grid{
			margin: 20rpx;
			&-item{
				background-color: white;
				padding: 20rpx;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				.title{
					border-bottom: 2rpx solid #EEEEEE;
					padding-bottom: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;
				}
				.cell{
					display: flex;
					flex-direction: column;
					margin-top: 16rpx;
					.icon{
						margin-right: 10rpx;
						transform: scale(0.6);
					}
				}
			}
		}
	}
	.drawer{
		.top{
			color: #FFFFFF;
			background-color: #41414F;
			padding: 20rpx;
			padding-top: var(--status-bar-height);
			.avatar{
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}
			.today{
				padding: 20rpx 0;
				margin-top: 20rpx;
				border-top: 2rpx solid #4e4d4e;
			}
		}
		.status{
			padding: 20rpx;
		}
		.addr{
			margin: 0 20rpx;
			.icon{
				width: 40rpx;
				height: 40rpx;
				margin-bottom: -8rpx;
			}
		}
		.list{
			&-item{
				display: flex;
				align-items: center;
				padding: 30rpx;
				border-bottom: 2rpx solid #EEEEEE;
				.icon{
					margin-right: 20rpx;
					font-size: 44rpx;
					color: #222;
				}
				.name{
					font-size: 28rpx;
					color: #333333;
				}
			}
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
