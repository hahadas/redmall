<template>
	<view class="main">
		<image src="/static/merchants/examples.png" mode="widthFix" class="top"></image>
		<view class="flex flex-between cell" @click="selectLogo('logoImage')">
			<text class="name">点击上传店铺LOGO</text>
			<view class="flex flex-center img" v-if="!logoImage">
				<text class="iconfont icon">&#xe64d;</text>
			</view>
			<image :src="logoImage" mode="" class="img" v-else></image>
		</view>
		<view class="list">
			<view class="list-item">
				<text class="label">店铺名称：</text>
				<input type="text" :maxlength="30" placeholder="请输入店铺名称" v-model="infor.name" class="input"/>
			</view>
			<view class="list-item">
				<text class="label">联系电话：</text>
				<input type="number" :maxlength="11" class="input" v-model="infor.mobile" placeholder="请输入店铺联系电话" />
			</view>
			<view class="list-item" @click="visible = true">
				<text class="color-purple flex-grow label">{{pickerText||'选择省/市/区'}}</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
			<view class="list-item" v-if="pickerText">
				<text class="color-purple flex-grow label">{{infor.addressDetails}}</text>
			</view>
			<view class="list-item bor-no">
				<input type="text" :maxlength="50" class="input" v-model="infor.addressSupplement" placeholder="补充具体地址" />
			</view>
		</view>
		<view class="cell" style="height: auto; padding: 30rpx;">
			<text class="name">店铺简介：</text>
			<textarea 
				placeholder="请输入您的店铺简介(80字以内)" :maxlength="80" 
				v-model="infor.introduce" 
				class="font36 color-b5" style="margin-top: 10rpx;width: 100%;"
				@keydown.enter="keydown"/>
			<!-- <input type="text" placeholder="请输入您的店铺简介(80字以内)" :maxlength="80" v-model="infor.introduce" class="flex-grow font36"/> -->
		</view>
		<view class="list">
			<view class="list-item">
				<text class="label">企业名称：</text>
				<input type="text" :maxlength="30" placeholder="请输入企业名称" v-model="infor.nameOfEnterprise" class="input"/>
			</view>
			<view class="list-item">
				<text class="label">信用代码：</text>
				<input type="text" class="input" v-model="infor.socialCreditCode" placeholder="请输入企业社会信用代码" />
			</view>
			
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('businessLicenseImg')">
			<text><text class="color-red">*</text>营业执照：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/business.png" mode="" class="img" v-if="!businessLicenseImg"></image>
				<image :src="businessLicenseImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('foodBusinessLicenseImg')">
			<text><text class="color-red">*</text>食品经营许可证：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!foodBusinessLicenseImg"></image>
				<image :src="foodBusinessLicenseImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('legalIdNumberJustImg')">
			<text><text class="color-red">*</text>法人身份证正面：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!legalIdNumberJustImg"></image>
				<image :src="legalIdNumberJustImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('legalIdNumberBackImg')">
			<text><text class="color-red">*</text>法人身份证反面：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!legalIdNumberBackImg"></image>
				<image :src="legalIdNumberBackImg" mode="" class="image" v-else></image>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uplodingImg('legalHealthCertificateImg')">
			<text>法人健康证：</text>
			<view class="flex flex-center box">
				<image src="/static/merchants/license.png" mode="" class="img" v-if="!legalHealthCertificateImg"></image>
				<image :src="legalHealthCertificateImg" mode="" class="image" v-else></image>
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
		<view style="height: 120rpx;"></view>
		<view class="flex flex-center fixed">
			<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="commit()">提交申请</button>
		</view>
		
		<w-picker
			:visible.sync="visible"
			ref="mpvueCityPicker"
			mode="region"
			:value="positionValue"
			@confirm="onConfirm"
			themeColor="#3a2397"
		></w-picker>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import upload from "@/common/http/upload.js";
	import publics from "@/common/utils/public.js"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	
	export default{
		components: { wPicker, avatar },
		data(){
			return {
				visible:false,
				loading: false,
				positionValue: [],
				pickerText: '',
				infor: {},
				callbackList: [],
				logoImage: "", // 店铺logo
				businessLicenseImg: "", // 营业执照
				foodBusinessLicenseImg: "", // 食品经营许可证
				legalIdNumberJustImg: "",  // 法人身份证正面
				legalIdNumberBackImg: "",  // 法人身份证反面
				legalHealthCertificateImg: "",  // 法人健康证
				othreOneImg: "",  // 其它图片01
				othreTwoImg: "",  // 其它图片02
				othreThreeImg: "",  // 其它图片03
				isEdit: false
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
				this.logoImage = examineData.logoImage
				this.businessLicenseImg = examineData.businessLicenseImg
				this.foodBusinessLicenseImg = examineData.foodBusinessLicenseImg
				this.legalIdNumberJustImg = examineData.legalIdNumberJustImg
				this.legalIdNumberBackImg = examineData.legalIdNumberBackImg
				this.legalHealthCertificateImg = examineData.legalHealthCertificateImg
				this.othreOneImg = examineData.othreOneImg
				this.othreTwoImg = examineData.othreTwoImg
				this.othreThreeImg = examineData.othreThreeImg
				let addrObj = publics.getLngAndLatByCode(examineData.threeAdcode)
				if (addrObj){
					this.pickerText = ""
					addrObj.map(v=>{
						this.pickerText = this.pickerText + v.name
						this.positionValue.push(v.name)
					})
				}
			}
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
					upload.getOssSignature(v.path, 10, 1).then(data=>{
						upload.uploadImageOss(data, false).then(list=>{
							num++
							_this.infor[v.name] = JSON.stringify({
								resourceTemporaryUUID: list[0].resourceTemporaryUUID,
								ossWidth: v.ossWidth,
								ossHeight: v.ossHeight,
								size: v.size
							})
							if (num === _this.callbackList.length) {
								uni.hideLoading();
								let path = this.isEdit ? url.store.updateApply : url.store.submitApply
								_this.$http('POST', path, _this.infor).then(res =>{
									uni.showModal({
										content: '商户入驻申请提交成功,请耐心等待,审核结果会通过您的手机短信通知',
										showCancel: false,
										success: e => {
											_this.$navigateBack(2)
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
				if (!this.logoImage) {
					return "请上传商家Logo图片"
				} else if (!this.infor.name){
					return "请输入店铺名称"
				} else if (!this.infor.mobile){
					return "请输入商家联系电话"
				} else if (!this.pickerText){
					return "请选择商家所在位置"
				} else if (!this.infor.nameOfEnterprise){
					return "请输入企业名称"
				} else if (!this.infor.socialCreditCode){
					return "请输入企业社会信用代码"
				} else if (!this.businessLicenseImg){
					return "请上传营业执照照片"
				} else if (!this.foodBusinessLicenseImg){
					return "请上传食品经营许可证照"
				} else if (!this.legalIdNumberJustImg){
					return "法人身份证正面照"
				} else if (!this.legalIdNumberBackImg){
					return "法人身份证反面照"
				} else {
					return false
				}
			},
			onConfirm(e) {
				let _this = this
				this.pickerText = e.result
				this.infor.oneAdcode = e.obj.province.value
				this.infor.twoAdcode = e.obj.city.value
				this.infor.threeAdcode = e.obj.area.value
				let addressInfo = e.obj.area
				uni.chooseLocation({
					longitude: addressInfo.centerLng.toString(),
					latitude: addressInfo.centerLat.toString(),
					success(res) {
						if (res.address.startsWith(e.result)){
							_this.infor.addressDetails = res.address.split(e.result)[1]
						} else if (res.name === '地图位置' || res.name === res.address){
							_this.infor.addressDetails = res.address
						} else {
							_this.infor.addressDetails = res.name + res.address
						}
						_this.infor.lng = res.longitude
						_this.infor.lat = res.latitude
						_this.$forceUpdate()
					}
				})
			},
			selectDetail(){
				let _this = this
				uni.chooseLocation({
					longitude: _this.addressInfo.centerLng.toString(),
					latitude: _this.addressInfo.centerLat.toString(),
					success(res) {
						if (res.address.startsWith(_this.pickerText)){
							_this.infor.addressDetails = res.address.split(_this.pickerText)[1]
						} else if (res.name === '地图位置' || res.name === res.address){
							_this.infor.addressDetails = res.address
						} else {
							_this.infor.addressDetails = res.name + res.address
						}
						_this.infor.lng = res.longitude
						_this.infor.lat = res.latitude
						_this.$forceUpdate()
					}
				})
			},
			// 上传图片
			selectLogo(){
				upload.showAvatarModal(this, 500, 500)
			},
			myUpload(rsp) {
				let _this = this
				this.callbackList.forEach((v, i)=>{
					if (v.name === "logoImage") {
						this.callbackList.splice(i, 1)
						return false
					}
				})
				this.logoImage = rsp.path
				uni.getImageInfo({
					src: rsp.path,
					success: function (image) {
						_this.callbackList.push({
							name: "logoImage",
							path: rsp.path,
							ossWidth: image.width,
							ossHeight: image.height
						})
					}
				});
			},
			uplodingImg (name) {
				let _this = this
				this.callbackList.forEach((v, i)=>{
					if (v.name === name) {
						this.callbackList.splice(i, 1)
						return false
					}
				})
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
			},
			keydown(){
				return false
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.top{
			width: 100%;
			margin-bottom: 10rpx;
			display: block;
		}
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