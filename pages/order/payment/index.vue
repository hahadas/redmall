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
				<text class="icon iconfont" style="color: #de421b; font-size: 54rpx;">&#xe637;</text>
				<view class="con">
					<text class="tit">{{ item.name }}{{item.amount}}元</text>
					<text>{{ item.tdescribe }}</text>
				</view>
			</view>
		</view>
		
		<key-words 
			:mix="true" 
			:show_key="show" 
			:show_forgetFuc="true"
			@closeFuc="show = false" 
			@getPassword="onConfirm">
		</key-words>

	</view>
</template>

<script>
	import imMix from "../../order/imMix.js"
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import keyWords from "@/components/bian-keywords/index.vue"
	import { baseUrl } from "@/common/http/index.js"

	let timer = null
    export default {
		components: { keyWords },
		mixins:[imMix],
        data () {
            return {
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
				show: false,
				userInfo: {},
				showCheckPayStatus: false,
            }
        },
		onShow(){
			this.$http("GET", url.user.getUserInfoBasic).then(res =>{
				this.userInfo = res.data
			})
			
			let that = this
			//弹窗校验是否已支付成功
			let showCheckPayStatus = uni.getStorageSync("ShowCheckPayStatus");
			if(showCheckPayStatus){
				uni.setStorageSync("ShowCheckPayStatus",false);//取消
				uni.showModal({
					content: '是否已经支付成功？',
					cancelText: '未支付',
					confirmText: '支付成功',
					success: function (res) {
						if (res.confirm) {
							that.checkPayResult();
						}
					}
				});
			}
		},
        onLoad (opt) {
			let that = this
			this.$http("GET", url.order.getOrderInfoById, {orderId: opt.orderId}).then(res =>{
				let row = res.data
				if (row) {
					let orderData = {
						goodsId: row.goodsId,
						goodsImage: row.skuImage || row.goodsImage,
						goodsName: row.goodsName,
						skuName: row.skuName,
						price: row.unitPrice,
						number: row.number,
						orderType: row.orderType,
						toImAccount: row.storeInfo.imAccount,
						orderId: row.id
					}
					
					that.orderData = orderData
					that.orderId = orderData.orderId
					that.getOrderInfo()
				}
			});
				
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
			async onConfirm(msg){
				this.show = false
				uni.showLoading({
					mask:true
				})
				let password = await publics.passwordEncryption(this.rsaKey, msg)
				this.$http("POST", url.pay.balancePay, {orderId: this.orderId, payPwd: password}).then(res =>{
					this.requestPayment(null, res.data)
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			toPayHandler(code){
				if (code === "balance") {
					console.log(this.userInfo.isSetPayPwd)
					if (!this.userInfo.isSetPayPwd) {
						this.$showModal('您未设置支付密码,请先去设置', null, res =>{
							if (res.confirm) {
								this.$navigateTo('/pages/setting/payPwd')
							}
						})
						return
					}
					this.show = true
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
				
				let payType = 0;//支付的平台，默认0，0=app，1=wap，2=pc
				//#ifdef H5
				uni.setStorageSync("ShowCheckPayStatus",true);//开启onshow时候弹出是否已支付的弹框
				
				payType = 1;
				if(navigator.userAgent.indexOf('Mobile') === -1) {  
				  payType = 2;//pc
				}
				
				//关闭loading
				uni.hideLoading();
				
				//跳转到页面支付
				window.open(baseUrl+path+"?payType="+payType+"&orderId="+this.orderId);
				//#endif
				
				// #ifdef APP-PLUS  
				this.$http("GET", path, {payType: payType, orderId: this.orderId}).then(res =>{
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
				//#endif
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
						if(doc.payStatus){
							this.imSend()
							this.$msg("支付成功");
							uni.redirectTo({
								url: '/pages/order/payment/result?orderInfo=' + JSON.stringify(this.orderInfo)
							})
						}else{
							this.$msg("未检测到支付成功的订单，如您已支付，可联系平台客服咨询")
							uni.hideLoading()
						}
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