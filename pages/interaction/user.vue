<template>
	<view class="page" v-if="isDone">
		<swiper style="height: 100vh;" @change="onchange">
			<swiper-item style="height: 100%;" v-if="videoHas">
				<uni-push :screenHeight="screenHeight" :playStatus="playStatus" :list="videoObject"></uni-push>
			</swiper-item>
			<swiper-item style="height: 100%;">
				<scroll-view
					scroll-y 
					@scroll="onScroll" 
					@scrolltolower="scrolltolower" 
					class="swiper" 
					:style="{height: screenHeight+'px'}">
					<swiper class="swiperImgs" :indicator-dots="true" v-if="swiperList.length > 0">
						<swiper-item v-for="(item, i) in swiperList" :key="i">
							<image :src="item" mode="aspectFill" class="swiperImg" @click="previewImg($event, swiperList, i)"></image>
						</swiper-item>
					</swiper>
					<image v-else :src="userDetail.headPortrait" mode="aspectFill" class="swiperImg" @click="previewImg($event, [userDetail.headPortrait], 0)"></image>
					<view class="wrap">
						<view class="wrap-box">
							<view class="wrap-box-avatar">
								<image :src="filterImg(userDetail.headPortrait, 1)" mode="aspectFill" class="wrap-box-avatar-img" @click="previewImg($event, [userDetail.headPortrait], 0)"></image>
							</view>
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
								<view class="addr">
									<view class="flex flex-align-center flex-row" style="width: 400rpx;" v-if="addressName">
										<image :src="staticUrl + 'user/addr.png'" mode="" class="addr-icon"></image>
										<text class="addr-name">{{addressName || "未设置地区"}}</text>
									</view>
									<view v-else></view>
									<text class="addr-btn" :class="{'addr-btn-active':followStatus}" v-if="localUserId !== id" @click="guanZhuByUser">{{followStatus?'取关':'关注'}}</text>
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
									<text class="about-textarea-txt">{{userDetail.personalSignature||"这个家伙很懒，什么都没留下"}}</text>
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
								<view class="dynamic-item" v-for="(item, i) in dynamicList" :key="i" @tap="goDetails(item, i)">
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
												<text class="mark" v-if="userDetail.distributorIsOpen">配送员</text>
											</view>
										</view>
									</view>
									<text class="dynamic-item-con">{{item.comment}}</text>
									<view class="dynamic-item-con-img" v-if="item.images.length > 1">
										<image :src="filterImg(url, 2)" mode="aspectFill" class="dynamic-item-con-img-s" v-for="(url, index) in item.images" :key="index" @tap.stop="previewImg($event, item.images, index)"></image>
									</view>
									<view class="dynamic-item-con-img" v-if="item.images.length === 1">
										<image :src="filterImg(item.images[0], 4)" mode="aspectFill" class="dynamic-item-con-img-one" @tap.stop="previewImg($event, item.images, index)"></image>
									</view>
									<view class="dynamic-item-option" v-if="item.status !== 1">
										<text class="dynamic-item-option-item-name" v-if="item.status === 0">当前视频正在审核中～</text>
										<view class="dynamic-item-option-item" v-if="item.status === 2">
											<text class="dynamic-item-option-item-name" style="color: #CA0400;">动态违规！原因：{{item.violationInformation}}</text>
										</view>
									</view>
									<view class="dynamic-item-option">
										<view class="dynamic-item-option-item">
											<image :src="staticUrl + 'video/comment.png'" mode="" class="dynamic-item-option-item-icon"></image>
											<text class="dynamic-item-option-item-name">{{item.commentCount || 0}}条评论</text>
										</view>
										<view class="dynamic-item-option-item" @tap.stop="onLike($event, item, i)">
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
								<view class="grid-item" v-for="(item, i) in videoList" :key="i" @tap="showVideo(item)">
									<image :src="item.image" mode="aspectFill" class="grid-item-img"></image>
									<view class="grid-item-bom">
										<image :src="staticUrl + 'video/video_love.png'" mode="" class="grid-item-bom-icon"></image>
										<text class="grid-item-bom-txt">{{item.likes}}</text>
									</view>
									<image :src="staticUrl + 'video/del.png'" class="grid-item-del" v-if="localUserId === id" @tap.stop="delVideo($event, item)"></image>
									<view class="grid-item-status" v-if="item.status !== 1">
										<text class="grid-item-status-txt" v-if="item.status === 0">审核中</text>
										<view class="grid-item-status-box" v-if="item.status === 2" @tap.stop="showErrMsg($event, item.violationInformation)">
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
								<block v-for="(item, i) in productList" :key="i">
									<view class="goods" v-if="item.status === 1" @tap="jumpToGoodsDetail(item)">
										<image :src="filterImg(item.goodsInfo.mainImage, 3)" mode="aspectFill" class="goods-img" lazy-load></image>
										<view class="goods-wrap">
											<view class="goods-wrap-title">
												<text class="goods-wrap-title-name">{{item.goodsInfo.titleName}}</text>
											</view>
											<view class="goods-wrap-tip">
												<text class="goods-wrap-tip-left">库存{{item.stock}}</text>
												<text class="goods-wrap-tip-right">月售{{item.sales}}件</text>
											</view>
											<view class="goods-wrap-price">
												<text class="goods-wrap-price-txt">¥{{item.goodsInfo.wholesalePrice}}</text>
											</view>
										</view>
									</view>
								</block>
							</view>
							<uni-load-more :status="productLoading"></uni-load-more>
						</block>
						<view style="height: 100rpx;"></view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<uni-header
			:statusBarHeight="statusBarHeight" :current="curIndex" 
			:videoHas="videoHas" :headerScroll="headerScroll" 
			:isShowMore="!(localUserId === id)" @onMore="onMore"></uni-header>
		
		<!-- #ifdef APP-PLUS -->
		<uni-footer @change="footerChange" v-if="localUserId !== id && !fromImChat"></uni-footer>
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<view class="popup-item" @click="goChatIm(true, 'video')">
					<text class="popup-item-name">视频通话</text>
				</view>
				<view class="popup-item" @click="goChatIm(true, 'voice')">
					<text class="popup-item-name">语音通话</text>
				</view>
				<view class="popup-item popup-cancel" @click="closePopup()">
					<text class="popup-item-name">取消</text>
				</view>
			</view>
		</uni-popup>
		<!-- #endif -->
	</view>
