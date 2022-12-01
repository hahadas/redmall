<template>
	<view>
		<view class="section flex flex-between">
			<input v-model="form.mobile" maxlength="11" type="number" placeholder="新的手机号" placeholder-style="font-size:30rpx" class="password flex-grow"/>
		</view>
		<view class="section flex flex-between">
			<input v-model="form.code" maxlength="6" type="number" placeholder="短信验证码" placeholder-style="font-size:30rpx" class="password flex-grow"/>
			<sms :phone="form.mobile" typeCode="3"></sms>
		</view>
		<view class="section flex flex-between">
			<input :password="!showPwd" v-model="password" maxlength="24"  placeholder="登入密码" placeholder-style="font-size:30rpx" class="password flex-grow"/>
			<text class="iconfont icon" @click="showPwd = !showPwd">{{showPwd?'\ue7c0':'\ue7bf'}}</text>
		</view>
		<view class="btn-area">
			<button type="primary" :loading="loading" :disabled="loading" @click="formSubmit()" class="buttons bg-base">确认</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import sms from "@/components/sms.vue"
	export default{
		components:{ sms },
		data() {
			return {
				loading: false,
				showPwd: false,
				password: "",
				form: {},
				rsaKey: ""
			};
		},
		async onLoad() {
			let res = await this.$http("GET", url.login.getPublicKey)
			this.rsaKey = res.data
		},
		methods: {
			...mapMutations(['logout']),
			async formSubmit(){
				if (!this.form.mobile) return this.$msg("请输入新的手机号码")
				if (!this.form.code) return this.$msg("请输入短信验证码")
				if (!this.password) return this.$msg("请输入登入密码")
				this.loading = true
				this.form.password = await publics.passwordEncryption(this.rsaKey,this.password)
				this.$http("POST", url.user.updateMobile, this.form).then(res =>{
					this.$msg("修改成功,请重新登入")
					this.logout()
					uni.removeStorageSync('smsTime')
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.section{
		width: 90%;
		margin: 20rpx auto;
		padding: 18rpx 0;
		background: #F2F2F2;
		border-radius: 10upx;
		.password{
			padding-left: 10rpx;
		}
		.icon{
			margin-right: 20rpx;
			font-size: 36rpx;
			color: #999;
		}
	}
	.remind{
		width: 90%;
		height: 80upx;
		margin: 20upx auto;
		font-size: 26upx;
		color: #A9A9A9;
		height: 80upx;
		line-height: 80upx;
		display: block;
	}
	.btn-area{
		width: 90%;
		margin: 10upx auto;
	}
</style>

