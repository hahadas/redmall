<template>
	<view class="main">
		<view class="flex flex-column flex-center">
			<image :src="user.avatar" mode="aspectFill" class="avatar"></image>
			<text class="name">{{user.nickname}}</text>
			<text class="color-w font30" style="margin-top: 50rpx;">对方邀请{{callType === 'video' ? '视频' : '语音'}}您通话</text>
		</view>
		<view class="bom">
			<view class="flex flex-column flex-center">
				<view class="icon" @click="cancel">
					<image src="/static/hang_up.png" mode=""></image>
				</view>
				<text class="txt">取消</text>
			</view>
			<view class="flex flex-column flex-center">
				<view class="icon" style="background-color: #0e841b;" @click="answer">
					<image src="/static/answer.png" mode=""></image>
				</view>
				<text class="txt">接听</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				user: {},
				message: {},
				callType: 'video'
			}
		},
		onBackPress(e){
			if (e.from === "backbutton"){
				this.closeCall()
			}
			return false
		},
		onLoad() {
			let data = uni.getStorageSync("callVideoData")
			if (data){
				data = JSON.parse(data)
				uni.removeStorageSync("callVideoData")
				this.user = data
				this.message = data.message
				let content = data.message.content
				if (typeof content === "string"){
					content = JSON.parse(content)
				}
				this.callType = content.callType
			}
		},
		methods:{
			closeCall(){
				getApp().closeCall()
				getApp().sendVideoMsg(this.message, {text: "已挂断"})
				uni.setStorageSync("VideoCallMyStatus",0);
			},
			cancel(){
				this.$navigateBack()
				this.closeCall()
			},
			answer(){
				let _this = this
				// 接听时互换，为了获取对应的视频通话key
				let newMessage = JSON.parse(JSON.stringify(this.message))
				newMessage.to = this.message.from
				newMessage.from = this.message.to
				getApp().callVideo(newMessage, ret=>{
					if ((ret.code === 1)) {
						//发送取消通话的消息
						let msg = {
							text: '通话时长',
							time: ret.time
						}
						getApp().sendVideoMsg(_this.message, msg)
						
					}
				});
				this.$navigateBack()
			},
		}
	}
</script>

<style scoped lang="scss">
	.main{
		height: 100vh;
		width: 100%;
		background-color: #1d2944;
		display: flex;
		align-items: center;
		justify-content: center;
		.avatar{
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			margin-bottom: 10rpx;
		}
		.name{
			font-size: 38rpx;
			color: white;
		}
		.bom{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.icon{
				width: 110rpx;
				height: 110rpx;
				margin-bottom: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #ac5250;
				border-radius: 50%;
				image{
					width: 60rpx;
					height: 60rpx;
				}
			}
			.txt{
				color: white;
				font-size: 26rpx;
			}
		}
	}
</style>