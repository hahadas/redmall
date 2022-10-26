<template>
	<view class="main">
		<view class="flex flex-between cell" @click="uploadAvatar()">
			<text class="name">本人头像</text>
			<view class="flex flex-center img" v-if="!realHeadPortrait">
				<text class="iconfont icon">&#xe64d;</text>
			</view>
			<image :src="realHeadPortrait" mode="" class="img" v-else></image>
		</view>
		<view class="list">
			<view class="list-item">
				<text class="label">真实姓名：</text>
				<input type="text" :maxlength="20" placeholder="请输入真实姓名" v-model="infor.realName" class="input"/>
			</view>
			<view class="list-item">
				<text class="label">身份证号：</text>
				<input type="text" :maxlength="20" class="input flex-grow" v-model="infor.idNumber" placeholder="请输入身份证号" />
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('idNumberJustImg')">
			<text><text class="color-red">*</text>身份证正面：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!idNumberJustImg"></image>
				<image :src="idNumberJustImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('idNumberBackImg')">
			<text><text class="color-red">*</text>身份证反面：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!idNumberBackImg"></image>
				<image :src="idNumberBackImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('healthCertificateImg')">
			<text>健康证：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!healthCertificateImg"></image>
				<image :src="healthCertificateImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('othreOneImg')">
			<text>其他证照：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!othreOneImg"></image>
				<image :src="othreOneImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('othreTwoImg')">
			<text>其他证照：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!othreTwoImg"></image>
				<image :src="othreTwoImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('othreThreeImg')">
			<text>其他证照：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!othreThreeImg"></image>
				<image :src="othreThreeImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="flex flex-center" style="margin-top: 50rpx;">
			<text class="font26 color-b9">
				提交申请即表示同意喝酒么的<text class="color-purple" @click="jumpTo()">《天使入驻条款》</text>
			</text>
		</view>
		<!-- <view style="height: 80rpx;"></view> -->
		<view class="flex flex-center fixed">
			<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="commit()">提交申请</button>
		</view>
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import upload from "@/common/http/upload.js";
	import url from '@/common/http/url.js';
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	export default{
		components:{ avatar },
		data(){
			return {
				loading: false,
				infor: {},
				isEdit: false,
				callbackList: [],
				realHeadPortrait: "",
				idNumberJustImg: "",
				idNumberBackImg: "",
				healthCertificateImg: "",
				othreOneImg: "",
				othreTwoImg: "",
				othreThreeImg: "",
				noticeId: 0
			}
		},
		onLoad(opt){
			let examineData = uni.getStorageSync("examineData")
			uni.removeStorageSync("examineData")
			if (examineData) {
				if (examineData.status === 3) this.isEdit = true
				this.infor = examineData
				delete this.infor.updateTime
				delete this.infor.createTime
				this.realHeadPortrait = examineData.realHeadPortrait
				this.idNumberJustImg = examineData.idNumberJustImg
				this.idNumberBackImg = examineData.idNumberBackImg
				this.healthCertificateImg = examineData.healthCertificateImg
				this.othreOneImg = examineData.othreOneImg
				this.othreTwoImg = examineData.othreTwoImg
				this.othreThreeImg = examineData.othreThreeImg
			}
			this.$http("GET", url.common.privacyAgreement).then(res =>{
				if (res.data && res.data.length > 0) {
					res.data.forEach(v => {
						if (v.keyCode === "platform_privacy_agreement_distribution"){
							this.noticeId = v.keyValue
							return
						}
					})
				}
			})
		},
		methods:{
			commit(){
				let _this = this
				if (this.regForm()) return this.$msg(this.regForm())
				this.loading = true
				let num = 0
				uni.showLoading({
					mask: true
				});
				this.callbackList.forEach(v =>{
					upload.getOssSignature(v.path, 11, 1).then(data=>{
						upload.uploadImageOss(data, false).then(list=>{
							num++
							_this.infor[v.name] = JSON.stringify({
								resourceTemporaryUUID: list[0].resourceTemporaryUUID,
								ossWidth: v.ossWidth,
								ossHeight: v.ossHeight,
								size: v.size || ""
							})
							if (num === _this.callbackList.length) {
								let path = this.isEdit ? url.distributor.updateApply : url.distributor.submitApply
								_this.$http('POST', path, _this.infor).then(res =>{
									uni.hideLoading();
									uni.showModal({
										content: '申请提交成功,请耐心等待,审核结果会通过您的手机短信通知',
										showCancel: false,
										success: e => {
											if (this.isEdit) {
												_this.$navigateBack(2)
											} else {
												_this.$navigateBack()
											}
										}
									});
								}).catch(()=>{
									_this.loading = false
								})
							}
						})
					})
				})
			},
			regForm(){
				if (!this.realHeadPortrait) {
					return "请上传本人真实头像"
				} else if (!this.infor.realName) {
					return "请输入真实姓名"
				} else if (!this.infor.idNumber) {
					return "请输入身份证号"
				} else if (!this.idNumberJustImg) {
					return "请上传身份证正面照"
				} else if (!this.idNumberBackImg) {
					return "请上传身份证反面照"
				} else {
					return false
				}
			},
			// 头像
			uploadAvatar(){
				upload.showAvatarModal(this, 400, 400)
			},
			myUpload(rsp){
				this.uplodingImg('realHeadPortrait', rsp.path)
			},
			// 上传图片
			uplodingImg (name, path) {
				let _this = this
				this.callbackList.forEach((v, i)=>{
					if (v.name === name) {
						this.callbackList.splice(i, 1)
						return false
					}
				})
				if (path) {
					this[name] = path
					uni.getImageInfo({
						src: path,
						success: function (image) {
							_this.callbackList.push({
								name: name,
								path: path,
								ossWidth: image.width,
								ossHeight: image.height
							})
						}
					});
				} else {
					uni.chooseImage({
						count: 1,
						success: (res) => {
							let tempFilePath = res.tempFilePaths[0]
							_this[name] = tempFilePath
							uni.getImageInfo({
								src: tempFilePath,
								success: function (image) {
									_this.callbackList.push({
										name: name,
										path: tempFilePath,
										ossWidth: image.width,
										ossHeight: image.height,
										size: res.tempFiles[0].size
									})
								}
							});
							
						}
					})
				}
			},
			jumpTo(){
				this.$navigateTo("/pages/notice/agreement?id="+this.noticeId)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.cell{
			padding: 0 30rpx;
			height: 130rpx;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			background-color: white;
			.name{
				color: #555;
				font-size: 36rpx;
			}
			.img{
				border-radius: 10rpx;
				width: 110rpx;
				height: 110rpx;
				background-color: #928add;
				overflow: hidden;
				.icon{
					font-size: 60rpx;
					color: white;
				}
			}
		}
		.list{
			border-radius: 10rpx;
			background-color: white;
			padding: 0 30rpx;
			margin-bottom: 10rpx;
			&-item{
				display: flex;
				align-items: center;
				height: 120rpx;
				border-bottom: 2rpx solid #f5f3f7;
				color: #555;
				font-size: 36rpx;
				.input{
					font-size: 36rpx;
				}
				.icon{
					font-size: 44rpx;
				}
			}
		}
		.grid{
			padding: 20rpx 30rpx;
			font-size: 36rpx;
			color: #555;
			background-color: white;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			.box{
				width: 350rpx;
				height: 250rpx;
				border: 2rpx solid #EEEEEE;
				border-radius: 14rpx;
				position: relative;
				.img{
					width: 187rpx;
					height: 111rpx;
				}
				.image{
					width: 100%;
					height: 100%;
				}
				.del{
					position: absolute;
					top: -20rpx;
					right: -20rpx;
					font-size: 40rpx;
				}
			}
			
		}
		.fixed{
			position: fixed;
			bottom: 30rpx;
			left: 0rpx;
			right: 0rpx;
			.btn{
				width: 710rpx;
				border-radius: 50rpx;
			}
		}
	}
</style>