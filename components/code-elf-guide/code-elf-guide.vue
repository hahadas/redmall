<template>
	<view class="content">
		
		<!-- 标题栏和状态栏占位符 -->
		<view class="status-bar-height"></view>
		<view class="status-bar-height-height"></view>
		
		<swiper class="swiper" 
		style="overflow-y: hidden;"
		:style="{width:swiperWidth+'px',height:swiperHeight+'px'}"
		indicator-dots="true"
		circular="true"
		@change="swiperChange"
		:interval="interval"
		:autoplay="autoplay" 
		:duration="duration">
			<swiper-item v-for="(item,index) in imagesList" :key="index" style="width: 100%;height: 100%;overflow-y: hidden;">
				<image :src="item" mode="aspectFill" style="width: 100%;overflow-y: hidden;height: 100%;position: fixed;background-repeat: no-repeat;" @tap="advertJump(item.operationCode, item.operationValue)"></image>
				<view class="jump-over" v-if="index < imagesList.length-1" @tap="launchFlag()">{{index+1}}/{{imagesList.length}} {{jumpover}}</view>
				<view class="experience" v-if="index == imagesList.length-1" @tap="launchFlag()">{{experience}}</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	export default {
		data() {
			return {
				swiperHeight:"900",
				swiperWidth:"500",
				background: ['color1', 'color2', 'color3'],
				imagesList:[],
				autoplay: true,
				interval: 5000,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验',
			}
		},
		created() {
			//高度，去除手机状态栏
			let systemInfo = uni.getSystemInfoSync();
			this.swiperHeight = systemInfo.windowHeight - systemInfo.statusBarHeight;
			this.swiperWidth = systemInfo.windowWidth;
			
			
			this.getBanner();
		},
		methods: {
			/**
			 * 获取启动轮播图
			 */
			getBanner() {
				let _this = this;
				this.$http('get', url.cms.advertisingMap, {position: 0}).then(res =>{
					let data = res.data
					if (data) {
						let list = new Array();
						for(let i=0;i<data.length;i++){
							list.push(data[i].ossUrl);
						}
						_this.imagesList = [];
						_this.imagesList = list;
						
					}
					if(!_this.imagesList || _this.imagesList.length <= 0){
						_this.launchFlag();
					}
				}).catch((err) => {
					uni.switchTab({
						url: '/pages/home/index'
					});
				})
			},
			swiperChange(e){
				let _this = this;
				if(parseInt(e.detail.current) == (this.imagesList.length-1)){
					_this.autoplay = false;
					//最后一张了跳转主页
					setTimeout(function() {
						let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
						let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
						curRoute += '';
						if(curRoute.indexOf("startup/index") != -1){//如果当前路由还是在该页面，则进行跳转主页操作
							uni.switchTab({
								url: '/pages/home/index'
							});
						}
					}, _this.interval-500);
				}
			},
			launchFlag: function(){
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				/* uni.setStorage({
						key: 'launchFlag',
						data: true,
				}); */
				this.autoplay = false;
				uni.switchTab({
					url: '/pages/home/index'
				});
				
			},
			advertJump(code, value){
				publics.advertOption(code, value)
			}
		}
	}
</script>

<style>
	page,
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
		overflow-y: hidden;
	}
	
	.jump-over,.experience{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		background-color: rgba(231, 231, 231, 0.6);
		/* background-color: #0076f4; */
		color: #464444;
		border: 1px solid rgba(200, 200, 200, 1.0);
		z-index: 999;
		top: 30upx;
		right: 10upx;
	}
	.jump-over{
		right: 45upx;
		bottom: 85upx;
	}
	.experience{
		right: 45upx;
		bottom: 85upx;
	}
</style>