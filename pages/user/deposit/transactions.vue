<template>
	<view class="main">
		<view class="top bg-base color-w">
			<text class="font36 name">可用资产</text>
			<text class="money">{{walletInfo.balance}}</text>
		</view>
		<view class="list" v-for="(item, i) in list" :key="i">
			<view class="title">
				<text>{{item.name}}</text>
				<text>需投资：{{item.amount}}</text>
			</view>
			<view class="con">
				<view class="con-item">
					<text class="red">{{item.totalRateOfReturn}}%</text>
					<text class="name">总回报率</text>
				</view>
				<view class="con-item">
					<view class="flex flex-align-end">
						<text class="num">{{item.showRevenueTimesAmount}}</text>
						<text class="unit">元</text>
					</view>
					<text class="name">周收益</text>
				</view>
				<view class="con-item">
					<view class="flex flex-align-end">
						<text class="num">{{item.showRevenueTimes}}</text>
						<text class="unit">周</text>
					</view>
					<text class="name">收益期限</text>
				</view>
			</view>
			<text class="tips" v-if="item.describeContent">说明：{{item.describeContent}}</text>
			<button type="primary" class="bg-base btn" @click="jumpTo(item)">
				<text class="font30">存托</text>
			</button>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components: { uniLoadMore },
		data(){
			return {
				loading: "nomore",
				list: [],
				walletInfo: {}
			}
		},
		onShow() {
			// 获取钱包信息
			this.$http("GET", url.deposit.getUserWallet).then(res =>{
				this.walletInfo = res.data
			})
			this.getList()
		},
		onPullDownRefresh() {
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("depositDetail")
		},
		methods:{
			getList(){
				this.$http("GET", url.deposit.getDepositList).then(res =>{
					this.list = res.data
					uni.stopPullDownRefresh()
				})
			},
			jumpTo(row){
				this.$navigateTo("payment?data="+JSON.stringify(row))
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		width: 750rpx;
		overflow: hidden;
	}
	.top{
		margin: 20rpx;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		.name{
			align-self: flex-start;
		}
		.money{
			margin-top: 40rpx;
			font-size: 54rpx;
		}
	}
	.list{
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		.title{
			// width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			font-size: 30rpx;
		}
		.con{
			padding: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			&-item{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.red{
					color: #ff3b48;
					font-size: 44rpx;
				}
				.name{
					font-size: 24rpx;
					color: #999999;
				}
				.num{
					font-weight: bold;
					font-size: 32rpx;
				}
				.unit{
					font-size: 26rpx;
					margin-left: 4rpx;
					color: #555;
				}
			}
		}
		.tips{
			font-size: 30rpx;
			color: #666666;
			margin: 0 20rpx;
			display: block;
		}
		.btn{
			width: 80%;
			height: 80rpx;
			line-height: 80rpx;
			margin-top: 30rpx;
		}
	}
</style>
