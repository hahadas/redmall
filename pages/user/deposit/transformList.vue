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
				<text class="blod font44 color-purple">¥{{item.fromWalletAmount}}</text>
			</view>
			<text class="color-b6 font30 margin">转换钱包：{{filterType(item.fromWallet)}}</text>
			<text class="color-b6 font30 margin">到账钱包：{{filterType(item.toWallet)}}</text>
			<text class="color-b6 font30 margin">转换费用：{{item.serviceChargeAmount}}</text>
			<text class="color-b6 font30 margin">实际到账：{{item.toWalletAmount}}</text>
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
	import selectOptions from "@/common/utils/selectOptions.js"
	export default{
		components: { vTabs, uniLoadMore },
		data(){
			return {
				current: 0,
				tabs: [
					{name: "全部", value: -1},
					{name: "存托权益转资产", value: 2},
					{name: "销售提成转资产", value: 3}
				],
				loading: "loading",
				pageSize: 1,
				list: []
			}
		},
		onLoad(opt){
			if (opt.type) {
				this.current = parseInt(opt.type)
			}
			this.getList('add')
		},
		onPullDownRefresh() {
			this.pageSize = 1
			this.list = []
			this.current = 0
			this.getList('refresh')
		},
		onReachBottom() {
			this.getList('add')
		},
		methods:{
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
					fromWallet: this.current === 0 ? -1 : this.tabs[this.current].value,
					toWallet: this.current === 0 ? -1 : 1,
				}
				this.$http("GET", url.deposit.getTransformList, params).then(res =>{
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
				this.getList("refresh")
			},
			filterType(val){
				let depositWalletList = selectOptions.depositWalletList
				let value = "其他钱包"
				for(let i = 0; i < depositWalletList.length; i++){
					if (val === depositWalletList[i].value){
						value = depositWalletList[i].name
						return value
					}
				}
			}
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
			margin: 10rpx 0;
			line-height: 50rpx;
			display: block;
		}
	}
	.drawer{
		padding: 0 30rpx;
		.title{
			font-size: 32rpx;
			margin-top: 50rpx;
			margin-bottom: 20rpx;
		}
		.grid{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 30rpx;
			&-item{
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 200rpx;
				height: 70rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				background-color: #f3f4f3;
				color: #87878b;
			}
			.active{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
		.btns{
			margin-top: 80rpx;
			padding-bottom: 40rpx;
			.btn{
				width: 45%;
				background-color: #f3f4f3;
				color: #87878b;
				font-size: 32rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
			.right{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
	}
</style>
