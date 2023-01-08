<template>
	<view class="main">
		<view class="header bg-base" :style="{'padding-top': statusBarHeight+'px'}">
			<!-- #ifdef MP-WEIXIN -->
			<view :style="{height: wxBtnHeight + 'px'}"></view>
			<!-- #endif -->
			<view class="positionShow" v-if="!isOpenPosition" @click="goSet">
				<view class="flex flex-align-center item">
					<text class="iconfont icon">&#xe659;</text>
					<text class="txt">您未开启位置服务，距离计算不准确，请点击前往开启位置服务</text>
				</view>
			</view>
			<view class="flex flex-between">
				<text class="iconfont font48 color-w" @tap="openMap">&#xe611;</text>
				<view class="search flex flex-align-center bg-w flex-grow">
					<view style="position: relative;">
						<view class="flex flex-align-center left" @click="showSearchList = !showSearchList">
							<text class="font30">{{searchList[searchIndex]}}</text>
							<text class="iconfont down">&#xe644;</text>
						</view>
						<view class="searchList" v-if="showSearchList">
							<text class="iconfont icon">&#xe644;</text>
							<view class="cell">
								<text 
									class="cell-item" 
									:class="{'color-purple': i === searchIndex}" 
									v-for="(item, i) in searchList" 
									:key="i"
									@click="selectSearchType(i)">
									{{item}}
								</text>
							</view>
						</view>
					</view>
					<input type="text" class="font30 color-b6 input flex-grow" confirm-type="search" @confirm="onSearch" v-model="keyWord" placeholder="输入您要搜索的内容" />
					<text class="iconfont color-purple font44" @click="onSearch">&#xe627;</text>
				</view>
				<view class="notice">
					<text class="iconfont font48 color-w" @tap="jumpToNotice(1, '系统公告')">&#xe68a;</text>
					<text class="tips" v-if="noticeTotal">{{noticeTotal>99?'99+':noticeTotal}}</text>
				</view>
			</view>
			<view class="flex flex-between font26 color-w">
				<text>{{addressName}}</text>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="swiper">
			<swiper :autoplay="true" indicator-dots class="swiper-wrap">
				<swiper-item v-for="(item, i) in swiperList" :key="i">
					<view class="swiper-box" @click="advertJump(item.operationCode, item.operationValue)">
						<image :src="item.ossUrl" mode="" class="swiper-item" style="border-radius: 20rpx;"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="content">
			<!-- 品质好酒 -->
			<view class="flex flex-between color-b6">
				<view class="flex flex-align-center font24">
					<text class="iconfont font24" style="margin-right: 6rpx;">&#xe613;</text>
					<text>品质保证</text>
				</view>
				<view class="flex flex-align-center font24">
					<text class="iconfont font24" style="margin-right: 6rpx;">&#xe613;</text>
					<text>独特送酒服务</text>
				</view>
				<view class="flex flex-align-center font24">
					<text class="iconfont font24" style="margin-right: 6rpx;">&#xe613;</text>
					<text>新社交天堂</text>
				</view>
				<view class="flex flex-align-center font24">
					<text class="iconfont font24" style="margin-right: 6rpx;">&#xe613;</text>
					<text>模式领先</text>
				</view>
			</view>
			
			<!-- 分类 -->
			<view class="clas">
				<image :src="staticUrl + 'home/class/notice.jpg'" mode="widthFix" class="img" @tap="jumpToNotice(2, '公告')"></image>
				<image :src="staticUrl + 'home/class/gift.jpg'" mode="widthFix" class="img" @tap="jumpToNew(1, '新人大礼')"></image>
				<image :src="staticUrl + 'home/class/alarm.jpg'" mode="widthFix" class="img" @tap="jumpToNew(2, '限时秒杀')"></image>
				<image :src="staticUrl + 'home/class/settled.jpg'" mode="widthFix" class="img" @tap="jumpToNew(5, '积分大送')"></image>
				<image :src="staticUrl + 'home/class/special.jpg'" mode="widthFix" class="img" @tap="jumpToNew(3, '特价商品')"></image>
				<image :src="staticUrl + 'home/class/team.jpg'" mode="widthFix" class="img" @tap="jumpToNew(4, '拼团')"></image>
				<!-- <image :src="staticUrl + 'home/class/dispatcher.jpg'" mode="widthFix" class="max-img" @tap="$navigateTo('/pages/agent/apply')"></image>
				<image :src="staticUrl + 'home/class/business.jpg'" mode="widthFix" class="max-img" @tap="$navigateTo('/pages/merchants/settleIn/step')"></image> -->
			</view>
			
			<!-- tabs -->
			<view 
				class="tabs" 
				:class="{'tabsFixed': tabsFixed}" 
				:style="{'padding-top': tabsFixed ? (statusBarHeight+'px') : 0}"
				id="tabs">
				<view class="tab flex flex-center" v-for="(item, i) in tabs" :key="i" @click="changeTab(i)">
					<image mode="widthFix" v-if="current === i" :src="staticUrl + 'home/tabs/' + item.img + '_use.png'"></image>
					<image mode="widthFix" v-else :src="staticUrl + 'home/tabs/' + item.img + '.png'"></image>
				</view>
			</view>
			<view class="list">
				<swiper :current="current" @change="swiperChange" :style="{'height': swiperHeight+statusBarHeight+'px'}">
					<!-- 新品推荐 -->
					<swiper-item style="height: 100%;">
						<scroll-view :show-scrollbar="false" :scroll-y="tabsFixed" class="new" @scrolltolower="currentLoadData()">
							<view class="flex flex-center mark">
								<text class="iconfont color-w font34">&#xe617;</text>
							</view>
							<view class="flex flex-between bg-w title color-purple" @click="jumpToProduct('新品推荐', 1)">
								<view class="flex flex-align-center">
									<image :src="staticUrl + 'home/tabs/news_icon.png'" mode="" class="icon"></image>
									<text class="font32">更多推荐</text>
								</view>
								<text class="iconfont font48">&#xe713;</text>
							</view>
							<view class="new-item">
								<product :list="newProductList" :type="1"></product>
							</view>
							<uni-load-more :status="loadingType"></uni-load-more>
						</scroll-view>
					</swiper-item>
					<!-- 精品推荐 -->
					<swiper-item style="height: 100%;">
						<scroll-view :show-scrollbar="false" :scroll-y="tabsFixed" class="new" @scrolltolower="currentLoadData()">
							<view class="flex flex-center mark" style="margin-left: 118px;">
								<text class="iconfont color-w font34">&#xe617;</text>
							</view>
							<view class="flex flex-between bg-w title color-purple" @click="jumpToProduct('精品推荐', 2)">
								<view class="flex flex-align-center">
									<image :src="staticUrl + 'home/tabs/boutique_icon.png'" mode="" class="icon"></image>
									<text class="font32">金牌推荐</text>
								</view>
								<text class="iconfont font48">&#xe713;</text>
							</view>
							<view class="new-item">
								<product :list="recommendList" :type="2"></product>
							</view>
							<uni-load-more :status="recommendLoading"></uni-load-more>
						</scroll-view>
					</swiper-item>
					<!-- 附近店铺 -->
					<swiper-item style="height: 100%;">
						<scroll-view :show-scrollbar="false" :scroll-y="tabsFixed" class="shop" @scrolltolower="currentLoadData()">
							<view class="flex flex-center mark" style="margin-left: 236px;">
								<text class="iconfont color-w font34">&#xe617;</text>
							</view>
							<view class="flex flex-between bg-w title color-purple" @click="jumpToStore(null)">
								<view class="flex flex-align-center">
									<image :src="staticUrl + 'home/tabs/nearby_icon.png'" mode="" class="icon"></image>
									<text class="font32">附近店铺</text>
								</view>
								<text class="iconfont font48">&#xe713;</text>
							</view>
							<shop :list="storeEnclosureList"></shop>
							<uni-load-more :status="nearbyLoading"></uni-load-more>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	
		<!-- 弹框 -->
		<modal v-if="showModal">
			<image :src="advertData.ossUrl" mode="widthFix" @click="imgJump"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="showModal = false">&#xe64a;</text>
		</modal>
		
		<!-- 福利红包 -->
		<red-envelopes v-for="(item, i) in redList" :key="i" :data="item" :type="1" :bottom="i === 0 ? 100 : i*80+100"></red-envelopes>
		
		<tabbar></tabbar>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import { checkOpenGPSService } from "@/common/utils/index.js"
	import product from "./modules/product.vue"
	import shop from "./modules/shop.vue"
	import modal from "@/components/modal.vue"
	import redEnvelopes from "@/components/red-envelopes.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import tabbar from '@/components/tabbar.vue';
 
	export default {
		components: { uniLoadMore, product, shop, modal, redEnvelopes, tabbar },
		data() {
			return {
				staticUrl: this.$staticUrl,
				statusBarHeight: getApp().statusBarHeight,
				swiperHeight: 0,
				swiperList: [],
				swiperCenterList: [],
				searchList: ["商品", "店铺"],
				searchIndex: 0,
				showSearchList: false,
				keyWord: "",
				centreSwiperList: [],
				current: 0,
				tabs: [
					{name: '新品推荐', img: 'news'},
					{name: '精品推荐', img: 'boutique'},
					{name: '附近店铺', img: 'nearby'}
				],
				tabsTop: 0,
				tabsFixed: false,
				myAddressData: { // 默认北京
					longitude:0,
					latitude:0
				},
				storeEnclosureList: [],
				nearbyLoading: "more",
				// 精品推荐
				recommendList: [],
				recommendPageSize: 1,
				recommendLoading: 'more',
				// 新品推荐
				newProductList: [],
				pageNum: 1,
				loadingType: 'more',
				addressName: "",
				showModal: false,
				advertData: {},
				redList: [],
				noticeTotal: 0,
				isOpenPosition: true,
				// #ifdef MP-WEIXIN
				wxBtnHeight: 0,
				// #endif
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.wxBtnHeight = wx.getMenuButtonBoundingClientRect().height
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			// #endif
			this.swiperHeight = uni.getSystemInfoSync().screenHeight
			// 获取新品商品
			this.getNewProductList('add')
			// 获取轮播图、弹框
			this.getAdvertising()
		},
		onShow() {
			let _this = this
			// #ifdef APP-PLUS
			//是否开启位置权限
			checkOpenGPSService(result=>{
				_this.isOpenPosition = result
				if (result) {
					//设置地址
					_this.getMyLocation();
				}
			})
			// #endif
			// 获取红包信息
			this.getRedBagList()
			// 获取公告未读数量
			this.getNoticeTotal()
		},
		mounted() {
			setTimeout(()=>{
				this.$getRect("#tabs").then(res =>{
					this.tabsTop = res.top - 50
				})
			}, 500)
		},
		onBackPress(){
			//隐藏到后台，不退出app
			let main = plus.android.runtimeMainActivity();
			main.moveTaskToBack(false);
			return true;
		},
		onPageScroll(e){
			// 滑动到tabs是固定在顶部
			if (e.scrollTop > this.tabsTop) {
				this.tabsFixed = true
			} else {
				this.tabsFixed = false
			}
		},
		//加载更多
		onReachBottom() {
			this.currentLoadData()
		},
		// 下拉刷新
		onPullDownRefresh(){
			// 获取轮播图、弹框
			this.getAdvertising()
			if (this.current === 0) {
				this.getNewProductList('refresh');
			} else if (this.current === 1) {
				this.getBoutiqueList('refresh');
			} else {
				// 附近的店铺
				this.storeEnclosureList = []
				this.getStoreEnclosureList();
			}
		},
		methods: {
			goSet(){
				let system = uni.getSystemInfoSync();// 获取系统信息
				if (system.platform === 'android') { // 判断平台
				    var Intent = plus.android.importClass('android.content.Intent');
					var Settings = plus.android.importClass('android.provider.Settings');
					var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS); 
					main.startActivity(intent); // 打开系统设置GPS服务页面
				
				} else if (system.platform === 'ios') {
					var UIApplication = plus.ios.importClass("UIApplication");
					var application2 = UIApplication.sharedApplication();    
					var NSURL2 = plus.ios.importClass("NSURL");                          
					var setting2 = NSURL2.URLWithString("app-settings:"); // 打开应用权限  
					application2.openURL(setting2);    
					plus.ios.deleteObject(setting2);    
					plus.ios.deleteObject(NSURL2);    
					plus.ios.deleteObject(application2);   
				}
			},
			// 红包福利
			getRedBagList(){
				this.$http("GET", url.cms.redEnvelopesList).then(res =>{
					if (res.data && res.data.length > 0) {
						let data = res.data
						data.map(v =>{
							v.show = true
						})
						this.redList = data
					}
				})
			},
			// 获取轮播图、弹框
			getAdvertising(){
				// 首页顶部轮播图
				this.$http("GET", url.cms.advertisingMap, {position: 1}).then(res =>{
					this.swiperList = res.data
				})
				// 首页中间轮播图
				this.$http("GET", url.cms.advertisingMap, {position: 2}).then(res =>{
					this.swiperCenterList = res.data
				})
				// 首页弹框广告
				this.$http("GET", url.cms.advertisingMap, {position: 3}).then(res =>{
					if (res.data.length > 0) {
						this.advertData = res.data[0]
						if (this.advertData.popupMode === 2) {
							if (!publics.advertShowToStorage(this.advertData.id)) {
								this.showModal = true
							}
						} else {
							this.showModal = true
						}
					}
				})
			},
			// 获取平台公告未读数量
			getNoticeTotal(){
				this.$http("GET", url.cms.noticeCount, {type:1, read: 2}).then(res =>{
					this.noticeTotal = res.data
				})
			},
			filterImg(img){
				return publics.filterImgUrl(img, 3)
			},
			async getBoutiqueList(type) {
				if (type === 'add') {
					if (this.recommendLoading === 'nomore') {
						return;
					}
					this.recommendLoading = 'loading';
				} else {
					this.recommendLoading = 'more';
					this.recommendList = []
					this.recommendPageSize = 1
				}
				let params = {
					pageSize: this.recommendPageSize,
					sortComprehensive: 1,
					goodsType: 2
				};
				let res = await this.$http('GET', url.goods.getGoodsList, params);
				let list = res.data
				let goodsList = list.records;
				if (type === 'refresh') {
					this.recommendList = [];
					this.recommendPageSize = 1;
				}
				this.recommendList = this.recommendList.concat(goodsList);
				if(this.recommendList.length < list.total){
					this.recommendPageSize++
					this.recommendLoading = "more"
				} else{
					this.recommendLoading = "nomore"
				}
				uni.stopPullDownRefresh();
			},
			// 获取新品上市商品
			async getNewProductList(type) {
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
					this.newProductList = []
					this.pageNum = 1
				}
				//没有更多直接返回
				let params = {
					pageSize: this.pageNum,
					sortComprehensive: 1,
					goodsType: 1,
					storeId: 0
				};
				let res = await this.$http('GET', url.goods.getGoodsList, params);
				let list = res.data
				this.newProductList = this.newProductList.concat(list.records);
				if(this.newProductList.length < list.total){
					this.pageNum++;
					this.loadingType = "more"
				} else{
					this.loadingType = "nomore"
				}
				uni.stopPullDownRefresh();
			},
			// 获取附近的店铺
			async getStoreEnclosureList() {
				let params = {
					pageNum: this.storeEnclosureList.length,
					lng: this.myAddressData.longitude, //经度
					lat: this.myAddressData.latitude   //纬度
				};
				let res = await this.$http('GET', url.store.getNearbyStores, params);
				this.storeEnclosureList = this.storeEnclosureList.concat(res.data);
				this.nearbyLoading = res.data.length < 12 ? 'nomore' : 'more'
				uni.stopPullDownRefresh();
			},
			selectSearchType(i){
				this.searchIndex = i
				this.showSearchList = false
			},
			onSearch(){
				this.showSearchList = false
				let keyWord = this.keyWord
				if (this.searchIndex === 0) {// 搜索商品
					this.jumpToProduct("商品列表", -1, keyWord)
				} else { // 搜索店铺
					this.jumpToStore(keyWord)
				}
				this.keyWord = ""
			},
			getMyLocation(){
				let _this = this;
				uni.getLocation({
				    type: 'wgs84',
					geocode: true,
				    success: async function (res) {
						console.log("获取当前位置成功。。。。", res)
				        //设置地址
						publics.setMyaddressLngLat(JSON.stringify(res));
						_this.myAddressData = res;
						//设置当前位置名称
						if (res.address){
							_this.addressName = res.address.district+(res.address.poiName||res.address.street);
						} else {
							let r = await publics.getPositionToLngAndLat(res.longitude, res.latitude)
							_this.addressName = r.result.address
						}
				    }, fail: function (err) { // 定位权限没开启
						// _this.openMap()
					}
				});
			},
			currentLoadData(){
				if (this.current === 0) {
					this.getNewProductList('add');
				} else if (this.current === 1) {
					this.getBoutiqueList('add');
				} else {
					this.getStoreEnclosureList();
				}
			},
			changeTab(index) {
				this.current = index
			},
			swiperChange(e){
				this.changeTab(e.detail.current)
				this.currentLoadData()
			},
			openMap(){
				let _this = this;
				uni.chooseLocation({
					latitude: _this.myAddressData.latitude || 39.904989,
					longitude: _this.myAddressData.longitude || 116.405285,
					success: function(res) {
						//设置地址
						publics.setMyaddressLngLat(JSON.stringify(res));
						_this.myAddressData = res;
						//重新加载附近店铺
						// _this.getStoreEnclosureList();
						if (res.address.indexOf("省") > -1) {
							//解析地址，去除省份和市
							let reg = /.+?(省|市|自治区|自治州|县|区)/g;
							let addressMatch = res.address.match(reg);
							//设置当前位置名称
							let replaseName = "";
							for(let i=0;i<addressMatch.length;i++){
								replaseName += addressMatch[i];
							}
							_this.addressName = res.address.replace(replaseName,"");
						} else {
							_this.addressName = res.address
						}
					}, fail() {
						// _this.$msg("获取位置失败,请检查定位服务是否开启，或持设备到相对开阔的露天场所再次尝试", 8000);
					}
				});
			},
			jumpToNotice(key, title){
				this.$navigateTo(`/pages/notice/index?type=${key}&title=${title}`)
			},
			jumpToProduct(title, goodsType, goodsName) {
				this.$navigateTo(`/pages/home/productList?title=${title}&goodsType=${goodsType}&goodsName=${goodsName}`)
			},
			jumpToNew(type, title){
				this.$navigateTo(`/pages/home/newPeopleOrSpecial?type=${type}&title=${title}`)
			},
			jumpToStore(keyWord){
				let path = "/pages/home/storeList"
				if (keyWord) {
					path = path + "?storeName=" + keyWord
				}
				this.$navigateTo(path)
			},
			showToast(){
				this.$msg("暂未开放，敬请期待～")
			},
			imgJump(){
				this.showModal = false
				this.$http("POST", url.cms.clickAdvertisingMap, {id: this.advertData.id})
				this.advertJump(this.advertData.operationCode, this.advertData.operationValue)
			},
			advertJump(code, value){
				publics.advertOption(code, value)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: #f4f5f6;
	}
	.positionShow{
		height: 100rpx;
		width: 750rpx;
		// position: fixed;
		// top: 80rpx;
		// left: 0;
		// right: 0;
		margin-left: -30rpx;
		background-color: #fceeed;
		display: flex;
		align-items: center;
		.item{
			padding: 0 30rpx;
		}
		.txt{
			font-size: 28rpx;
			color: #666666;
		}
		.icon{
			color: #f55556;
			font-size: 40rpx;
			margin-right: 20rpx;
		}
	}
	.header{
		border-radius: 0 0 40% 40%;
		padding: 0 30rpx 200rpx;
		
		.search{
			margin: 20rpx 30rpx 10rpx;
			padding: 16rpx 20rpx;
			border-radius: 50rpx;
			.left{
				border-right: 2rpx solid #EEEEEE;
				color: #333;
				padding-right: 10rpx;
				.down{
					font-size: 24rpx;
					margin-top: 6rpx;
				}
			}
			.searchList{
				margin-top: 10rpx;
				position: absolute;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				z-index: 9999;
				left: -50rpx;
				.icon{
					transform: scaleY(-1);
					color: white;
					margin-bottom: -10rpx;
				}
				.cell{
					background-color: #FFFFFF;
					border-radius: 10rpx;
					padding: 0 30rpx;
					box-shadow: 0rpx 0rpx 4rpx #FFFFFF;
					&-item{
						font-size: 30rpx;
						width: 100rpx;
						height: 80rpx;
						display: block;
						text-align: center;
						line-height: 80rpx;
						border-bottom: 2rpx solid #fbf9fc;
					}
					&-item:last-child{
						border: none;
					}
				}
			}
			.input{
				margin: 0 10rpx;
				width: 300rpx;
			}
		}
		.notice{
			position: relative;
			.tips{
				position: absolute;
				right: -20rpx;
				top: -20rpx;
				color: white;
				font-size: 24rpx;
				padding: 0 14rpx;
				border-radius: 50rpx;
				z-index: 9;
				background-color: #CA0400;
			}
		}
	}
	.swiper{
		width: 750rpx;
		height: 280rpx;
		margin-bottom: 10rpx;
		margin-top: -180rpx;
		&-wrap{
			width: 100%;
			height: 100%;
		}
		&-box{
			width: 710rpx;
			height: 100%;
			margin-left: 20rpx;
			border-radius: 20rpx;
			overflow: hidden;
		}
		&-item{
			width: 100%;
			height: 100%;
		}
	}
	.content{
		padding: 0 20rpx;
		.grid{
			margin: 10rpx 0 10rpx;
			border-radius: 20rpx;
			padding: 20rpx 0 30rpx;
			&-item{
				width: 33.33%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				.icon{
					width: 90rpx;
					height: 90rpx;
				}
			}
		}
		.clas{
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			.img{
				border-radius: 20rpx;
				margin-bottom: 10rpx;
				width: 230rpx;
			}
			.max-img{
				width: 350rpx;
			}
		}
		.centreSwiper{
			margin-bottom: 26rpx;
			.wrap{
				height: 180rpx;
				width: 100%;
				&-item{
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
		}
		.tabs{
			margin-bottom: 6rpx;
			transform: 0.5s;
			display: flex;
			.tab{
				width: 33.33%;
				.txt{
					padding-bottom: 4rpx;
				}
			}
			.active{
				color: #381895;
				font-weight: bold;
				font-size: 38rpx;
			}
			.active.txt{
				border-bottom: 8rpx solid #b90000;
			}
		}
		.tabsFixed{
			background-color: white;
			width: 750rpx;
			height: 90rpx;
			line-height: 90rpx;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 99;
		}
		.list{
			.mark{
				width: 236rpx;
				margin-bottom: -6rpx;
			}
			.title{
				padding: 0 20rpx;
				border-radius: 10rpx;
				height: 90rpx;
				box-shadow: 0 0px 10px rgba(0,0,0,0.1);
				.icon{
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
			}
			.new{
				height: 100%;
				// overflow-y: scroll;
				&-item{
					flex-wrap: wrap;
					justify-content: space-between;
					margin-top: 20rpx;
				}
				.recommend{
					background-color: #6b5aac;
					border-radius: 20rpx;
					margin-top: 0;
					.pad{
						margin: 0 20rpx;
					}
				}
			}
			.shop{
				height: 100%;
			}
		}
	}
	.custom-view{
		overflow: hidden;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
