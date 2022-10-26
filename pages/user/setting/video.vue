<template>
	<view>
		<video ref="myVideo" id="myVideo" :src="src" :controls="false" loop autoplay class="video">
			<cover-image src="/static/video/back.png" mode="" class="header-left" @click="onBack"></cover-image>
		</video>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default {
		data(){
			return{
				src:"",
				videoContext: ""
			}
		},
		onLoad(opt) {
			if (opt.sendVideo) {
				let url = uni.getStorageSync("sendVideoUrl")
				uni.removeStorageSync("sendVideoUrl")
				this.src = url
			} else {
				this.videoContext = uni.createVideoContext('myVideo')
				this.$http("GET", url.user.getUserInfoBasic).then(res =>{
					if (res.data.userResources.length > 0){
						res.data.userResources.forEach(v=>{
							if (v.type === 2) {
								this.src = v.ossUrl
							}
						})
					}
				})
			}
			
		},
		created(){
		},
		methods:{
			onBack(){
				uni.navigateBack()
			}
		},
		onHide() {
			this.videoContext.stop()
		},
		onUnload() {
			this.videoContext.stop()
		}
	}
</script>

<style scoped>
	.header-left{
		height: 60rpx;
		width: 60rpx;
		line-height: 100rpx;
		align-items: flex-start;
		justify-content: flex-end;
		position: absolute;
		left: 30rpx;
		top: var(--status-bar-height);
	}
	.video{
		width: 750rpx;
		height: 100vh;
		object-fit: fill;
	}
</style>
