<template>
	<view>
		<view class="header bg-base flex flex-center flex-column">
			<text class="font26">我的积分</text>
			<text class="number">{{integral||0}}</text>
		</view>
		<view class="form">
			<view class="form-item">
				<text class="label">还款账户</text>
				<view class="color-b9" @click="selectBank">
					<text class="font30">{{bankData?"已选择":"请选择"}}</text>
					<text class="iconfont">&#xe770;</text>
				</view>
			</view>
			<block v-if="bankData">
				<view class="form-item">
					<text class="label">持卡人</text>
					<text>{{bankData.name}}</text>
				</view>
				<view class="form-item">
					<text class="label">银行卡号</text>
					<text>{{bankData.account}}</text>
				</view>
				<view class="form-item">
					<text class="label">开户支行</text>
					<text>{{bankData.bankName | filterName}}</text>
				</view>
				<view class="form-item">
					<text class="label">预留号码</text>
					<text>{{bankData.phone}}</text>
				</view>
			</block>
			<view class="form-item">
				<text class="label">还款金额</text>
				<input type="number" placeholder="请输入还款金额" v-model="amount" class="input" />
			</view>
			<view class="form-item">
				<text class="label">还款比例</text>
				<text class="flex-grow">1:{{scale}}</text>
				<text class="color-b9 font30">积分</text>
			</view>
			<view class="form-item">
				<text class="label">实际积分</text>
				<text class="flex-grow">{{(Number(amount || 0)*scale).toFixed(2)}}</text>
			</view>
			<view class="form-item bor-no">
				<text class="label">登入密码</text>
				<input type="password" placeholder="请输入登入密码" v-model="password" class="input" />
			</view>
		</view>
		<view class="flex flex-center" style="margin-top: 20rpx;" v-if="remarks">
			<text class="color-red font30">{{remarks}}</text>
		</view>
		<view class="btn">
			<button type="primary" :loading="loading" :disabled="!open" class="bg-base" @click="onConfirm">还款</button>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="flex flex-center">
			<text class="color-b9 font34" @click="$navigateTo('creditCardRecord')">还款记录</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				loading: false,
				amount: "",
				password: "",
				bankData: null,
				scale: 0,
				open: false,
				remarks: "",
				rsaKey: "",
				integral: ""
			}
		},
		filters: {
			filterName(val) {
				if (val.indexOf("-") > -1) {
					return val.split("-")[1]
				} else {
					return val
				}
			}
		},
		onShow() {
			console.log(this.paymentData)
			this.bankData = this.paymentData
		},
		onLoad() {
			this.getMoneyInfo()
			this.$http("GET", url.login.getPublicKey).then(res => {
				this.rsaKey = res.data
			})
			this.$http("GET", url.user.returnCreditCardConfig).then(res => {
				this.open = res.data.keyValue === "1" ? true : false
				if (res.data.children) {
					res.data.children.map(v => {
						if (v.keyCode === "third_party_service_return_credit_card_integral") {
							this.scale = Number(v.keyValue)
						}
						if (v.keyCode === "third_party_service_return_credit_card_num_multiple") {
							this.remarks = v.remarks
						}
					})
				}
			})
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("creditCardRecord")
		},
		methods:{
			getMoneyInfo(){
				this.$http('GET', url.user.getWalletInfo).then(res =>{
					this.integral = res.data.integral
				})
			},
			async onConfirm(){
				if (!this.bankData) return this.$msg("请选择还款账户")
				if (!this.amount) return this.$msg("请输入还款金额")
				if (!this.password) return this.$msg("请输入登入密码")
				this.loading = true
				let params = {
					account: this.bankData.account,
					name: this.bankData.name,
					phone: this.bankData.phone,
					bankName: this.bankData.bankName.split("-")[0],
					openBranchName: this.bankData.bankName.split("-")[1],
					amount: this.amount,
					loginPwd: await publics.passwordEncryption(this.rsaKey, this.password),
				}
				this.$http("POST", url.user.addReturnCreditCard, params).then(res => {
					this.loading = false
					this.$msg(res.data)
					this.$navigateTo("creditCardRecord")
				}).catch(()=>{
					this.loading = false
				})
			},
			selectBank(){
				this.$navigateTo("/pages/user/payment/list?type=3&bank=true")
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		padding: 50rpx 0 40rpx;
		color: white;
		border-radius: 0 0 20rpx 20rpx;
		.number{
			font-size: 60rpx;
			margin-top: 10rpx;
		}
	}
	.form{
		background-color: white;
		margin-top: 20rpx;
		border-radius: 20rpx;
		padding: 0 20rpx;
		&-item{
			border-bottom: 2rpx solid #EEEEEE;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.label{
				width: 160rpx;
				margin-right: 20rpx;
				color: #333333;
			}
			.input{
				font-size: 36rpx;
				flex-grow: 1;
			}
		}
	}
	.btn{
		padding: 20rpx 0 50rpx;
		width: 90%;
		margin-left: 5%;
	}
</style>
