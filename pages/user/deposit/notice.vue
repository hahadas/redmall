<template>
	<view class="main">
		<view class="con" v-for="(item, i) in list" :key="i" @click="jumpTo(item)">
			<view><image :src="item.mainImage" mode="" class="img"></image></view>
			<view class="right">
				<text class="font28 color-b3 line line-2 flex-1">{{item.titleName}}</text>
				<text class="font26 color-b9">{{item.createTime}}</text>
			</view>
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
				list: [],
				pageSize: 1,
				loading: "loading"
			}
		},
		onPullDownRefresh() {
			this.list = []
			this.pageSize = 1
			this.getList('refresh')
		},
		onReachBottom() {
			this.getList('add')
		},
		onLoad() {
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
				this.$http("GET", url.deposit.getNoticeList, {pageSize: this.pageSize}).then(res =>{
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
			jumpTo(row){
				uni.setStorageSync("noticeDetail", row)
				this.$navigateTo("noticeDetail")
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		padding: 20rpx;
	}
	.con{
		padding: 20rpx 0rpx;
		height: 140rpx;
		display: flex;
		border-bottom: 2rpx solid #EEEEEE;
		.img{
			width: 200rpx;
			height: 140rpx;
			border-radius: 16rpx;
			margin-right: 20rpx;
			background-color: #007AFF;
		}
		.right{
			height: 140rpx;
			display: flex;
			flex-direction: column;
		}
	}
</style>
