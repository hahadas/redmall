<template>
	<view class="main">
		<view class="flex flex-between cell" @click="selectImg('logoImage')">
			<text class="name">店铺LOGO</text>
			<image :src="logoImage" mode="" class="img"></image>
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
			<view class="list-item" v-if="infor.addressDetails" @click="selectDetail">
				<text class="color-purple flex-grow label">{{infor.addressDetails}}</text>
			</view>
			<view class="list-item bor-no">
				<input type="text" :maxlength="50" class="input" v-model="infor.addressSupplement" placeholder="补充具体地址" />
			</view>
		</view>
		<view class="flex flex-column textarea">
			<text class="name">店铺简介：</text>
			<textarea :maxlength="80" placeholder="请输入您的店铺简介(80字以内)" v-model="infor.introduce" class="areaTxt" @keydown.enter="keydown" />
			<!-- <input type="text" placeholder="请输入您的店铺简介(80字以内)" :maxlength="80" v-model="infor.introduce" class="flex-grow font36"/> -->
		</view>
		<view class="flex flex-column textarea">
			<text class="name">店铺公告：</text>
			<textarea :maxlength="180" placeholder="请输入您的店铺公告(180字以内)" v-model="infor.notice" class="areaTxt" @keydown.enter="keydown" />
			<!-- <input type="text" placeholder="请输入您的店铺简介(80字以内)" :maxlength="80" v-model="infor.introduce" class="flex-grow font36"/> -->
		</view>
		<view class="grid flex flex-between">
			<text>店铺背景图：</text>
			<view class="flex flex-center box" @click="uplodingImg('backgroundImage')">
				<text class="iconfont font60 color-b9" v-if="!backgroundImage">&#xe64d;</text>
				<image :src="backgroundImage" mode="" class="image" v-else></image>
			</view>
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="commit()">修改</button>
		<w-picker
			:visible.sync="visible"
			:value="positionValue"
			ref="mpvueCityPicker"
			mode="region"
			@confirm="onConfirm"
			themeColor="#3a2397"
		></w-picker>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import upload from "@/common/http/upload.js"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	
	export default{
		components: {
		   wPicker, avatar
		},
		data(){
			return {
				loading: false,
				visible: false,
				pickerText: '',
				positionValue: [],
				infor: {},
				callbackList: [],
				logoImage: "",
				backgroundImage: "",
				addressInfo: {}
			}
		},
		onLoad(){
			this.$http("GET", url.store.getStoreInfo).then(res=>{
				this.infor = res.data
				delete this.infor.createTime
				this.logoImage = res.data.logoImage
				this.backgroundImage = res.data.backgroundImage
				if (res.data.notice === 'null') {
					this.infor.notice = ""
				}
				let addrObj = publics.getLngAndLatByCode(res.data.threeAdcode)
				if (addrObj){
					this.pickerText = ""
					addrObj.map(v=>{
						this.pickerText = this.pickerText + v.name
						this.positionValue.push(v.name)
					})
				}
			})
		},
		methods:{
			async commit(){
				if (!this.infor.name){
					return this.$msg("请输入店铺名称")
				} else if (!this.infor.mobile){
					return this.$msg("请输入店铺联系电话")
				} else if (!this.infor.introduce){
					return this.$msg("请输入店铺简介")
				}
				this.loading = true
				let callbackList = this.callbackList
				for(let i = 0; i<callbackList.length; i++){
					let v = callbackList[i]
					let data = await upload.getOssSignature(v.path, 10, 1)
					let list = await upload.uploadImageOss(data)
					this.infor[v.name] = JSON.stringify({
						resourceTemporaryUUID: list[0].resourceTemporaryUUID,
						ossWidth: v.ossWidth,
						ossHeight: v.ossHeight,
						size: v.size
					})
				}
				this.httpReq()
			},
			httpReq(){
				this.$http("POST", url.store.editStoreInfo, this.infor).then(res =>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			},
			onConfirm(e) {
				let _this = this
				this.pickerText = e.result
				this.infor.oneAdcode = e.obj.province.value
				this.infor.twoAdcode = e.obj.city.value
				this.infor.threeAdcode = e.obj.area.value
				let addressInfo = e.obj.area
				this.addressInfo = addressInfo
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
			selectImg(){
				upload.showAvatarModal(this, 500, 500)
			},
			myUpload(rsp){
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
			uplodingImg(name){
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
		.textarea{
			padding: 30rpx;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			background-color: white;
			.areaTxt{
				margin-top: 10rpx;
				width: 100%;
				font-size: 36rpx;
			}
		}
		.name{
			color: #555;
			font-size: 36rpx;
		}
		.cell{
			padding: 0 30rpx;
			height: 130rpx;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			background-color: white;
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
			.cell{
				height: auto;
				flex-direction: column;
				align-items: flex-start;
				padding: 30rpx 0;
				.textarea{
					height: 200rpx;
					width: 100%;
					margin-top: 20rpx;
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
				.img{
					width: 187rpx;
					height: 111rpx;
				}
				.image{
					width: 100%;
					height: 100%;
				}
			}
			
		}
		.btn{
			margin: 50rpx 0;
			border-radius: 50rpx;
		}
	}
</style>