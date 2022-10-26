<template>
	<view>
		<video ref="myVideo" id="myVideo" :src="src" :controls="false" loop autoplay style="width: 750rpx;" :style="{height: screenHeight + 'px'}"
		 @play="onplay" @error="onerror" @timeupdate="timeupdate" :show-play-btn="false" :show-center-play-btn="false" :enable-progress-gesture="false" :enable-play-gesture="false" :vslide-gesture="false" :vslide-gesture-in-fullscreen="false"></video>
	</view>
</template>

<script>
	export default {
		name: "video",
		props: {
			screenHeight: {
				default: 0
			},
			src: {
				default: false
			},
			playStatus: {
				default: false
			}
		},
		data() {
			return {

			}
		},
		created() {

		},
		watch: {
			playStatus: function(val) {
				console.log("playStatus", val);
				if (!val) {
					uni.createVideoContext('myVideo').pause();
				} else {
					uni.createVideoContext('myVideo').play();
				}
			}
		},
		methods: {
			onplay: function(e) {
				if (uni.getSystemInfoSync().platform == 'ios') {
					this.$emit("play", 0.1);
				}
			},
			onerror: function(err) {
				console.log(err);
			},
			timeupdate: function(e) {
				if (e.detail.currentTime > 0.2) {
					this.$emit("play", e.detail.currentTime);
				}
			}
		}
	}
</script>

<style>

</style>
