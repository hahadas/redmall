<template>
	<view>
		<text class="remind">警告!</text>
		<text class="remind" style="font-size: 40upx;">该操作将会删除您账户内的所有信息，包括您的账号！删除后将不能找回，因为该操作是永久性的！请您慎重！</text>
		<view class="section flex flex-between">
			<input v-model="originalPassword" :password="!oldPwd" maxlength="24"  placeholder="请输入登录密码进行确认" placeholder-style="font-size:15px" class="password flex-grow"/>
			<text class="iconfont icon" @click="oldPwd = !oldPwd">{{oldPwd?'\ue7c0':'\ue7bf'}}</text>
		</view>
		<view class="btn-area">
			<button type="primary" :loading="loading" :disabled="loading" @click="formSubmit()" class="buttons bg-base">确认删除我的账户</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex';
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data() {
			return {
				loading: false,
				oldPwd: false,
				newPwd: false,
				originalPassword:'',
				password:'',
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
				if (!this.originalPassword) return this.$msg("请输入您的登入密码")
				this.loading = true
				let params = { 
					loginPwd: await publics.passwordEncryption(this.rsaKey, this.originalPassword)
				};
				this.$http("POST", url.user.delMyUserInfo, params).then(res =>{
					this.$msg("账户删除成功！")
					this.logout()
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
		text-align: center;
		margin: 20upx auto;
		font-size: 60upx;
		color: #ff0000;
		height: auto;
		line-height: 80upx;
		display: block;
	}
	.btn-area{
		width: 90%;
		margin: 10upx auto;
	}
</style>

