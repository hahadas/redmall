<template>
	<view>
		<view class="list">
			<view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					商品主图：
				</text>
				<view class="flex flex-align-center color-b9" v-if="!mainImage" @click="mainImg">
					<text>请选择</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
				<image :src="mainImage" v-else mode="" class="mainPic" @tap="showAction"></image>
			</view>
			<view class="list-item tips">
				<view class="flex flex-between" style="width: 100%;">
					<text class="label">
						<text class="color-red">*</text>
						商品轮播图：
					</text>
					<text class="color-b9 font28">最多可添加5张</text>
				</view>
				<view class="imgs">
					<view class="img-box" v-for="(item, i) in imgList" :key="i" @tap="viewImg(item, i, 'imgList')">
						<image :src="item.url || item" mode="" class="img"></image>
						<text class="iconfont del" @tap.stop="onDel(i, 'imgList')">&#xe638;</text>
					</view>
					<view class="img-box" v-if="imgList.length < 5" @click="selectImg('imgList')">
						<text class="iconfont icon">&#xe64d;</text>
					</view>
				</view>
			</view>
			<view class="list-item" @click="jumpTo()">
				<text class="label">
					<text class="color-red">*</text>
					商品详情：
				</text>
				<view class="flex flex-align-center color-b9">
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view>
			<view class="list-item tips bor-no">
				<view class="flex flex-between" style="width: 100%;">
					<text class="label">
						<text class="color-w">*</text>
						商品详情图：
					</text>
				</view>
				<view class="imgs">
					<view class="img-box" v-for="(item, i) in detailsList" :key="i" @tap="viewImg(item, i, 'detailsList')">
						<image :src="item.url || item" mode="" class="img"></image>
						<text class="iconfont del" @tap.stop="onDel(i, 'detailsList')">&#xe638;</text>
					</view>
					<view class="img-box" @click="selectImg('detailsList')">
						<text class="iconfont icon">&#xe64d;</text>
					</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="prev item" @click="prev">上一步，填写商品规格</button>
			<button type="primary" class="bg-base item" @click="next">下一步，填写商品配送</button>
		</view>
		
		<!-- <avatar @upload="adminLogoUpload" ref="adminLogo"></avatar> -->
	</view>
</template>

<script>
	// import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import upload from "@/common/http/upload.js"
	export default{
		// components: { avatar },
		props:{
			form: {
				default: {}
			}
		},
		data(){
			return {
				mainImage: "",
				mainImageObj: {},
				imgList: [],
				detailsList: []
			}
		},
		methods:{
			showAction(){
				let _this = this
				uni.showActionSheet({
				    itemList: ['查看图片', '重新选择'],
				    success: function (res) {
				        if (res.tapIndex === 0) {
							_this.viewMain()
						} else {
							_this.mainImg()
						}
				    }
				});
			},
			mainImg(){
				this.$parent.selectImg("three")
				// upload.showAvatarModal(this, 500, 500)
			},
			// adminLogoUpload(rsp) {
			// 	let _this = this
			// 	this.mainImage = rsp.path
			// 	this.mainImageObj = {
			// 		url: rsp.path,
			// 		ossType: 13
			// 	}
			// 	uni.getImageInfo({
			// 		src: rsp.path,
			// 		success: function (image) {
			// 			_this.mainImageObj.ossWidth = image.width
			// 			_this.mainImageObj.ossHeight = image.height
			// 		}
			// 	});
			// },
			selectImg(name){
				let _this = this
				let count = 9
				let ossType = 15
				if (name === 'imgList') {
					count = 5 - this.imgList.length
					ossType = 14
				}
				uni.chooseImage({
					count: count,
					success(res) {
						res.tempFilePaths.map((v, i) => {
							uni.getImageInfo({
								src: v,
								success: function (image) {
									let obj = {
										url: v,
										ossType: ossType,
										ossWidth: image.width,
										ossHeight: image.height,
										size: res.tempFiles[i].size
									}
									_this[name].push(obj)
								}
							});
						})
					}
				})
			},
			viewMain(){
				let _this = this
				uni.previewImage({
					current: 0,
					urls: [_this.mainImage]
				});
			},
			viewImg(item, i, name){
				let urls = []
				if (!item.url){
					urls = this[name]
				} else {
					this[name].map(v =>{
						urls.push(v.url)
					})
				}
				uni.previewImage({
					current: i,
					urls: urls
				});
			},
			onDel(i, name){
				this[name].splice(i, 1)
			},
			prev(){
				this.$emit("prev")
			},
			next(){
				this.$emit("next", this.form)
			},
			jumpTo(){
				console.log(this.form)
				this.$navigateTo('richText?html='+(this.form.detailsTextHtml||""))
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		&-item{
			border-bottom: 2rpx solid #EEEEEE;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			.label{
				// width: 200rpx;
			}
			.imgs{
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.img-box{
					margin-left: 20rpx;
					margin-bottom: 20rpx;
					border-radius: 10rpx;
					width: 180rpx;
					height: 180rpx;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2rpx dotted #EEEEEE;
					background-color: #f3f4f5;
					.img{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
					.icon{
						font-size: 100rpx;
						color: #999999;
					}
					.del{
						position: absolute;
						right: -20rpx;
						top: -20rpx;
						color: #CA0400;
						font-size: 40rpx;
					}
				}
			}
			.mainPic{
				height: 110rpx;
				width: 110rpx;
				border-radius: 10rpx;
			}
		}
		.tips{
			align-items: flex-start;
			flex-direction: column;
			height: auto;
			padding: 36rpx 0;
			.name{
				font-size: 26rpx;
				margin-left: 20rpx;
				line-height: 40rpx;
				color: #999999;
				margin-top: 20rpx;
			}
		}
	}
	.btn{
		margin-top: 80rpx;
		padding-bottom: 50rpx;
		.prev{
			background-color: #c0c1c2;
		}
		.item{
			border-radius: 50rpx;
			width: 80%;
			margin-top: 40rpx;
		}
	}
</style>
