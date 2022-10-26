<template>
	<view class="pay-type-list">

		<view class="type-item b-b" v-for="item in paymentss" :key="item.code" @click="toPayHandler(item.code)"
			  v-if="!(type == 2 && item.code == 'balancepay')">
			<text v-if=" item.code == 'wechatpay'" class="icon iconfont" style="color: #1fb922;">&#xe62b;</text>
			<text v-if=" item.code == 'alipay'" class="icon iconfont" style="color: #1aa1e6; font-size: 60rpx;">&#xe715;</text>
			<text v-if=" item.code == 'offline'" class="icon iconfont" style="color: #1fb922;">&#xe62b;</text>
			<text v-if=" item.code == 'balancepay'" class="icon iconfont" style="color: #de421b; font-size: 60rpx;">&#xe61c;</text>
			<text v-if=" item.code == 'balanceintegration'" class="icon iconfont" style="color: #21ac82; font-size: 54rpx;">&#xe61e;</text>
			<text v-if=" item.code == 'balancejingping'" class="icon iconfont" style="color: #de421b; font-size: 54rpx;">&#xe637;</text>
			<text v-if=" item.code == 'applepay'" class="icon iconfont" style="color: #000000;">&#xe600;</text>

			<view class="con">
				<text class="tit">{{ item.name }}</text>
				<text>{{ item.memo }}</text>
			</view>
		</view>
	</view>


</template>

<script>

