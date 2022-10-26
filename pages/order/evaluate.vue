<template>
	<view class="main">
		<view class="con bg-w">
			<view class="flex">
				<view><image :src="info.goodsImage || info.skuImage" mode="" class="img"></image></view>
				<view class="flex flex-column">
					<text class="line font30 color-b3">{{info.goodsName}}</text>
					<text class="line font28 color-b9">{{info.skuName}}</text>
				</view>
			</view>
			<view class="flex flex-center rate">
				<uni-rate :size="30" :margin="10" @change="rateChange($event, 'evaluateGoodsScore')"></uni-rate>
			</view>
			<textarea class="textarea font30" v-model="form.evaluateGoodsComment" :maxlength="100" placeholder="评价商家,宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧" />
			<view class="img-box flex flex-align-center">
				<block v-if="goodsImgList.length > 0">
					<view class="imgs" v-for="(item, index) in goodsImgList" :key="index" @tap="viewImage(item, 'goodsImgList')">
						<image :src="item" mode="" class="pic"></image>
						<text class="iconfont del" @tap.stop="delImg(index, 'goodsImgList')">&#xe638;</text>
					</view>
				</block>
				<view class="imgs flex flex-center bor" v-if="goodsImgList.length < 8" @tap="selectImg('goodsImgList')">
					<text class="iconfont icon color-b9">&#xe698;</text>
				</view>
			</view>
		</view>
		<!-- 评价天使 -->
		<view class="con bg-w" v-if="info.deliveryPlatformUserId">
			<view class="flex">
				<view><image :src="info.deliveryUserInfo.headPortrait" mode="" class="img"></image></view>
				<view class="flex flex-column">
					<text class="line font30 color-b3">{{info.deliveryUserInfo.nickname}}</text>
					<text class="line font28 color-b9">{{info.deliveryUserInfo.mobile}}</text>
				</view>
			</view>
			<view class="flex flex-center rate">
				<uni-rate :size="30" :margin="10" @change="rateChange($event, 'evaluateDistributionScore')"></uni-rate>
			</view>
			<textarea class="textarea font30" v-model="form.evaluateDistributionComment" :maxlength="100" placeholder="评价天使,配送满足你的期待吗？分享给大家吧" />
			<view class="img-box flex flex-align-center">
				<block v-if="agentImgList.length > 0">
					<view class="imgs" v-for="(item, index) in agentImgList" :key="index" @tap="viewImage(item, 'agentImgList')">
						<image :src="item" mode="" class="pic"></image>
						<text class="iconfont del" @tap.stop="delImg(index, 'agentImgList')">&#xe638;</text>
					</view>
				</block>
				<view class="imgs flex flex-center bor" v-if="agentImgList.length < 9" @tap="selectImg('agentImgList')">
					<text class="iconfont icon color-b9">&#xe698;</text>
				</view>
			</view>
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave">发布</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import upload from "@/common/http/upload.js"
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	export default{
		components: { uniRate },
		data(){
			return{
				loading: false,
				goodsImgList: [],
				agentImgList: [],
				orderId: "",
				info: {},
				form: {
					evaluateGoodsScore: 2,
					evaluateDistributionScore: 1
				}
			}
		},
		onLoad(opt) {
			this.orderId = opt.orderId
			this.$http("GET", url.order.getOrderInfoById, {orderId: this.orderId}).then(res =>{
				this.info = res.data
			})
		},
		methods: {
			async onSave(){
				this.loading = true
				if (this.goodsImgList.length > 0) {
					let evaluateGoodsImages = []
					for(let i = 0; i<this.goodsImgList.length; i++){
						let obj = this.goodsImgList[i]
						let ossData = await upload.getOssSignature(obj, 20, 1)
						let uploadData = await upload.uploadImageOss(ossData, false)
						evaluateGoodsImages.push(JSON.stringify({resourceTemporaryUUID: uploadData[0].resourceTemporaryUUID}))
					}
					this.form.evaluateGoodsImages = evaluateGoodsImages
				}
				if (this.agentImgList.length > 0) {
					let evaluateDistributionImages = []
					for(let i = 0; i<this.agentImgList.length; i++){
						let obj = this.agentImgList[i]
						let ossData = await upload.getOssSignature(obj, 21, 1)
						let uploadData = await upload.uploadImageOss(ossData, false)
						evaluateDistributionImages.push(JSON.stringify({resourceTemporaryUUID: uploadData[0].resourceTemporaryUUID}))
					}
					this.form.evaluateDistributionImages = evaluateDistributionImages
				}
				this.$http("POST", url.order.evaluate, {
					orderId: this.orderId,
					...this.form
				}).then(res =>{
					this.$msg(res.data)
					this.$navigateBack()
				}).catch(()=>{
					this.loading = false
				})
			},
			selectImg(name){
				let _this = this
				uni.chooseImage({
					count: 9 - _this[name].length,
					success(res) {
						_this[name] = _this[name].concat(res.tempFilePaths)
					}
				})
			},
			delImg(index, name){
				this[name].splice(index,1);
			},
			viewImage(url, name){
				let _this = this
				uni.previewImage({
					urls: _this[name],
					current: url
				});
			},
			rateChange(e, name){
				let value = e.value
				if (name === "evaluateGoodsScore") {
					value = value * 2
				}
				this.form[name] = value
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding: 20rpx;
		.con{
			border-radius: 20rpx;
			padding: 20rpx;
			.img{
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				margin-right: 10rpx;
				display: block;
			}
			.rate{
				margin: 30rpx 0;
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #EEEEEE;
			}
			.textarea {
				width: 100%;
			}
			.img-box{
				flex-flow: wrap;
				.imgs{
					width: 152rpx;
					height: 152rpx;
					margin-right: 20rpx;
					position: relative;
					border-radius: 10rpx;
					margin-bottom: 20rpx;
					.pic{
						width: 100%;
						height: 100%;
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
		.btn{
			margin-top: 100rpx;
			border-radius: 50rpx;
		}
	}
</style>
