<template>
	<view class="list">
		<view class="list-item" v-for="(item, i) in list" :key="i">
			<image :src="item.toUserInfo.headPortrait" mode="aspectFill" class="avatar" @click="goUser(item)"></image>
			<view class="flex flex-column flex-grow">
				<text class="font32 color-b3 line">{{item.toUserInfo.nickname}}</text>
				<text class="color-9 font24">拉黑时间：{{item.createTime}}</text>
			</view>
			<text class="btn bg-base" @click="onDel(item, i)">移除</text>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import url from "@/common/http/url.js";
	export default{
		components: { uniLoadMore },
		data(){
			return {
				loading: "nomore",
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh(){
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				this.loading = "loading"
				this.$http("GET", url.user.myBackUserList, {pageNum: this.list.length}).then(res => {
					this.list = res.data.concat(this.list)
					if (res.data.length < 12) {
						this.loading = "nomore"
					} else {
						this.loading = "more"
					}
					uni.stopPullDownRefresh()
				})
			},
			onDel(item, i){
				let _this = this
				this.$showModal("是否把该用户移除黑名单？", "移除黑名单", res => {
					if (res.confirm) {
						_this.$http("POST", url.user.delBackUser, {toImAccount: item.blackImAccount}).then(doc => {
							_this.$msg(doc.data)
							_this.list.splice(i, 1)
						})
					}
				})
			},
			goUser(item) {
				this.$navigateTo("/pages/interaction/user?userId="+item.blackImAccount)
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		padding: 20rpx;
		&-item{
			padding: 20rpx 0;
			margin-bottom: 20rpx;
			border-bottom: 2rpx solid #f6f6f6;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.avatar{
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
			}
			.btn{
				border-radius: 10rpx;
				font-size: 28rpx;
				color: white;
				padding: 6rpx 20rpx;
				margin-left: 10rpx;
			}
		}
	}
</style>