import url from '@/common/http/url.js';
import publics from "@/common/utils/public.js"
export default {
	props: {
		// 如果是商品订单此参数必须
		orderId: {
			type: String,
			default () {
				return ''
			}
		},
		// 如果是充值订单此参数必须
		recharge: {
			type: Number,
			default () {
				return 0
			}
		},
		// 用户id
		uid: {
			type: Number,
			default () {
				return 0
			}
		},
		// 订单类型
		type: {
			type: Number,
			default () {
				return 1
			}
		}
	},
	data () {
		return {
			paymentss: [],
			iap:null
		}
	},
	mounted () {
		this.getPayment()
		//this.getApplePay();
	},
	methods: {
		// 获取可用支付方式列表
		async getPayment () {
			console.log('getPayments')
			let params = {};
			let res = await this.$http('get',url.order.paymentlist,params,true);
			this.orderInfo = res.data
			this.paymentss = this.formatPayments(this.orderInfo)

		},
		// 支付方式处理
		formatPayments (payments) {
			// 如果是充值订单 过滤余额支付 过滤非线上支付方式
			if (this.type === 2) {
				payments = payments.filter(item => item.code !== 'balancepay' || item.is_online === 1)
			}

			// 设置logo图片
			payments.forEach(item => {
				this.$set(item, 'icon', '/static/image/' + item.code + '.png')
			})
			return payments
		},
		// 用户点击支付方式处理
		async toPayHandler (code) {
			let _this = this;
			let params = {'orderId':this.orderId};
			let data = {
				payment_code: code,
				payment_type: _this.type
			}

			data['ids'] = (this.type == 1 || this.type == 5 || this.type == 6) ? this.orderId : this.uid
			 if ((this.type == 5 || this.type == 6) && this.recharge) {
				data['params'] = {
					trade_type: 'APP',
					formid: this.orderId
				}
			}
			switch (code) {
				case 'alipay':
				/**
				 * 支付宝支付需要模拟GET提交数据
				 */
				if (_this.type == 1 && _this.orderId) {
					data['params'] = {
						trade_type: 'APP'
					}
				} else if (_this.type == 2 && _this.recharge) {
					data['params'] = {
						trade_type: 'APP',
						money: _this.recharge
					}
				}

					let res = await this.$http('get',url.order.aliAppPay,params,true);
					if (res) {
						uni.requestPayment({
							provider: "alipay",
							orderInfo: res.order,
							success: function(data){
								publics.findByOrderIdPayStatus(_this.orderId);
								_this.$msg("支付成功");
								uni.redirectTo({
									url: '/pages/order/payment/result?order=' + JSON.stringify(res.orderInfo)
								})
							}
						});
					} else {
						_this.$msg(res.msg)
					}

				break
				case 'wechatpay':
					// 微信 H5支付
					if (_this.type == 1 && _this.orderId) {
						data['params'] = {
							trade_type: 'APP'
						}
					} else if (_this.type == 2 && _this.recharge) {
						data['params'] = {
							trade_type: 'APP',
							money: _this.recharge
						}
					}

					// 微信app支付
					let resData = await this.$http('get',url.order.appPay,params);
					let resD = resData.data
					if (resD) {
							// 调用微信支付
							uni.requestPayment({
								provider: "wxpay",
								orderInfo: resD,
								success: function(data){
									publics.findByOrderIdPayStatus(_this.orderId);
									_this.$msg("支付成功");
									uni.redirectTo({
										url: '/pages/order/payment/result?id=' + data
									})
								},
								fail:function(err){
									console.log(JSON.stringify(err));
								}
							});
						} else {
							_this.$msg(resD.msg)
						}

					break
				case 'balancepay':
					/**
					 *  用户余额支付
					 *
					 */
					let params1 = {'orderId':this.orderId};
					let res1 = await this.$http('post',url.order.balancePay,params1);
					let data = res1.data
					if (data) {
						uni.redirectTo({
							url: '/pages/order/payment/result?order=' + JSON.stringify(data)
						})
					}
					break
				case 'balanceintegration':
					/**
					 *  用户积分支付
					 *
					 */
					let params2 = {'orderId':this.orderId};
					let res2 = await this.$http('post',url.order.balanceintegrationPay,params2);
					if (res2.data) {
						uni.redirectTo({
							url: '/pages/order/payment/result?order=' + JSON.stringify(res2.data.data)
						})
					}
					break
				case 'balancejingping':
					/**
					 *  用户精品券支付
					 *
					 */
					let params3 = {'orderId':this.orderId};
					let res3 = await this.$http('post',url.order.balancejingpingPay,params3);
					if (res3.data) {
						uni.redirectTo({
							url: '/pages/order/payment/result?order=' + JSON.stringify(res3.data.data)
						})
					}
					break
				case 'applepay':
					// applepay
					this.applePay();
					break
				case 'offline':
					/**
					 * 线下支付
					 */
					_this.$showModal('请联系客服进行线下支付', '线下支付说明')
					break
				}
		},
		getApplePay(){
			console.log("获取苹果支付渠道===");
			let that = this;
			var ids=['uni.UNI7D57679.pay001'];//应用内购项目
			// 获取苹果支付渠道
			plus.payment.getChannels(function(channels){
				for(var i in channels){
					var channel=channels[i];
					if(channel.id==='appleiap'){
						that.iap=channel;
					}
				}
				
				that.iap.requestOrder(ids,function(e){
					console.log('requestOrder success: '+JSON.stringify(e));
				},function(e){
					console.log('requestOrder failed: '+JSON.stringify(e));
					plus.nativeUI.confirm("错误信息："+JSON.stringify(e), function(e){
						if(e.index==0){
							requestOrder();
						}else{
							back();
						}
					}, '重新请求支付',['确定','取消']);
				});
			},function(e){
				console.log("获取支付通道失败："+e.message);
			});
		},
		applePay(){
			console.log("=====支付");
			plus.payment.request(this.iap, {productid:'uni.UNI7D57679.pay001'}, function(result){
				console.log(JSON.stringify(result));
				plus.nativeUI.alert("支付成功：感谢你的支持，我们会继续努力完善产品。", function(){
					back();
				}, "捐赠");
			},function(e){
				plus.nativeUI.alert("错误信息："+e.message,null,"支付失败："+e.code);
			});
			console.log("=====支付end");
		}
	}

}
</script>
<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
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
			color: #999;
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

</style>

