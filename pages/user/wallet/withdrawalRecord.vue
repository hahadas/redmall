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
				<text class="blod font44 color-purple">{{item.withdrawalAmount}}</text>
				<text class="font40 color-b9" v-if="item.status === 1">申请中</text>
				<text class="font40 color-b9" v-if="item.status === 2">提现成功</text>
				<text class="font40 color-b9" v-if="item.status === 3">提现失败</text>
			</view>
			<view class="flex flex-between">
				<text class="color-b6 font30 margin">收款类型：{{item.collectionType | filterCollectionType}}</text>
				<text class="color-purple font32" @tap="jumpTo(item)">查看</text>
			</view>
			
			<text class="color-b6 font30 margin">用户类型：{{item.userType | filterUserType}}</text>
			<text class="color-b6 font30 margin">手&ensp;续&ensp;费：{{item.serviceAmount}}元</text>
			<text class="color-b6 font30 margin">实际到账：{{item.actualArrivalAmount}}元</text>
			<text class="color-b6 font30 margin">提现详情：{{item.operationMsg}}</text>
			<view class="flex flex-space-end">
				<text class="color-b9 font30">{{item.createTime}}</text>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<uni-popup ref="popup">
			<view class="popup">
				<text class="title">收款信息</text>
				<view class="form">收款类型：{{collection.type | filterCollectionType}}</view>
				<block v-if="collection.type === 3">
					<view class="form">所属银行：{{collection.bankName}}</view>
					<view class="form" v-if="collection.branch">所属支行：{{collection.branch}}</view>
					<view class="form">银行卡号：{{collection.account}}</view>
					<view class="form">绑定号码：{{collection.phone}}</view>
				</block>
				<block v-else>
					<view class="form">账号：{{collection.account}}</view>
					<view class="form">姓名：{{collection.name}}</view>
				</block>
				<text class="btn" @click="closePopup">确定</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import url from "@/common/http/url.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	export default{
		components: { vTabs, uniLoadMore },
		data(){
			return {
				type: 1, // 1-用户， 2-天使， 3-用户, 4-存托
				loadingType: "loading",
				current: 0,
				tabs: [
					{name: "全部", value: -1},
					{name: "申请中", value: 1},
					{name: "提现成功", value: 2},
					{name: "提现失败", value: 3}
				],
				pageSize: 1,
				list: [],
				collection: {}
			}
		},
		filters:{
			filterCollectionType(val){
				let collectionList = selectOptions.collectionList
				let value = "其他类型"
				collectionList.forEach(v =>{
					if (v.value === val){
						value = v.name
						return false
					}
				})
				return value
			},
			filterUserType(val){
				let userTypeList = selectOptions.userTypeList
				let value = "其他类型"
				userTypeList.forEach(v =>{
					if (v.value === val){
						value = v.name
						return false
					}
				})
				return value
			}
		},
		onLoad(opt) {
			if (opt.type){
				this.type = parseInt(opt.type)
			}
			this.getList('add');
		},
		methods:{
			getList(type){
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.pageSize = 1;
					this.list = []
					this.loadingType = 'more';
				}
				let params = {
					pageSize: this.pageSize,
					status: this.tabs[this.current].value,
					collectionType: -1
				};
				let path = url.withdrawal.withdrawalList
				if (this.type === 4) {
					path = url.deposit.withdrawalList
				} else {
					params.userType = this.type
				}
				this.$http('GET', path, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loadingType = "more"
					} else{
						this.loadingType = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			},
			changeTab(val) {
				this.current = val;
				this.getList('refresh');
			},
			jumpTo(row){
				this.collection = JSON.parse(row.collectionJson)
				this.collection.type = row.collectionType
				let bankName = this.collection.bankName
				if (bankName && bankName.indexOf("-") > -1) {
					this.collection.bankName = bankName.split("-")[0]
					this.collection.branch = bankName.split("-")[1]
				}
				this.$refs.popup.open()
			},
			closePopup(){
				this.$refs.popup.close()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getList('refresh');
		},
		//加载更多
		onReachBottom() {
			this.getList('add');
		}
	}
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		.title{
			border-bottom: 2rpx solid #eeeeee;
			padding-bottom: 10rpx;
			margin-bottom: 10rpx;
		}
		.margin{
			margin-top: 10rpx;
			line-height: 50rpx;
			display: block;
		}
	}
	.popup{
		width: 700rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		.title{
			width: 100%;
			border-bottom: 2rpx solid #EEEEEE;
			text-align: center;
			display: block;
			padding: 20rpx 0;
			font-size: 32rpx;
		}
		.form{
			padding: 20rpx;
			font-size: 30rpx;
			color: #444444;
		}
		.btn{
			width: 100%;
			display: block;
			padding: 20rpx 0;
			border-top: 2rpx solid #EEEEEE;
			color: #381895;
			font-size: 30rpx;
			text-align: center;
		}
	}
</style>
