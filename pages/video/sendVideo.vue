<template>
	<view>
		<form>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class='iconfont' style="margin-right: 10upx;font-size: 36upx;">&#xe61f;</text>
					发布状态
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-1 grid-square flex-sub">
					<radio-group class="block" style="text-align: left;padding-left: 30upx;padding-bottom: 10upx;" @change="RadioChange">
						<radio class='blue radio radio-my' :class="videoDate.status=='0'?'checked':''" :checked="videoDate.status=='0'?true:false" value="0">
							<text style="padding-left: 10upx;">公开，所有人可观看</text>	
						</radio>
						<radio class='red radio radio-my' :class="videoDate.status=='1'?'checked':''" :checked="videoDate.status=='1'?true:false" value="1">
							<text style="padding-left: 10upx;">私密，只可自己观看</text>	
						</radio>
					</radio-group>
				</view>
			</view>
			
			<!-- <view class="cu-bar bg-white margin-top" v-if="videoType.store || videoType.product || videoType.dkUser">
				<view class="action">
					<text class='iconfont' style="margin-right: 10upx;font-size: 34upx;">&#xe601;</text>
					视频类型
				</view>
			</view>
			<view class="cu-form-group" v-if="videoType.store || videoType.product || videoType.dkUser">
				<view class="grid col-1 grid-square flex-sub">
					<radio-group class="block" style="text-align: left;padding-left: 30upx;padding-bottom: 10upx;" @change="RadioChangeByUserType">
						<radio class='blue radio radio-my' :class="videoDate.userType=='0'?'checked':''" :checked="videoDate.userType=='0'?true:false" value="0">
							<text style="padding-left: 10upx;">普通</text>	
						</radio>
						<radio v-if="videoType.dkUser" class='blue radio radio-my' :class="videoDate.userType=='1'?'checked':''" :checked="videoDate.userType=='1'?true:false" value="1">
							<text style="padding-left: 10upx;">配送员(品酒师)主页</text>	
						</radio>
						<radio v-if="videoType.store" class='blue radio radio-my' :class="videoDate.userType=='2'?'checked':''" :checked="videoDate.userType=='2'?true:false" value="2">
							<text style="padding-left: 10upx;">商家店铺主页</text>	
						</radio>
						<radio v-if="videoType.store" class='blue radio radio-my' :class="videoDate.userType=='3'?'checked':''" :checked="videoDate.userType=='3'?true:false" value="3">
							<text style="padding-left: 10upx;">商品详情,输入商品编号</text>	
						</radio>
					</radio-group>
				</view>
			</view>
			<view class="cu-form-group" v-if="videoDate.userType == 3">
				<view class="title">商品编号</view>
				<input placeholder="商品编号" style="text-align: left;padding-left: 30upx" name="input" v-model="videoDate.productId" type="number" maxlength="20"></input>
			</view> -->
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class='iconfont' style="margin-right: 10upx;font-size: 38upx;">&#xe640;</text>
					视频描述
				</view>
				<view class="action">
					{{videoDate.note.length}}/50
				</view>
			</view>
			<view class="cu-form-group align-start">
				<textarea style="border: 2rpx solid #EEEEEE; padding-top: 10rpx; padding-left: 10rpx;" :maxlength="50" @input="textareaBInput" placeholder="请输入视频描述" v-model="videoDate.note"></textarea>
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action" @tap="ChooseVideo">
					<text class='iconfont' style="margin-right: 10upx; font-size: 38rpx;">&#xe698;</text>
					选择视频(视频大小不超过{{videoSize}}M)
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-1 grid-square flex-sub">
					<view style="width: 100%;height: auto;height: auto;background-color: #eaeaea;padding-bottom: 0upx;" v-if="videoDate.url && videoDate.url.trim() != ''">
						<view class="bg-img" @click="viewVideo(videoDate.url)">
							<image :src="videoDate.imageOssUrl" mode="" style="width: 100%;" :style="{height:videoHeight+'px'}"></image>
							<text class="iconfont icon">&#xe601;</text>
							<!-- <video :src="videoDate.url" :poster="videoDate.imageOssUrl" style="width: 100%;" :style="{height:videoHeight+'px'}"></video> -->
						</view>
						
						<!-- <button @tap.stop="videoCrop()" class="cu-btn bg-blue margin-tb-sm lg" style="margin-left: 20upx;">重新裁剪视频</button> -->
						<button @tap.stop="ChooseVideo()" class="cu-btn bg-red margin-tb-sm lg" style="width: 50%;margin-left: 25%;">重新选择视频</button>
					</view>
					<view class="solids" @tap="ChooseVideo" v-if="!videoDate.url || videoDate.url.trim() == ''">
						<text class='iconfont icon'>&#xe698;</text>
					</view>
				</view>
			</view>
			
			<view @click="sendVideo" class="bg-white uni-flex btns margin-top" style="text-align: center;padding: 0 30upx;background-color: unset;">
				<button type="primary">
					<text class="iconfont" style="font-size: 40upx;margin-right: 10upx;">&#xe62f;</text>
					{{videoBtnTitle}}
				</button>
			</view>
		</form>
		
		
		
		<view style="width: 100%;height: 50upx;"></view>
		
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import upload from "@/common/http/upload.js"
	// 以下路径需根据项目实际情况填写
	import { pathToBase64, base64ToPath } from '@/js_sdk/gsq-image-tools/image-tools/index.js'
	
	const crop = uni.requireNativePlugin("Html5app-VideoCrop");
	
	export default {
		data() {
			return {
				videoBtnTitle:'发布视频',
				videoHeight:'200',
				videoSize:50,
				videoType:{
					store:false,
					product:false,
					dkUser:false
				},
				videoDate:{
					id:0,
					note:'',
					duration:0,
					url:'',
					imageUrl:'',
					imageOssUrl:'',
					videoData:{cursorId:-1},
					imageData:{cursorId:-1},
					lng:'',
					lat:'',
					userType:0,
					productId:null,
					status:0
				}
			};
		},
		async onLoad(options){
			if(options.videoId){
				this.videoDate.id = options.videoId;
				this.videoBtnTitle = "修改视频";
			}
		},
		mounted() {
			let systemInfo = uni.getSystemInfoSync();
			let windowWidth = systemInfo.windowWidth-60;//预算视频宽度
			let autoHeight = (windowWidth/3)*5;//采用比例为5:3
			this.videoHeight = parseInt(autoHeight);//取整
			//获取视频编辑信息
			this.videoInitConfig();
			//判断是否设置地址
			let _this = this;
			let addressLngLat = publics.getMyaddressLngLat();
			if(addressLngLat){
				//设置地址
				let myAddressData = JSON.parse(addressLngLat);
				_this.videoDate.lng = myAddressData.longitude;
				_this.videoDate.lat = myAddressData.latitude;
			}else{
				this.$msg("请先设置您当前的位置");
				setTimeout(function(){
					_this.openMap();
				},500);
			}
		},
		methods: {
			async videoInitConfig(){
				let that = this;
				let res = await this.$http('get', url.interaction.videoConfig, {videoId:this.videoDate.id});
				let data = res.data
				that.videoSize = data.videoSize;
				
				that.videoType.store = data.store;
				that.videoType.product = data.product;
				that.videoType.dkUser = data.dkUser;
				
				if(that.videoDate.id != 0 && data.videoData){
					let videoData = data.videoData;
					that.videoDate.note = videoData.note;
					that.videoDate.duration = videoData.duration;
					that.videoDate.url = videoData.video;
					that.videoDate.imageUrl = videoData.image;
					that.videoDate.imageOssUrl = videoData.image;
					that.videoDate.videoData = {cursorId:0};
					that.videoDate.imageData = {cursorId:0};
					that.videoDate.lng = videoData.lng;
					that.videoDate.lat = videoData.lat;
					that.videoDate.userType = videoData.userType;
					that.videoDate.status = videoData.status;
					if(videoData.videoUrl){
						that.videoDate.productId = videoData.videoUrl.split("id=")[1];
					}
				}
			},
			videoCrop(){
				let that = this;
				publics.jiuYinVideoCrop(this.videoDate.url,res => {
					if(res){
						that.videoDate.url = res.mp4;
						that.videoDate.imageUrl = res.image;
					}
				});
			},
			select(){
				//打开视频选择
				const _this=this;
				plus.gallery.pick(function(e){
				   _this.setPath(e.files[0]);
				}, function (e){
						
				},{filter:"video",multiple:true,maximum:1,system:false,onmaxed:function(){
						
				}});
			},
			setPath:function(url){        
			   console.log(url);
			   const that=this;
				crop.openCrop({
				"url":url,
				"resolution":"480p", //分辨率
				"mode":"fill", //视频模式，填充、裁剪SCALE
				"quality":"sd", // 高度质量
				"ratio":"9/16", //视频比例
				"mintime":2000, //限制最小时间
				"codecs":2,//编码方式
				"gop":"5",
				"fps":"25"
				},res=>{
					console.log(JSON.stringify(res));
					
					that.videoDate.url = 'file://'+res.mp4;
					that.videoDate.duration = res.duration;
					if(res.image.indexOf("?t=") != -1){
						res.image = res.image.split("?t=")[0];
					}
					that.videoDate.imageUrl = 'file://'+res.image;
					
					console.log(JSON.stringify(res));
					
					that.uploadImageByUrl(that.videoDate.imageUrl);
				});
			},
			viewVideo(url){
				uni.setStorageSync('sendVideoUrl', url)
				this.$navigateTo("../user/setting/video?sendVideo=true")
			},
			ChooseVideo() {
				let that = this;
				let itemList = ['从手机相册选择', '相机拍摄']
				let systemInfo = uni.getSystemInfoSync()
				let brand = systemInfo.brand
				console.log("--------当前手机品牌：", brand)
				if (brand.indexOf('HUAWEI')>-1) {
					itemList = ['从手机相册选择']
				}
				uni.showActionSheet({
				    itemList: itemList,
				    success: function (res) {
						if(res.tapIndex == 0){//从手机相册选择
							that.chooseVideoByType("album");
						}else{//相机拍摄
							that.chooseVideoByType("camera");
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			chooseVideoByType(type){
				let that = this;
				this.videoDate.url = '';
				this.videoDate.imageUrl = '';
				this.videoDate.imageOssUrl = '';
				publics.uploadJiuYinVideo(this.videoSize,type,res => {
					console.log("-------> ", res)
					if(res){
						//去除后面时间戳
						if(res.mp4.indexOf("?t=") != -1){
							res.mp4 = res.mp4.split("?t=")[0];
						}
						if(res.image.indexOf("?t=") != -1){
							res.image = res.image.split("?t=")[0];
						}
						//判断第一个字符是否存在file://
						if(res.mp4.indexOf("file://") == -1){
							res.mp4 = 'file://'+res.mp4;
						}
						if(res.image.indexOf("file://") == -1){
							res.image = 'file://'+res.image;
						}
						console.log("-------> ", res)
						that.videoDate.url = res.mp4;
						that.videoDate.duration = res.duration;
						//+"?t="+new Date().getTime()
						that.videoDate.imageUrl = res.image;
						that.videoDate.imageOssUrl = res.image
						console.log('111111111111111111111111111111111111')
						// that.uploadImageByUrl(that.videoDate.imageUrl);
					}
				});
			},
			async uploadImageByUrl(url) {
				let that = this;
				uni.showLoading({
					title: '视频解析中...'
				});
				let urls = url.split(".");
				let fileType = urls[urls.length-1];
				let res = await this.$http("GET", "single/home/policy", {type: 0, fileType:fileType})
				let data = res.data
				data.filePath = url;
				that.videoDate.imageData = data;
				upload.uploadImageOss([data]).then(doc =>{
					if (doc) {
						uni.hideLoading();
						that.videoDate.imageOssUrl = that.videoDate.imageData.fileUrl;
					}
				})
			},
			async sendVideo(){
				let that = this;
				uni.showLoading({
					title: '视频发布中...'
				});
				if(this.videoDate.videoData && this.videoDate.videoData.cursorId == 0){
					uni.hideLoading();
					this.saveVideo();//直接保存
					return;
				}
				let url = this.videoDate.url;
				let urls = url.split(".");
				let fileType = urls[urls.length-1];
				
				let res = await this.$http("GET", "single/home/policy", {type: 1, fileType:fileType})
				let data = res.data
				data.filePath = url;
				that.videoDate.videoData = data;
				console.log("上传视频。。。。。", data)
				upload.uploadImageOss([data]).then(doc =>{
					if (doc) {
						uni.hideLoading();
						that.saveVideo();
					}
				})
			},
			async saveVideo(){
				let that = this;
				if(!this.videoDate.videoData || this.videoDate.videoData.cursorId == -1){
					this.$msg("获取不到视频信息,请您重新上传视频");
					return;
				}
				if(!this.videoDate.note || this.videoDate.note.trim().length <= 0 || this.videoDate.note.trim().length > 50){
					uni.hideLoading();
					this.$msg("请您填写视频描述");
					return true;
				}
				if(!this.videoDate.productId){
					this.videoDate.productId = 0;
				}
				if(!this.videoDate.duration){
					this.videoDate.duration = 0;
				}
				let paret = {
					id:this.videoDate.id,
					lng:this.videoDate.lng,
					lat:this.videoDate.lat,
					userType:this.videoDate.userType,
					productId:this.videoDate.productId,
					status:this.videoDate.status,
					note:this.videoDate.note,
					// imageId:this.videoDate.imageData.cursorId,
					videoId:this.videoDate.videoData.cursorId,
					duration:this.videoDate.duration
				};
				
				let res = await this.$http('post', url.interaction.saveOrUpdateVideo, paret);
				let data = res.data
				uni.hideLoading();
				if(data){
					if(data.trim() == "411"){
						this.$msg("请先设置您当前的位置");
						setTimeout(function(){
							that.openMap();
						},1500);
					}else{
						if(that.videoDate.id != 0){
							this.$msg("修改成功");
						}else{
							this.$msg("发布成功");
						}
						that.videoDate = null;
						// this.$navigateBack(1, 1000);
					}
				}
			},
			ViewVideo(index) {
				let url = this.imgVideoList[index].url;
				this.showModal('VideoShow');
			},
			showModal(e) {
				this.modalName = e;
			},
			hideModal(e) {
				this.modalName = null;
			},
			textareaBInput(e) {
				this.videoDate.note = e.detail.value;
			},
			RadioChange(e) {
				this.videoDate.status = parseInt(e.detail.value);
			},
			RadioChangeByUserType(e) {
				this.videoDate.userType = parseInt(e.detail.value);
			},
			openMap(){
				let _this = this;
				uni.chooseLocation({
					keyword: "",
					success: function(res) {
						_this.videoDate.lng = res.longitude;
						_this.videoDate.lat = res.latitude;
						publics.setMyaddressLngLat(JSON.stringify(res));
					}
				});
			}
		}
	}
</script>

<style scoped>
	@import url('../../common/main.css');
</style>
<style scoped>
	.bg-img{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bg-img .icon{
		position: absolute;
		font-size: 100rpx;
		color: #FFFFFF;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	
	.radio-my {
		width: 100%;
		margin-bottom: 20upx;
	}
	.solids .icon{
		font-size: 54rpx;
		color: #b1b2b5;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -27rpx;
		margin-top: -27rpx;
	}
</style>

