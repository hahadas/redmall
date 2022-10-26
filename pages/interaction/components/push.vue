<template>
	<view style="flex: 1;">
		<uni-list @change="onchange" :num="playerList.length">
			<cell :recycle="false" v-for="(item, index) in playerList" :key="index" :data-index="index" :style="{'height': screenHeight + 'px'}">
				<uni-video :src="item.ossUrl" :playStatus="playStatus" :screenHeight="screenHeight" v-if="playerCur === index" @play="onplay"></uni-video>
				<image :lazy-load="true" :fade-show="false" v-if="!item.isPlay" :src="item.ossTailoringUrl" mode="" style="width: 750rpx; filter: blur(10px);"
				 :style="{height: screenHeight+ 'px'}"></image>
				<!-- <view class="" style="position: absolute;bottom: 130rpx;left: 0;right: 0;padding-left: 20rpx;padding-right: 20rpx; flex-direction: row;justify-content: space-between;align-items: center;">
					<view class="">
						<text style="color: #FFFFFF;font-size: 32rpx;font-weight: 600;padding: 10rpx;">{{item.nickname}}</text>
						<text style="color: #FFFFFF;font-size: 28rpx;padding: 10rpx;lines: 1;width: 600rpx;text-overflow: ellipsis;">{{item.title}}</text>
						<view class="" style="flex-direction: row;align-items: center;">
							<text class="iconfont" style="color:#FFFFFF;font-size: 30rpx;">&#xe605;</text>
							<text style="color: #FFFFFF;font-size: 28rpx;padding: 10rpx;width:400rpx;">{{item.nickname}}的原声创作</text>
						</view>
					</view>
					<view class="" style="flex-direction: row;">
						<image src="/static/logo.png" mode="" style="width: 90rpx;height: 90rpx;border-radius: 100rpx;"></image>
					</view>
				</view> -->
				<!-- <view class="" style="position: absolute;top: 0;bottom: 0; right: 0;align-items: center;justify-content: center;padding-right: 20rpx;">
					<view class="" style="border-radius: 100rpx;border-color: #FFFFFF;border-width: 3rpx;">
						<image src="/static/logo.png" mode="" style="width: 90rpx;height: 90rpx;border-radius: 100rpx;"></image>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe608;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">7036</text>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe606;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">4566</text>
					</view>
					<view class="" style="flex-direction: column;align-items: center;margin-top: 40rpx;">
						<text class="iconfont" style="font-size: 66rpx;color: #FFFFFF;">&#xe600;</text>
						<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">分享</text>
					</view>
				</view> -->
			</cell>
		</uni-list>
	</view>
</template>

<script>
	import uniList from './list';
	import uniVideo from './video';
	export default {
		components: {
			uniList,
			uniVideo
		},
		props: {
			screenHeight: {
				default: 0
			},
			playStatus: {
				default: false
			},
			list: {
				default: {}
			}
		},
		data() {
			return {
				playerCur: 0,
				playerList: []
			}
		},
		created() {
			this.playerList = []
			this.list.isPlay = false
			this.playerList.push(this.list)
		},
		methods: {
			onplay: function(time) {
				if (time > 0) {
					this.playerList[this.playerCur].isPlay = true;
				}
			},
			onchange: function(index) {
				console.log(index);
				if (index != this.playerCur) {
					this.playerList[this.playerCur].isPlay = false;
					this.playerCur = index;
				}
			}
		}
	}
</script>

<style>

</style>
