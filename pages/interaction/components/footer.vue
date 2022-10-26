<template>
	<view class="footer">
		<view class="footer-item bg1" @tap="goPath" :data-index="1">
			<image src="/static/video/chat.png" mode="" class="footer-item-img"></image>
			<text class="footer-item-title">聊天</text>
			<!-- <view class="footer-item-line" :class="{'activate-line': current === 1}"></view> -->
		</view>
		<!-- <view class="footer-item bg2" @tap="goPath" :data-index="2">
			<image src="/static/video/tel.png" mode="" class="footer-item-img"></image>
			<text class="footer-item-title">语音</text>
			<view class="footer-item-line" :class="{'activate-line': current === 2}"></view>
		</view> -->
		<view class="footer-item bg3" @tap="goPath" :data-index="3">
			<image src="/static/video/video.png" mode="" class="footer-item-img"></image>
			<text class="footer-item-title">语音视频</text>
			<!-- <view class="footer-item-line" :class="{'activate-line': current === 3}"></view> -->
		</view>
		<!-- <view class="footer-item">
			<text class="footer-item-title" style="color: #999;">我的</text>
			<view class="footer-item-line" :class="{'activate-line': current === 4}"></view>
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			current: {
				default: 1
			}
		},
		data() {
			return {

			}
		},
		methods: {
			goPath: function(e) {
				var index = e.target.dataset.index;
				this.$emit("change", index)
			}
		}
	}
</script>
<style scoped>
	.footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20rpx;
		align-items: center;
		justify-content: space-between;
		/* border-top-width: 1rpx; */
		/* border-color: rgba(255, 255, 255, 0.1); */
		flex-direction: row;
		width: 750rpx;
		padding: 0 20rpx;
	}

	.footer-item {
		position: relative;
		height: 80rpx;
		line-height: 80rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 320rpx;
		border-radius: 50rpx;
		flex-direction: row;
	}
	.bg1{
		background-image: linear-gradient(to top, #1ca3e7, #35e7e7);
	}
	.bg2{
		background-image: linear-gradient(to top, #6978f0, #a25ef2);
	}
	.bg3{
		background-image: linear-gradient(to top, #eb7070, #dc3a68);
	}
	.footer-item-img{
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}
	.footer-item-title {
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: 600;
	}

	.footer-item-line {
		width: 40rpx;
		height: 5rpx;
		line-height: 5rpx;
		position: absolute;
		bottom: 0;
		border-radius: 10rpx;
	}
</style>
