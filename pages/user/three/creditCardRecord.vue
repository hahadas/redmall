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
				<text class="blod font44 color-purple">¥{{item.amount}}</text>
				<text class="color-b6 font30" v-if="item.status === 1">还款中</text>
				<text class="color-b6 font30" v-else-if="item.status === 2">还款成功</text>
				<text class="color-b6 font30" v-else>还款失败</text>
			</view>
			<!-- <view class="flex flex-between margin">
				<text class="color-b6 font30">订单编号：{{item.sporderId}}</text>
				<text class="color-purple font30" @click="$onCopy(item.sporderId)">复制</text>
			</view> -->
			<text class="color-b6 font30 margin">银行名称：{{item.bankName}}</text>
			<text class="color-b6 font30 margin">银行卡号：{{item.account}}</text>
			<text class="color-b6 font30 margin" v-if="item.openBranchName && item.openBranchName !== 'undefined'">开户支行：{{item.openBranchName}}</text>
			<text class="color-b6 font30 margin">持&ensp;卡&ensp;人：{{item.name}}</text>
			<text class="color-b6 font30 margin">手机号码：{{item.phone}}</text>
			<text class="color-b6 font30 margin">还款比例：1:{{item.proportion}}</text>
			<text class="color-b6 font30 margin">扣除积分：{{item.integral}}</text>
			<text class="color-b6 font30 margin" v-if="item.status === 3 && item.operationErrMsg">描述：{{item.operationErrMsg}}</text>
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
				current: 0,
				tabs: [
					{name: "还款中", value: 1},
					{name: "还款成功", value: 2},
					{name: "还款失败", value: 3}
				],
				loading: "loading",
				list: [],
				pageSize: 1
			}
		},
		onLoad(opt) {
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
				this.$http("GET", url.user.returnCreditCardRecord, params).then(res =>{
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
