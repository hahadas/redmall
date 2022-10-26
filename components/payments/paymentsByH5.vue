<template>
	<view class="pay-type-list">

		<view class="type-item" v-for="item in payments" :key="item.code" @click="toPayHandler(item.code)"
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
	<!--<view class='cell-group payment-method'>
		<view class='cell-item add-title-item' v-for="item in payments" :key="item.code" @click="toPayHandler(item.code)"
		 v-if="!(type == 2 && item.code == 'balancepay')">
			<view class='cell-item-hd'>
				<image class='cell-hd-icon' :src='item.icon'></image>
			</view>
			<view class='cell-item-bd'>
				<view class="cell-bd-view">
					<text class="cell-bd-text">{{ item.name }}</text>
				</view>
				<view class="cell-bd-view">
					<text class="cell-bd-text address">{{ item.memo }}</text>
				</view>
			</view>
			<view class='cell-item-ft'>
				<image class='cell-ft-next icon' src='../../../static/image/right.png'></image>
			</view>
		</view>
	</view>-->
</template>

<script>
	import {
		isWeiXinBrowser
	} from '@/common/utils/index.js'
	import url from '@/common/http/url.js';
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
		data() {
			return {
				payments: [],
				openid: ''
			}
		},
		mounted() {
			this.getPayments()
		},
		methods: {
			// 获取可用支付方式列表
			async getPayments() {
				let params = {};
				let res = await this.$http('get',url.order.paymentlist,params);
				this.orderInfo = res.data
				this.payments = this.formatPayments(this.orderInfo)
			},
			// 支付方式处理
			formatPayments(payments) {
				// h5支付并且是在微信浏览器内 过滤支付宝支付
				if (isWeiXinBrowser()) {
					payments = payments.filter(item => item.code !== 'alipay')
				}

				// 如果是充值订单 过滤余额支付 过滤非线上支付方式
				if (this.type === 2) {
					payments = payments.filter(
						item => item.code !== 'balancepay' || item.is_online === 1
					)
				}

				// 设置logo图片
				payments.forEach(item => {
					this.$set(item, 'icon', '/static/image/' + item.code + '.png')
				})
				console.log(payments)
				return payments
			},
			checkWXJSBridge(data) {
				let that = this
				let interval = setInterval(() => {
					if (typeof window.WeixinJSBridge != 'undefined') {
						clearTimeout(interval)
						that.onBridgeReady(data)
					}
				}, 200)
			},
			onBridgeReady(data) {
				var _this = this
				window.WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						appId: data.appid, // 公众号名称，由商户传入
						timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
						nonceStr: data.nonceStr, // 随机串
						package: data.package,
						signType: data.signType, // 微信签名方式：
						paySign: data.paySign // 微信签名
					},
					function(res) {
						if (res.err_msg === 'get_brand_wcpay_request:ok') {
							_this.$msg('支付成功')
						} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
							_this.$msg('取消支付')
						} else {
							_this.$msg('支付失败')
						}
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/order/result?id=' + data.payment_id
							})
						}, 1000)
					}
				)
			},
			// 用户点击支付方式处理
			async toPayHandler(code) {
				let params = {'orderId':this.orderId};
				let data = {
					payment_code: code,
					payment_type: this.type
				}
				data['orderId'] = (this.type == 1 || this.type == 5 || this.type == 6) ? this.orderId : this.uid
				switch (code) {
					case 'alipay':
						/**
						 * 支付宝支付需要模拟GET提交数据
						 */
						if (this.type == 1 && this.orderId) {
							data['params'] = {
								trade_type: 'WAP',
								return_url: baseUrl +
									'wap/#/pages/order/result'
							}
						} else if (this.type == 2 && this.recharge) {
							data['params'] = {
								money: this.recharge,
								return_url: baseUrl + 'wap/#/pages/order/result'
							}
						} else if ((this.type == 5 || this.type == 6) && this.recharge) {
							data['params'] = {
								orderId: this.orderId
							}
						}

						let res = await this.$http('get',url.order.aliWapPay,params);
						console.log('============================')
						console.log(res);
						console.log('success:' + JSON.stringify(res));
						if (res) {

							document.body.appendChild(JSON.stringify(res.data))
							let testForm = document.getElementsByName('punchout_form')
								// 模拟GET提交
								/*
									const url = res.data.url
								const data = res.data.data
								let tempForm = document.createElement('form')
								tempForm.id = 'aliPay'
								tempForm.methods = 'post'
								tempForm.action = url
								tempForm.target = '_self'
								let input = []
								for (let k in data) {
									input[k] = document.createElement('input')
									input[k].type = 'hidden'
									input[k].name = k
									input[k].value = data[k]
									tempForm.appendChild(input[k])
								}
								tempForm.addEventListener('submit', function() {}, false)
								document.body.appendChild(tempForm)*/
							testForm.dispatchEvent(new Event('submit'))
							    console.log(tempForm);
							testForm.submit()
								document.body.removeChild(testForm)

						}
						break
					case 'wechatpay':

						/**
						 * 微信支付有两种
						 * 判断是否在微信浏览器
						 * 	微信jsapi支付
						 */
						let isWeiXin = isWeiXinBrowser()

						if (isWeiXin) {
							var transitUrl =
								baseUrl +
								'wap/#/pages/order/paymet/auth?order_id=' +
								this.orderId +
								'&type=' +
								this.type;

							if (this.type == 1 && this.orderId) {
								// 微信jsapi支付
								// if (this.openid) {
								//   data['params'] = {
								//     trade_type: 'JSAPI_OFFICIAL',
								//     openid: this.openid
								//   }
								// } else {
								//   data['params'] = {
								//     trade_type: 'JSAPI_OFFICIAL',
								//     url: window.location.href
								//   }
								// }
								data['params'] = {
									trade_type: 'JSAPI_OFFICIAL',
									url: transitUrl
								}
							} else if (this.type == 2 && this.recharge) {
								data['params'] = {
									trade_type: 'JSAPI_OFFICIAL',
									money: this.recharge,
									url: transitUrl + '&uid=' + this.uid + '&money=' + this.recharge
								}
								// if (this.openid) {
								//   data['params'] = {
								//     money: this.recharge,
								//     openid: this.openid
								//   }
								// } else {
								//   data['params'] = {
								//     money: this.recharge,
								//     url: window.location.href
								//   }
								// }
							} else if ((this.type == 5 || this.type == 6) && this.recharge) {
								data['params'] = {
									orderId: this.orderId
								}
							}
							let res = await this.$http('get',url.order.webPay,params);
							console.log(res);
							if (res) {
								const data = res.data.data
								this.checkWXJSBridge(data)
							}else{
								window.location.href = res.data.msg
								return;
							}
						} else {
							// 微信 H5支付
							if (this.type == 1 && this.orderId) {
								data['params'] = {
									trade_type: 'MWEB',
									return_url: baseUrl +
										'wap/#/pages/order/payment/result'
								}
							} else if (this.type == 2 && this.recharge) {
								data['params'] = {
									trade_type: 'MWEB',
									money: this.recharge,
									return_url: baseUrl + 'wap/#/pages/order/payment/result'
								}
							} else if ((this.type == 5 || this.type == 6) && this.recharge) {
								data['params'] = {
									orderId: this.orderId
								}
							}
							console.log(data);
							// 微信h5支付
							let res = await this.$http('get',url.order.wapPay,params);
							console.log(res);
							if (res) {
								location.href = res.data
							} else {
								this.$msg(res.data)
							}
						}
						break
					case 'balancepay':
						/**
						 *  用户余额支付
						 *
						 */
						if ((this.type == 5 || this.type == 6) && this.recharge) {
							data['params'] = {
								orderId: this.orderId
							}
						}
						let params1 = {'orderId':this.orderId};
						let res1 = await this.$http('post',url.order.balancePay,params1);
						let data1 = res1.data
						console.log(data1)
						if (data1) {
							uni.redirectTo({
								url: '/pages/order/payment/result?order=' + JSON.stringify(data1)
							})
						}else {
							this.$msg('余额支付失败');
						}

						break
					case 'offline':
						/**
						 * 线下支付
						 */
						this.$showModal('请联系客服进行线下支付qq:951449465','线下支付说明')
						break
				}
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
