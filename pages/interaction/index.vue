<template>
	<div>
		<view style="position: sticky; top: 0;">
			<view class="positionShow" :style="{paddingTop: statusBarHeight + 'px'}" v-if="!isOpenPosition" @click="goSet">
				<view class="positionShow-item">
					<icon type="info" class="positionShow-icon"></icon>
					<text class="positionShow-txt">您未开启位置服务，距离计算不准确，请点击前往开启位置服务</text>
				</view>
			</view>
			<view class="top" :style="{paddingTop: ((isOpenPosition ? statusBarHeight : 0) + 'px')}">
				<!-- #ifdef MP-WEIXIN -->
				<view :style="{height: wxBtnHeight + 'px'}"></view>
				<!-- #endif -->
				<view class="header">
					<scroll-view scroll-x class="nav-area">
						<view class="flex">
							<view class="nav-area-item" v-for="(item, index) in navList" :key="index" @tap="tapNav(index)">
								<text class="nav-area-item-name" :class="{ 'nav-area-item-active': index === current }">{{ item }}</text>
							</view>
						</view>
					</scroll-view>
					<view class="search" v-if="isSearch && (current === 1 || current === 2)">
						<input type="text" v-model="wordKey" class="search-input" :maxlength="15" placeholder="用户昵称" @input="searchInput">
						<text class="search-btn" @click="onSearch(current)">搜索</text>
					</view>
					<view class="nav-right">
						<image :src="staticUrl + 'video/search.png'" class="nav-right-icon" @click="showSearch"></image>
						<view class="nav-right-message" @tap="jumpTo('/pages/interaction/message')">
							<image :src="staticUrl + 'video/message.png'" class="nav-right-icon"></image>
							<text class="nav-right-message-dian" :style="{top: statusBarHeight + 5 + 'px'}" v-if="unReadTotal">{{unReadTotal>99?'99+':unReadTotal}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>		
		<swiper class="swiper" :style="{height: swiperHeight + 'px'}" :current="current" @change="swiperChange">
			<swiper-item>
				<dynamic ref="dynamic" :myAddressData="myAddressData" :swiperHeight="swiperHeight"></dynamic>
			</swiper-item>
			<swiper-item>
				<nearby ref="nearby" :myAddressData="myAddressData" :swiperHeight="swiperHeight" :wordKey="nearbyWordKey"></nearby>
			</swiper-item>
			<swiper-item>
				<angel ref="angel" :myAddressData="myAddressData" :swiperHeight="swiperHeight" :wordKey="angelWordKey"></angel>
			</swiper-item>
			<swiper-item>
				<publish ref="publish"></publish>
			</swiper-item>
			<swiper-item>
				<my ref="my"></my>
			</swiper-item>
			<swiper-item>
				<comment ref="comment" :swiperHeight="swiperHeight"></comment>
			</swiper-item>
		</swiper>		
		
		<!-- 弹框 -->
		<modal v-if="advertDataOne.showModal && current===0">
			<image :src="advertDataOne.ossUrl" mode="widthFix" @click="imgJump('advertDataOne')"></image>
			<view class="img-wrap" @click="advertDataOne.showModal = false">
				<image :src="staticUrl + 'video/video_close.png'" class="img-wrap-icon"></image>
			</view>
		</modal>
		<modal v-if="advertDataTwo.showModal && current===1">
			<image :src="advertDataTwo.ossUrl" mode="widthFix" @click="imgJump('advertDataTwo')"></image>
			<view class="img-wrap" @click="advertDataTwo.showModal = false">
				<image :src="staticUrl + 'video/video_close.png'" class="img-wrap-icon"></image>
			</view>
		</modal>
		<modal v-if="advertDataThree.showModal && current===2">
			<image :src="advertDataThree.ossUrl" mode="widthFix" @click="imgJump('advertDataThree')"></image>
			<view class="img-wrap" @click="advertDataThree.showModal = false">
				<image :src="staticUrl + 'video/video_close.png'" class="img-wrap-icon"></image>
			</view>
		</modal>
		
		<!-- 福利红包 -->
		<red-envelopes v-for="(item, i) in redList" :key="i" :data="item" :type="2" :bottom="i === 0 ? 100 : i*80+100"></red-envelopes>
		
		<tabbar></tabbar>
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	import { sendRequest } from "@/common/http/api.js"
	import { checkOpenGPSService } from "@/common/utils/index.js"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import dynamic from "./modules/dynamic.vue"
	import nearby from "./modules/nearby.vue"
	import angel from "./modules/angel.vue"
	import publish from "./modules/publish.vue"
	import my from "./modules/my.vue"
	import comment from "./modules/comment.vue"
	import modal from "@/components/modal.vue"
	import redEnvelopes from "@/components/red-envelopes.vue"
	import tabbar from "@/components/tabbar.vue"
	// import redEnvelopes from "@/components/red-envelopes-n.nvue"
	
	export default {
		components: {
			dynamic, nearby, angel, publish, my, comment, modal, redEnvelopes, tabbar
		},
		data(){
			return {
				staticUrl: this.$staticUrl,
				swiperHeight: 0,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				navList: ["动态", "附近", "配送", "发布", "我的", "评论"],
				current: 0,
				isSearch: false,
				wordKey: "",
				nearbyWordKey: "", // 附近的人检索key
				angelWordKey: "", // 配送员检索key
				unReadTotal: 0, // 未读消息数量
				myAddressData: {longitude:0,latitude:0},
				redList: [],
				advertDataOne: {},
				advertDataTwo: {},
				advertDataThree: {},
				isOpenPosition: true,
				// #ifdef MP-WEIXIN
				wxBtnHeight: 0,
				// #endif
			}
		},
		computed: {
			...mapState(["unReadNum"])
		},
		watch:{
			unReadNum(val){
				if (val){
					this.setBadge(true, val)
				}
			}
		},
		onBackPress(){
			//隐藏到后台，不退出app
			let main = plus.android.runtimeMainActivity();
			main.moveTaskToBack(false);
			return true;
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.wxBtnHeight = wx.getMenuButtonBoundingClientRect().height
			// #endif
			this.swiperHeight = uni.getSystemInfoSync().screenHeight - 94
			this.getLocation()
		},
		onShow() {
			let _this = this
			let interactionCurrent = uni.getStorageSync("interactionCurrent")
			if (interactionCurrent) {
				this.current = interactionCurrent
				this.switchIndex = interactionCurrent
				uni.removeStorageSync("interactionCurrent")
			}
			
			// #ifdef APP-PLUS
			//是否开启位置权限
			checkOpenGPSService(result=>{
				console.log("checkOpenGPSService,,", result)
				_this.isOpenPosition = result
				if (result) {
					_this.swiperHeight = uni.getSystemInfoSync().screenHeight - 144
				}
				if (result) {
					uni.getLocation({
						type: 'wgs84',
						geocode: true,
						success: function (res) {
							_this.myAddressData = res
							publics.setMyaddressLngLat(JSON.stringify(res));
						}
					});
				}
			})
			// #endif
			
			this.setBadge(false)
			this.getRedBagList()
			this.getAdvert('advertDataOne', 5)
			this.getAdvert('advertDataTwo', 6)
			this.getAdvert('advertDataThree', 7)
		},
		methods:{
			// 设置消息未读数量
			async setBadge(type, val){
				let unReadTotal = 0
				if (type) {
					unReadTotal = val
				} else {
					unReadTotal = publics.getCUnReadTotal()
				}
				this.unReadTotal = unReadTotal
				this.$forceUpdate()
				if (unReadTotal > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: unReadTotal + ""
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
				// #ifdef APP-PLUS
				plus.runtime.setBadgeNumber(unReadTotal)
				// #endif
				getApp().localUnReadNum = unReadTotal
			},
			// 红包福利
			getRedBagList(){
				sendRequest("GET", url.cms.redEnvelopesList).then(res =>{
					if (res.data && res.data.length > 0) {
						let data = res.data
						data.map(v =>{
							v.show = true
						})
						this.redList = data
					}
				})
			},
			// 获取公告
			async getAdvert(name, position){
				let res = await sendRequest("GET", url.cms.advertisingMap, {position: position})
				if (res.data && res.data.length > 0) {
					this[name] = res.data[0]
					if (this[name].popupMode === 2) {
						if (!publics.advertShowToStorage(this[name].id)) {
							this[name].showModal = true
						}
					} else {
						this[name].showModal = true
					}
				}
			},
			getLocation(){
				let _this = this;
				let addrRes = publics.getMyaddressLngLat()
				if (addrRes) {
					addrRes = JSON.parse(addrRes)
					this.setAddress(addrRes)
				} else {
					this.openMap()
				}
			},
			openMap(){
				let _this = this;
				
				/* H5浏览器不执行，所以H5的时候直接加载数据 */
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: async function(res) {
						//设置地址
						publics.setMyaddressLngLat(JSON.stringify(res));
						_this.setAddress(res)
					},
					fail: function(err) {
						console.log(".....这是是互动的获取位置失败....", err)
						_this.$refs.dynamic.loadData()
					}
				});
				// #ifdef H5
				setTimeout(()=>{
					// 请求附近动态数据
					_this.$refs.dynamic.loadData()
				}, 300)
				// #endif
				
			},
			setAddress(res){
				let _this = this
				this.myAddressData = res;
				setTimeout(()=>{
					// 请求附近动态数据
					_this.$refs.dynamic.loadData()
				}, 300)
			},
			showSearch(){
				if (this.current !== 1 && this.current !== 2) {
					return this.showToast("搜索仅限附近和配送员～")
				}
				this.isSearch = !this.isSearch
				this.wordKey = ""
			},
			searchInput(e){
				if (this.current === 1) {
					this.nearbyWordKey = e.detail.value
				} else if(this.current === 2) {
					this.angelWordKey = e.detail.value
				}
			},
			onSearch(current){
				uni.hideKeyboard()
				if (current === 1) { // 附近的人
					this.nearbyWordKey = this.wordKey
					this.$refs.nearby.penpleNearbyList = []
					setTimeout(()=>{
						this.$refs.nearby.loadData()
					}, 200)
				} else if (current === 2) { // 附近的配送员
					this.angelWordKey = this.wordKey
					this.$refs.angel.proxyList = []
					setTimeout(()=>{
						this.$refs.angel.loadData()
					}, 200)
				}
			},
			tapNav(index) {
				uni.hideKeyboard()
				this.current = index
			},
			swiperChange(e){
				this.current = e.detail.current
				this.wordKey = ""
				this.nearbyWordKey = ""
				this.angelWordKey = ""
				this.isSearch = false
				if (this.current === 0) {
					this.$refs.dynamic.loadData()
				} else if (this.current === 1) {
					this.$refs.nearby.loadData()
				} else if (this.current === 2) {
					this.$refs.angel.loadData()
				} else if (this.current === 4) {
					this.$refs.my.getInfo()
				} else if (this.current === 5) {
					this.$refs.comment.loadData()
				}
			},
			jumpTo(path){
				uni.navigateTo({
					url: path
				})
			},
			showToast(msg){
				uni.showToast({
					title: msg,
					icon: "none"
				})
			},
			imgJump(name){
				this[name].showModal = false
				sendRequest("POST", url.cms.clickAdvertisingMap, {id: this[name].id})
				publics.advertOption(this[name].operationCode, this[name].operationValue)
			},
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
			}
		}
	}
