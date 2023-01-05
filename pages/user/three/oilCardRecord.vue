<template>
	<view>
		<v-tabs
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:scroll="false"
			@change="changeTab">
		</v-tabs>
		<view class="list bg-w" v-for="(item, i) in list" :key="i">
			<view class="title flex flex-between">
				<text class="blod font44 color-purple">¥{{item.cardnum}}</text>
				<text class="color-b6 font30" v-if="item.gameState === 0">充值中</text>
				<text class="color-b6 font30" v-if="item.gameState === 1">充值成功</text>
				<text class="color-b6 font30" v-else>充值失败</text>
			</view>
			<view class="flex flex-between margin">
				<text class="color-b6 font30">订单编号：{{item.sporderId}}</text>
				<text class="color-purple font30" @click="$onCopy(item.sporderId)">复制</text>
			</view>
			<text class="color-b6 font30 margin">油卡类型：{{item.chargeType === 1 ? '中石化' : '中石油'}}</text>
			<text class="color-b6 font30 margin">充值卡号：{{item.gameUserid}}</text>
			<text class="color-b6 font30 margin">持卡人：{{item.gasCardName}}</text>
			<text class="color-b6 font30 margin">手机号码：{{item.gasCardTel}}</text>
			<text class="color-b6 font30 margin">扣除金额：{{item.deductionWalletAmount}}</text>
			<text class="color-b6 font30 margin" v-if="item.gameState === 9 && item.queryErrMsg">描述：{{item.queryErrMsg}}</text>
			<view class="flex flex-space-end">
				<text class="color-b9 font30">{{item.createTime}}</text>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	export default {
		data() {
			return {
				type: 1, // 1-话费， 2-油卡
				current: 0,
				tabs: [
					{name: "全部", value: -1},
					{name: "充值成功", value: 1},
					{name: "充值失败", value: 9},
					{name: "充值中", value: 0}
				],
				loading: "loading",
				list: [],
				pageSize: 1
			}
		},
		onLoad(opt) {
			if(opt.type){
				this.type = parseInt(opt.type)
			}
			this.getList('add')
		},
		onReachBottom() {
			this.getList('add')
		},
		onPullDownRefresh() {
			this.getList('refresh')
		},
		methods:{
			getList(type) {
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.pageSize = 1
					this.list = []
					this.loading = 'more';
				}
				let params = {
					pageSize: this.pageSize,
					gameState: this.tabs[this.current].value
				}
				this.$http("GET", url.juhe.getOilCardRecord, params).then(res =>{
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
			changeTab(e){
				this.current = e
				this.getList('refresh')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		margin: 0 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		.title{
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
	}
</style>
