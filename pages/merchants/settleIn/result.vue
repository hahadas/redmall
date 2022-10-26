<template>
	<view class="main">
		<view class="top flex flex-center flex-column">
			<text class="iconfont icon" style="color: #13BB24;" v-if="data.status === 1">&#xe606;</text>
			<text class="iconfont icon" style="color: #CA0400;" v-if="data.status === 3">&#xe638;</text>
			<text class="blod font40">{{data.status===1?'审核中':'审核失败'}}</text>
			<text class="font32 text-cen" style="margin-top: 10rpx;" v-if="data.status === 1">您申请的资料正在审核中，请耐心等待1～3个工作日！</text>
			<text class="tips" v-if="data.errorMsg && data.status === 3">审核意见：{{data.errorMsg}}</text>
		</view>
		<!-- <view class="imgs flex flex-between">
			<image :src="item.ossUrl" mode="" v-for="(item, i) in data.resourcesList" :key="i" @click="viewPic(i)"></image>
		</view> -->
		<button type="primary" class="bg-base btn" v-if="data.status === 3" @click="jumpTo">重新提交</button>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				data: {}
			}
		},
		onLoad(opt) {
			let examineData = uni.getStorageSync("examineData")
			if (examineData.status === 1) uni.removeStorageSync("examineData")
			this.data = examineData
		},
		methods: {
			viewPic(i){
				let urls = this.data.resourcesList.map(v=>{return v.ossUrl})
				uni.previewImage({
					count: i,
					urls: urls
				})
			},
			jumpTo(){
				if (this.data.realName) { // 配送员
					this.$navigateTo("/pages/agent/apply")
				} else { // 商家
					this.$navigateTo("/pages/merchants/index")
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 0 10%;
		margin-top: 50rpx;
		.icon{
			font-size: 100rpx;
			margin-bottom: 20rpx;
		}
		.tips{
			margin-top: 20rpx;
			padding: 10rpx;
			background-color: #e4e2e5;
			border-radius: 10rpx;
			color: #999999;
			font-size: 30rpx;
		}
	}
	.imgs {
		margin: 50rpx;
		flex-wrap: wrap;
		image{
			width: 320rpx;
			height: 320rpx;
			margin-bottom: 10rpx;
		}
	}
	.btn{
		margin-top: 50rpx;
		width: 80%;
	}
</style>
