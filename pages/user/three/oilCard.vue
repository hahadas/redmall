<template>
	<view class="main">
		<image :src="staticUrl + 'user/oil.jpg'" mode="widthFix" class="banner"></image>
		<view class="con">
			<view class="flex flex-between">
				<view class="tab flex flex-center" :class="{'active' : i === current}" v-for="(tab, i) in tabs" :key="i" @click="tabChange(i)">
					<text class="font30">{{tab.name}}</text>
				</view>
			</view>
			<view class="form">
				<view class="flex flex-center" style="margin-bottom: 50rpx;">
					<text class="color-purple font32">我的积分：{{integral}}</text>
				</view>
				<view class="form-item">
					<input type="number" placeholder="请输入充值卡号" v-model="form.gameUserid" class="input" />
				</view>
				<view class="form-item">
					<input type="text" placeholder="请输入持卡人姓名" v-model="form.gasCardName" class="input" />
				</view>
				<view class="form-item">
					<input type="number" :maxlength="11" placeholder="请输入持卡人手机号" v-model="form.gasCardTel" class="input" />
				</view>
				<view class="form-item">
					<input type="password" placeholder="请输入登入密码" v-model="password" class="input" />
				</view>
				<view v-if="describe1 || describe2" class="describe">
					<text class="color-red" v-if="current === 0 && describe1">{{describe1}}</text>
					<text class="color-red" v-if="current === 1 && describe2">{{describe2}}</text>
				</view>
				<view class="grid">
					<text class="grid-item" :class="{'active': select.keyCode === item.keyCode}" v-for="(item, i) in selecData.children" :key="i" @click="onSelect(item)">{{item.name}}</text>
				</view>
				<view class="flex flex-center" style="margin-bottom: 20rpx;">
					<text class="color-red font30">{{remarks}}</text>
				</view>
				<button type="primary" class="bg-base" :loading="loading" :disabled="loading" @click="recharge()" v-if="selecData.keyValue === '1'">充值</button>
				<view class="flex flex-center" v-else>
					<text class="color-b9 font30">{{selecData.remarks}}</text>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="flex flex-center" style="padding: 30rpx 0;">
					<text class="color-b9 font34" @click="$navigateTo('oilCardRecord')">充值记录</text>
				</view>
				<!-- #endif -->
				<!-- <view class="flex flex-column font32" style="margin-top: 20rpx;">
					<text class="color-b6">*提示：</text>
					<text class="color-b9">1、{{remarks}}</text>
					<text class="color-b9" v-if="current === 0 && describe1">2、{{describe1}}</text>
					<text class="color-b9" v-if="current === 1 && describe2">2、{{describe2}}</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				staticUrl: this.$staticUrl,
				loading: false,
				tabs: [
					{name: "中国石化", value: 1},
					{name: "中国石油", value: 2}
				],
				current: 0,
				form: {},
				config: {},
				selecData: {},
				select: {},
				remarks: "",
				integral: 0,
				password: "",
				rsaKey: "",
				describe1: "",
				describe2: ""
			}
		},
		onLoad() {
			this.$http("GET", url.juhe.rechargeParame).then(res =>{
				this.config = res.data
				this.selecData = this.config.juheHuaOilCardFaceValus
				this.remarks = res.data.juheOilCardRechargeIntegral.remarks
				res.data.juheAllDescribe.children.forEach(v => {
					if (v.keyCode === "juhe_all_describe_hua") {
						this.describe1 = v.keyValue
					}
					if (v.keyCode === "juhe_all_describe_you") {
						this.describe2 = v.keyValue
					}
				})
				
			})
			// 获取钱包信息
			this.$http('GET', url.user.getWalletInfo).then(res =>{
				this.integral = res.data.integral
			})
			this.$http("GET", url.login.getPublicKey).then(res => {
				this.rsaKey = res.data
			})
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("oilCardRecord")
		},
		methods:{
			onSelect(item){
				this.select = item
			},
			recharge(){
				if (!this.form.gameUserid) return this.$msg("请输入充值的卡号")
				if (!this.form.gasCardName) return this.$msg("请输入持卡人姓名")
				if (!this.form.gasCardTel) return this.$msg("请输入持卡人手机号")
				if (!this.password) return this.$msg("请输入登入密码")
				let _this = this
				this.$showModal("是否确认充值", "提示", async r => {
					if (r.confirm) {
						_this.loading = true
						let params = {
							loginPwd: await publics.passwordEncryption(_this.rsaKey, _this.password),
							chargeType: _this.tabs[_this.current].value,
							code: _this.select.keyCode,
							..._this.form
						}
						_this.$http("POST", url.juhe.rechargeOilCard, params).then(res =>{
							_this.loading = false
							_this.$msg(res.data)
						}).catch(()=>{
							_this.loading = false
						})
					}
				})
			},
			tabChange(i){
				this.current = i
				if (i === 0) {
					this.selecData = this.config.juheHuaOilCardFaceValus
				} else {
					this.selecData = this.config.juheYouOilCardFaceValus
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 120vh;
	}
	.banner{
		width: 750rpx;
		height: 500rpx;
	}
	.con{
		position: absolute;
		width: 690rpx;
		left: 30rpx;
		top: 278rpx;
		.tab{
			height: 110rpx;
			background-color: rgba($color: #381895, $alpha: .2);
			width: 49%;
			border-radius: 20rpx 20rpx 0 0;
		}
		.active{
			background-color: white;
		}
		.form{
			background-color: white;
			padding: 30rpx 30rpx 50rpx;
			border-radius: 0 0 20rpx 20rpx;
			&-item{
				border-bottom: 2rpx solid #EEEEEE;
				padding-bottom: 10rpx;
				margin-bottom: 40rpx;
				.input{
					font-size: 36rpx;
				}
			}
			.describe{
				margin-top: -20rpx;
				margin-bottom: 10rpx;
				display: block;
			}
			.grid{
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-bottom: 50rpx;
				&-item{
					width: 30%;
					height: 120rpx;
					text-align: center;
					line-height: 120rpx;
					font-size: 34rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
					border: 2rpx solid #381895;
					border-radius: 16rpx;
					margin-right: 10rpx;
				}
				.active{
					background-color: rgba($color: #381895, $alpha: .3);
				}
			}
		}
	}
</style>