</template>
<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import { sendRequest } from "@/common/http/api.js"
	import publics from "@/common/utils/public.js"
	var system = uni.getSystemInfoSync();
	import uniHeader from './components/header';
	// #ifdef APP-PLUS
	import uniFooter from './components/footer';
	// #endif
	import uniSwiper from './components/swiper';
	import uniPush from './components/push';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniHeader,
			// #ifdef APP-PLUS
			uniFooter,
			// #endif
			uniSwiper,
			uniPush,
			uniLoadMore,
			uniPopup,
		},
		data() {
			return {
				staticUrl: this.$staticUrl,
				isDone: false,
				statusBarHeight: system.statusBarHeight,
				screenHeight: system.screenHeight,
				swiperList: [],
				videoObject: {},
				curIndex: 0,
				addressName: "",
				playStatus: true,
				userDetail: {},
				videoData: {},
				loadingType: "loading",
				dynamicList: [],
				cellTabs: [
					{name:"TA的动态", total:0},
					// #ifdef APP-PLUS
					{name:"TA的视频", total:0}
					// #endif
					// {name:"配送员库存", total:8}
				],
				cellIndex: 0,
				localUserId: "",
				id: "",
				headerScroll: false,
				labelHobbyList: [],
				labelPastOccupationList: [],
				videoHas: false,
				followStatus: false, // 关注
				pageSize: 0,
				videoList: [],
				videoLoading: "nomore",
				videoTotal: 0,
				userFlag: false,
				isOnline: true, // 对方是否在线，默认在线
				productList: [],
				productLoading: "nomore",
				fromImChat: false ,// 是否从聊天页面进入到当前页面
				isBack: false, // 是否已拉黑用户
			}
		},
		computed:{
			...mapState(["userInfo", "interactionOnlineStatus"])
		},
		async onLoad(opt) {
			uni.showLoading({
				mask:true,
				title: "数据加载ing..."
			})
			if (opt.fromImChat) {
				this.fromImChat = opt.fromImChat
			}
			if (opt.userId) { // 用户imAccount
				this.id = opt.userId
			} else {
				this.id = this.userInfo.imAccount
			}
			if (opt.id) {	// 用户id
				let r = await sendRequest("get", url.user.getImAccountById, {id: opt.id})
				this.id = r.data
			}
			this.init()
			this.cellIndex = opt.current ? parseInt(opt.current) : 0
		},
		methods: {
			refresh(){
				this.dynamicList = []
				this.pageSize = 0
				this.videoList = []
				this.productList = []
				this.init()
			},
			async init(){
				this.localUserId = this.userInfo.imAccount
				if (this.localUserId === this.id) {
					this.userDetail = this.userInfo
				} else {
					let res = await sendRequest("get", url.user.getUserInfoById, {toImAccount: this.id})
					if (!res.data) {
						this.$navigateBack()
						return
					}
					this.userDetail = res.data
					// 是否已拉黑该用户
					let blockInfo = await sendRequest("get", url.user.isBackUser, {toImAccount: this.id})
					this.isBack = blockInfo.data
				}
				if (this.userDetail.labelHobby) {
					this.labelHobbyList = this.userDetail.labelHobby.split("-")
				}
				if (this.userDetail.labelPastOccupation) {
					this.labelPastOccupationList = this.userDetail.labelPastOccupation.split("-")
				}
				this.addressName = publics.getAddressByThreeCode(this.userDetail.adcode)
				let userResources = this.userDetail.userResources
				if (userResources && userResources.length > 0) {
					this.swiperList = []
					userResources.map(v =>{
						if (v.type === 1) {
							this.swiperList.push(v.ossUrl)
						}
						if (v.type === 2 && v.status === 1) {
							this.videoObject = v
							this.videoHas = true
						}
					})
				}
				this.isDone = true
				uni.hideLoading()
				this.getList()
				
				// #ifdef APP-PLUS
				this.getVideoInit()
				// #endif
				
				if (this.userDetail.distributorIsOpen){
					this.cellTabs.push({name:"配送员库存", total:0})
					this.getProductList()
				}
			},
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			scrolltolower(){
				if (this.cellIndex === 0) {
					this.getList()
				} else if (this.cellIndex === 1) {
					// #ifdef APP-PLUS
					this.getVideoList()
					// #endif
					
					// #ifndef APP-PLUS
					if (this.userDetail.distributorIsOpen){
						this.getProductList()
					}
					// #endif
				} else {
					if (this.userDetail.distributorIsOpen){
						this.getProductList()
					}
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
						if (v.images && typeof v.images === "string") {
							v.images = v.images.split(",")
						}
					})
					this.dynamicList = this.dynamicList.concat(list)
					this.cellTabs[0].total = this.dynamicList.length
					if(list.length>8){
						this.loadingType = "more";
					}else{
						this.loadingType = "nomore";
					}
				} else{
					this.loadingType = "nomore";
				}
			},
			getVideoInit(){
				sendRequest('get', url.interaction.userVideoInit, {userId:this.userDetail.id}).then(res =>{
					this.videoData = res.data
					this.videoTotal = res.data.zuoPin
					this.cellTabs[1].total = res.data.zuoPin
					this.userFlag = res.data.userFlag
					this.followStatus = res.data.likeItsByUserId
					this.getVideoList()
				})
			},
			getVideoList(){
				if (this.videoList.length === this.videoTotal) return
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
					} else {
						this.videoLoading = "nomore"
					}
				})
			},
			getProductList(type) {
				let params = {
					toImAccount: this.userDetail.imAccount,
					pageNum: this.productList.length
				};
				sendRequest('GET', url.agent.getStockList, params).then(res =>{
					this.cellTabs[this.cellTabs.length - 1].total = res.data.stockCount
					let list = res.data.stockList
					this.productList = this.productList.concat(list)
					this.productLoading = list.length < 12 ? 'nomore' : 'more'
				})
			},
			//浏览视频
			showVideo(row){
				uni.navigateTo({
					url: "/pages/video/indexByUser?pages=user&id="+row.id
				})
			},
			// 删除视频
			delVideo(e, item){
				e.stopPropagation(); 
				let _this = this
				uni.showModal({
					title: "删除视频",
					content: "是否确认删除该视频",
					success(res) {
						if (res.confirm) {
							sendRequest("POST", url.interaction.delVideo, {videoId: item.id}).then(res => {
								uni.showToast({
									title: res.data,
									icon: "none"
								})
								_this.pageSize = 0
								_this.videoList = []
								_this.getVideoInit()
							})
						}
					}
				})
			},
			showErrMsg(e, msg){
				e.stopPropagation(); 
				if (!msg) return
				uni.showModal({
					content: msg,
					showCancel: false
				})
			},
			// 0-关注/1-取关
			guanZhuByUser(){
				publics.setGuanZhuDatasJiLu(this.userDetail.id);
				let type = this.followStatus ? 1 : 0
				sendRequest("POST", url.interaction.followByUserId, {
					userId: this.userDetail.id,
					type: type
				}).then(res =>{
					this.followStatus = type ? 0 : 1
					if (type) {
						this.videoData.fenSi--
					} else {
						this.videoData.fenSi++
					}
				})
			},
			onMore(){
				let _this = this
				let itemList = ["举报", "拉黑"]
				if (this.isBack) {
					itemList = ["举报", "移除黑名单"]
				}
				uni.showActionSheet({
					itemList: itemList,
					success: function (res) {
						if (res.tapIndex === 0) {
							uni.navigateTo({
								url: "/pages/report/index?type=3&configType=2&id="+_this.userInfo.id
							})
						} else {
							let params = {
								toImAccount: _this.id
							}
							let msg = "拉黑该用户后，在附近、配送员、动态、视频中将不会出现该用户以及该用户发布的任何内容，是否要拉黑？"
							let title = "拉黑"
							let path = url.user.addBackUser
							if (_this.isBack) {
								msg = "是否把该用户移除黑名单？"
								title = "移除黑名单"
								path = url.user.delBackUser
							}
							uni.showModal({
								title: title,
								content: msg,
								success(r) {
									if (r.confirm) {
										sendRequest("POST", path, params).then(doc => {
											_this.isBack = !_this.isBack
											uni.showToast({
												title: doc.data,
												icon: "none"
											})
											itemList[1] = [_this.isBack?"移除黑名单":"拉黑"]
										})
									}
								}
							})
						}
					}
				})
			},
			previewImg(e, imgs, index){
				e.stopPropagation(); 
				let _this = this
				uni.previewImage({
					urls: imgs,
					current: imgs[index]
				});
			},
			// 点赞
			onLike(e, item, index){
				e.stopPropagation(); 
				let type = item.isLike ? 1 : 0
				sendRequest('post', url.interaction.likeByComment, {type:type, commentId: item.id}).then(res => {
					this.dynamicList[index].isLike = !type
					if (!type) {
						this.dynamicList[index].likeCount += 1
					} else {
						this.dynamicList[index].likeCount -= 1
					}
					this.$forceUpdate()
				})
			},
			goDetails(item, i){
				uni.navigateTo({
					url: "details?pages=user&itemIndex="+i+"&id="+item.id
				})
			},
			onScroll(e){
				if (e.detail.scrollTop > 130) {
					this.headerScroll = true
				} else {
					this.headerScroll = false
				}
			},
			onchange: function(e) {
				this.curIndex = e.detail.current;
				this.playStatus = this.curIndex === 0 ? true : false;
				if (this.current === 0) this.headerScroll = false
			},
			footerChange(index){
				console.log(index)
				if (index === 1) {
					this.goChatIm(false)
				} else {
					this.$refs.popup.open()
				}
			},
			goChatIm(sendVideo, callType){
				this.playStatus = false
				let type = this.userDetail.distributorIsOpen ? 2 : 1
				let url = "im-chat?type="+type+"&&id="+this.userDetail.imAccount 
				if (sendVideo) {
					url = url + "&&sendVideo=true&&callType="+callType
				}
				setTimeout(()=>{
					uni.navigateTo({
						url: url
					})
					this.closePopup()
				}, 300)
			},
			closePopup(){
				this.$refs.popup.close()
			},
			jumpToFollow(){
				let data = {
					nickname: this.userDetail.nickname,
					id: this.userDetail.id
				}
				uni.navigateTo({
					url: "/pages/video/followAndLike?data="+JSON.stringify(data)
				})
			},
			jumpToGoodsDetail(item){
				uni.navigateTo({
					url: '/pages/home/details?id='+item.goodsId
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		/* position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0; */
		background-color: #000000;
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
	}
	.swiperImg{
		width: 750rpx;
		height: 600rpx;
	}
	.wrap{
		margin: 30rpx 20rpx 0;
	}
	.wrap-box{
		display: flex;
		flex-direction: row;
	}
	.wrap-box-avatar{
		position: relative;
	}
	.wrap-box-avatar-img{
		border-style: solid;
		border-width: 4rpx;
		border-color: #FFFFFF;
		width: 140rpx;
		height: 140rpx;
		/* margin-top: -50rpx; */
		margin-right: 20rpx;
		border-radius: 70rpx;
	}
	.wrap-box-avatar-online{
		width: 80rpx;
		position: absolute;
		bottom: 16rpx;
		left: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
		background-color: rgba(0,0,0,0.5);
		padding-top: 4rpx;
		padding-bottom: 4rpx;
	}
	.wrap-box-avatar-online-yuan{
		margin-right: 6rpx;
		width: 10rpx;
		height: 10rpx;
	}
	.wrap-box-avatar-online-txt{
		font-size: 20rpx;
		color: white;
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
		height: 70rpx;
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
	.addr-btn-active{
		color: #b2b3b5 !important;
		background-image: linear-gradient(to bottom, #e9e7ea, #e9e7ea) !important;
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
		padding: 0 20rpx;
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
		width: 214rpx;
		height: 214rpx;
		margin-bottom: 6rpx;
		border-radius: 10rpx;
	}
	.dynamic-item-con-img-one{
		width: 400rpx;
		height: 400rpx;
		border-radius: 10rpx;
	}
	.dynamic-item-option{
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
	.grid-item-del{
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		right: 6rpx;
		bottom: 10rpx;
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
		width: 350rpx;
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
		/* align-items: center; */
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
	.popup{
		background-color: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.popup-item{
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom-color: #EEEEEE;
		border-bottom-width: 2rpx;
	}
	.popup-item-name{
		font-size: 30rpx;
	}
	.popup-item-desc{
		color: #999999;
		font-size: 24rpx;
	}
	.popup-cancel{
		border-top-color: #EEEEEE;
		border-top-width: 10rpx;
	}
</style>