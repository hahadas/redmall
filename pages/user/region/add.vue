<template>
	<view>
		<view class="flex flex-align-center form">
			<text class="label">代理账号</text>
			<input type="number" :maxlength="11" class="flex-grow" v-model="form.agentUserName" placeholder-style="fontSize:32rpx" placeholder="请输入代理账号" />
		</view>
		<view class="flex flex-align-center form">
			<text class="label">代理地区</text>
			<picker class="flex-grow flex flex-space-end" mode="selector" range-key="name" :value="areaIndex" :range="areaList" @change="pickerChange">
				<view class="flex flex-align-center color-b9">
					<text v-if="areaList.length > 0">{{areaList[areaIndex].name}}</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</picker>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">分润比例</text>
			<input type="number" class="flex-grow" v-model="form.areaReward" placeholder-style="fontSize:32rpx" placeholder="请输入分润比例" />
			<text class="font28 color-b9">%</text>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">登入密码</text>
			<input type="password" class="flex-grow" v-model="password" placeholder-style="fontSize:32rpx" placeholder="请输入登入密码" />
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave">确定</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import sysAddress from "@/common/utils/sysAddress.js"
	export default{
		data(){
			return {
				loading: false,
				form: {},
				password: "",
				areaList: [],
				areaIndex: 0,
				rsaKey: ""
			}
		},
		async onLoad(opt) {
			if (opt.adCode) {
				let list = []
				sysAddress.map(v => {
					if (v.padcode === parseInt(opt.adCode)){
						list.push(v)
					}
				})
				this.areaList = list
			}
			let res = await this.$http("GET", url.login.getPublicKey)
			this.rsaKey = res.data
		},
		methods:{
			async onSave(){
				if (this.loading) return
				this.loading = true
				this.form.loginPwd = await publics.passwordEncryption(this.rsaKey, this.password)
				this.$http("POST", url.user.addAgentRegion, this.form).then(res =>{
					this.$msg(res.data)
					this.$navigateBack()
					this.loading = false
				}).catch(()=>{
					this.loading = false
				})
			},
			pickerChange(e){
				this.areaIndex = e.detail.value
				this.form.adCode = this.areaList[this.areaIndex].adcode
			}
		}
	}
</script>

<style scoped lang="scss">
	.form{
		background-color: #FFFFFF;
		padding: 26rpx 20rpx;
		font-size: 32rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.label{
			margin-right: 20rpx;
		}
	}
	.btn{
		width: 90%;
		margin-top: 80rpx;
	}
</style>
