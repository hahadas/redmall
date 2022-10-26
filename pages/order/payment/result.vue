<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">支付成功</text>
		<!-- <view class="result-mid red-price">
			{{ orderInfo.actualPaymentRmb }}
		</view> -->
		<view class="btn-group">
			<text class="mix-btn" @click="goOrder">查看订单</text>
			<text class="mix-btn hollow" @click="onBack">点我返回</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: {},
			}
		},
		onLoad(options) {
			if (options.orderInfo) {
				let order  = JSON.parse(options.orderInfo)
				this.orderInfo = order
			}
		},
		methods: {
			goOrder(){
				uni.redirectTo({
					url: "/pages/order/index?status=1"
				})
			},
			onBack(){
				this.$navigateBack(2)
			}
		}
	};
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon {
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}
	.tit {
		font-size: 38upx;
		color: #303133;
	}
	.btn-group {
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: 32rpx;
		color: #fff;
		background-color: #381895;
		border-radius: 10upx;
		&.hollow {
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
