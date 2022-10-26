<template>
	<view class="main bg-w flex flex-column flex-align-center">
		<textarea cols="30" rows="10" class="textarea" v-model="personalSignature" :maxlength="100" placeholder="请填写你的个性签名"></textarea>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave"><text class="font34">提交</text></button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				loading: false,
				personalSignature: ""
			}
		},
		onLoad(opt) {
			this.personalSignature = opt.personalSignature === "null" ? "" : opt.personalSignature
		},
		methods:{
			onSave(){
				if (!this.personalSignature) return this.$msg("请填写你的个性签名")
				this.loading = true
				this.$http("POST", url.user.editUserInfo, {personalSignature: this.personalSignature}).then(res =>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		height: 100vh;
		.textarea{
			padding: 20rpx;
			border: 2rpx solid #EEEEEE;
			border-radius: 20rpx;
			margin: 50rpx;
			
		}
		.btn{
			width: 70%;
			margin-top: 50rpx;
		}
	}
</style>
