<template>
	<view class="main">
		<image src="/static/user/bill.png" mode="" class="banner"></image>
		<view class="box">
			<input type="number" v-model="phone" :maxlength="11" placeholder="请输入手机号码" class="input" />
			<text class="iconfont del" @click="phone=''" v-if="phone">&#xe638;</text>
		</view>
		<view class="box">
			<input type="password" v-model="password" placeholder="请输入登入密码" class="input" />
			<text class="iconfont del" @click="password=''" v-if="password">&#xe638;</text>
		</view>
		<text class="color-red font32 describe" v-if="describe">{{describe}}</text>
		<view class="flex flex-center flex-column" style="margin: 20rpx 0 30rpx;">
			<text class="color-purple font32">我的积分：{{integral}}</text>
			<text class="color-b9 font32">提示：{{remarks}}</text>
			<!-- <text class="color-b9 font32">{{describe}}</text> -->
		</view>
		<text class="tips" v-if="config.keyValue === '2'">提示：{{config.remarks}}</text>
		<view class="grid" v-else>
			<text class="grid-item" v-for="(item, i) in config.children" :key="i" @click="recharge(item)">{{item.name}}</text>
		</view>
		<!-- <text class="color-red bom" v-if="remarks">{{remarks}}!</text> -->
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				phone: "",
				integral: 0,
				config: {},
				remarks: "",
				password: "",
				rsaKey: "",
				describe: ""
			}
		},
		onLoad() {
			this.$http("GET", url.juhe.rechargeParame).then(res =>{
				this.config = res.data.juhePhoneBillFaceValues
				this.remarks = res.data.juhePhoneBillRechargeIntegral.remarks
				res.data.juheAllDescribe.children.forEach(v => {
					if (v.keyCode === "juhe_all_describe_phone") {
						this.describe = v.keyValue
						return false
					}
				})
				
			})
			this.$http("GET", url.login.getPublicKey).then(res => {
				this.rsaKey = res.data
			})
		},
		onShow() {
			// 获取钱包信息
			this.$http('GET', url.user.getWalletInfo).then(res =>{
				this.integral = res.data.integral
			})
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("phoneBillRecord")
		},
		methods:{
			recharge(row){
				if (!this.phone) return this.$msg("请输入充值的手机号码")
				if (!this.password) return this.$msg("请输入登入密码")
				let _this = this
				this.$showModal("是否确认充值", "提示", async r => {
					if (r.confirm) {
						uni.showLoading({
							mask:true
						})
						let params = {
							loginPwd: await publics.passwordEncryption(_this.rsaKey, _this.password),
							phoneno: _this.phone,
							code: row.keyCode
						}
						_this.$http("POST", url.juhe.rechargePhoneBill, params).then(res =>{
							uni.hideLoading()
							_this.$msg(res.data)
						}).catch(()=>{
							uni.hideLoading()
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: white;
		min-height: 100vh;
		.banner{
			width: 750rpx;
			height: 200rpx;
		}
		.box{
			padding: 40rpx 40rpx 10rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			align-items: center;
			.input{
				font-size: 50rpx;
				flex-grow: 1;
			}
			.del{
				font-size: 40rpx;
				margin-right: 20rpx;
				color: #9d9c9e;
			}
		}
		.describe{
			display: block;
			margin: 20rpx 40rpx 0;
		}
		.tips{
			background-color: rgba($color: #381895, $alpha: .3);
			color: #381895;
			font-size: 28rpx;
			padding: 20rpx;
			display: block;
		}
		.grid{
			margin: 30rpx 0rpx 30rpx 40rpx;
			padding-bottom: 30rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			
			&-item{
				width: 215rpx;
				height: 150rpx;
				text-align: center;
				line-height: 150rpx;
				font-size: 34rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
				border: 2rpx solid #381895;
				border-radius: 16rpx;
				margin-right: 10rpx;
			}
		}
		.bom{
			display: block;
			margin: 0 40rpx;
			padding-bottom: 30rpx;
		}
	}
</style>
