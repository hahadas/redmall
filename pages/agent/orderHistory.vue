<template>
	<view class="page">
		
		<v-tabs :value="current" :tabs="tabs" height="90rpx" field="name" :scroll="false" fontSize="30rpx" @change="onClickItem"></v-tabs>
		<!-- 使用 swiper 配合 滑动切换 -->
		<swiper class="swiper-box" scroll-y="true" @change='scollSwiper' :current='current' duration="300" :style="{height: swiperHeight+'px'}">

			<swiper-item scroll-y="true" v-for="(tabItem, tabIndex) in tabs" :key="tabIndex">
				<!-- 使用 scroll-view 来滚动内容区域 -->
				<scroll-view scroll-y="true" :style="{height: swiperHeight+'px'}">
						<view v-for="(order, index) in list" :key="index" class="center-order" @click="orderDetails(order)">
							<view class="order-list">
								<view class="order-left">
									<text class="order-time">{{order.confirmReceiptTime}}</text>
								</view>
								<view class="order-right">
									<view class="order-price">
										<text>¥ {{order.deliveryPlatformMoney}}</text>
									</view>
									<text style="color: #4e8ddf;" v-if="!order.deliveryPlatformEvaluate">待评价</text>
									<text style="color: #10ad15;" v-else>{{order.deliveryPlatformEvaluate}}星</text>
								</view>
							</view>
							<view class="order-store">
								<view class="store-left">
									<text class="store-name"> 
										<text class="color-purple iconfont font24 icon">&#xe630;</text>
										{{order.storeInfo.name}}
									</text>
									<text v-if="order.orderType===2" class="store-distance">自身供货</text>
								</view>
								<view class="store-address1">
									{{order.storeAddressDetails}}{{order.storeAddressSupplement}}
								</view>
							</view>
							<view class="order-store">
								<view class="store-left">
									<text class="store-name">
										<text class="color-yellow iconfont font24 icon">&#xe630;</text>
										{{order.userFullName}}
									</text>
								</view>
								<view class="store-address2">
									{{order.userAddressDetails}}{{order.userAddressSupplement}}
								</view>
							</view>
						</view>
						
						<uni-load-more :status="loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from '@/components/v-tabs/v-tabs.vue';
	/* 接口和用户登入状态 */
	import url from '@/common/http/url.js';
	export default {
		components: {
			uniLoadMore,
			vTabs
		},
		data() {
			return {
				swiperHeight: 0,
				loadingType: 'loading', //加载更多状态
				current: 0,
				tabs: [
					{name: "全部", value: -1},
					{name: "待评价", value: 4},
					{name: "已评价", value: 5}
				],
				list: []
			};
		},
		onLoad() {
			//高度，去除手机状态栏
			let systemInfo = uni.getSystemInfoSync();
			this.swiperHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - 30;
			
			//获取订单信息
			this.getHallOrders(false);
		},
		methods: {
			//获取订单信息
			getHallOrders(type){
				if (type) {
					this.list = []
					this.loadingType = "loading"
				}
				let params = {
					status: this.tabs[this.current].value,
					evaluateDistributionScore: -1,
					pageNum: this.list.length
				}
				this.$http("GET", url.distributor.historyOrderList, params).then(res =>{
					this.list = this.list.concat(res.data)
					this.loadingType = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh();
				})
				
			},
			orderDetails(row){
				this.$navigateTo('detail?isHistory=true&&id='+row.id+"&&orderUserId="+row.userId);
			},
			onClickItem(val) {
				this.current = val;
			},
			scollSwiper(e) {
				this.current = e.target.current;
				this.getHallOrders(true);
			},
			//下拉刷新
			onPullDownRefresh() {
				this.getHallOrders(true);
			},
			//加载更多
			onReachBottom() {
				this.getHallOrders(false);
			},
		}
	};
</script>

<style scoped lang="scss">
	.screen-swiper {
		min-height: 168rpx;
	}

	.center-start {
		text-align: center;
		position: relative;
		top: 200rpx;
	}

	.loading-btn {
		position: fixed;
		width: 100%;
		bottom: 10rpx;
	}

	.lod-but {
		margin: 10rpx 304rpx;
		border-radius: 72rpx;
		font-size: 30rpx;
		padding: 36rpx 0;
		background-color: #48484f;
		box-shadow: 0 2px 5px #946565;
	}

	.start-btn {
		margin: 10rpx 200rpx;
		border-radius: 72rpx;
		font-size: 30rpx;
		padding: 10rpx 0;
		background-color: #FE7517;
	}

	.start-text {
		color: #909090;
	}

	.start-img {
		width: 500rpx;
		height: 300rpx;
	}

	.center-order {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 10rpx 10rpx 0 0;
		padding-bottom: 20rpx;
		z-index: 9999;
		overflow-y: scroll;
	}

	.order-list {
		padding: 20rpx 0;
		margin: 10rpx 30rpx 0 30rpx;
		border-bottom: 1rpx dashed #f5e7e7;
		height: 60upx;
	}

	.order-left {
		height: 60upx;
		line-height: 60rpx;
		float: left;
		width: 50%;
		border-right: 1rpx solid #f5e7e7;
		/* margin-top: 20rpx; */

	}

	.order-right {
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 38rpx;
		font-weight: 300;
	}

	.order-time {
		color: #999;
		font-size: 30rpx;
	}

	.order-price {
		color: #ff8b3e;
		font-size: 38rpx;
		font-weight: 300;
		margin-left: 20rpx;
	}

	.order-store {

		margin: 0 20rpx;
		position: relative;

	}

	.elm-text {
		background-color: #007AFF;
		color: #fff;
		border-radius: 0 0 6rpx 6rpx;
		padding: 3px;

	}

	.store-distance {
		position: absolute;
		right: 0;
		// top: 18rpx;
		font-size: 28upx;
		color: #216AE7;
	}

	.icon-tishi {
		color: #216AE7;
	}

	.icon-dingwei1 {
		color: #216AE7;
	}

	.icon-tishi-copy {
		color: #F5761B;
	}

	.store-left {
		padding-top: 4rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.store-address1 {
		color: #999;
		margin-left: 30rpx;
		
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.store-address2 {
		font-weight: 600;
		margin-left: 30rpx;
		padding-bottom: 8rpx;
		
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.store-name {
		width: 500rpx;
		font-weight: 600;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		.icon{
			margin-right: 10rpx;
		}
	}

	.order-give {

		border-top: 1rpx solid #f5e7e7;
	}

	.give-left {
		float: left;
		width: 30%;
		text-align: center;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 0 0 0 10rpx;
		color: #666;
	}

	.give-right {
		float: right;
		width: 70%;
		background-color: #13BB24;
		text-align: center;
		padding: 20rpx;
		border-radius: 0 0 10rpx 0;
		color: #fff;
	}
</style>
