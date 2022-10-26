<template>
	<view class="main bg-w">
		<view :style="{'height': statusBarHeight + 'px'}"></view>
		<!-- <text class="iconfont color-b3 nav" @tap="$navigateBack()">&#xe771;</text> -->
		<text class="title">注册</text>
		<view class="form">
			<view class="form-item flex flex-align-end">
				<input type="number" :maxlength="11" placeholder="请输入手机号" placeholder-class="placeholder" v-model="form.username" />
			</view>
			<view class="form-item flex flex-align-end">
				<input type="number" :maxlength="6" placeholder="请输入短信验证码" placeholder-class="placeholder" v-model="form.code" />
				<sms :phone="form.username" typeCode="0"></sms>
			</view>
			<view class="form-item flex flex-align-end">
				<input :password="!showPassword" placeholder="登录密码（长度为6-24位字母和数字组合）" placeholder-class="placeholder" class="flex-grow" v-model="password" />
				<text class="iconfont font40 eye" @tap="showPassword = !showPassword">{{showPassword?'\ue7c0':'\ue7bf'}}</text>
			</view>
			<view class="form-item flex flex-align-end">
				<input :password="!confirmPwd" placeholder="确认密码（长度为6-24位字母和数字组合）" placeholder-class="placeholder" class="flex-grow" v-model="confimpassword" />
				<text class="iconfont font40 eye" @tap="confirmPwd = !confirmPwd">{{confirmPwd?'\ue7c0':'\ue7bf'}}</text>
			</view>
			<view class="form-item flex flex-align-end" v-if="!hasCode">
				<input type="text" placeholder="推荐码(选填)" placeholder-class="placeholder" @input="onInput" v-model="form.recommendCode" />
			</view>
			<view class="btn flex flex-center flex-column">
				<button type="primary" class="bg-base btn-item" :loading="loading" :disabled="loading" @tap="onRegister">注册</button>
				<text class="font28 color-purple" @tap="$navigateTo('../login/login')">已有账号？马上登录</text>
			</view>
			<!-- #ifdef H5 -->
			<view class="download">
				<view class="item bg-base" @click="download(androidUrl)">
					<text class="iconfont icon">&#xe609;</text>
					<text class="font26">安卓下载</text>
				</view>
				<text class="font28 color-purple" @tap="$navigateTo('../login/login')">苹果用户请先使用网页版</text>
				<!-- <view class="item bg-base" @click="download(iosUrl)">
					<text class="iconfont icon">&#xe607;</text>
					<text class="font26">苹果下载</text>
				</view> -->
			</view>
			<view style="height: 100rpx;"></view>
			<!-- #endif -->
		</view>
		<view class="flex flex-center flex-column fixed">
			<text class="color-b9 font24">登录注册即表示同意《用户协议及隐私策略》</text>
		</view>
	</view>
</template>

<script>
	import sms from "@/components/sms.vue"
	import url from "@/common/http/url.js"
	import mix from "../login/mix.js"
	import publics from "@/common/utils/public.js"
	
	export default{
		mixins: [mix],
		components: { sms },
		data(){
			return {
				confimpassword: "",
				hasCode: false
			}
		},
		async onLoad(opt) {
			uni.clearStorageSync()
			if (opt.code){
				this.hasCode = true
				this.form.recommendCode = opt.code
			}
			let _this = this
			// #ifdef APP-PLUS
			uni.getLocation({
			    type: 'wgs84',
				geocode: true,
			    success: async function (res) {
					let e = await publics.getPositionToLngAndLat(res.longitude, res.latitude)
					_this.form.adcode = e.result['ad_info'].adcode
			    }
			});
			// #endif
		},
		methods: {
			async onRegister(){
				if (!this.form.username) return this.$msg("请输入手机号")
				if (!this.form.code) return this.$msg("请输入短信验证码")
				if (!this.password) return this.$msg("请输入密码")
				if (this.confimpassword !== this.password) return this.$msg("两次密码不一致")
				this.loading = true
				this.form.password = await this.passwordEncryption(this.rsaKey, this.password)
				uni.removeStorageSync('smsTime')
				this.$http("POST", url.login.register, this.form).then(res => {
					this.$msg("注册成功，请下载APP~")
				}).catch(()=>{
					this.loading = false
				})
			},
			onInput(e){
				this.form.recommendCode = e.detail.value
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		.nav{
			font-size: 50rpx;
			padding-top: 30rpx;
			display: block;
			padding-left: 30rpx;
		}
		.title{
			padding: 80rpx 50rpx;
			display: block;
			font-size: 54rpx;
		}
		
		.form{
			margin: 0 50rpx;
			&-item{
				border-bottom: 2rpx solid #eee;
				height: 100rpx;
				justify-content: space-between;
				padding-bottom: 20rpx;
				.eye{
					color: #d4d5d8;
				}
				.placeholder{
					color: #999;
					font-size: 30rpx;
				}
			}
			.btn{
				margin-top: 80rpx;
				&-item{
					width: 80%;
					border-radius: 50rpx;
					margin-bottom: 50rpx;
				}
			}
			.btn::after{ border: none;}
		}
		.fixed{
			// position: fixed;
			// bottom: 50rpx;
			// left: 0;
			// right: 0;
			padding-bottom: 100rpx;
		}
		.download{
			margin-top: 50rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.item{
				width: 80%;
				height: 90rpx;
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				margin-bottom: 30rpx;
				.icon{
					font-size: 50rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>