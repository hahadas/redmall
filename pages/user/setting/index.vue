<template>
	<view class="container">
		<view class="bg-w">
			<view class="list-cell m-t" @click="navTo('/pages/user/setting/personal')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">个人资料</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" @click="navTo('/pages/user/address/index')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">收货地址</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" @click="navTo('/pages/user/payment/index')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">收款信息</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" @click="navTo('reminder')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">新消息提醒</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
		</view>
		<view class="bg-w">
			<view class="list-cell m-t" @click="navTo('updateMobile')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">修改手机号</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="navTo('editPassword')">
				<text class="cell-tit">修改密码</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="navTo('payPwd')">
				<text class="cell-tit">支付密码</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="navTo('/pages/login/forget')">
				<text class="cell-tit">忘记密码？找回密码</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
		</view>
		<view class="bg-w">
			<view class="list-cell m-t" @click="navTo('blackList')" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">黑名单</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell m-t" @click="navTo('/pages/notice/agreement?id='+aboutId)" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">关于redMall</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<view class="b-b"></view>
			<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="onContact">
				<text class="cell-tit">联系客服</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="b-b"></view>
			<view class="list-cell" @click="versionApp">
				<text class="cell-tit">检查更新</text>
				<text class="cell-tip">当前版本 {{version}}</text>
				<text class="cell-more iconfont">&#xe770;</text>
			</view>
			<!-- #endif -->
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
		<view class="fixed">
			<text class="p1" @tap="navTo('privacy?status=hide')">服务协议｜隐私政策</text>
			<text class="p2">Copyright ©️ 2020 RedMall.All Rights Reserved.</text>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from "vuex"
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				version: "1.0.0",
				aboutId: 0,
				mobileList: []
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.version = plus.runtime.version;
			// #endif
			// 客服
			this.$http("GET", url.common.customerService).then(res =>{
				let mobileList = res.data.mobile
				mobileList.map(v => { v.type = "电话"})
				let qqList = res.data.qq
				qqList.map(v => { v.type = "QQ"})
				let wechatList = res.data.wechat
				wechatList.map(v => { v.type = "微信"})
				this.mobileList = wechatList.concat(qqList).concat(mobileList)
			})
			// 关于我们
			this.$http("GET", url.common.getAboutId).then(res =>{
				this.aboutId = res.data
			})
		},
		methods:{
			...mapMutations(["logout"]),
			versionApp(){
				// #ifdef APP-PLUS
				getApp().versionApp(true);
				// #endif
				// #ifndef APP-PLUS
				this.$msg("当前版本不支持检测更新～")
				// #endif
			},
			//退出登录
			toLogout() {
				let that = this;
				uni.showModal({
					title: "提示",
					content: '确定要退出登录么',
					success: e => {
						if (e.confirm) {
							that.logout();
						}
					}
				});
			},
			// 联系客服
			onContact(){
				if (this.mobileList.length === 0) return
				let _this = this
				let itemList = []
				let phoneList = []
				this.mobileList.map(v => {
					itemList.push(`[${v.type}]${v.name}(${v.keyValue})`)
					phoneList.push(v.keyValue)
				})
				uni.showActionSheet({
					itemList: itemList,
					success(res) {
						if (itemList[res.tapIndex].indexOf("QQ") > -1) {
							_this.$onCopy(phoneList[res.tapIndex])
							_this.$msg("QQ号已复制, 请打开QQ添加客服联系", 2000)
						} else if (itemList[res.tapIndex].indexOf("微信") > -1){
							_this.$onCopy(phoneList[res.tapIndex])
							_this.$msg("微信号已复制, 请打开微信添加客服联系", 2000)
						} else {
							uni.makePhoneCall({
							    phoneNumber: phoneList[res.tapIndex]
							});
						}
					}
				})
			},
			navTo(path){
				this.$navigateTo(path)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		min-height: 100vh;
		background-color: #f8f8f8;
	}
	.b-b{
		width: 730rpx;
		background-color: #f1f1f1;
		height: 2rpx;
		text-align: right;
		margin-left: 20rpx;
	}
	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn {
			margin-top: 40upx;
			border-radius: 50upx;
			width: 90%;
			margin-left: 2.5%;
			background: linear-gradient(to bottom,  #3a2397 0%, #805df5 100%); 
			.cell-tit {
				color: #FFFFFF;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover {
			background: #fafafa;
		}
		&.m-t {
			margin-top: 16upx;
		}
		.cell-more {
			align-self: baseline;
			font-size: 32rpx;
			color: #909399;
			margin-left: 10upx;
		}
		.cell-tit {
			flex: 1;
			font-size: 30rpx;
			color: #303133;
			margin-right: 10upx;
		}
		.cell-tip {
			font-size: 28rpx;
			color: #909399;
		}
	}
	.fixed{
		// position: fixed;
		// bottom: 30rpx;
		// left: 0;
		// right: 0;
		margin-top: 80rpx;
		margin-bottom: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.p1{
			font-size: 30rpx;
			color: #666;
		}
		.p2{
			font-size: 24rpx;
			color: #999999;
		}
	}
</style>
