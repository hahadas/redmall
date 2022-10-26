<template>
	<view>
		<view class="bg-base header color-w flex flex-align-center flex-space-around">
			<view class="flex flex-column flex-center">
				<text class="font30">余额</text>
				<text class="font46" v-if="type === 2">{{walletInfo.distributorBalance||0}}</text>
				<text class="font46" v-else>{{walletInfo.balance||0}}</text>
			</view>
			<view class="flex flex-column flex-center" v-if="type === 1">
				<text class="font30">积分</text>
				<text class="font46">{{walletInfo.integral||0}}</text>
			</view>
		</view>
		<view class="cell bg-w">
			<view class="flex flex-between cell-item" @tap="jumpTo('withdrawal')">
				<text class="font30 color-b3">提现</text>
				<text class="iconfont color-b9 font38">&#xe770;</text>
			</view>
			<!-- <view class="b-l-20"></view>
			<view class="flex flex-between cell-item" @tap="jumpTo('transform')">
				<text class="font30 color-b3">积分转消费券</text>
				<text class="iconfont color-b9 font38">&#xe770;</text>
			</view> -->
		</view>
		<view class="cell bg-w">
			<view class="flex flex-between cell-item" @tap="jumpTo('withdrawalRecord')">
				<text class="font30 color-b3">提现记录</text>
				<text class="iconfont color-b9 font38">&#xe770;</text>
			</view>
			<block v-if="type === 3">
				<view class="b-l-20"></view>
				<view class="flex flex-between cell-item" @tap="jumpTo('/pages/merchants/collection/list')">
					<text class="font30 color-b3">收款记录</text>
					<text class="iconfont color-b9 font38">&#xe770;</text>
				</view>
			</block>
			<view class="b-l-20"></view>
			<view class="flex flex-between cell-item" @tap="jumpTo('flow')">
				<text class="font30 color-b3">流水记录</text>
				<text class="iconfont color-b9 font38">&#xe770;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				// totalMoney:0.00,//总余额
				// jingPingMoney:0,//精品券
				// integralMoney:0.00,//积分余额
				// xiaofeiMoney: 0.00,//消费券余额
				type: 1, // 1-用户， 2-天使， 3-用户, 4-存托
				walletInfo: {}
			}
		},
		onLoad(opt) {
			if (opt.type){
				this.type = parseInt(opt.type)
			}
		},
		onShow(){
			this.loadData();
		},
		methods:{
			loadData(){
				if (this.type === 3) {
					this.$http("GET", url.store.getWalletInfo).then(res=>{
						this.walletInfo = res.data
					})
				} else {
					this.$http('GET', url.user.getWalletInfo).then(res =>{
						uni.stopPullDownRefresh();
						this.walletInfo = res.data
					})
				}
				uni.stopPullDownRefresh()
			},
			jumpTo(path) {
				this.$navigateTo(path+'?type='+this.type)
			}
		},
		onPullDownRefresh() {
			this.loadData();
		}
	}
</script>

<style scoped lang="scss">
	.header{
		width: 690rpx;
		margin-left: 30rpx;
		border-radius: 20rpx;
		padding: 50rpx 0;
	}
	.cell{
		margin-top: 20rpx;
		&-item{
			height: 100rpx;
			padding: 0 20rpx;
		}
	}
</style>
