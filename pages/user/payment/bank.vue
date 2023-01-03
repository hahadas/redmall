<template>
	<view class="main">
		<view class="top flex flex-center flex-column">
			<text class="font46 title">绑定银行卡</text>
			<text class="font32">请绑定姓名本人的支付宝账号</text>
		</view>
		<view class="form">
			<view class="form-item flex flex-align-center">
				<text class="label font32">持卡人：</text>
				<input type="text" placeholder="持卡人" :disabled="isView" v-model="paymentInfo.name">
			</view>
			<view class="form-item flex flex-align-center">
				<text class="label font32">银行卡号：</text>
				<input type="number" :maxlength="20" placeholder="银行卡号" :disabled="isView" class="flex-grow" v-model="paymentInfo.account">
			</view>
			<view class="form-item flex flex-align-center">
				<text class="label font32">所属银行：</text>
				<input type="text" :maxlength="20" placeholder="所属银行" :disabled="isView" class="flex-grow" v-model="bankName">
			</view>
			<view class="form-item flex flex-align-center">
				<text class="label font32">所属支行：</text>
				<input type="text" :maxlength="40" placeholder="所属支行" :disabled="isView" class="flex-grow" v-model="branch">
			</view>
			<view class="form-item flex flex-align-center">
				<text class="label font32">预留号码：</text>
				<input type="number" placeholder="预留号码" :disabled="isView" :maxlength="11" v-model="paymentInfo.phone">
			</view>
			<view class="form-item flex flex-align-center" v-if="!isView">
				<text class="label font32">登录密码：</text>
				<input type="password" placeholder="登录密码" v-model="password">
			</view>
		</view>
		<button type="primary" class="bg-base" v-if="!isView" :loading="loading" :disabled="loading" @tap="onSave()">确定</button>
	</view>
</template>

<script>
	import mix from "./mix.js"
	export default {
		mixins: [mix],
		data(){
			return {
				branch: "",
				bankName: ""
			}
		},
		methods: {
			onSave(){
				if (!this.paymentInfo.name) return this.$msg("请输入持卡人姓名")
				if (!this.paymentInfo.account) return this.$msg("请输入银行卡号")
				if (!this.bankName) return this.$msg("请输入所属银行")
				if (!this.branch) return this.$msg("请输入所属支行")
				if (!this.paymentInfo.phone) return this.$msg("请输入银行预留号码")
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
					width: 170rpx;
				}
			}
		}
	}
</style>
