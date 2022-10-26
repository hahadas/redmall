<template>
	<view class="main">
		<text class="tips">你的举报将在24小时内受理，若举报成功会第一时间告知处理结果，请尽量提交完整的举报描述及材料。</text>
		<view class="wrap">
			<view class="flex flex-align-center cell">
				<text class="label">举报理由</text>
				<text>{{optData.name}}</text>
			</view>
			<view class="flex flex-column cell">
				<text class="label">举报描述</text>
				<textarea placeholder="详细描述举报理由" v-model="complaintDetails" :maxlength="200" class="textarea" />
				<view class="flex flex-space-end">
					<text class="color-b9 font28">{{complaintDetails.length}}/200</text>
				</view>
			</view>
			<view class="flex flex-between cell">
				<text class="label">相关凭证</text>
				<text class="color-b9">最多只能上传4张图片</text>
			</view>
			<view class="img-box flex flex-align-center">
				<block v-if="imgList.length > 0">
					<view class="imgs" v-for="(item, index) in imgList" :key="index" @tap="viewImage(item)">
						<image :src="item" mode="" class="pic"></image>
						<text class="iconfont del" @tap.stop="delImg(index)">&#xe638;</text>
					</view>
				</block>
				<view class="imgs flex flex-center bor" v-if="imgList.length < 4" @tap="selectImg()">
					<text class="iconfont icon color-b9">&#xe698;</text>
				</view>
			</view>
			<button type="primary" class="bg-base" :loading="loading" :disabled="loading" @click="onSubmit">提交</button>
		</view>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import upload from "@/common/http/upload.js"
	import { sendRequestJson } from "@/common/http/api.js"
	export default{
		data(){
			return {
				loading: false,
				complaintDetails: "",
				imgList: [],
				optData: {}
			}
		},
		onLoad(opt) {
			if (opt.data) {
				this.optData = JSON.parse(opt.data)
			}
		},
		methods:{
			async onSubmit(){
				if (!this.complaintDetails) return this.$msg("请填写举报描述")
				if (this.loading) return
				uni.showLoading({
					mask: true
				})
				this.loading = true
				let params = {
					complaintDetails: this.complaintDetails,
					complaintId: this.optData.complaintId,
					complaintUserTypeId: this.optData.id,
					type: this.optData.type
				}
				if (this.imgList.length > 0) {
					let complaintImages = []
					for(let i = 0; i < this.imgList.length; i++) {
						let data = await upload.getOssSignature(this.imgList[i], 26, 1)
						let list = await upload.uploadImageOss(data, false)
						complaintImages.push(JSON.stringify({
							resourceTemporaryUUID: list[0].resourceTemporaryUUID
						}))
					}
					params.complaintImages = complaintImages
				}
				sendRequestJson("POST", url.report.addComplaint, params).then(res => {
					this.$msg(res.data)
					this.$navigateBack(2)
					this.loading = false
					uni.hideLoading()
				}).catch(()=>{
					uni.hideLoading()
					this.loading = false
				})
			},
			selectImg(){
				let _this = this
				uni.chooseImage({
					count: 4 - _this.imgList.length,
					success(res) {
						_this.imgList = _this.imgList.concat(res.tempFilePaths)
					}
				})
			},
			viewImage(url){
				let _this = this
				uni.previewImage({
					urls: _this.imgList,
					current: url
				});
			},
			delImg(index){
				this.imgList.splice(index,1);
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		background-color: white;
		.tips{
			padding: 10rpx 20rpx;
			font-size: 26rpx;
			color: #999999;
			border-bottom: 2rpx solid #EEEEEE;
			display: block;
		}
		.wrap{
			padding: 0 20rpx;
			.cell{
				padding: 30rpx 0;
				.label{
					margin-right: 20rpx;
				}
				.textarea{
					width: 690rpx;
					background-color: #f2f0f3;
					border-radius: 10rpx;
					height: 300rpx;
					padding: 10rpx;
					margin-top: 10rpx;
					color: #666666;
					margin-bottom: 10rpx;
				}
			}
			.img-box{
				flex-flow: wrap;
				margin-bottom: 60rpx;
				.imgs{
					width: 160rpx;
					height: 160rpx;
					margin-right: 20rpx;
					position: relative;
					margin-bottom: 20rpx;
					.pic{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
					.del{
						position: absolute;
						top: -20rpx;
						right: -20rpx;
						font-size: 40rpx;
						color: #CA0400;
					}
				}
				.imgs:nth-child(4){
					margin-right: 0;
				}
				.imgs:nth-child(8){
					margin-right: 0;
				}
				.bor{
					border: 2rpx solid #c7c5c8;
					.icon{
						font-size: 60rpx;
					}
				}
				
			}
		}
		
	}
</style>
