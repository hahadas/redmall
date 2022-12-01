<template>
	<view class="main">
		<view class="box">
			<image :src="storeInfo.logoImage" mode="" class="logo"></image>
			<text class="font34 color-b3 name">{{storeInfo.name}}</text>
			<text class="font30 color-b9">付款金额</text>
			<text class="color-purple money" v-if="amount">¥{{amount.toFixed(2)}}</text>
			<view class="bom">
				<text class="font28 color-b9" v-if="bonusPoints">商家赠送积分数量：{{bonusPoints}}</text>
				<view class="flex flex-column btn">
					<view class="item" @click="openModal">
						<text class="iconfont icon" style="color: #de421b;">&#xe61c;</text>
						<text>余额支付</text>
					</view>
					<view class="item" @click="onPay('wxpay')">
						<text class="iconfont icon" style="color: #1fb922;">&#xe62b;</text>
						<text>微信支付</text>
					</view>
					<view class="item" @click="onPay('alipay')">
						<text class="iconfont icon" style="color: #1aa1e6;">&#xe715;</text>
						<text>支付宝支付</text>
					</view>
				</view>
			</view>
		</view>
		
		<key-words
			:mix="true" 
			:show_key="show" 
			:show_forgetFuc="true"
			@closeFuc="show = false" 
			@getPassword="balancePay">
		</key-words>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import keyWords from "@/components/bian-keywords/index.vue"
	export default{
		components: { keyWords },
		data(){
			return {
				codeResultData: {},
				storeInfo: {},
				amount: "",
				bonusPoints: "",
				payData: null,
				rsaKey: "",
				show: false,
				userInfo: {}
			}
		},
		onLoad() {
			let codeResultData = uni.getStorageSync("codeResultData")
			this.codeResultData = codeResultData
			uni.removeStorageSync("codeResultData")
			this.$http("GET", url.user.getCollectionInfo, codeResultData).then(res => {
				this.amount = res.data.amount
				this.bonusPoints = res.data.bonusPoints
				this.payData = res.data.payData
				this.storeInfo = res.data.storeInfo
			})
			this.$http("GET", url.login.getPublicKey).then(res => {
				this.rsaKey = res.data
			})
		},
		onShow(){
			this.$http("GET", url.user.getUserInfoBasic).then(res =>{
				this.userInfo = res.data
			})
		},
		methods:{
			openModal(){
				if (!this.userInfo.isSetPayPwd) {
					this.$showModal('您未设置支付密码,请先去设置', null, res =>{
						if (res.confirm) {
							this.$navigateTo('/pages/setting/payPwd')
						}
					})
					return
				}
				this.show = true
			},
			// 余额支付
			async balancePay(msg){
				uni.showLoading({
					mask:true
				})
				let params = {
					type: this.codeResultData.type,
					payData: this.payData,
					payPwd: await publics.passwordEncryption(this.rsaKey, msg)
				}
				this.$http("POST", url.user.scanBalancePay, params).then(res =>{
					this.$msg(res.data)
					this.closePopup()
					this.$navigateBack(1, 500)
					uni.hideLoading()
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 第三方支付
			onPay(type){
				uni.showLoading({
					mask:true
				})
				let path = url.pay.scanWechat
				if (type === "alipay") {
					path = url.pay.scanAli
				}
				let params = {
					amount: this.amount,
					type: this.codeResultData.type,
					payData: this.payData
				}
				this.$http("GET", path, params).then(res =>{
					this.requestPayment(type, res.data)
				}).catch((err)=>{
					uni.hideLoading()
				})
			},
			requestPayment(type, data){
				let _this = this
				uni.requestPayment({
					provider: type,
					orderInfo: data.paymentInfo,
					success: function(res){
						uni.hideLoading()
						_this.checkPayResult(data.collectionPayData)
					},
					fail:function(err){
						uni.hideLoading()
						_this.$msg("支付失败")
					}
				});
			},
			checkPayResult(payData){
				uni.showLoading({
					mask:true,
					title:"正在验证付款状态，请稍后…"
				})
				setTimeout(()=>{
					this.$http("GET", url.pay.scanPayCheck, {collectionPayData: payData}).then(doc=>{
						uni.hideLoading()
						this.$msg("支付成功");
						this.$navigateBack(1, 500)
					}).catch(()=>{
						this.$msg("支付失败")
						uni.hideLoading()
					})
				}, 1000)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: white;
		min-height: 100vh;
		padding: 0 50rpx;
	}
	.box{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 100rpx;
		.logo{
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
		}
		.name{
			margin-bottom: 200rpx;
		}
		.money{
			font-size: 70rpx;
		}
		.bom{
			margin-top: 200rpx;
			width: 100%;
			text-align: center;
		}
		.btn{
			width: 90%;
			margin-left: 5%;
			margin-top: 20rpx;
			padding-bottom: 50rpx;
			.item{
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx solid #b7addc;
				// background-color: rgba($color: #381895, $alpha: 0.3);
				border-radius: 16rpx;
				width: 100%;
				height: 100rpx;
				color: #381895;
				margin-bottom: 20rpx;
				.icon{
					font-size: 50rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
	.popup{
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx;
		.title{
			display: block;
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		.form{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 20rpx;
			color: #333333;
		}
		.btn{
			width: 40%;
		}
	}
</style>
