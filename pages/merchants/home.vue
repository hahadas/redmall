<template>
	<view>
		<view :style="{paddingTop: statusBarHeight + 'px'}" class="top-bg">
			<image :src="storeInfo.backgroundImage" mode="aspectFill" class="bj"></image>
			<view class="mask bj"></view>
			<view
				class="header flex flex-between" 
				@click="toNav('view')">
				<view class="flex flex-grow" style="justify-content: space-between;">
					<view class="flex flex-align-center">
						<view>
							<image :src="storeInfo.logoImage" mode="" class="avatar"></image>
						</view>
						<view class="flex flex-column">
							<view class="flex flex-align-center">
								<text class="font38 line">{{storeInfo.name}}</text>
							</view>
							<text class="font26 line">{{storeInfo.introduce}}</text>
						</view>
					</view>
				</view>
				<text class="iconfont blod font48">&#xe770;</text>
			</view>
		</view>
		
		<view class="list">
			<view class="list-item flex flex-between bg-w" @click="toNav('/pages/user/wallet/index?type=3')">
				<view class="flex flex-align-center">
					<text class="font30 blod">商家钱包</text>
				</view>
				<view class="flex flex-align-center color-b6">
					<text class="font30">{{ walletData.balance || 0 }}</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view>
		</view>
		
		<view class="con">
			<view class="culist" @click="toNav('collection/index')">
				<view class="title flex flex-between">
					<text class="blod font32">收款</text>
					<text class="iconfont icon">&#xe770;</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item">
							<text class="font48" style="color: #f53b58;">{{collectionData.toDayAmount || 0}}</text>
							<text class="color-b5 font26">今日收款总额</text>
						</view>
						<view class="grod-item">
							<text class="font48" style="color: #f53b58;">{{collectionData.toDayBonusPoints || 0}}</text>
							<text class="color-b5 font26">今日赠送积分</text>
						</view>
						<view class="grod-item">
							<text class="font48" style="color: #f53b58;">{{collectionData.toDayActualArrivalAmount || 0}}</text>
							<text class="color-b5 font26">今日实际收款</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="con">
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">商品订单</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in orderList" :key="i" style="width: 20%;" @click="jumpToOrder(item, null)">
							<!-- <image src="/static/user/payment.png" mode="" class="img"></image> -->
							<text class="iconfont icon" v-if="i === 0">&#xe68f;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe62e;</text>
							<text class="iconfont icon" v-if="i === 2">&#xe651;</text>
							<text class="iconfont icon" v-if="i === 3">&#xe631;</text>
							<text class="iconfont icon" v-if="i === 4">&#xe60a;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total" style="left: 80rpx;">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">物流配送订单</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in logisticsList" :key="i" @click="jumpToOrder(item, 1)">
							<!-- <image src="/static/user/payment.png" mode="" class="img"></image> -->
							<text class="iconfont icon" v-if="i === 0">&#xe63a;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe636;</text>
							<text class="iconfont icon" v-if="i === 2">&#xe71a;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">商家配送订单</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in businessList" :key="i" @click="jumpToOrder(item, 2)">
							<!-- <image src="/static/user/payment.png" mode="" class="img"></image> -->
							<text class="iconfont icon" v-if="i === 0">&#xe633;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe632;</text>
							<text class="iconfont icon" v-if="i === 2">&#xe634;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">平台配送订单</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in platformList" :key="i" style="width: 25%;" @click="jumpToOrder(item, 4)">
							<!-- <image src="/static/user/payment.png" mode="" class="img"></image> -->
							<text class="iconfont icon" v-if="i === 0">&#xe629;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe610;</text>
							<text class="iconfont icon" v-if="i === 2">&#xe632;</text>
							<text class="iconfont icon" v-if="i === 3">&#xe634;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total" style="left: 100rpx;">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="culist">
				<view class="title flex flex-between">
					<text class="blod font32">用户自提订单</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in extractionList" :key="i" style="width: 50%;" @click="jumpToOrder(item, 3)">
							<!-- <image src="/static/user/payment.png" mode="" class="img"></image> -->
							<text class="iconfont icon" v-if="i === 0">&#xe612;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe6e8;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total" style="left: 190rpx;">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list" @click="jumpToOrder(null, 5)">
			<view class="list-item flex flex-between bg-w">
				<view class="flex flex-align-center">
					<text class="font30 blod">无需配送订单<text v-if="noDeliveryRequired">({{noDeliveryRequired}})</text></text>
				</view>
				<view class="flex flex-align-center color-b6">
					<!-- <text class="font30">{{ userDetailInfo.blance || 0 }}</text> -->
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view>
		</view>
		<view class="con">
			<view class="culist">
				<view class="title flex flex-between" @click="jumpToGoods(null)">
					<text class="blod font32">所有商品<text v-if="goodsTotalInfo.allProducts">({{goodsTotalInfo.allProducts}})</text></text>
					<text class="iconfont icon">&#xe770;</text>
				</view>
				<view class="flex flex-column pad">
					<view class="grod">
						<view class="grod-item" v-for="(item, i) in goodsList" :key="i" style="width: 20%;" @click="jumpToGoods(item)">
							<text class="iconfont icon" v-if="i === 0">&#xe63f;</text>
							<text class="iconfont icon" v-if="i === 1">&#xe641;</text>
							<text class="iconfont icon" v-if="i === 2">&#xe69a;</text>
							<text class="iconfont icon" v-if="i === 3">&#xe63e;</text>
							<text class="iconfont icon" v-if="i === 4">&#xe645;</text>
							<text class="color-b5 font26">{{item.name}}</text>
							<text class="tips" v-if="item.total" style="left: 80rpx;">{{item.total>99?'99+':item.total}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cell bg-w">
			<view class="flex flex-between item" @click="toNav('goods/add')">
				<text class="label">添加商品</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="flex flex-between item" @click="toNav('class/index')">
				<text class="label">商品分类<text v-if="goodsTotalInfo.classification">({{goodsTotalInfo.classification}})</text></text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="flex flex-between item" @click="toNav('coupon/index')">
				<text class="label">优惠券<text v-if="goodsTotalInfo.discount">({{goodsTotalInfo.discount}})</text></text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="flex flex-between item" @click="toNav('cupboard')">
				<text class="label">橱柜展示</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="flex flex-between item" @click="toNav('/pages/user/address/index?type=2')">
				<text class="label">发货地址</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="flex flex-between item" @click="toNav('attestation')">
				<text class="label">认证信息</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
		</view>
		<view style="height: 100rpx;"></view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	let options = JSON.parse(JSON.stringify(selectOptions))
	export default{
		data(){
			return {
				statusBarHeight: getApp().statusBarHeight,
				storeInfo: {},
				// 物流
				logisticsList: options.logisticsList,
				// 商家
				businessList: options.businessList,
				// 平台
				platformList: options.platformList,
				// 自提
				extractionList: options.extractionList,
				// 订单
				orderList: options.merchantsOrderList,
				// 无需配送订单总数
				noDeliveryRequired: 0,
				// 商品
				goodsList: options.goodsStatusList,
				walletData: {},
				goodsTotalInfo: {},
				collectionData: {}
			}
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods:{
			init(){
				this.getInfo()
				this.getCollectionToday()
				this.getWallet()
				this.getGoodsTotal()
			},
			getInfo(){
				this.$http("GET", url.store.getStoreInfo).then(res=>{
					this.storeInfo = res.data || {}
					this.getOrderTotal()
				})
			},
			getCollectionToday(){
				this.$http("GET", url.store.getTodayCollectionTotal).then(res=>{
					this.collectionData = res.data || {}
				})
			},
			getWallet(){
				this.$http("GET", url.store.getWalletInfo).then(res=>{
					this.walletData = res.data || {}
				})
			},
			getOrderTotal(){
				this.$http("GET", url.store.getOrderAmount).then(res =>{
					uni.stopPullDownRefresh()
					let data = res.data
					// 物流
					this.logisticsList[0].total = data.logisticsToBeDelivered
					this.logisticsList[1].total = data.logisticsDelivered
					this.logisticsList[2].total = data.logisticsConfirmed
					// 商家
					this.businessList[0].total = data.businessToBeDelivered
					this.businessList[1].total = data.businessDelivery
					this.businessList[2].total = data.businessDelivered
					// 平台
					this.platformList[0].total = data.platformWaitingForDelivery
					this.platformList[1].total = data.platformPickingUp
					this.platformList[2].total = data.platformPickedUp
					this.platformList[3].total = data.platformDelivered
					// 自提
					this.extractionList[0].total = data.raisingToBePickedUp
					this.extractionList[1].total = data.raisingPickedUp
					// 无需配送
					this.noDeliveryRequired = data.noDeliveryRequired
					// 订单
					this.orderList[0].total = data.waitingForPayment
					this.orderList[1].total = data.toBeEvaluated
					this.orderList[2].total = data.completed
					this.orderList[3].total = data.refunded
					this.orderList[4].total = data.overtimeClosing
					this.$forceUpdate()
				})
			},
			getGoodsTotal(){
				this.$http("GET", url.store.storeInitStatistics).then(res => {
					let data = res.data
					this.goodsTotalInfo = data
					this.goodsList[0].total = data.onTheShelves
					this.goodsList[1].total = data.onTheShelf
					this.goodsList[2].total = data.underReview
					this.goodsList[3].total = data.auditFailure
					this.goodsList[4].total = data.violation
					this.$forceUpdate()
				})
			},
			jumpToOrder(row, method){
				let path = ""
				if (!method){
					path = 'order/index?status='
				} else {
					if (method === 5) { // 无需配送
						path = 'order/index?deliveryMethod='+method
					} else {
						path = 'order/index?deliveryMethod='+method+"&&deliveryStatus="
					}
				}
				this.$navigateTo(path+(row ? row.value : ""))
			},
			jumpToGoods(row){
				let path = "goods/list"
				if (row) {
					path = path + "?status=" + row.value
				}
				this.toNav(path)
			},
			toNav(path){
				this.$navigateTo(path)
			}
		}
	}
</script>

<style scoped lang="scss">
	.top-bg{
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		// padding: 80rpx 50rpx 0;
		background-color: white;
		position: relative;
		width: 750rpx;
		height: 300rpx;
		.bj{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
		.mask{
			background: linear-gradient(to top, #ffffff 0%, rgba($color: #ffffff, $alpha: .2) 100%);
		}
	}
	.header{
		height: 200rpx;
		position: absolute;
		bottom: 0rpx;
		left: 30rpx;
		right: 30rpx;
		.avatar{
			width: 150rpx;
			height: 150rpx;
			background-color: white;
			border-radius: 50%;
			margin-right: 30rpx;
		}
	}
	.cell{
		margin: 20rpx;
		padding: 20rpx 20rpx 50rpx;
		border-radius: 20rpx;
		.item{
			margin-top: 40rpx;
			.label{
				font-size: 32rpx;
				color: #333;
			}
			.icon{
				color: #666;
				font-size: 38rpx;
			}
		}
	}
	.list{
		margin-bottom: 20rpx;
		padding: 0 20rpx;
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
	.con{
		padding: 0 20rpx;
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
					width: 33.33%;
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
						font-size: 56rpx;
						color: #f53b58;
						// margin-bottom: 10rpx;
					}
					.tips{
						position: absolute;
						left: 120rpx;
						top: -20rpx;
						color: white;
						font-size: 24rpx;
						padding: 0 14rpx;
						border-radius: 50rpx;
						z-index: 9;
						background-color: #CA0400;
					}
				}
				&-item text:last-child{
					margin-top: 10rpx;
				}
			}
		}
	}
</style>