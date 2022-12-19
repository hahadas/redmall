<template>
	<view class="page">
		<!-- <view :style="{height: 48+statusBarHeight + 'px'}"></view> -->
		<you-scroll
			@onPullDown="refresh"
			@onLoadMore="loadMore">
			<view>
				<swiper class="swiperImgs" v-if="swiperList.length > 0" :indicator-dots="true">
					<swiper-item v-for="(item, i) in swiperList" :key="i">
						<image :src="item" mode="aspectFill" class="swiperImg" @click="previewImg(swiperList, i)"></image>
					</swiper-item>
				</swiper>
				<image v-else :src="userDetail.headPortrait" mode="aspectFill" class="swiperImg" @click="previewImg([userDetail.headPortrait], 0)"></image>
				<view class="wrap">
					<view class="wrap-box">
						<view><image :src="filterImg(userDetail.headPortrait, 1)" mode="aspectFill" class="avatar"></image></view>
						<view class="wrap-box-info">
							<text class="wrap-box-info-name">{{userDetail.nickname}}</text>
							<view class="wrap-box-info-basic">
								<view class="six" :class="{'woman':userDetail.gender===3}">
									<image :src="staticUrl + 'video/man.png'" mode="" class="six-icon" v-if="userDetail.gender === 2"></image>
									<image :src="staticUrl + 'video/woman.png'" mode="" class="six-icon" v-if="userDetail.gender === 3"></image>
									<text class="six-name">{{userDetail.age}}</text>
								</view>
								<text class="constellation">{{userDetail.constellation}}</text>
								<text class="mark" v-if="userDetail.distributorIsOpen">配送员</text>
							</view>
							<view class="addr" v-if="addressName">
								<image :src="staticUrl + 'user/addr.png'" mode="" class="addr-icon"></image>
								<text class="addr-name">{{addressName}}</text>
							</view>
						</view>
					</view>
					
					<view class="get" @click="jumpToFollow()">
						<view class="get-item">
							<text class="get-item-number">{{(videoData.dianZan || 0) + (videoData.commentDianZan || 0)}}</text>
							<text class="get-item-txt">获赞·</text>
						</view>
						<view class="get-item">
							<text class="get-item-number">{{videoData.fenSi}}</text>
							<text class="get-item-txt">粉丝·</text>
						</view>
						<view class="get-item">
							<text class="get-item-number">{{videoData.guanZhu}}</text>
							<text class="get-item-txt">关注·</text>
						</view>
						<view class="get-item">
							<text class="get-item-number">{{videoData.xiHuan}}</text>
							<text class="get-item-txt">喜欢</text>
						</view>
					</view>
					
					<view class="about">
						<block>
							<text class="about-title">个性签名</text>
							<view class="about-textarea">
								<text class="about-textarea-txt">{{userDetail.personalSignature || "这个家伙很懒，什么都没留下"}}</text>
							</view>
						</block>
						<view class="about-cell" v-if="userDetail.alcoholConsumption">
							<text class="about-title">我的酒量</text>
							<view class="about-list">
								<text class="about-list-tip">{{userDetail.alcoholConsumption}}</text>
							</view>
						</view>
						<view class="about-cell" v-if="userDetail.labelPastOccupation">
							<text class="about-title">过往职业</text>
							<view class="about-list">
								<text class="about-list-tip" v-for="(item, i) in labelPastOccupationList" :key="i">{{item}}</text>
							</view>
						</view>
						<view class="about-cell" v-if="userDetail.labelHobby">
							<text class="about-title">兴趣爱好</text>
							<view class="about-list">
								<text class="about-list-tip" v-for="(item, i) in labelHobbyList" :key="i">{{item}}</text>
							</view>
						</view>
						
					</view>
					
					<view class="cell">
						<view class="cell-item" v-for="(item, i) in cellTabs" :key="i" @tap="cellIndex = i">
							<text class="cell-item-name-action" v-if="cellIndex === i">{{item.name}} {{item.total?`(${item.total})`:''}}</text>
							<text class="cell-item-name" v-else>{{item.name}} {{item.total?`(${item.total})`:''}}</text>
							<text class="cell-item-xian-action" v-if="cellIndex === i"></text>
							<text class="cell-item-xian" v-else></text>
						</view>
					</view>
					
					<block v-if="cellIndex === 0">
						<view class="dynamic">
							<view class="dynamic-item" v-for="(item, i) in dynamicList" :key="i" @tap="goDetails(item)">
								<view class="dynamic-item-top">
									<view><image :src="filterImg(userDetail.headPortrait, 1)" mode="aspectFill" class="dynamic-item-top-img"></image></view>
									<view style="flex-grow: 1;">
										<view class="dynamic-item-top-column">
											<text class="dynamic-item-top-column-name" style="margin-right: 10rpx;">{{userDetail.nickname}}</text>
										</view>
										<view class="dynamic-item-top-column" style="justify-content: flex-start;">
											<view class="six" style="margin-right: 20rpx;" :class="{'woman':userDetail.gender===3}">
												<image :src="staticUrl + 'video/man.png'" mode="" class="six-icon" v-if="userDetail.gender === 2"></image>
												<image :src="staticUrl + 'video/woman.png'" mode="" class="six-icon" v-if="userDetail.gender === 3"></image>
												<text class="six-name">{{userDetail.age||0}}</text>
											</view>
											<text class="mark" v-if="userDetail.dkUserId">配送员</text>
										</view>
									</view>
								</view>
								<text class="dynamic-item-con">{{item.comment}}</text>
								<view class="dynamic-item-con-img" v-if="item.images.length > 1">
									<image :src="filterImg(url, 2)" mode="aspectFill" class="dynamic-item-con-img-s" v-for="(url, index) in item.images" :key="index" @tap.stop="previewImg(item.images, index)"></image>
								</view>
								<view class="dynamic-item-con-img" v-if="item.images.length === 1">
									<image :src="filterImg(item.images[0], 4)" mode="aspectFill" class="dynamic-item-con-img-one" @tap.stop="previewImg(item.images, index)"></image>
								</view>
								<view class="dynamic-item-option" v-if="item.status !== 1">
									<text class="dynamic-item-option-item-name" v-if="item.status === 0">当前动态正在审核中～</text>
									<view class="dynamic-item-option-item" v-if="item.status === 2">
										<text class="dynamic-item-option-item-name" style="color: #CA0400;">动态违规！原因：{{item.violationInformation}}</text>
									</view>
								</view>
								<view class="dynamic-item-option">
									<view class="dynamic-item-option-item">
										<image :src="staticUrl + 'video/comment.png'" mode="" class="dynamic-item-option-item-icon"></image>
										<text class="dynamic-item-option-item-name">{{item.commentCount || 0}}条评论</text>
									</view>
									<view class="dynamic-item-option-item" @tap.stop="onLike(item, i)">
										<image :src="staticUrl + 'video/love_grey.png'" mode="" class="dynamic-item-option-item-icon" v-if="!item.isLike"></image>
										<image :src="staticUrl + 'video/love_red.png'" mode="" class="dynamic-item-option-item-icon" v-else></image>
										<text class="dynamic-item-option-item-name">{{item.likeCount || 0}}点赞</text>
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="loadingType"></uni-load-more>
					</block>
					<!-- #ifdef APP-PLUS -->
					<block v-if="cellIndex === 1">
						<view class="grid">
							<view class="grid-item" v-for="(item, i) in videoList" :key="i" @click="showVideo(item)">
								<image :src="item.image" mode="aspectFill" class="grid-item-img"></image>
								<view class="grid-item-bom">
									<image :src="staticUrl + 'video/video_love.png'" mode="" class="grid-item-bom-icon"></image>
									<text class="grid-item-bom-txt">{{item.likes}}</text>
								</view>
								<view class="grid-item-status" v-if="item.status !== 1">
									<text class="grid-item-status-txt" v-if="item.status === 0">审核中</text>
									<view class="grid-item-status-box" v-if="item.status === 2" @click="showErrMsg(item.violationInformation)">
										<text class="grid-item-status-txt" style="color: #CA0400; margin-right: 10rpx;">视频违规</text>
										<icon type="info" color="#CA0400" size="14" />
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="videoLoading"></uni-load-more>
					</block>
					<!-- #endif -->
					
					<block v-if="cellIndex === cellTabs.length - 1">
						<view class="product">
							<view class="goods" v-for="(item, i) in productList" :key="i" @tap="jumpToGoodsDetail(item)">
								<image :src="filterImg(item.goodsInfo.mainImage, 3)" mode="aspectFill" class="goods-img" lazy-load></image>
								<view class="goods-wrap">
									<view class="goods-wrap-title">
										<text class="goods-wrap-title-name">{{item.goodsInfo.titleName}}</text>
									</view>
									<view class="goods-wrap-tip">
										<text class="goods-wrap-tip-left">库存{{item.stock}}</text>
										<text class="goods-wrap-tip-right">已售{{item.sales}}件</text>
									</view>
									<view class="goods-wrap-price">
										<text class="goods-wrap-price-txt">¥{{item.goodsInfo.wholesalePrice}}</text>
									</view>
								</view>
							</view>
						</view>
						<uni-load-more :status="productLoading"></uni-load-more>
					</block>
				</view>
			</view>
		</you-scroll>
	</view>
