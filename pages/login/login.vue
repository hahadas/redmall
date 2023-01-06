<template>
	<view class="main bg-w">
		<view :style="{'height': statusBarHeight + 'px'}"></view>
		<text class="iconfont color-b3 nav" @tap="$navigateBack()">&#xe771;</text>
		<text class="title">账号密码登录</text>
		<view class="form">
			<view class="form-item flex flex-align-end">
				<input type="number" :maxlength="11" class="flex-grow" placeholder="请输入手机号" placeholder-class="placeholder" v-model="form.username" />
			</view>
			<view class="form-item flex flex-align-end">
				<input :password="!showPassword" placeholder="请输入登录密码" placeholder-class="placeholder" class="flex-grow" v-model="password" />
				<text class="iconfont font40 eye" @tap="showPassword = !showPassword" v-if="showPassword">&#xe7c0;</text>
				<text class="iconfont font40 eye" @tap="showPassword = !showPassword" v-else>&#xe7bf;</text>
			</view>
			<view class="btn flex flex-center flex-column">
				<button type="primary" class="bg-base btn-item" :loading="loading" :disabled="loading" @tap="onSumbit">登录</button>
				<!-- <button type="primary" class="btn-item" v-if="isSupport" @tap="loginAuth">一键登录</button> -->
				<text class="font28 color-purple" @tap="jumpTo('forget')">忘记密码</text>
			</view>
			<!-- #ifdef H5 -->
			<view class="download">
				<view class="item bg-base" @click="download(androidUrl)">
					<text class="iconfont icon">&#xe609;</text>
					<text class="font26">安卓下载</text>
				</view>
				<!-- <text class="font28 color-purple">苹果用户请先使用网页版</text> -->
				<view class="item bg-base" @click="download(iosUrl)">
					<text class="iconfont icon">&#xe607;</text>
					<text class="font26">苹果下载</text>
				</view>
			</view>
			<!-- #endif -->
			
		</view>
		<view class="flex flex-center flex-column fixed">
			<!-- <text class="color-b9 font24" @tap="jumpTo('/pages/setting/privacy?status=hide')">登录注册即表示同意《用户协议及隐私策略》</text> -->
			<text class="color-b9 font24" @tap="$navigateTo('/pages/notice/agreement?id='+noticeId)">登录注册即表示同意《用户协议及隐私策略》</text>
		</view>
	</view>
</template>

<script>
	import mix from "./mix.js"
	// const jv = uni.requireNativePlugin('JG-JVerification')
	export default{
		mixins: [mix],
		data(){
			return {
				isSupport: false,
				noticeId: getApp().privacyAgreementNoticeId,//隐私协议ID
			}
		},
		onLoad() {
			// this.init()
		},
		methods:{
			onSumbit(){
				if (!this.form.username) return this.$msg("请输入手机号")
				if (this.form.username.trim().length !== 11) return this.$msg("手机号格式有误")
				if (!this.password) return this.$msg("请输入密码")
				this.onLogin(this.form)
			},
			// 初始化
			// init:function(){
			// 	let self = this;
			// 	jv.init({
			// 		timeout:5000,
			// 		isProduction:false,
			// 	},result=>{
			// 		console.log("初始化。。。。", result)
			// 		jv.checkVerifyEnable(res=>{
			// 			self.isSupport = res.enable;
			// 			console.log("判断网络环境是否支持", res)
			// 		})
			// 	});
			// },
			// loginAuth:function(){
			// 	let self = this;
			// 	// 登录预取号
			// 	jv.preLogin(5000,res=>{
			// 		// 一键登入
			// 		jv.loginAuth({
			// 			autoFinish:true,
			// 			timeout:5000
			// 		},result=>{
			// 			console.log(result,"---")
			// 		},event=>{
			// 			console.log("loginAuthevent:"+JSON.stringify(event));
			// 		})
			// 	})
			// }
		
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
		.fixed{
			position: fixed;
			bottom: 50rpx;
			left: 0;
			right: 0;
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
