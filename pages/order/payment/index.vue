<template>
	<view class="app">
		
		<view class="bg-w flex flex-column flex-center">
			<text class="color-b3 font28" style="margin-top: 30rpx;">支付剩余时间 {{m}}:{{s}}</text>
			<view class="flex flex-space-around">
				<view class="price-box" v-if="orderInfo.payRmbAmount">
					<text>支付金额</text>
					<text class="price">{{orderInfo.payRmbAmount}}</text>
				</view>
				<view class="price-box" v-if="orderInfo.payIntegralAmount">
					<text>支付积分</text>
					<text class="price">{{orderInfo.payIntegralAmount}}</text>
				</view>
			</view>
		</view>
		
		<view class="pay-type-list" v-if="orderInfo.payIntegralAmount">
			<view class="type-item">
				<text class="icon iconfont" style="color: #21ac82; font-size: 54rpx;">&#xe61e;</text>
				<view class="con">
					<text class="tit">积分余额</text>
					<text>{{walletInfo.integral}}</text>
				</view>
			</view>
		</view>
		
		<view class="pay-type-list">
			<view class="type-item" v-for="item in paymentss" :key="item.code" @click="toPayHandler(item.code)">
				<text v-if=" item.code == 'wechat'" class="icon iconfont" style="color: #1fb922;">&#xe62b;</text>
				<text v-if=" item.code == 'alipay'" class="icon iconfont" style="color: #1aa1e6; font-size: 60rpx;">&#xe715;</text>
				<text v-if=" item.code == 'offline'" class="icon iconfont" style="color: #1fb922;">&#xe62b;</text>
				<text v-if=" item.code == 'balance'" class="icon iconfont" style="color: #de421b; font-size: 60rpx;">&#xe61c;</text>
				<text v-if=" item.code == 'balanceintegration'" class="icon iconfont" style="color: #21ac82; font-size: 54rpx;">&#xe61e;</text>
				<text v-if=" item.code == 'balancejingping'" class="icon iconfont" style="color: #de421b; font-size: 54rpx;">&#xe637;</text>
				<text v-if=" item.code == 'applepay'" class="icon iconfont" style="color: #000000;">&#xe600;</text>
				<view class="con">
					<text class="tit">{{ item.name }}</text>
					<text>{{ item.memo }}</text>
				</view>
			</view>
			<view class="type-item" v-for="item in cards" :key="item.id" @click="cardPay(item.id)">
				<!-- <text class="icon iconfont" style="color: #21ac82; font-size: 54rpx;">&#xe61e;</text> -->
				<text class="icon iconfont" style="color: #de421b; font-size: 54rpx;">&#xe637;</text>
				<!-- <text v-if=" item.code == 'applepay'" class="icon iconfont" style="color: #000000;">&#xe600;</text> -->
				<view class="con">
					<text class="tit">{{ item.name }}{{item.amount}}元</text>
					<text>{{ item.tdescribe }}</text>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<text class="title">登入密码</text>
				<view class="form">
					<text>登入密码</text>
					<input type="password" v-model="password" placeholder="请输入登入密码" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
				</view>
				<view class="flex flex-align-center flex-space-around">
					<button type="default" class="btn" @click="closePopup">取消</button>
					<button type="primary" :loading="loading" :disabled="loading" class="btn bg-base" @click="onConfirm">确认</button>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import imMix from "../../order/imMix.js"
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	let timer = null
    export default {
		components: { uniPopup },
		mixins:[imMix],
        data () {
            return {
				loading: false,
                orderId: 0,
                orderInfo: {}, // 订单详情
				walletInfo: {},
				paymentss: [
					{code: "wechat", name: "微信", memo: "微信支付"},
					{code: "alipay", name: "支付宝", memo: "支付宝支付"},
					{code: "balance", name: "余额", memo: "余额支付"}
				],
				m: "00",
				s: "00",
				cards: [],
				orderData: {},
				rsaKey: "",
				password: ""
            }
        },
        onLoad (opt) {
			let orderData = uni.getStorageSync("orderData")
			if (orderData) {
				this.orderData = orderData
				this.orderId = orderData.orderId
				this.getOrderInfo()
				uni.removeStorageSync("orderData")
			}
			this.$http("GET", url.login.getPublicKey).then(res => {
				this.rsaKey = res.data
			})
        },
		onHide() {
			clearInterval(timer)
			timer = null;
		},
		onUnload() {
			clearInterval(timer)
			timer = null;
		},
        methods: {
			async getOrderInfo () {
				let res = await this.$http('get', url.order.getPayOrderInfo, {orderId: this.orderId});
				this.orderInfo = res.data
				if (res.data.payIntegralAmount){
					this.getWalletInfo()
				}
				this.cards = res.data.cards || []
				// 倒计时
				if (timer){
					clearInterval(timer)
				} else {
					let payExpireTime = this.orderInfo.payExpireTime
					timer = setInterval(()=>{
						let nowTime = new Date().getTime()
						let leftTime = parseInt(payExpireTime - nowTime)
						if (leftTime >=0) {
							this.m = Math.floor(leftTime/1000/60%60);  
							this.s = Math.floor(leftTime/1000%60);  
							if (this.m.toString().length === 1) this.m = "0" + this.m
							if (this.s.toString().length === 1) this.s = "0" + this.s
						} else {
							clearInterval(timer)
							timer = null
						}
					}, 1000)
				}
				
            },
			getWalletInfo(){
				this.$http("GET", url.user.getWalletInfo).then(res =>{
					this.walletInfo = res.data
				})
			},
			closePopup(){
				this.$refs.popup.close()
			},
			async onConfirm(){
				if (!this.password) return this.$msg("请输入登入密码")
				if (this.loading) return
				this.loading = true
				uni.showLoading({
					mask:true
				})
				let password = await publics.passwordEncryption(this.rsaKey, this.password)
				console.log("余额支付参数。。。。", this.orderId, password)
				this.$http("POST", url.pay.balancePay, {orderId: this.orderId, loginPwd: password}).then(res =>{
					console.log("支付成功。。。。。。", res.data)
					this.requestPayment(null, res.data)
				}).catch(()=>{
					this.loading = false
					uni.hideLoading()
				})
			},
			toPayHandler(code){
				if (code === "balance") {
					this.$refs.popup.open()
					return
				}
				let _this = this
				uni.showLoading({
					mask:true
				})
				let type = null
				let path = null
				if (code === "alipay"){
					path = url.pay.aliPay
					type = "alipay"
				} else if(code === "wechat") {
					path = url.pay.wechatPay
					type = "wxpay"
				}
				this.$http("GET", path, {orderId: this.orderId}).then(res =>{
					this.requestPayment(type, res.data)
				}).catch((err)=>{
					uni.hideLoading()
					let resErr = err.res
					if (resErr.data.code === 15001) {
						this.$msg(resErr.data.msg)
						uni.redirectTo({
							url: '/pages/order/payment/result?orderInfo=' + JSON.stringify(this.orderInfo)
						})
					}
				})
			},
			// 支付成功后跳转结果页
			requestPayment(type, data){
				let _this = this
				if (!type) { // 余额支付/消费卡支付
					this.imSend()
					this.$msg("支付成功");
					uni.redirectTo({
						url: '/pages/order/payment/result?orderInfo=' + JSON.stringify(this.orderInfo)
					})
				} else { // 第三方支付
					uni.requestPayment({
						provider: type,
						orderInfo: data,
						success: function(res){
							uni.hideLoading()
							_this.checkPayResult()
						},
						fail:function(err){
							console.log("err..........")
							uni.hideLoading()
							_this.$msg("支付失败")
						}
					});
				}
			},
			// 检测第三方支付结果
			checkPayResult(){
				uni.showLoading({
					mask:true,
					title:"正在检测第三方支付结果..."
				})
				setTimeout(()=>{
					this.$http("GET", url.pay.checkPay, {orderId: this.orderId}).then(doc=>{
						uni.hideLoading()
						this.imSend()
						this.$msg("支付成功");
						uni.redirectTo({
							url: '/pages/order/payment/result?orderInfo=' + JSON.stringify(this.orderInfo)
						})
					}).catch(()=>{
						this.$msg("支付失败")
						uni.hideLoading()
					})
				}, 1000)
				
			},
			// 消费卡支付
			cardPay(id){
				uni.showLoading({
					mask:true
				})
				this.$http("POST", url.pay.cardPay, {orderId: this.orderId, cardId: id}).then(res =>{
					this.requestPayment(null)
					uni.hideLoading()
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			imSend(){
				// 精品商品不向商家发送消息
				if (this.orderData.orderType !== 2) {
					let toImAccount = this.orderData.toImAccount
					this.isOtherOnline(toImAccount, "placeOrder")
					this.sessionOperation(toImAccount, 3, ()=>{
						let goodsInfo = {
							orderId: this.orderId,
							goodsId: this.orderData.goodsId,
							goodsImage: this.orderData.goodsImage,
							goodsName: this.orderData.goodsName,
							skuName: this.orderData.skuName,
							price: this.orderData.price,
							number: this.orderData.number,
							identity: toImAccount, // 身份标示，商家的imAccount
						}
						this.sendMsgToOther(toImAccount, goodsInfo, 8, 3)
					})
				} 
			}
        }
    }
</script>
<style lang='scss' scoped>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 200upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}

		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: 32rpx;
			color: #303133;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #bbbbc4;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: 32rpx;
		color: #fff;
		background-color: #381895;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
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