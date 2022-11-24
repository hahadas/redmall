<template>
	<view class="header" :class="{'scroll-bg': headerScroll}" :style="{marginTop:statusBarHeight+'px'}">
		<image :src="staticUrl + 'video/back_black.png'" mode="" class="header-left" v-if="headerScroll" @click="onBack"></image>
		<image :src="staticUrl + 'video/back.png'" mode="" class="header-left" v-else @click="onBack"></image>
		<view class="header-center">
			<view class="header-item" v-if="videoHas">
				<text class="header-item-title" :class="{'select-title': current === 0}" :style="{color: headerScroll?'#333333':'#FFFFFF'}">视频</text>
				<view class="header-item-line" :class="{'activate-line': current === 0, 'activate-line-p': headerScroll&&current === 0}"></view>
			</view>
			<view class="header-item">
				<text class="header-item-title" :class="{'select-title': current === 1}" :style="{color: headerScroll?'#333333':'#FFFFFF'}">详细资料</text>
				<view class="header-item-line" :class="{'activate-line': current === 1, 'activate-line-p': headerScroll&&current === 1}"></view>
			</view>
		</view>
		<block v-if="isShowMore">
			<image :src="staticUrl + 'video/more_black.png'" mode="" class="header-right" v-if="headerScroll" @click="onMore"></image>
			<image :src="staticUrl + 'video/more.png'" mode="" class="header-right" v-else @click="onMore"></image>
		</block>
	</view>
</template>
<script>
	export default {
		props: {
			statusBarHeight: {
				default: 0
			},
			current: {
				default: 0
			},
			headerScroll: {
				default: false
			},
			videoHas: {
				default: false
			},
			isShowMore: {
				default: false
			}
		},
		data() {
			return {
				staticUrl: getApp().staticUrl || this.$staticUrl
			}
		},
		methods: {
			onBack(){
				uni.navigateBack()
			},
			onMore(){
				this.$emit("onMore")
			}
		}
	}
</script>

<style scoped>
	.scroll-bg{
		background-color: #FFFFFF;
		box-shadow: 0 20rpx 20rpx rgba(0,0,0,0.1);
		/* padding-bottom: 30rpx; */
	}
	.header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
		/* background-color: #13BB24; */
	}

	.header-center {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.header-left,
	.header-right {
		height: 60rpx;
		width: 60rpx;
		line-height: 100rpx;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
	}

	.header-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.header-item-title {
		width: 160rpx;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		/* color: #FFFFFF; */
		font-size: 32rpx;
		font-weight: 600;
	}
	.select-title{
		font-size: 38rpx !important;
	}

	.header-item-line {
		height: 8rpx;
		line-height: 8rpx;
		width: 40rpx;
		border-radius: 10rpx;
	}
	.activate-line {
		background-color: #FFFFFF;
	}
	.activate-line-p{
		background-color: #381895;
	}
</style>
