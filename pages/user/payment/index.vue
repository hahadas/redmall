<template>
	<view class="main">
		<view class="alipy">
			<view class="list" @tap="jumpTo(0)">
				<view class="flex flex-align-center no">
					<text class="iconfont add">&#xe64d;</text>
					<text class="font44">支付宝收款信息</text>
				</view>
			</view>
		</view>
		<view class="wechat">
			<view class="list" @tap="jumpTo(1)">
				<view class="flex flex-align-center no">
					<text class="iconfont add">&#xe64d;</text>
					<text class="font44">微信收款信息</text>
				</view>
			</view>
		</view>
		
		<view class="bank">
			<view class="list" @tap="jumpTo(3)">
				<view class="flex flex-align-center no">
					<text class="iconfont add">&#xe64d;</text>
					<text class="font44">银行卡收款信息</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				coupon: ""
			}
		},
		onLoad(option) {
			this.coupon = option.coupon
		},
		onShow() {
		},
		methods: {
			jumpTo(type) {
				uni.navigateTo({
					url: "list?type=" + type + "&coupon=" + this.coupon
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 30rpx;
		.other{
			background-color: #3046df;
			border-radius: 20rpx;
		}
		.alipy{
			background-color: #21b6fa;
			border-radius: 20rpx;
		}
		.wechat{
			background-color: #51bd21;
			border-radius: 20rpx;
		}
		.bank{
			background-color: #f1ca5c;
			border-radius: 20rpx;
		}
		.list{
			height: 184rpx;
			padding: 20rpx 30rpx;
			margin-bottom: 20rpx;
			color: #FFFFFF;
			.no{
				height: 100%;
			}
			.add{
				font-size: 60rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
