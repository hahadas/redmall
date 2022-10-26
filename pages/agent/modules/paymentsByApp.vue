<template>
	<view class="pay-type-list">

		<view class="type-item b-b" v-for="item in paymentss" :key="item.code" @click="toPayHandler(item.code)" 
		v-if="item.code == 'alipay'">
			<text v-if=" item.code == 'alipay'" class="icon iconfont icon-alipay">&#xe715;</text>

			<view class="con" v-if="item.code == 'alipay'">
				<text class="tit">{{ item.name }}</text>
				<text>{{ item.memo }}</text>
			</view>
		</view>
		<!-- <view class="type-item b-b" v-for="item in paymentss" :key="item.code" @click="toPayHandler(item.code)" 
		v-if="item.code == 'wechatpay' || item.code == 'alipay'">
			<text v-if=" item.code == 'wechatpay'" class="icon yticon icon-weixinzhifu"></text>
			<text v-if=" item.code == 'alipay'" class="icon yticon icon-alipay"></text>

			<view class="con" v-if=" item.code == 'wechatpay' || item.code == 'alipay'">
				<text class="tit">{{ item.name }}</text>
				<text>{{ item.memo }}</text>
			</view>
		</view> -->
	</view>


</template>

<script>

import url from '@/common/http/url.js';
export default {
	props: {
		// 如果是商品订单此参数必须
		orderId: {
			type: Number,
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
			dictMoney:'0.00'
		}
	},
	mounted () {
		this.getPayment()
	},
	methods: {
		// 获取可用支付方式列表
		async getPayment () {
			let params = {};
			let res = await this.$http('get',url.order.paymentlist,params,true);
			let data = res.data
			this.dictMoney = data.dictMoney;
			this.paymentss = this.formatPayments(data);
		},
		// 支付方式处理
		formatPayments (payments) {
			// 设置logo图片
			payments.forEach(item => {
				this.$set(item, 'icon', '/static/image/' + item.code + '.png')
			})
			return payments
		},
		// 用户点击支付方式处理
		async toPayHandler (code) {
			let _this = this
			switch (code) {
				case 'alipay':
					let userInfo = uni.getStorageSync('userInfo');
					let res = await this.$http('get',url.agent.aliAppPay,{dkUserId:userInfo.id});
					if (res) {
						let resData = res.data
						uni.requestPayment({
							provider: "alipay",
							orderInfo: resData.order,
							success: function(doc){
								_this.$http('post',url.agent.dkTradeQuery,{dkUserId:userInfo.id});
								_this.$msg('支付成功')
								_this.$parent.getUserInfo();
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
					let res1 = await this.$http('get',url.order.appPay,params);
					if (res1) {
							// 调用微信支付
							uni.requestPayment({
								provider: "wxpay",
								orderInfo: res1,
								success: function(data){
									_this.$msg('支付成功')
									_this.redirectHandler(data)
								},
								fail:function(res){
									console.log(JSON.stringify(res));
								}
							});
						} else {
							_this.$msg(res.msg)
						}

					break
				case 'offline':
					/**
					 * 线下支付
					 */
					_this.$showModal('请联系客服进行线下支付','线下支付说明')
					break
				}
		},
		// 支付成功后跳转操作
		redirectHandler (paymentId) {
			this.$msg("缴纳配送押金成功~~~");
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
			font-size: 60upx;
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
			color: #c6c4cd;
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
		background-color: #fa436a;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>

