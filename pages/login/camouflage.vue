<template>
	<view class="main">
		<block v-if="!show">
			<text class="title">活动参与资格报名</text>
			<view class="form">
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="姓名" placeholder-class="placeholder" v-model="form.username" />
				</view>
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="性别" placeholder-class="placeholder" v-model="form.six" />
				</view>
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="年龄" placeholder-class="placeholder" v-model="form.age" />
				</view>
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="身高" placeholder-class="placeholder" v-model="form.height" />
				</view>
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="体重" placeholder-class="placeholder" v-model="form.weight" />
				</view>
				<view class="form-item flex flex-align-end">
					<input class="flex-grow" placeholder="个人简介" placeholder-class="placeholder" v-model="form.content" />
				</view>
				<view class="btn flex flex-center flex-column">
					<button type="primary" class="bg-base btn-item" @tap="onSumbit">提交并支付报名费</button>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="qrcode" @click="tabBarHome">
				<image :src="staticUrl + 'logo_qrcode.jpeg'" class="icon"></image>
				<text class="font36 color-b6" style="background: #3888fff2;padding: 20rpx;color: white;font-weight: bolder;border-radius: 30rpx;margin-top: 50rpx;text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px #2626ef;">
					进入RedMall小程序
				</text>
			</view>
		</block>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	
	export default{
		data() {
			return {
				//staticUrl: getApp().staticUrl,
				staticUrl: this.$staticUrl,
				form: {},
				show: false,
				uniPlatform: uni.getSystemInfoSync().uniPlatform,
			}
		},
		onShow() {
			// 获取 苹果应用商店需要隐藏的页面和功能模块 配置
			if (this.uniPlatform === 'mp-weixin') {
				this.$http("GET", url.common.mpWeiXiHide).then(res => {
					if(res.data){
						this.show = res.data.keyValue === "1" ? false : true
					}
				})
			}else{//其它设备则显示
				this.show = true
			}
		},
		methods: {
			onSumbit() {
				this.$msg("报名成功！当前限时免费，无需报名费!")
				// this.loading = true
			},
			tabBarHome(){
				//跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				uni.reLaunch({
					url: '/pages/home/index'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.main {
		height: 100vh;
		background-color: white;
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
	.qrcode{
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.icon{
			width: 400rpx;
			height: 400rpx;
			margin-bottom: 10rpx;
		}
	}
</style>