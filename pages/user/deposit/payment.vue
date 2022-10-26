<template>
	<view>
		<view class="top bg-base">
			<view class="cell">
				<text class="num">{{info.amount}}</text>
				<text class="name">投资积分</text>
			</view>
			<view class="cell">
				<view class="flex flex-align-end">
					<text class="num">{{info.showRevenueTimesAmount}}</text>
					<text class="unit">元</text>
				</view>
				<text class="name">周收益</text>
			</view>
			<view class="cell">
				<view class="flex flex-align-end">
					<text class="num">{{info.showRevenueTimes}}</text>
					<text class="unit">周</text>
				</view>
				<text class="name">收益期限</text>
			</view>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">登入密码</text>
			<input type="password" class="flex-grow" v-model="password" placeholder="登入密码" />
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave">确定</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				loading: false,
				password: "",
				info: {},
				rsaKey: ""
			}
		},
		onLoad(opt) {
			if (opt.data){
				this.info = JSON.parse(opt.data)
				this.getRsaKey()
			}
		},
		
		methods:{
			async onSave(){
				if (!this.password) return this.$msg("请输入登入密码")
				this.loading = true
				let params = {
					depositId: this.info.id,
					loginPwd: await publics.passwordEncryption(this.rsaKey, this.password)
				}
				this.$http("POST", url.deposit.buyDepositPlan, params).then(res =>{
					this.$msg(res.data)
					// this.$navigateBack(1, 500)
					uni.redirectTo({
						url: "depositDetail"
					})
				}).catch(()=>{
					this.loading = false
				})
			},
			async getRsaKey() {
				let res = await this.$http("GET", url.login.getPublicKey)
				this.rsaKey = res.data
			}
		}
	}
</script>

<style scoped lang="scss">
	.top{
		padding: 50rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.cell{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: white;
			.num{
				font-size: 44rpx;
			}
			.unit{
				font-size: 24rpx;
				margin-left: 4rpx;
				margin-bottom: 6rpx;
			}
			.name{
				font-size: 26rpx;
				margin-top: 20rpx;
			}
		}
	}
	.form{
		background-color: #FFFFFF;
		padding: 26rpx 20rpx;
		font-size: 32rpx;
		.label{
			margin-right: 20rpx;
		}
	}
	.btn{
		width: 90%;
		margin-top: 80rpx;
	}
</style>
