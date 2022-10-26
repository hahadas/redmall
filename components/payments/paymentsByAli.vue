<template>
	<view class="pay-type-list">

		<view class="type-item b-b" v-for="item in payments" :key="item.code" @click="toPayHandler(item.code)"
			  v-if="!(type == 2 && item.code == 'balancepay')">
			<text v-if=" item.code == 'wechatpay'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'alipay'" class="icon yticon icon-alipay"></text>
			<text v-if=" item.code == 'offline'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'balancepay'" class="icon yticon icon-erjiye-yucunkuan"></text>

			<view class="con">
				<text class="tit">{{ item.name }}</text>
				<text>{{ item.memo }}</text>
			</view>
		</view>
	</view>

</template>

<script>
import url from '@/common/http/url.js';
export default {
	props: {
		// 如果是商品订单此参数必须
		orderId: {
			type: String,
			default () {
				return '';
			}
		},
		// 如果是充值订单此参数必须
		recharge: {
			type: Number,
			default () {
				return 0;
			}
		},
		// 用户id
		uid: {
			type: Number,
			default () {
				return 0;
			}
		},
		// 订单类型
		type: {
			type: Number,
			default () {
				return 1;
			}
		}
	},
	data () {
		return {
			payments: []
		}
	},
	mounted () {
		this.getPayments();
	},
	methods: {
		// 获取可用支付方式列表
		async getPayments () {

			let params = {};
			let res = await this.$http('GET',Api.order.paymentlist,params);
			this.orderInfo = res.data
			this.payments = this.formatPayments(this.orderInfo)

		},
		// 支付方式处理
		formatPayments (payments) {
			payments = payments.filter(item => item.code !== 'wechatpay');


			// 如果是充值订单 过滤余额支付 过滤非线上支付方式
			if (this.type === 2) {
				payments = payments.filter(item => item.code !== 'balancepay' || item.is_online === 1)
			}

			// 设置logo图片
			payments.forEach(item => {
				this.$set(item, 'icon', '/static/image/' + item.code + '.png');
			});

			return payments;
		},
		// 用户点击支付方式处理
		async toPayHandler (code) {
			let params = {'orderId':this.orderId};
			let data = {
				payment_code: code,
				payment_type: this.type
			}
			data['ids'] = (this.type == 1 || this.type == 5 || this.type == 6) ? this.orderId : this.uid

			// 判断订单支付类型
			if (this.type == 2 && this.recharge) {
				data['params'] = {
					money: this.recharge,
					trade_type: 'JSAPI'
				}
			} else if ((this.type == 5 || this.type == 6) && this.recharge) {
				data['params'] = {
					trade_type: 'JSAPI',
					formid: this.orderId
				}
			}else {
				data['params'] = {
					trade_type: 'JSAPI'
				}
			}


			let _this = this;
			switch (code) {
				case 'alipay':
					let resData = await this.$http('GET',url.order.webPay,params);
					let res = resData.data
					console.log(res);
					if (res) {
							uni.requestPayment({
								provider: 'alipay',
								tradeNO:res.data.trade_no,
								success: function (e) {
									if (e.errMsg === 'requestPayment:ok') {
										this.$msg(res.msg);
										uni.redirectTo({
											url: '/pages/order/payment/result?id=' + res.data.id
										})
									}
								}
							});
						} else {
							this.$msg(res.msg);
						}
					}
					break
				case 'balancepay':
					//用户余额支付
					let params = {'orderId':this.orderId};
					let res = await this.$http('POST',url.order.balancePay,params);
					console.log(data1)
					let data = res.data
					if (data) {
						uni.redirectTo({
							url: '/pages/order/payment/result?order=' + JSON.stringify(data)
						})
					}else {
						this.$msg('余额支付失败');
					}
					break;
				case 'offline':
					//线下支付
					this.$showModal('线下支付说明', '请联系客服进行线下支付')
					break;
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
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
