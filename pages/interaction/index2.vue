<template>
	<view class="content">
		<view class="flex flex-align-center bg-base header">
			<scroll-view class="nav-area" scroll-x :scroll-left="navScrollLeft">
				<view class="scroller" :style="{ width: navItemWidth * navList.length + 'px' }">
					<view class="scroller-wrapper">
						<view class="scroller-item" 
							v-for="(item, index) in navList" :key="index" 
							:style="{ width: navItemWidth + 'px' }" 
							:class="{ active: index === current }"
							@tap="tapNav(index)"
						>{{ item }}</view>
					</view>
				</view>
			</scroll-view>
			<view class="search" v-if="isSearch && (current === 1 || current === 2)">
				<input type="text" v-model="wordKey" class="input" :maxlength="15" placeholder="用户昵称" @input="searchInput">
				<text class="btn bg-base" @click="onSearch(current)">搜索</text>
			</view>
			<view class="flex">
				<text class="iconfont color-w icon" @click="showSearch">&#xe627;</text>
				<view class="msg" @tap="$navigateTo('message')">
					<text class="iconfont icon">&#xe62e;</text>
					<text class="dian" v-if="unReadTotal">{{unReadTotal>99?'99+':unReadTotal}}</text>
				</view>
			</view>
		</view>
		<!-- <view :style="{height: 50+statusBarHeight + 'px'}"></view> -->
		<view class="swiper-area">
			<swiper 
				:current="switchIndex" :duration="200" 
				@transition="transition" @change="change" @animationfinish="animationfinish"
				:style="{height: swiperHeight + 'px'}">
				<swiper-item class="item">
					<dynamic ref="dynamic" :myAddressData="myAddressData" :swiperHeight="swiperHeight"></dynamic>
				</swiper-item>
				<swiper-item class="item">
					<nearby ref="nearby" :wordKey="nearbyWordKey" :myAddressData="myAddressData" :swiperHeight="swiperHeight"></nearby>
				</swiper-item>
				<swiper-item class="item">
					<angel ref="angel" :wordKey="angelWordKey" :myAddressData="myAddressData" :swiperHeight="swiperHeight"></angel>
				</swiper-item>
				<swiper-item class="item">
					<publish ref="publish"></publish>
				</swiper-item>
				<swiper-item>
					<my ref="my"></my>
				</swiper-item>
				<swiper-item class="item">
					<comment ref="comment"></comment>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 弹框 -->
		<modal v-if="advertDataOne.showModal && current===0">
			<image :src="advertDataOne.ossUrl" mode="widthFix" @click="imgJump('advertDataOne')"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="advertDataOne.showModal = false">&#xe64a;</text>
		</modal>
		<modal v-if="advertDataTwo.showModal && current===1">
			<image :src="advertDataTwo.ossUrl" mode="widthFix" @click="imgJump('advertDataTwo')"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="advertDataTwo.showModal = false">&#xe64a;</text>
		</modal>
		<modal v-if="advertDataThree.showModal && current===2">
			<image :src="advertDataThree.ossUrl" mode="widthFix" @click="imgJump('advertDataThree')"></image>
			<text class="iconfont color-w font60" style="margin-top: 20rpx;" @click="advertDataThree.showModal = false">&#xe64a;</text>
		</modal>
		
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
	
	export default{
		components: {
			dynamic, nearby, angel, publish, my, comment, modal, redEnvelopes
		},
		data(){
			return {
				swiperHeight: uni.getSystemInfoSync().windowHeight, // scroll view 高
				statusBarHeight: getApp().statusBarHeight,
				screenWidth: uni.getSystemInfoSync().screenWidth * 0.8, // 屏幕宽
				navScrollLeft: 0, // 导航滚动区的滚动距离
				activeBarLeft: 0, // 滑块距离左边距离
				navItemWidth: 48,// navitem 宽
				navList: ["动态", "附近", "天使", "发布", "我的", "评论"],
				switchIndex: 0, // 使 swiper 切换到的 index
				current: 0, // swiper change 时的 index
				finishedIndex: 0, // swiper 停止滑动后的 index
				isSearch: false, // 是否显示搜索
				wordKey: "", // 检索条件
				nearbyWordKey: "", // 附近的人检索key
				angelWordKey: "", // 天使检索key
				unReadTotal: 0, // 未读消息数量
				myAddressData: {longitude:0,latitude:0}, // 经纬度
				redList: [],
				advertDataOne: {},
				advertDataTwo: {},
				advertDataThree: {},
			}
		},
		computed: {
			...mapState(["isHandNewMsg"])
		},
		watch:{
			isHandNewMsg(val, old){
				if (val) {
					this.setBadge(true)
					this.setHandNewMsg(false)
				}
			}
		},
		mounted() {
			this.getLocation()
		},
		onShow() {
			let interactionCurrent = uni.getStorageSync("interactionCurrent")
			if (interactionCurrent) {
				this.current = interactionCurrent
				this.switchIndex = interactionCurrent
				uni.removeStorageSync("interactionCurrent")
			}
			
			this.setBadge(false)
			this.getRedBagList()
			this.getAdvert('advertDataOne', 5)
			this.getAdvert('advertDataTwo', 6)
			this.getAdvert('advertDataThree', 7)
			
		},
		methods:{
			...mapMutations(["setHandNewMsg"]),
			// 设置消息未读数量
			async setBadge(type){
				let unReadTotal = await getApp().getSessionUnReadNumber()
				let oldNum = this.unReadTotal
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
			// 获取公告
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
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: async function(res) {
						//设置地址
						publics.setMyaddressLngLat(JSON.stringify(res));
						_this.setAddress(res)
					},
					fail: function(err) {
						uni.chooseLocation({
							success: function(res) {
								//设置地址
								_this.setAddress(res)
							}
						});
					}
				});
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
					return this.$msg("搜索仅限附近和天使～")
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
				// if (!this.wordKey) return
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
			scrolltolower(){
				let _this = this
				this.wordKey = ""
				this.nearbyWordKey = ""
				this.angelWordKey = ""
				this.isSearch = false
				if (this.current === 0) {
					this.$refs.dynamic.loadData()
				} else if (this.current === 1){
					this.$refs.nearby.loadData()
				} else if (this.current === 2) {
					this.$refs.angel.loadData()
				} else if (this.current === 4) {
					this.$refs.my.getInfo()
				}
			},
			transition({ detail: { dx } }) { // swiper 运动时触发
				this.activeBarLeft = this.navItemWidth * this.finishedIndex + this.navItemWidth * (dx / this.screenWidth)
				if (this.activeBarLeft > (this.screenWidth - this.navItemWidth) / 2) {
					this.navScrollLeft = this.activeBarLeft - (this.screenWidth - this.navItemWidth) / 2
				}
			},
			tapNav(index) { // 点击 bavbar 切换
				this.switchIndex = index
			},
			change({ detail: { current } }) { // swiper index 变化时触发
				// if (this.switchIndex === current) return
				this.current = current
				this.scrolltolower()
			},
			animationfinish({ detail: { current } }) { // swiper 运动结束时触发
				this.switchIndex = this.finishedIndex = current
			},
			refresh(){
				setTimeout(() => {
					if (this.current === 0) {
						this.$refs.dynamic.loadData()
					}
				}, 1234)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		.header{
			width: 100%;
			padding-top: var(--status-bar-height);
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 999;
			.search{
				background-color: #F0F0F0;
				width: 80%;
				height: 80rpx;
				border-radius: 50rpx;
				display: flex;
				align-items: center;
				position: absolute;
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
		.nav-area {
			width: 80%;
			height: 100rpx;
			.scroller {
				height: 100%;
				.scroller-wrapper {
					height: 90rpx;
					.scroller-item {
						@include flex();
						float: left;
						height: 100%;
						color: #e4e4eb;
						font-size: 32rpx;
						&.active {
							color: #FFFFFF;
							font-size: 40rpx;
						}
					}
				}
			}
		}
		.swiper-area {
			flex: 1;
			width: 100%;
			swiper {
				height: 100%;
				background: #F8F8F8;
			}
			.item{
				height: 100%;
				overflow-y: scroll;
			}
		}
	}
</style>
