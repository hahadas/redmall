<template>
	<view class="app">
		<view class="price-box">
			<text>{{isPayment ? '已' : ''}}缴纳{{title}}</text>
			<text class="blod font42" style="color: #51c609;margin: 20rpx 0;">¥ {{deposit}}</text>
			<text class="color-b9 font26" v-if="isPayment">时间：{{payTime}}</text>
		</view>
		
		<view class="pay-type-list" v-if="!isPayment">
			<view class="type-item" @click="toPayHandler('wxpay')">
				<text class="icon iconfont" style="color: #1fb922;">&#xe62b;</text>
				<view class="con">
					<text class="tit">微信</text>
					<text>微信支付</text>
				</view>
			</view>
			<view class="type-item" @click="toPayHandler('alipay')">
				<text class="icon iconfont" style="color: #1aa1e6; font-size: 60rpx;">&#xe715;</text>
				<view class="con">
					<text class="tit">支付宝</text>
					<text>支付宝支付</text>
				</view>
			</view>
		</view>

		<view class="register-section" @click="jumpTo">《{{agreementTitle}}》</view>
		
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
    export default {
        data () {
            return {
				isPayment: false,
				title: "",
				deposit: '0.00', // 押金金额
				noteceId: "", // 协议公告ID
				agreementTitle: "" ,// 协议标题
				payTime:""
            }
        },
        onLoad(opt) {
			if (opt.title) {
				this.title = opt.title
				uni.setNavigationBarTitle({
					title: opt.title
				})
			}
			this.getDepositStatus()
			this.getInfo()
        },
        methods: {
			getDepositStatus(){
				this.$http("GET", url.distributor.distributorDeposit).then(res => {
					if (res.data && res.data.status){
						this.isPayment = res.data
						this.payTime = res.data.payTime
					}
				})
			},
			getInfo(){
				this.$http("GET", url.common.distributorDepositConfig).then(res => {
					let children = res.data.children
					children.map(v=>{
						if (v.keyCode === "distributor_deposit_amount") {
							this.deposit = v.keyValue
						}
						if (v.keyCode === "distributor_deposit_agreement") {
							this.noteceId = v.keyValue
						}
					})
					this.getAgreementTitle()
				})
			},
			getAgreementTitle(){
				this.$http("GET", url.cms.getNoticeDetailById, {id: this.noteceId}).then(res =>{
					this.agreementTitle = res.data.titleName
				})
			},
			toPayHandler(type){
				uni.showLoading({
					title: "支付中...",
					mask: true
				})
				let _this = this
				let path = url.pay.aliPayOther
				if (type === "wxpay") {
					path = url.pay.wechatPayOther
				}
				this.$http("GET", path, {type: 1}).then(res =>{
					uni.requestPayment({
						provider: type,
						orderInfo: res.data,
						success: function(res){
							uni.hideLoading()
							_this.checkPayResult()
						},
						fail:function(err){
							uni.hideLoading()
							_this.$msg("支付失败")
						}
					});
				}).catch(err=>{
					uni.hideLoading()
					let resErr = err.res
					if (resErr.data.code === 15001) {
						this.$msg(resErr.data.msg)
						this.getDepositStatus()
					}
				})
			},
			// 检测第三方支付结果
			checkPayResult(){
				uni.showLoading({
					mask:true,
					title:"正在检测第三方支付结果..."
				})
				setTimeout(()=>{
					this.$http("GET", url.pay.payCheckOther, {type: 1}).then(doc=>{
						uni.hideLoading()
						this.$msg("支付成功");
						this.getDepositStatus()
					}).catch(()=>{
						this.$msg("支付失败")
						uni.hideLoading()
					})
				}, 1000)
			},
			jumpTo(){
				this.$navigateTo("/pages/notice/agreement?id="+this.noteceId)
			}
        }
    }
</script>
<style lang='scss' scoped>
	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 36upx;
		color: #909399;
		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
		}
	}
	.pay-type-list{
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
			font-size: 52upx;
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
			color: #bbbbc4;
		}
	}
	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		text-align: center;
		font-size: 30upx;
		color: #999;
	}
</style>



