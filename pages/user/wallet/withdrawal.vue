<template>
	<view class="main bg-w">
		<view class="list">
			<view class="list-item flex flex-between">
				<text class="font32">提现至</text>
				<view class="flex flex-align-center color-b6" @click="jumpTo()">
					<text class="font28" v-if="paymentInfo.type === undefined">请选择</text>
					<text class="font28" v-if="paymentInfo.type === 0">支付宝({{paymentInfo.account}})</text>
					<text class="font28" v-if="paymentInfo.type === 1">微信({{paymentInfo.account}})</text>
					<text class="font28" v-if="paymentInfo.type === 3">{{paymentInfo.bankName}}({{paymentInfo.account | filtersCard}})</text>
					<text class="iconfont font38">&#xe770;</text>
				</view>
			</view>
			<view class="list-item">
				<text class="font32">提现金额</text>
				<view class="flex flex-align-end con">
					<text class="blod font48">¥</text>
					<input type="text" class="font40 input" v-model="money" placeholder="0.00" />
				</view>
			</view>
			<view class="flex flex-between">
				<view class="money flex flex-align-center font26">
					<text class="color-red">可提现余额¥{{balance||0}}，</text>
					<text class="color-purple" @tap="money = balance">全部提现</text>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<text class="color-b9 font30" @click="$navigateTo('creditCardRecord')">提现记录</text>
				<!-- #endif -->
			</view>
			
			<button type="primary" class="bg-base" :loading="loading" :disabled="loading" @click="onSave">确认提现</button>
			<view class="flex flex-column font32 tips color-red">
				<text>*提示：</text>
				<text>1、提现数额最低{{config.minAmount || 0}}，最大{{config.maxAmount || 0}}。</text>
				<text>2、提现数额必须为{{config.multiple || 0}}的倍数。</text>
				<text>3、提现数额小于等于{{config.fixed || 0}}，统一收取{{config.fixedService||0}}的手续费。大于{{config.fixed||0}}，按{{config.percentage||0}}%收取手续费。</text>
				<text>4、平台将在三个工作日内打款。</text>
				<text v-if="config.remarks">5、{{config.remarks}}。</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				loading: false,
				money: "",
				balance: 0,
				paymentInfo: {},
				config: {},
				type: 1 // 1-用户， 2-配送员， 3-商家, 4-存托
			}
		},
		filters: {
			filtersCard(val) {
				if (!val) return
				return val.substring(val.length - 4, val.length)
			}
		},
		onLoad(opt) {
			if (opt.type) {
				this.type = parseInt(opt.type)
			}
			if (this.type === 4) {
				// 获取存托余额
				this.$http("GET", url.deposit.getUserWallet).then(res =>{
					this.balance = res.data.balance
				})
			} else if (this.type === 3) {
				// 获取商家余额
				this.$http("GET", url.store.getWalletInfo).then(res=>{
					this.balance = res.data.balance
				})
			} else {
				// 获取用户余额
				this.$http('GET', url.user.getWalletInfo).then(res =>{
					if (this.type === 1) {
						this.balance = res.data.balance
					} else {
						this.balance = res.data.distributorBalance
					}
				})
			}
		},
		onShow() {
			if (this.paymentData){
				this.paymentInfo = this.paymentData
			}
			let path = url.withdrawal.getConfigInfo
			let name = "user"
			if (this.type === 2){
				name = "distribution"
			} else if (this.type === 3){
				name = "store"
			} else if (this.type === 4) {
				path = url.deposit.getWithdrawalInfo
				name = "deposit"
			}
			// 获取提现参数
			this.$http("GET", path, {type: this.type}).then(res =>{
				this.config.status = res.data.keyValue
				let list = res.data.children
				list.forEach(v => {
					if (v.keyCode === `${name}_withdrawal_min_amount`){
						this.config.minAmount = v.keyValue // 提现最低数额
					}
					if (v.keyCode === `${name}_withdrawal_max_amount`){
						this.config.maxAmount = v.keyValue // 提现最大数额
					}
					if (v.keyCode === `${name}_withdrawal_multiple_amount`){
						this.config.multiple = v.keyValue // 倍数
					}
					if (v.keyCode === `${name}_withdrawal_fixed_amount`){
						this.config.fixed = v.keyValue // 固定金额范围
					}
					if (v.keyCode === `${name}_withdrawal_fixed_service_amount`){
						this.config.fixedService = v.keyValue // 某个范围内扣除固定的手续费
					}
					if (v.keyCode === `${name}_withdrawal_fixed_service_percentage`){
						this.config.percentage = v.keyValue // 超出固定范围外扣除固定的百分比手续费
					}
					if (v.keyCode === `${name}_withdrawal_collection_type`){
						this.config.remarks = v.remarks // 支持的收款类型
					}
				})
				this.$forceUpdate()
			})
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("withdrawalRecord?type="+this.type)
		},
		methods:{
			onSave(){
				if (!this.type) return
				if (!this.paymentInfo.id) return this.$msg("请选择提现到账信息")
				if (!this.money) return this.$msg("请输入提现金额")
				if (Number(this.money) > Number(this.balance)) return this.$msg("输入金额已超过可提现余额")
				this.loading = true
				let params = {
					type:this.paymentInfo.type,
					amount: this.money,
					collectionId: this.paymentInfo.id
				}
				let path = null
				if (this.type === 4) {
					path = url.deposit.withdrawal
				} else {
					path = url.withdrawal.apply
					params.userType = this.type
				}
				this.$http("POST", path, params).then(res =>{
					this.$msg(res.data)
					this.$navigateTo('withdrawalRecord?type='+this.type)
					this.loading = false
				}).catch(()=>{
					this.loading = false
				})
			},
			jumpTo(){
				this.$navigateTo("../payment/index?coupon=true")
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		padding: 0 20rpx;
		.list{
			&-item{
				padding: 30rpx 0;
				border-bottom: 2rpx solid #EEEEEE;
				.con{
					margin-top: 30rpx;
					.input{
						margin-left: 10rpx;
						font-size: 60rpx;
						margin-bottom: -6rpx;
					}
				}
			}
		}
		.money{
			margin: 30rpx 0;
		}
		.tips{
			margin-top: 80rpx;
			line-height: 50rpx;
		}
	}
</style>
