<template>
	<view class="main" :style="{backgroundImage: 'url('+ staticUrl + 'login/bg.jpg)'}">
		<text class="color-w font60">Red Mall</text>
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
			<!-- <view class="form-item flex flex-align-end" v-if="!hasCode">
				<input type="text" placeholder="推荐码(选填)" placeholder-class="placeholder" @input="onInput" v-model="form.recommendCode" />
			</view> -->
			<view class="btn flex flex-center flex-column">
				<button type="primary" class="bg-base btn-item" :loading="loading" :disabled="loading" @tap="onRegister">立即注册</button>
				<view class="download bg-base">
					<view class="download-item" @click="download(androidUrl)">
						<text class="iconfont icon">&#xe609;</text>
						<text class="font32">安卓下载</text>
					</view>
					<text class="xian"></text>
					<view class="download-item" @tap="jumpWeb">
						<text class="iconfont icon">&#xe607;</text>
						<text class="font32">苹果网页版</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view style="height: 200rpx;"></view> -->
		<view class="flex flex-center fixed">
			<text class="font24" style="color: #cbcccf;" @tap="$navigateTo('/pages/notice/agreement?id='+noticeId)">登录注册即表示同意《用户协议及隐私策略》</text>
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
				staticUrl: this.$staticUrl,
				confimpassword: "",
				hasCode: false,
				noticeId: ""
			}
		},
		async onLoad(opt) {
			uni.clearStorageSync()
			if (opt.code){
				this.hasCode = true
				this.form.recommendCode = opt.code
			}
			
			// 获取隐私协议
			this.$http("GET", url.common.privacyAgreement).then(res =>{
				if (res.data && res.data.length > 0) {
					res.data.forEach(v => {
						if (v.keyCode === "platform_privacy_agreement_user"){
							this.noticeId = v.keyValue
							return
						}
					})
				}
			})
			
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
			},
			jumpWeb(){
				window.open("https://hejiume-wap.hushuo.show")
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.form{
			width: 100%;
			background-color: white;
			border-radius: 20rpx;
			padding: 0 20rpx;
			margin-top: 50rpx;
			&-item{
				border-bottom: 2rpx solid #eee;
				height: 90rpx;
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
				margin-top: 60rpx;
				&-item{
					width: 90%;
					border-radius: 50rpx;
					font-size: 32rpx;
				}
			}
			.btn::after{ border: none;}
		}
		.fixed{
			position: fixed;
			bottom: 30rpx;
			left: 0;
			right: 0;
		}
		.download{
			width: 90%;
			border-radius: 50rpx;
			height: 40rpx;
			padding: 20rpx 0;
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			margin-bottom: 40rpx;
			.xian{
				width: 2rpx;
				height: 100%;
				background-color: white;
			}
			&-item{
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				.icon{
					font-size: 40rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
</style>