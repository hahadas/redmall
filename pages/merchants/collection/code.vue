<template>
	<view class="main bg-base">
		<view class="box">
			<view class="store">
				<image :src="storeInfo.logoImage" mode="" class="img"></image>
				<text class="font34 color-b3">{{storeInfo.name}}</text>
			</view>
			<view class="qrcode">
				<text class="color-purple font60" style="margin-bottom: 20rpx;display: block;" v-if="amount">¥{{amount}}</text>
				<tki-qrcode
					ref="qrcode"
					:val="url"
					icon="/static/logo.png"
					:size="400"
					:iconSize="30"
					:onval="true"
					></tki-qrcode>
				<text class="color-b9 font28" style="margin-top: 10rpx;" v-if="bonusPoints">赠送积分：{{bonusPoints}}</text>
			</view>
			<text class="font26 color-b9">该码只能该用户支付，并且该码只能收款一次，如需重复付款请重新生成收款码</text>
		</view>
		<view class="user color-w" v-if="scanOrPaymentUserInfo">
			<view>
				<image :src="scanOrPaymentUserInfo.headPortrait" mode="" class="logo"></image>
			</view>
			<view class="info">
				<text>{{scanOrPaymentUserInfo.nickname}}</text>
				<text style="margin-top: 10rpx;">{{scanOrPaymentUserInfo.username}}</text>
			</view>
			<text class="font26" v-if="collectionStatus">付款成功</text>
			<text class="font26" v-else>支付中...</text>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	const music = uni.createInnerAudioContext(); //创建播放器对象
	let timer = null
	export default{
		components: { tkiQrcode },
		data(){
			return {
				storeInfo: {},
				amount: "",
				url: "",
				bonusPoints: "",
				collectionStatus: false,
				scanOrPaymentUserInfo: null
			}
		},
		onLoad() {
			this.$http("GET", url.store.getStoreInfo).then(res=>{
				this.storeInfo = res.data
				// this.icon = res.data.logoImage
			})
			let data = uni.getStorageSync("collectionData")
			if (data) {
				this.url = data.data
				// this.amount = data.amount
				this.bonusPoints = data.bonusPoints
				console.log("......url....", this.url)
				uni.removeStorageSync("collectionData")
				setTimeout(()=> {
					this.$refs.qrcode._makeCode()
				}, 300)
				this.interver()
			}
		},
		methods:{
			interver(){
				let _this = this
				let result = this.url
				let r = null
				if ((result.indexOf("https") > -1 || result.indexOf("http") > -1) && result.indexOf("data") > -1){
					let reg = new RegExp("(^|&)data=([^&]*)(&|$)");
					let json = result.substr(1).match(reg)
					try{
						// r = JSON.parse(decodeURI(json[2]))
						r = JSON.parse(json[2])
					}catch(err){}
				} else {
					return
				}
				timer = setInterval(()=>{
					_this.$http("GET", url.pay.checkStoreCollection, {data: r.data}).then(res=>{
						_this.collectionStatus = res.data.collectionStatus
						_this.scanOrPaymentUserInfo = res.data.scanOrPaymentUserInfo
						_this.amount = res.data.amount
						if (res.data && res.data.collectionStatus) {
							_this.clearInter()
							music.loop = false; //循环播放
							music.src = "static/music/collection.mp3"; // 收款成功提示
							music.play(); //执行播放
							setTimeout(()=>{
								uni.redirectTo({
									url: "success?amount="+_this.amount
								})
							}, 500)
						}
					}).catch(()=>{
						_this.clearInter()
					})
				}, 600)
			},
			clearInter(){
				clearInterval(timer)
				timer = null
			}
		},
		onHide() {
			this.clearInter()
		},
		onUnload() {
			this.clearInter()
		}
	}
</script>

<style scoped lang="scss">
	.main{
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.box{
		width: 600rpx;
		min-height: 50vh;
		padding: 30rpx 30rpx 30rpx;
		background-color: white;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		.store{
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
		}
		.img{
			width: 100rpx;
			height: 100rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}
	}
	.qrcode{
		flex: 1;
		margin-bottom: 30rpx;
	}
	.user{
		width: 660rpx;
		margin: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.logo{
			width: 100rpx;
			height: 100rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}
		.info{
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			font-size: 28rpx;
		}
	}
</style>
