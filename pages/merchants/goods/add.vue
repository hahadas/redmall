<template>
	<view class="main">
		<view class="header">
			<!-- <view class="status-bar-height-height"></view> -->
			<!-- <view :style="{height: navHeight + 'px'}"></view> -->
			<view class="errMsg" v-if="form.errorMsg && form.status === 2">
				<text class="txt">
					<text class="iconfont icon">&#xe659;</text>
					审核失败：{{form.errorMsg}}
				</text>
			</view>
			
			<view class="tabs">
				<view class="tab" :class="{'active': current === i}" v-for="(item, i) in tabs" :key="i" @click="tabsChange(i)">
					<text class="number">{{i+1}}</text>
					<text class="name">{{item}}</text>
				</view>
			</view>
		</view>
		<one ref="one" v-show="current === 0" :classData="classData" :form="form" @next="onNext" @edit="onEdit"></one>
		<two ref="two" v-show="current === 1" :form="form" @next="onNext" @prev="onPrev"></two>
		<three ref="three" v-show="current === 2" :form="form" @next="onNext" @prev="onPrev"></three>
		<four ref="four" v-show="current === 3" :loading="loading" :form="form" @next="onNext" @prev="onPrev"></four>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import upload from "@/common/http/upload.js"
	import publics from "@/common/utils/public.js"
	import { sendRequestJson } from "@/common/http/api.js"
	import one from "./modules/one.vue"
	import two from "./modules/two.vue"
	import three from "./modules/three.vue"
	import four from "./modules/four.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	export default{
		components: { one, two, three, four, avatar },
		data(){
			return {
				navHeight: 0,
				loading: false,
				tabs: ["商品信息", "商品规格", "商品详情", "商品配送"],
				current: 0,
				form: {},
				classData: {},
				isEdit: false,
				oldStatus: null,
				uploadImgPage: "" // two-第二个页面 three-第三个页面
			}
		},
		onBackPress(e) {
			if (e.from !== 'navigateBack' && !this.isEdit) {
				this.$showModal("您当前的商品未提交，如果返回则会清空所填内容，是否确认返回", "提示", res =>{
					if (res.confirm) {
						uni.navigateBack()
					}
				})
			} else {
				return false
			}
			return true
		},
		onLoad(opt) {
			this.navHeight = uni.getSystemInfoSync().windowTop
			if (opt.id) {
				this.isEdit = true
				uni.setNavigationBarTitle({
					title: "编辑商品"
				})
				this.$http("GET", url.store.getGoodsDetailById, {goodsId: opt.id}).then(res =>{
					let info = JSON.parse(JSON.stringify(res.data))
					this.form = info
					if (info.goodsType === 2) {
						this.form.deliveryPlatform = 1 // 平台配送
					}
					this.oldStatus = info.status
					this.$refs.two.skuList = info.skuList
					delete this.form.updateTime
					delete this.form.createTime
					// 主图
					if (info.mainImage) {
						this.$refs.three.mainImage = info.mainImage
					}
					// 轮播图
					if (info.topImgList) {
						this.$refs.three.imgList = info.topImgList
					}
					// 详情图
					if (info.detailsImgList) {
						this.$refs.three.detailsList = info.detailsImgList
					}
					// 商家分类
					if (info.storeCategoryId) {
						this.$http("GET", url.store.getCategoryList).then(res =>{
							let data = res.data
							data.map(v =>{
								if (v.id === info.storeCategoryId) {
									this.classData = v
								}
							})
						})
					}
					// 商品类型
					let goodsTypeList = this.$refs.one.goodsTypeList
					goodsTypeList.forEach((v, i) =>{
						if (info.goodsType === v.value){
							this.$refs.one.goodsTypeIndex = i
							if (info.goodsType === 12 && info.homeGoodsSeckill) { // 秒杀
								let dueDateTime = info.homeGoodsSeckill.dueDateTime
								this.$refs.one.endTime = dueDateTime
								this.form.dueDateTime = dueDateTime
							} else if (info.goodsType === 14 && info.homeGoodsGroupWork) { // 拼团
								this.form.groupNumber = info.homeGoodsGroupWork.groupNumber
							}
							return
						}
					})
				})
			} else {
				this.form.deliveryNo = 2 // 无需配送
				this.form.deliveryExpress = 2 // 快递邮寄
				this.form.deliverySelfraising = 2 // 用户自提
				this.form.deliveryBusiness = 2 // 商家配送
				this.form.deliveryPlatform = 2 // 平台配送
				this.form.paymentCombination = 2 // 支付组合
				this.form.goodsType = 1 // 商品类型 1-普通 2-精品
				this.form.isNewProducts = 1 // 是否是新品 1-不是 2-是
			}
		},
		onShow() {
			if (this.classObj) {
				this.classData = this.classObj
				this.form.storeCategoryId = this.classData.id
			}
			if (this.addressData){
				this.$refs.four.addrData = this.addressData
			}
		},
		methods:{
			onEdit(data){
				this.form = Object.assign({}, this.form, data)
			},
			async onNext(val){
				let _this = this
				if (this.current === 3) {
					this.onShowModal()
				} else {
					this.current++
				}
			},
			onShowModal(){
				let _this = this
				if (this.oldStatus === 1 || this.oldStatus === 2){
					let statusMsg = this.oldStatus === 1 ? '已上架' : '已下架'
					this.$showModal(`该商品${statusMsg},如修改则该商品将重新审核,是否确认修改当前商品？`, null, res=>{
						if (res.confirm) {
							_this.onSubmit()
						} else {
							this.loading = false
						}
					})
				} else {
					this.onSubmit()
				}
			},
			async onSubmit(){
				let _this = this
				let skuList = this.$refs.two.skuList
				let imgList = this.$refs.three.imgList
				let detailsList = this.$refs.three.detailsList
				let mainImageObj = this.$refs.three.mainImageObj
				if (skuList.length === 0) {
					return this.$msg("请至少添加一个商品规格")
				}
				if (imgList.length === 0) {
					return this.$msg("请至少上传一张商品轮播图")
				}
				if (detailsList.length === 0) {
					return this.$msg("请至少上传一张商品详情图")
				}
				this.loading = true
				uni.showLoading({
					mask: true
				});
				let uploadList = []
				uploadList = uploadList.concat(skuList).concat(imgList).concat(detailsList).concat([mainImageObj])
				let uploadArray = []
				let topImgList = [] // 轮播图
				let detailsImgList = [] // 详情图
				imgList.map(v =>{
					if (typeof v === "string"){
						topImgList.push(v)
					}
				})
				detailsList.map(v =>{
					if (typeof v === "string"){
						detailsImgList.push(v)
					}
				})
				uploadList.map(v => {
					if (v.ossType) {
						uploadArray.push(v)
					}
				})
				for(let i = 0; i<uploadArray.length; i++){
					let v = uploadArray[i]
					let data = await upload.getOssSignature(v.url, v.ossType, 1)
					let list = await upload.uploadImageOss(data, false)
					let resourceTemporaryUUID = list[0].resourceTemporaryUUID
					if (v.ossType === 13) { // 主图
						_this.form.mainImage = JSON.stringify({
							resourceTemporaryUUID: resourceTemporaryUUID
						})
					} else if (v.ossType === 16) { // sku
						skuList[v.skuIndex].mainImage = JSON.stringify({
							resourceTemporaryUUID: resourceTemporaryUUID
						})
						this.form.skuList = skuList
					} else if (v.ossType === 14) { // 轮播图
						topImgList.push(JSON.stringify({
							resourceTemporaryUUID: resourceTemporaryUUID
						}))
						this.form.topImgList = topImgList
					} else { // 详情图
						detailsImgList.push(JSON.stringify({
							resourceTemporaryUUID: resourceTemporaryUUID
						}))
						this.form.detailsImgList = detailsImgList
					}
				}
				console.log(".......end......")
				this.httpReq()
			},
			httpReq(){
				let path = this.isEdit ? url.store.updateGoods : url.store.addGoods
				console.log("....请求参数。。。", this.form)
				sendRequestJson("POST", path, this.form).then(res =>{
					uni.hideLoading();
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(err=>{
					this.loading = false
					uni.hideLoading();
				})
			},
			selectImg(type){
				this.uploadImgPage = type
				upload.showAvatarModal(this, 500, 500)
			},
			myUpload(rsp){
				let _this = this
				uni.getImageInfo({
					src: rsp.path,
					success: function (image) {
						if (_this.uploadImgPage === "two") {
							let skuIndex = _this.$refs.two.skuIndex
							_this.$refs.two.skuList[skuIndex].url = rsp.path
							_this.$refs.two.skuList[skuIndex].ossType = 16
							_this.$refs.two.skuList[skuIndex].ossWidth = image.width
							_this.$refs.two.skuList[skuIndex].ossHeight = image.height
							_this.$refs.two.skuList[skuIndex].skuIndex = skuIndex
						} else if (_this.uploadImgPage === "three") {
							_this.$refs.three.mainImage = rsp.path
							_this.$refs.three.mainImageObj = {
								url: rsp.path,
								ossType: 13,
								ossWidth: image.width,
								ossHeight: image.height
							}
						}
					}
				});
			},
			onPrev(){
				if (this.loading) return
				this.current--
			},
			tabsChange(i){
				if (this.loading) return
				this.current = i
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		// margin: 0 20rpx;
		padding-top: 150rpx;
		.header{
			position: fixed;
			top: 0;
			left: 0rpx;
			right: 0rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			z-index: 99;
			.errMsg{
				padding: 20rpx;
				background-color: rgba(#dd524d, .3);
				.txt{
					font-size: 30rpx;
					color: #dd524d;
					.icon{
						font-size: 34rpx;
						color: #dd524d;
						// color: #999999;
					}
				}
			}
			.tabs{
				width: 100%;
				display: flex;
				height: 150rpx;
				align-items: center;
				background-color: #F8F8F8;
				.tab{
					width: 25%;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: #999999;
					.number{
						width: 26rpx;
						height: 26rpx;
						border-radius: 50%;
						border: 2rpx solid #999999;
						text-align: center;
						line-height: 26rpx;
						font-size: 24rpx;
						margin-bottom: 20rpx;
					}
					.name{
						font-size: 28rpx;
					}
				}
				.active{
					background-color: #FFFFFF;
					color: #333333;
					.number{
						width: 32rpx;
						height: 32rpx;
						line-height: 32rpx;
					}
					.name{
						font-size: 32rpx;
					}
				}
			}
		}
	}
</style>
