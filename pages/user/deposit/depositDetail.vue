<template>
	<view>
		<view class="top bg-base color-w">
			<view class="flex flex-between">
				<view class="cell">
					<text class="name">总投入（元）</text>
					<text class="num">{{walletInfo.balanceExpenditureDepositAmount}}</text>
				</view>
				<view class="cell">
					<text class="name">总收益（元）</text>
					<text class="num">{{walletInfo.depositCumulativeEnter}}</text>
				</view>
			</view>
			<button type="primary" class="btn" @click="jumpTo()">立即存托</button>
		</view>
		<v-tabs
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:scroll="false"
			@change="changeTab">
		</v-tabs>
		<view class="list" v-for="(item, i) in list" :key="i" @click="goDetail(item)">
			<view class="title">
				<text class="color-purple">{{item.name}}</text>
				<text class="color-purple" v-if="item.status === 1">进行中</text>
				<text class="color-b9" v-if="item.status === 2">已结束</text>
				<text class="color-b9" v-if="item.status === 3">暂停收益</text>
			</view>
			<view class="list-con">
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">购买投入</text>
					<text class="right"><text class="color-purple">{{item.amount}}</text>元</text>
				</view>
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">每周收益</text>
					<text class="right">{{item.showRevenueTimesAmount}}元</text>
				</view>
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">均日收益</text>
					<text class="right">{{item.revenueTimesAmount}}</text>
				</view>
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">累计收益</text>
					<text class="right"><text class="color-purple">{{item.userRevenueTotal}}</text>元</text>
				</view>
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">收益周期</text>
					<text class="right">{{item.showRevenueTimes}}期 - {{item.userSurplusRevenueTimes}}/{{item.revenueTimes}}天</text>
				</view>
				<view class="flex flex-align-center list-con-wrap">
					<text class="label">开始时间</text>
					<text class="right">{{item.createTime.split(" ")[0]}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import { timestampToTime } from "@/common/utils/index.js"
	export default{
		components: { vTabs, uniLoadMore },
		data(){
			return {
				current: 0,
				tabs: [
					{name:"运行中", value: 1},
					{name:"已结束", value: 2}
				],
				walletInfo: {},
				loading: "nomore",
				list: [],
				pageSize: 1
			}
		},
		onLoad() {
			this.getWalletInfo()
			this.getList()
		},
		onPullDownRefresh() {
			this.pageSize = 1
			this.list = []
			this.getList('refresh')
			this.getWalletInfo()
		},
		onReachBottom() {
			this.getList('add')
		},
		methods:{
			getWalletInfo(){
				this.$http("GET", url.deposit.getUserWallet).then(res =>{
					this.walletInfo = res.data
				})
			},
			getList(type){
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.loading = 'more';
				}
				let params = {
					pageSize: this.pageSize,
					status: this.tabs[this.current].value
				}
				this.$http("GET", url.deposit.getUserDepositList, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			},
			changeTab(index){
				this.current = index
				this.pageSize = 1
				this.list = []
				this.getList('refresh')
			},
			jumpTo(){
				this.$navigateTo("transactions")
			},
			goDetail(row){
				this.$navigateTo("detail?current=1&&id="+row.id)
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.top{
		padding: 50rpx 30rpx;
		margin-bottom: 20rpx;
		.cell{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.name{
				font-size: 28rpx;
			}
			.num{
				font-size: 54rpx;
				margin-top: 10rpx;
			}
		}
		.btn{
			margin-top: 50rpx;
			background-color: #7c7dfd;
		}
	}
	.list{
		background-color: white;
		margin-top: 20rpx;
		.title{
			width: 710rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			font-size: 32rpx;
		}
		&-con{
			padding: 20rpx;
			&-wrap{
				margin-bottom: 20rpx;
				font-size: 32rpx;
				.label{
					color: #999999;
					width: 50%;
					display: inline-block;
				}
				.right{
					width: 50%;
					display: inline-block;
				}
			}
		}
		
	}
</style>
