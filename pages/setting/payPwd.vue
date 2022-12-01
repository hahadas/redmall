<template>
	<view class="main bg-w">
		<view :style="{'height': statusBarHeight + 'px'}"></view>
		<text class="iconfont color-b3 nav" @tap="$navigateBack()">&#xe771;</text>
		<text class="title">支付密码</text>
		<view class="form">
			<view class="form-item flex flex-align-end">
				<input type="number" :disabled="true" :maxlength="11" placeholder="手机号" placeholder-class="placeholder" v-model="form.username" />
			</view>
			<view class="form-item flex flex-align-end">
				<input type="number" :maxlength="6" placeholder="验证码" placeholder-class="placeholder" v-model="form.code" />
				<sms :phone="form.username" typeCode="4"></sms>
			</view>
			<view class="form-item flex flex-align-end">
				<input :password="!showPassword" :maxlength="6" type="number" placeholder="支付密码（长度为6位数字）" placeholder-class="placeholder" class="flex-grow" v-model="password" />
				<text class="iconfont font40 eye" @tap="showPassword = !showPassword" v-if="showPassword">&#xe7c0;</text>
				<text class="iconfont font40 eye" @tap="showPassword = !showPassword" v-else>&#xe7bf;</text>
			</view>
			<view class="form-item flex flex-align-end">
				<input :password="!confirmPwd" :maxlength="6" type="number" placeholder="确认密码（长度为6位数字）" placeholder-class="placeholder" class="flex-grow" v-model="confimpassword" />
				<text class="iconfont font40 eye" @tap="confirmPwd = !confirmPwd" v-if="confirmPwd">&#xe7c0;</text>
				<text class="iconfont font40 eye" @tap="confirmPwd = !confirmPwd" v-else>&#xe7bf;</text>
			</view>
			<view class="btn flex flex-center flex-column">
				<button type="primary" class="bg-base btn-item" :loading="loading" :disabled="loading" @tap="onSave">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import sms from "@/components/sms.vue"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import { mapState } from "vuex"
	export default{
		components: { sms },
		data(){
			return {
				statusBarHeight: getApp().statusBarHeight,
				loading: false,
				rsaKey: "",
				confimpassword: "",
				password: "",
				form: {},
				showPassword: false,
				confirmPwd: false
			}
		},
		computed: {
			...mapState(["userInfo"])
		},
		async onLoad() {
			let res = await this.$http("GET", url.login.getPublicKey)
			this.rsaKey = res.data
			if (this.userInfo.mobile) {
				this.$set(this.form, 'username', this.userInfo.mobile)
			}
		},
		methods: {
			async onSave(){
				if (!this.form.username) return this.$msg("请输入手机号")
				if (!this.form.code) return this.$msg("请输入短信验证码")
				if (!this.password) return this.$msg("请输入密码")
				if (this.confimpassword !== this.password) return this.$msg("两次密码不一致")
				this.loading = true
				this.form.payPassword = await this.passwordEncryption(this.rsaKey, this.password)
				this.$http("POST", url.login.payPasswordByCode, this.form).then(res => {
					if (res.code === 200) {
						this.$msg(res.data)
						this.$navigateBack()
					}
				}).catch(()=>{
					this.loading = false
				})
			},
			passwordEncryption(rsaKey, password){
				return publics.passwordEncryption(rsaKey, password)
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
			margin: 80rpx 50rpx;
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
		.forget{
			margin-top: 20rpx;
		}
		.other{
			width: 100%;
			margin-top: 80rpx;
			.xian{
				color: #e1e3e6;
			}
			.text{
				color: #bebfc1;
				margin: 0 20rpx;
			}
			.icon{
				color: #21b6fa;
				font-size: 80rpx;
				margin: 30rpx 0;
			}
		}
		.fixed{
			position: fixed;
			bottom: 50rpx;
			left: 0;
			right: 0;
		}
	}
</style>
