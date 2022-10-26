<template>
	<view class="pay-type-list">

		<view class="type-item b-b" v-for="item in payments" :key="item.code"
			  report-submit="true" @click="toPayHandler(item.code)"
			  v-if="!(type == 2 && item.code == 'balancepay')">
			<!-- <text class="icon yticon icon-weixinzhifu"></text> -->
			<image :src="item.img" style="width: 80upx;height: 80upx;margin-right: 20upx;"></image>
			<view class="con">
				<text class="tit">{{ item.name }}</text>
				<text>{{ item.memo }}</text>
			</view>
		</view>
	</view>

</template>

<script>
import { apiBaseUrl } from '@/config/config.js'
import Api from '@/common/api';
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
			payments: [],
			imgList: [
				'/static/image/wechatpay.png','/static/image/balancepay.png','/static/image/payment_balance.png',
			]
		}
	},
	mounted () {
		this.getPayments()
	},
	methods: {
		// 获取可用支付方式列表
		async getPayments () {

			let params = {};
			this.orderInfo = await Api.apiCall('get',Api.order.paymentlist,params);
			this.payments = this.formatPayments(this.orderInfo)
			for(var i = 0;i < this.payments.length;i++){
				this.payments[i].img = this.imgList[i]
			}
			console.log('------',this.payments)
		},

		// 支付方式处理
		formatPayments (payments) {
			// 过滤支付宝支付
			payments = payments.filter(item => item.code !== 'alipay')

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

			let params = {'orderId':this.orderId,
				payment_type: this.type};


			// 判断订单支付类型
			if (this.type == 2 && this.recharge) {

			}else if ((this.type == 5 || this.type == 6) && this.recharge) {

			}
			let _this = this
			switch (code) {
				case 'wechatpay':

					let res = await Api.apiCall('post',Api.order.weixinAppletPay,params);
					console.log(res);
					if (res) {

						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.timeStamp,
							nonceStr: res.nonceStr,
							package: res.package,
							signType: res.signType,
							paySign: res.paySign,
							success: function (e) {
								if (e.errMsg === 'requestPayment:ok') {
									_this.$common.successToShow(res.msg, () => {
										_this.$common.redirectTo('/pages/order/payment/result?id=' + res.id)
									})
								}
							}
						});
					} else {
						this.$common.errorToShow(res.msg)
					}

				break
				case 'balancepay':
				/**
				 *  用户余额支付
				 *
				 */
				let params1 = {'orderId':this.orderId};
					let data1 = await Api.apiCall('post',Api.order.balancePay,params1);
					console.log(data1)
					if (data1) {
						uni.redirectTo({
							url: '/pages/order/payment/result?order=' + JSON.stringify(data1)
						})
					}else {
						this.$api.msg('余额支付失败');
					}
				break
				case 'offline':
				/**
				 * 线下支付
				 */
				this.$common.modelShow('线下支付说明', '请联系客服进行线下支付', () => {},false, '取消', '确定')
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
