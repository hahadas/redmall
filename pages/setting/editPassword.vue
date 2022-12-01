<template>
	<view>
		<view class="section flex flex-between">
			<input v-model="originalPassword" :password="!oldPwd" maxlength="24"  placeholder="请输入原密码" placeholder-style="font-size:15px" class="password flex-grow"/>
			<text class="iconfont icon" @click="oldPwd = !oldPwd">{{oldPwd?'\ue7c0':'\ue7bf'}}</text>
		</view>
		<view class="section flex flex-between">
			<input :password="!newPwd" v-model="password" maxlength="24"  placeholder="请输入新的密码" placeholder-style="font-size:26upx" class="password flex-grow"/>
			<text class="iconfont icon" @click="newPwd = !newPwd">{{newPwd?'\ue7c0':'\ue7bf'}}</text>
		</view>
		<text class="remind">6~24位不含特殊字符的数字、字母组合</text>
		<view class="btn-area">
			<button type="primary" :loading="loading" :disabled="loading" @click="formSubmit()" class="buttons bg-base">确认提交</button>
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
				if (!this.originalPassword) return this.$msg("请输入原密码")
				if (!this.password) return this.$msg("请输入新密码")
				this.loading = true
				let params = { 
					originalPassword: await publics.passwordEncryption(this.rsaKey, this.originalPassword), 
					password: await publics.passwordEncryption(this.rsaKey, this.password)
				};
				this.$http("POST", url.user.editPassword, params).then(res =>{
					this.$msg("密码修改成功,请重新登入")
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

