<template>
	<view>
		<view class="tabs bg-base" :style="{'padding-top': statusBarHeight + 'px'}">
			<view scroll-x="true" class="scroll" v-if="!isSearch">
				<view class="tabs-item" :class="{'active': current === i}" v-for="(item, i) in tabs" :key="i" @tap="tabSelect(i)">
					<text>{{item}}</text>
					<text class="xian" v-if="current === i"></text>
				</view>
			</view>
			<view class="search" v-if="isSearch && (current === 1 || current === 2)">
				<input type="text" v-model="wordKey" class="input" :maxlength="15" placeholder="用户昵称">
				<text class="btn bg-base" @click="onSearch(current)">搜索</text>
			</view>
			<view class="flex">
				<text class="iconfont color-w icon" @click="showSearch">&#xe627;</text>
				<view class="msg" @tap="jumpTo('message')">
					<text class="iconfont icon">&#xe62e;</text>
					<text class="dian" v-if="unReadTotal">{{unReadTotal>99?'99+':unReadTotal}}</text>
				</view>
			</view>
		</view>
		
		<swiper 
			class="swiper" :current="current" 
			@change="swiperChange" @transition="onswiperscroll"
			@animationfinish="animationfinish" @onAnimationEnd="animationfinish"
			:style="{height: swiperHeight+statusBarHeight + 'px'}">
			<swiper-item class="swiper-item" :style="{height: swiperHeight + 'px'}">
				<dynamic ref="dynamic" :myAddressData="myAddressData" :statusBarHeight="statusBarHeight" :swiperHeight="swiperHeight"></dynamic>
			</swiper-item>
			<swiper-item :style="{height: swiperHeight + 'px'}">
				<nearby ref="nearby" :wordKey="nearbyWordKey" :myAddressData="myAddressData" :statusBarHeight="statusBarHeight" :swiperHeight="swiperHeight"></nearby>
			</swiper-item>
			<swiper-item :style="{height: swiperHeight + 'px'}">
				<angel ref="angel" :wordKey="angelWordKey" :myAddressData="myAddressData" :statusBarHeight="statusBarHeight" :swiperHeight="swiperHeight"></angel>
			</swiper-item>
			<swiper-item class="swiper-item" :style="{height: swiperHeight + 'px'}">
				<publish ref="publish"></publish>
			</swiper-item>
			<swiper-item class="swiper-item" :style="{height: swiperHeight + 'px'}">
				<my ref="my"></my>
			</swiper-item>
			<swiper-item class="swiper-item" :style="{height: swiperHeight + 'px'}">
				<comment ref="comment"></comment>
			</swiper-item>
		</swiper>
		
		<!-- 福利红包 -->
		<red-envelopes v-for="(item, i) in redList" :key="i" :data="item" :type="2" :bottom="i === 0 ? 100 : i*80+100"></red-envelopes>
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import { selectInformationType } from "@/common/im/db.js"
	import dynamic from "./modules/dynamic.vue"
	import nearby from "./modules/nearby.vue"
	import angel from "./modules/angel.vue"
	import publish from "./modules/publish.vue"
	import my from "./modules/my.nvue"
	import comment from "./modules/comment.vue"
	import modal from "@/components/modal.vue"
	import redEnvelopes from "@/components/red-envelopes.vue"
	
	export default {
		components: {
			dynamic, nearby, angel, publish, my, comment, modal, redEnvelopes
		},
		data() {
			return {
				myAddressData: {longitude:0,latitude:0},
				tabs: ["动态","附近","天使", "发布", "我的", "评论"],
				current: 0,
				isSearch: false,
				statusBarHeight: getApp().statusBarHeight,
				swiperHeight: 0,
				jiGuangMsgCount: "",
				unReadTotal: 0,
				wordKey: "",
				nearbyWordKey: "",
				angelWordKey: "",
				advertDataOne: {},
				advertDataTwo: {},
				advertDataThree: {},
				redList: [],
				isTap: false,
				_touchTabIndex: 0,
				_lastTabIndex: 0
			}
		},
		computed: {
			...mapState(["isHandNewMsg"])
		},
		watch:{
			isHandNewMsg(val, old){
				console.log("------isHandNewMsg-----index------", val, old)
				if (val) {
					this.setBadge(true)
					this.setHandNewMsg(false)
				}
			}
		},
		onLoad() {
			this.swiperHeight = uni.getSystemInfoSync().screenHeight - 50 - this.statusBarHeight - 44
			this.getLocation()
		},
		onShow() {
			this.setBadge(false)
			this.getRedBagList()
			this.getAdvert('advertDataOne', 5)
			this.getAdvert('advertDataTwo', 6)
			this.getAdvert('advertDataThree', 7)
		},
		methods:{
			...mapMutations(["setHandNewMsg"]),
			async setBadge(type){
				let unReadTotal = await getApp().getSessionUnReadNumber()
				let oldNum = this.unReadTotal
				console.log("..........unReadTotal......", unReadTotal)
				if (type && oldNum === unReadTotal){
					unReadTotal++
				}
				this.unReadTotal = unReadTotal
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
				plus.runtime.setBadgeNumber(unReadTotal)
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
			getLocation(){
				let _this = this;
				let addrRes = publics.getMyaddressLngLat()
				console.log("addrRes。。。。。。。.........////////'''''''']]]]]]]]]]];;;;;;;;;;;", addrRes)
				if (addrRes) {
					addrRes = JSON.parse(addrRes)
					this.setAddress(addrRes)
				} else {
					this.openMap()
				}
				// uni.getLocation({
				//     type: 'wgs84',
				// 	geocode: true,
				//     success: function (res) {
				// 		//设置地址
				// 		console.log("获取位置。。。。。。。", res)
				// 		_this.setAddress(res)
				//     },
				// 	fail: function (err) {
				// 		console.log(err)
				// 		_this.$msg("请设置您当前的位置");
				// 		_this.openMap()
				// 	}
				// });
			},
			openMap(){
				let _this = this;
				uni.chooseLocation({
					success: function(res) {
						//设置地址
						_this.setAddress(res)
					}
				});
			},
			setAddress(res){
				this.myAddressData = res;
				setTimeout(()=>{
					// 请求附近动态数据
					this.$refs.dynamic.loadData()
				}, 300)
			},
			showSearch(){
				if (this.current !== 1 && this.current !== 2) {
					return this.$msg("搜索仅限附近和天使～")
				}
				this.isSearch = !this.isSearch
				this.wordKey = ""
			},
			onSearch(current){
				if (!this.wordKey) return
				if (current === 1) { // 附近的人
					this.nearbyWordKey = this.wordKey
					this.$refs.nearby.penpleNearbyList = []
					setTimeout(()=>{
						this.$refs.nearby.loadData()
					}, 200)
				} else if (current === 2) { // 附近的天使
					this.angelWordKey = this.wordKey
					this.$refs.angel.proxyList = []
					setTimeout(()=>{
						this.$refs.angel.loadData()
					}, 200)
				}
			},
			async getAdvert(name, position){
				let res = await this.$http("GET", url.cms.advertisingMap, {position: position})
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
			scrolltolower(){
				let _this = this
				if (this.current === 0) {
					this.$refs.dynamic.loadData()
				} else if (this.current === 1){
					this.$refs.nearby.loadData()
				} else if (this.current === 2) {
					this.$refs.angel.loadData()
				} else if (this.current === 4) {
					this.$refs.my.getInfo()
				}
				if (this.current !== 1 && this.current !== 2 && this.isSearch === true){
					this.isSearch = false
				}
			},
			tabSelect(index) {
				this.current = index
				// this.isTap = true
				// this._touchTabIndex = index
				// this.switchTab(index);
			},
			swiperChange(e){
				this.current = e.detail.current
				this.isSearch = false
				this.wordKey = ""
				this.nearbyWordKey = ""
				this.angelWordKey = ""
				this.scrolltolower()
				// this.switchTab(e.detail.current);
			},
			onswiperscroll(e){
				console.log("isTap...........>>>>>>>>>>>>>>>")
				if (this.isTap) return
				var offsetX = e.detail.dx;
				var preloadIndex = this._lastTabIndex;
				console.log("///////////////>>>>>>>>>>>>>>>", offsetX, preloadIndex)
				if (offsetX > 1) {
				  preloadIndex++;
				} else if (offsetX < -1) {
				  preloadIndex--;
				}
				console.log("90909090909090909090909090909", preloadIndex, this._lastTabIndex)
				if (preloadIndex === this._lastTabIndex || preloadIndex < 0) {
				  return;
				}
			},
			animationfinish(e){
				let index = e.detail.current
				if (this._touchTabIndex === index) {
				  this.isTap = false;
				}
				this._lastTabIndex = index;
				this.switchTab(index);
			},
			switchTab(index){
				if (this.current === index) return
				this.current = index
				// this.scrolltolower()
			},
			jumpTo(path){
				this.$navigateTo(path)
			},
			imgJump(name){
				this[name].showModal = false
				this.$http("POST", url.cms.clickAdvertisingMap, {id: this[name].id})
				publics.advertOption(this[name].operationCode, this[name].operationValue)
			}
		}
	}
</script>

<style scoped lang="scss">
	.tabs{
		padding: 0 30rpx;
		height: 100rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: white;
		box-shadow: 0rpx -32rpx 40rpx 12rpx #555555;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.scroll{
			width: 80%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow-x: scroll;
			.tabs-item{
				width: 228rpx;
				color: #e4e4eb;
				text-align: center;
				font-size: 32rpx;
				padding-bottom: 6rpx;
				padding: 4rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.xian{
					background-color: #FFFFFF;
					width: 20rpx;
					height: 6rpx;
					border-radius: 10rpx;
					margin-top: 4rpx;
					display: inline-block;
				}
			}
			.active{
				color: #FFFFFF;
				// background-color: rgba($color: #ffffff, $alpha: 0.3);
				border-radius: 30rpx;
				font-size: 40rpx;
			}
		}
		.search{
			background-color: #F0F0F0;
			width: 80%;
			height: 80rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			.input{
				flex-grow: 1;
				font-size: 32rpx;
				margin-left: 20rpx;
			}
			.btn{
				display: inline-block;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 30rpx;
				color: white;
				margin: 0 10rpx;
				border-radius: 50rpx;
				width: 120rpx;
				text-align: center;
			}
		}
		.icon{
			font-size: 50rpx;
		}
		.msg{
			margin-left: 20rpx;
			position: relative;
			color: white;
			.dian{
				position: absolute;
				right: -10rpx;
				top: -10rpx;
				font-size: 24rpx;
				border-radius: 30rpx;
				padding: 0rpx 16rpx;
				background-color: #ff0833;
			}
		}
	}
	.swiper{
		margin-top: 88rpx;
		&-item{
			overflow-y: scroll;
		}
	}
</style>