</script>

<style scoped>
	.positionShow{
		height: 100rpx;
		/* padding-bottom: 10rpx; */
		width: 750rpx;
		background-color: #fceeed;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.positionShow-item{
		flex-direction: row;
		align-items: center;
		padding: 0 30rpx;
	}
	.positionShow-txt{
		font-size: 28rpx;
		color: #666666;
		width: 640rpx;
	}
	.positionShow-icon{
		color: #f55556;
		font-size: 40rpx;
		margin-right: 20rpx;
	}
	.top{
		width: 100%;
		background-image: linear-gradient(to bottom, #381895, #865afd);
	}
	.header{
		width: 750rpx;
		padding: 0 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.nav-area{
		height: 100rpx;
		width: 600rpx;
		display: flex;
		flex-direction: row;
	}
	.nav-area-item{
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.nav-area-item-name{
		width: 100rpx;
		text-align: center;
		color: #e4e4eb;
		font-size: 32rpx;
	}
	.nav-area-item-active{
		color: #FFFFFF;
		font-size: 40rpx;
	}
	.search{
		background-color: #F0F0F0;
		width: 600rpx;
		height: 80rpx;
		border-radius: 50rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		left: 10rpx;
	}
	.search-input{
		width: 420rpx;
		flex-grow: 1;
		font-size: 32rpx;
		margin-left: 20rpx;
	}
	.search-btn{
		display: inline-block;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 30rpx;
		color: white;
		margin: 0 10rpx;
		border-radius: 50rpx;
		width: 120rpx;
		text-align: center;
		background-image: linear-gradient(to bottom, #381895, #865afd);
	}
	.nav-right{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10rpx;
	}
	.nav-right-icon{
		width: 50rpx;
		height: 50rpx;
	}
	.nav-right-message{
		/* position: relative; */
		/* z-index: 1; */
		margin-left: 20rpx;
	}
	.nav-right-message-dian{
		position: fixed;
		z-index: 999;
		right: 0rpx;
		font-size: 24rpx;
		border-radius: 30rpx;
		padding: 0rpx 14rpx 0 14rpx;
		background-color: #ff0833;
		color: white;
	}
	.swiper{
		width: 750rpx;
		background-color: #F8F8F8;
	}
	.img-wrap{
		margin-top: 30rpx;
		width: 50rpx;
		height: 50rpx;
		border-color: #fff;
		border-width: 4rpx;
		border-radius: 50rpx;
		align-items: center;
		justify-content: center;
	}
	.img-wrap-icon{
		width: 26rpx;
		height: 26rpx;
	}
</style>