</template>
<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import { sendRequest } from "@/common/http/api.js"
	import publics from "@/common/utils/public.js"
	var system = uni.getSystemInfoSync();
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import youScroll from '@/components/you-scroll' 
	export default {
		components: {
			uniLoadMore,
			youScroll
		},
		data() {
			return {
				statusBarHeight: system.statusBarHeight,
				screenHeight: system.screenHeight,
				swiperList: [],
				curIndex: 0,
				addressName: "",
				userDetail: {},
				videoData: {},
				loadingType: "loading",
				dynamicList: [],
				cellTabs: [
					{name:"我的动态", total:0},
					// #ifdef APP-PLUS
					{name:"我的视频", total:0}
					// #endif
				],
				cellIndex: 0,
				localUserId: "",
				id: "",
				headerScroll: false,
				labelPastOccupationList: [],
				labelHobbyList: [],
				pageSize: 0,
				videoList: [],
				videoLoading: "loading",
				videoTotal: 0,
				userFlag: false,
				totalPageNo: 0,
				productList: [],
				productLoading: "loading"
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		methods: {
			getInfo(){
				let _this = this
				let userInfo = this.userInfo
				if (userInfo.labelHobby) {
					this.labelHobbyList = userInfo.labelHobby.split("-")
				}
				if (userInfo.labelPastOccupation) {
					this.labelPastOccupationList = userInfo.labelPastOccupation.split("-")
				}
				this.userDetail = userInfo
				if (!this.userInfo.adcode){
					uni.getLocation({
						type: 'wgs84',
						geocode: true,
						success: function(res) {
							_this.addressName = res.address.province+res.address.city+res.address.province
						}
					})
				} else {
					this.addressName = publics.getAddressByThreeCode(this.userDetail.adcode)
				}
				let userResources = this.userDetail.userResources
				if (userResources.length > 0) {
					this.swiperList = []
					userResources.map(v =>{
						if (v.type === 1) {
							this.swiperList.push(v.ossUrl)
						}
					})
				}
				this.getList()
				this.getVideoInit()
				if (userInfo.distributorIsOpen){
					this.cellTabs.push({name:"配送员库存", total:0})
					this.getProductList()
				}
			},
			async getList(){
				let params = {
					userId: this.userDetail.id,
					pageNum: this.dynamicList.length
				}
				let res = await sendRequest('get', url.interaction.getUserDynamickList, params);
				let list = res.data
				if (list&&list.length>0) {
					list.map(v => {
						if (typeof v.images === "string") {
							v.images = v.images.split(",")
						}
					})
					this.dynamicList = this.dynamicList.concat(list)
					this.cellTabs[0].total = this.dynamicList.length
					this.loadingType = list.length < 12 ? 'nomore' : 'more'
				} else {
					this.loadingType = "nomore"
				}
			},
			getVideoInit(){
				sendRequest('get', url.interaction.userVideoInit, {userId:this.userDetail.id}).then(res =>{
					this.videoData = res.data
					this.videoTotal = res.data.zuoPin
					this.cellTabs[1].total = res.data.zuoPin
					this.userFlag = res.data.userFlag
					this.getVideoList()
				})
			},
			getVideoList(){
				if (this.videoLoading === 'nomore') return
				let params = {
					userId: this.userDetail.id,
					type: 0,
					pageSize: this.pageSize
				}
				sendRequest('get', url.interaction.userVideoType, params).then(res =>{
					this.videoList = [...this.videoList, ...res.data]
					if (this.videoList.length < parseInt(this.videoTotal)) {
						this.pageSize++
						this.videoLoading = "more"
						this.totalPageNo = 1
					} else {
						this.videoLoading = "nomore"
						this.totalPageNo = 0
					}
				})
			},
			getProductList(type) {
				let params = {
					toImAccount: this.userDetail.imAccount,
					pageNum: this.productList.length
				};
				sendRequest('GET', url.agent.getStockList, params).then(res =>{
					this.cellTabs[this.cellTabs.length - 1].total = res.data.stockAllCount
					let list = res.data.stockList
					this.productList = this.productList.concat(list)
					this.productLoading = list.length < 12 ? 'nomore' : 'more'
				})
			},
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			//浏览视频
			showVideo(row){
				uni.navigateTo({
					url: "/pages/video/indexByUser?id="+row.id
				})
			},
			previewImg(imgs, index){
				let _this = this
				uni.previewImage({
					urls: imgs,
					current: imgs[index]
				});
			},
			refresh(done){
				this.dynamicList = []
				this.pageSize = 0
				this.productList = []
				this.getInfo()
				if (typeof done === "function") done()
			},
			loadMore(){
				if (this.cellIndex === 0) {
					// this.dynamicList = []
					this.getList()
				} else if (this.cellIndex === 1) {
					// this.pageSize = 0
					this.getVideoInit()
				} else {
					if (this.userDetail.distributorIsOpen){
						this.getProductList()
					}
				}
			},
			goDetails(item){
				uni.navigateTo({
					url: "details?id="+item.id
				})
			},
			jumpToFollow(){
				let data = {
					nickname: this.userDetail.nickname,
					id: this.userDetail.id,
					guanZhu: this.videoData.guanZhu,
					xiHuan: this.videoData.xiHuan,
					userFlag: this.userFlag
				}
				uni.navigateTo({
					url: "/pages/video/followAndLike?data="+JSON.stringify(data)
				})
			},
			jumpToGoodsDetail(item) {
				uni.navigateTo({
					url: "/pages/home/details?id="+item.goodsId
				})
			},
			showErrMsg(msg){
				if (!msg) return
				uni.showModal({
					content: msg,
					showCancel: false
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		height: 100%;
		overflow-y: scroll;
	}
	.woman{
		background-color: #ff4d94 !important;
	}
	.six{
		background-color: #1995fc;
		border-radius: 20rpx;
		padding: 2rpx 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.six-icon{
		width: 20rpx;
		height: 20rpx;
		margin-right: 6rpx;
	}
	.six-name{
		font-size: 24rpx;
		color: #FFFFFF;
	}
	.mark{
		font-size: 24rpx;
		background-image: linear-gradient(to bottom, #381895, #865afd);
		border-radius: 6rpx;
		color: white;
		padding: 4rpx 10rpx;
		display: inline-block;
		border-radius: 20rpx;
	}
	.swiper{
		width: 750rpx;
		background-color: #FFFFFF;
		/* position: relative; */
	}
	.swiperImgs{
		width: 750rpx;
		height: 600rpx;
		margin-bottom: 10rpx;
		/* position: absolute;
		left: 0;
		top: 0;
		right: 0;
		z-index:9; */
	}
	.swiperImg{
		width: 750rpx;
		height: 600rpx;
	}
	.wrap{
		margin: 30rpx 20rpx 0;
		/* position: absolute; */
		/* top: 600rpx; */
		/* z-index: 999; */
	}
	.wrap-box{
		display: flex;
		flex-direction: row;
	}
	.avatar{
		border-style: solid;
		border-width: 4rpx;
		border-color: #FFFFFF;
		width: 140rpx;
		height: 140rpx;
		/* margin-top: -50rpx; */
		margin-right: 20rpx;
		border-radius: 70rpx;
	}
	.wrap-box-info{
		width: 550rpx;
	}
	.wrap-box-info-name{
		font-size: 34rpx;
		overflow: hidden;
		text-overflow:ellipsis; 
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		margin-bottom: 10rpx;
	}
	.wrap-box-info-basic{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.constellation{
		margin: 0 10rpx;
		background-color: #4864F8;
		color: white;
		border-radius: 20rpx;
		padding: 0 20rpx;
		line-height: 34rpx;
		font-size: 24rpx;
	}
	.addr{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
	}
	.addr-icon{
		width: 40rpx;
		height: 40rpx;
	}
	.addr-name{
		font-size: 28rpx;
		color: #999999;
		flex: 1;
	}
	.addr-btn{
		color: white;
		background-image: linear-gradient(to bottom, #381895, #865afd);
		font-size: 26rpx;
		padding: 10rpx 30rpx;
		border-radius: 10rpx;
	}
	.get{
		display: flex;
		flex-direction: row;
		margin-top: 30rpx;
	}
	.get-item{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 10rpx;
	}
	.get-item-number{
		margin-right: 6rpx;
		font-size: 30rpx;
		color: #555;
	}
	.get-item-txt{
		font-size: 30rpx;
		color: #555;
	}
	.cell{
		margin-top: 60rpx;
		padding-bottom: 40rpx;
		padding-top: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-top-color: #eceaed;
		border-top-width: 2rpx;
		border-top-style: solid;
		/* border-bottom-color: #eceaed;
		border-bottom-width: 2rpx;
		border-bottom-style: solid; */
	}
	.cell-item{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 40rpx;
		flex-direction: column;
	}
	.cell-item-name{
		font-size: 32rpx;
		color: #666;
	}
	.cell-item-xian{
		width: 30rpx;
		height: 6rpx;
		border-radius: 10rpx;
	}
	.cell-item-name-action{
		font-size: 40rpx;
		color: #000;
		font-weight: bold;
	}
	.cell-item-xian-action{
		width: 30rpx;
		height: 6rpx;
		border-radius: 10rpx;
		background-color: #6b5aac;
	}
	.about{
		margin-top: 20rpx;
	}
	.about-cell{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.about-title{
		margin-top: 20rpx;
		display: block;
		font-size: 30rpx;
	}
	.about-textarea{
		width: 710rpx;
		background-color: #f1eff2;
		margin-top: 10rpx;
		border-radius: 16rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.about-textarea-txt{
		padding: 10rpx;
		font-size: 26rpx;
		color: #666;
	}
	.about-list{
		width: 550rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.about-list-tip{
		border-radius: 50rpx;
		font-size: 24rpx;
		background-color: rgba(56,24,149, .3);
		color: #381895;
		margin-right: 10rpx;
		padding: 8rpx 16rpx;
		margin-top: 10rpx;
	}
	.dynamic{
		width: 710rpx;
		/* padding: 0 20rpx; */
		/* margin-top: 50rpx; */
	}
	.dynamic-item{
		border-bottom-color: #eee;
		border-bottom-width: 2rpx;
		border-bottom-style: solid;
		padding-bottom: 50rpx;
		margin-bottom: 50rpx;
	}
	.dynamic-item-top{
		display: flex;
		align-items: center;
		flex-direction: row;
	}
	.dynamic-item-top-img{
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 60rpx;
	}
	.dynamic-item-top-column{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	.dynamic-item-top-column-name{
		color: #666;
		font-size: 30rpx;
		width: 550rpx;
		overflow: hidden;
		text-overflow: ellipsis; 
		display: -webkit-box; 
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
	.dynamic-item-con{
		margin: 20rpx 0;
		font-size: 30rpx;
		display: block;
	}
	.dynamic-item-con-img{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}
	.dynamic-item-con-img-s{
		margin-right: 6rpx;
		width: 220rpx;
		height: 220rpx;
		margin-bottom: 6rpx;
		border-radius: 10rpx;
	}
	
	.dynamic-item-con-img-one{
		width: 400rpx;
		height: 400rpx;
		border-radius: 10rpx;
	}
	.dynamic-item-option{
		width: 710rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
	}
	.dynamic-item-option-item{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.dynamic-item-option-item-icon{
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	.dynamic-item-option-item-name{
		font-size: 24rpx;
		color: #999999;
	}
	.grid{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 710rpx;
	}
	.grid-item{
		margin-right: 6rpx;
		margin-left: 6rpx;
		margin-bottom: 12rpx;
		width: 223rpx;
		height: 320rpx;
		position: relative;
		background-color: #000000;
	}
	.grid-item-img{
		width: 223rpx;
		height: 320rpx;
		display: block;
	}
	.grid-item-bom{
		position: absolute;
		left: 10rpx;
		bottom: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.grid-item-bom-icon{
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}
	.grid-item-bom-txt{
		color: white;
		font-weight: bold;
		font-size: 32rpx;
	}
	.grid-item-status{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		background-color: rgba(0,0,0,0.3);
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
	}
	.grid-item-status-txt{
		text-align: center;
		font-size: 24rpx;
		color: #FFFFFF;
	}
	.grid-item-status-box{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
	}
	.product{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 710rpx;
	}
	.goods{
		width: 340rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
	}
	.goods-img{
		width: 340rpx;
		max-height: 350rpx;
		display: block;
		will-change: transform;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
	}
	.goods-wrap{
		margin: 10rpx 20rpx 20rpx;
	}
	.goods-wrap-title{
		display: flex;
		flex-direction: row;
	}
	.goods-wrap-title-name{
		width: 280rpx;
		display: inline-block;
		text-overflow: ellipsis;
		lines: 2;
		font-size: 28rpx;
		color: #333333;
	}
	.goods-wrap-title-mark{
		background-image: linear-gradient(to bottom, #381895, #865afd);
		font-size: 24rpx;
		padding-left: 6rpx;
		padding-right: 6rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
		margin-top: 8rpx;
		color: white;
	}
	.goods-wrap-tip{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	.goods-wrap-tip-left{
		font-size: 26rpx;
		color: #fa2d43;
	}
	.goods-wrap-tip-right{
		font-size: 28rpx;
		color: #666;
	}
	.goods-wrap-price{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between
	}
	.goods-wrap-price-txt{
		font-weight: bold;
		color: #381895;
	}
</style>