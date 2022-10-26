<template>
	<view>
		<view class="top bg-base">
			<view class="cell">
				<text class="num">{{info.balance}}</text>
				<text class="name">我的资产</text>
			</view>
			<text class="iconfont font60 color-w">&#xe713;</text>
			<view class="cell">
				<text class="num">{{integral}}</text>
				<text class="name">我的喝酒么积分</text>
			</view>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">转换数额</text>
			<input type="number" class="flex-grow" v-model="number" placeholder-style="fontSize:32rpx" placeholder="请输入转换数额" />
			<text class="font28 color-b9">我的资产</text>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">转换费用</text>
			<text class="flex-grow">1:{{config.proportion}}</text>
			<text class="font28 color-b9"></text>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">实际到账</text>
			<text class="flex-grow">{{number?(Number(number)*config.proportion):0}}</text>
			<text class="font28 color-b9">喝酒么积分</text>
		</view>
		<view class="flex flex-center" style="margin-top: 60rpx;">
			<text class="color-b9 font32">{{config.remarks}}</text>
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave">确定</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return{
				loading: false,
				info:{},
				integral: 0,
				number: "",
				config: {
					proportion: 0,
					remarks: ""
				}
			}
		},
		onShow() {
			// 获取存托钱包信息
			this.$http("GET", url.deposit.getUserWallet).then(res =>{
				this.info = res.data
			})
			// 获取喝酒么钱包信息
			this.$http('GET', url.user.getWalletInfo).then(res =>{
				this.integral = res.data.integral
			})
			// 获取转换参数
			this.getConfigData()
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("transformToIntegralList")
		},
		methods:{
			getConfigData(){
				this.$http("GET", url.deposit.walletToIntegralConfig).then(res =>{
					this.config.proportion = Number(res.data.keyValue)
					this.config.remarks = res.data.children[0].remarks
				})
			},
			onSave(){
				if (!this.number || Number(this.number) === 0) return this.$msg("请输入要转换的数量")
				this.loading = true
				this.$http("POST", url.deposit.transformToIntegral, {amount: this.number}).then(res =>{
					this.$msg(res.data)
					this.$navigateTo("transformToIntegralList")
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 50rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
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
		border-bottom: 2rpx solid #EEEEEE;
		.label{
			margin-right: 20rpx;
		}
	}
	.btn{
		width: 90%;
		margin-top: 20rpx;
	}
</style>
