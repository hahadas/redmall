<template>
	<view class="main" :style="{backgroundImage: 'url('+ staticUrl + 'login/login_bg1.png)'}">
		<view class="flex flex-center flex-column fixed">
			<view class="flex flex-between btn color-purple">
				<view class="flex flex-center btn-item bg-w" @tap="$navigateTo('login')">
					<text class="iconfont" style="font-size: 52rpx;">&#xe60f;</text>
					<text class="font28">手机登录</text>
				</view>
				<view class="flex flex-center btn-item bg-w" @tap="$navigateTo('register')">
					<text class="iconfont icon">&#xe62d;</text>
					<text class="font28">手机注册</text>
				</view>
			</view>
			<text class="color-w font24" @tap="$navigateTo('/pages/notice/agreement?id='+noticeId)">登录注册即表示同意《用户协议及隐私策略》</text>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				noticeId: getApp().privacyAgreementNoticeId,//隐私协议ID
				staticUrl: this.$staticUrl
			}
		},
		onLoad() {
			// 防止token过期之后定时器还在执行
			getApp().closeInterval()
			// 禁止侧滑返回
			// #ifdef APP-PLUS
			let page = this.$mp.page.$getAppWebview();
			page.setStyle({ popGesture: 'none' });
			// #endif
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-repeat: no-repeat;
		background-size: 100% 100%;
		min-height: 100vh;
		.top{
			width: 650rpx;
			margin-top: 100rpx;
		}
		.fixed{
			position: fixed;
			bottom: 50rpx;
			left: 0;
			right: 0;
			.btn{
				width: 690rpx;
				margin-bottom: 80rpx;
				&-item{
					border-radius: 50rpx;
					width: 300rpx;
					height: 80rpx;
					.icon{
						font-size: 48rpx;
						margin-right: 10rpx;
					}
				}
			}
			.register{
				margin-top: 30rpx;
				margin-bottom: 50rpx;
			}
		}
	}
</style>