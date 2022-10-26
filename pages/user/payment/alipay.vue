<template>
	<view class="main">
		<view class="top flex flex-center flex-column">
			<text class="font46 title">绑定支付宝</text>
			<text class="font32">请绑定姓名本人的支付宝账号</text>
		</view>
		<view class="form">
			<view class="form-item flex flex-align-center">
				<text class="label font32">姓名：</text>
				<input type="text" placeholder="真实姓名" :disabled="isView" v-model="paymentInfo.name">
			</view>
			<view class="form-item flex flex-align-center">
				<text class="label font32">账号：</text>
				<input type="text" placeholder="支付宝账号" :disabled="isView" v-model="paymentInfo.account">
			</view>
			<view class="form-item flex flex-column">
				<text class="font32">收款二维码：</text>
				<view class="flex flex-center add" v-if="!imgUrl" @tap="selectImg">
					<text class="iconfont icon">&#xe64d;</text>
				</view>
				<image :src="imgUrl" mode="" v-if="imgUrl" @tap="selectImg"></image>
			</view>
			<view class="form-item flex flex-align-center" v-if="!isView">
				<text class="label font32">密码：</text>
				<input type="password" placeholder="喝酒么登入密码" v-model="password">
			</view>
		</view>
		<button type="primary" class="bg-base" v-if="!isView" :loading="loading" :disabled="loading" @tap="onSave">确定</button>
	</view>
</template>

<script>
	import mix from "./mix.js"
	export default {
		mixins: [mix],
		data(){
			return {
			}
		},
		methods: {
			onSave() {
				if (!this.paymentInfo.name) return this.$msg("请输入姓名")
				if (!this.paymentInfo.account) return this.$msg("请输入支付宝账号")
				if (!this.imgUrl) return this.$msg("请上传支付宝收款码")
				this.onSubmit()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #FFFFFF;
	}
	.main{
		padding: 30rpx 50rpx;
		.top{
			margin-top: 40rpx;
			.title{
				margin-bottom: 20rpx;
			}
		}
		.form{
			margin-top: 100rpx;
			&-item{
				padding-bottom: 20rpx;
				border-bottom: 2rpx solid #eee;
				margin-bottom: 50rpx;
				.label{
					width: 120rpx;
				}
				.add{
					width: 300rpx;
					height: 300rpx;
					border: 2rpx solid #cdcdcd;
					margin-top: 30rpx;
					.icon{
						font-size: 60rpx;
						color: #cdcdcd;
					}
				}
			}
		}
	}
</style>
