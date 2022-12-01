<template>
	<view style="flex: 1;">
		<!-- #ifdef APP-PLUS -->
		<uni-list @change="onchange" :num="playerList.length">
			<cell :recycle="false" v-for="(item, index) in playerList" :key="index" :data-index="index" :style="{'height': screenHeight + 'px'}">
				<uni-video 
					v-if="playerCur === index"
					:src="item.ossUrl" 
					:playStatus="playStatus" 
					:screenHeight="screenHeight" 
					@play="onplay">
				</uni-video>
				<image :lazy-load="true" :fade-show="false" v-if="!item.isPlay" :src="item.ossTailoringUrl" mode="" style="width: 750rpx; filter: blur(10px);"
				 :style="{height: screenHeight+ 'px'}"></image>
			</cell>
		</uni-list>
		<!-- #endif -->
		
		<!-- #ifndef APP-PLUS -->
		<video
			ref="myVideo" 
			id="myVideo" 
			:src="data.ossUrl" 
			:controls="true" 
			loop
			autoplay 
			style="width: 750rpx;" 
			:style="{height: screenHeight + 'px'}"
			@play="onplay"
			@error="onerror" 
			@timeupdate="timeupdate" 
			:show-play-btn="true" 
			:show-center-play-btn="false" 
			:enable-progress-gesture="false" 
			:enable-play-gesture="false" 
			:vslide-gesture="false" 
			:vslide-gesture-in-fullscreen="false">
		</video>
		<image 
			:lazy-load="true" 
			:fade-show="false" 
			v-if="!data.isPlay" 
			:src="data.ossTailoringUrl" 
			mode="" 
			style="width: 750rpx; filter: blur(10px);"
			:style="{height: screenHeight+ 'px'}">
		</image>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import uniList from './list'
	import uniVideo from './video';
	// #endif	

	export default {
		// #ifdef APP-PLUS
		components: {
			uniVideo,
			uniList
		},
		// #endif
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
		// #ifndef APP-NVUE
		watch: {
			playStatus(val) {
				if (!val) {
					uni.createVideoContext('myVideo').pause();
				} else {
					uni.createVideoContext('myVideo').play();
				}
			}
		},
		// #endif
		data() {
			return {
				playerCur: 0,
				playerList: [],
				data: {}
			}
		},
		created() {
			this.data = this.list
			this.data.isPlay = false
			this.playerList.push(this.data)
		},
		methods: {
			onplay: function(time) {
				if (uni.getSystemInfoSync().platform == 'ios') {
					this.data.isPlay = true
				}
				if (time > 0) {
					this.playerList[this.playerCur].isPlay = true;
				}
			},
			timeupdate: function(e) {
				if (e.detail.currentTime > 0.2) {
					this.data.isPlay = true
				}
			},
			onchange(index){
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
