<template>
	<view class="main">
		<view class="list" v-for="(item, i) in list" :key="i">
		<!-- 	<view class="flex flex-space-end time">
				<text class="font26 color-w">{{item.createTime}}</text>
			</view> -->
			<view class="flex flex-align-center">
				<!-- <text class="iconfont color-purple icon">&#xe669;</text> -->
				<view>
					<view class="color-purple money blod">
						<text class="font60">{{item.amount}}</text>
						<text class="font26" style="margin-left: 4rpx; margin-bottom: 16rpx;">元</text>
					</view>
				</view>
				<view class="flex flex-column right">
					<text class="font34 line">{{item.name}}</text>
					<text>适用于：{{item.buyGoodsType | filterType}}</text>
					<text class="font26">{{item.tdescribe}}</text>
					<text class="font26">获得时间：{{item.createTime}}</text>
				</view>
			</view>
			
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		data(){
			return {
				loading: "loading",
				pageSize: 1,
				list: []
			}
		},
		filters: {
			filterType(val){
				switch(val) {
					case 1:
						return "普通商品";
					case 2:
						return "精品商品";
					default:
						return "所有"
				}
			}
		},
		onLoad() {
			this.getList('add')
		},
		onReachBottom() {
			this.getList('add')
		},
		onPullDownRefresh() {
			this.getList('refresh')
		},
		methods: {
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
					pageSize: this.pageSize
				}
				this.$http("GET", url.user.getUserCards, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.list{
			// background-color: white;
			margin-bottom: 20rpx;
			border-radius: 16rpx;
			padding: 30rpx;
			background-color: rgba($color: #381895, $alpha: .3);
			.icon{
				font-size: 70rpx;
				margin-right: 20rpx;
			}
			.time{
				margin-bottom: 10rpx;
			}
			.money{
				margin-right: 20rpx;
				display: flex;
				align-items: flex-end;
			}
			.right{
				color: #6648ab;
			}
		}
	}
</style>
