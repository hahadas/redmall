<template>
	<view class="footer">
		<view class="footer-item bg1" @tap="goPath(1)">
			<image :src="staticUrl + 'video/chat.png'" mode="" class="footer-item-img"></image>
			<text class="footer-item-title">聊天</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="footer-item bg3" @tap="goPath(2)">
			<image :src="staticUrl + 'video/video.png'" mode="" class="footer-item-img"></image>
			<text class="footer-item-title">语音视频</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		props: {
			current: {
				default: 1,
			}
		},
		data() {
			return {
				staticUrl: getApp().staticUrl,
			}
		},
		methods: {
			goPath: function(index) {
				this.$emit("change", index)
			}
		}
	}
</script>
<style scoped>
	.footer {
		position: absolute;
		left: 20rpx;
		right: 20rpx;
		bottom: 20rpx;
		display: flex;
		align-items: center;
		/* #ifdef APP-PLUS */
		justify-content: space-between;
		/* #endif */
		/* #ifndef APP-PLUS */
		justify-content: center;
		/* #endif */
		flex-direction: row;
	}

	.footer-item {
		position: relative;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
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