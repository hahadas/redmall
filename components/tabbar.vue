<template>
	<view>
		<view class="nav">
			<block v-for="(item,index) in tabbar">
				<view class="nav-item" v-if="!item.midButton" :key="index" @click="jumpTo(item, index)">
					<image 
						:src="current === index ? item.selectedIconPath :item.iconPath" 
						class="icon" mode="">
					</image>
					<text class="name" :class="{active: current === index}">{{item.name}}</text>
				</view>
				<view class="nav-item" @click="jumpTo(item, index)" v-else>
					<image :src="item.iconPath" class="midButton" mode=""></image>
				</view>
			</block>
		</view>
		<view class="nav-height"></view>
	</view>
</template>

<script>
	let userInfo = uni.getStorageSync('userInfo');
	export default {
		name:"tabbar",
		data() {
			return {
				current: 0,
				tabbar: [
					{
						name: '首页',
						url: '/pages/home/index',
						iconPath: '/static/tabber/home.png',
						selectedIconPath: '/static/tabber/home_use.png'
					},
					{
						name: '分类',
						url: '/pages/class/index',
						iconPath: '/static/tabber/class.png',
						selectedIconPath: '/static/tabber/class_use.png'
					},
					// #ifdef APP-PLUS
					{
						name: '',
						url: '/pages/video/index?userId=' + userInfo.id,
						iconPath: '/static/tabber/video.png',
						selectedIconPath: '',
						midButton: true
					},
					// #endif
					{
						name: '互动',
						url: '/pages/interaction/index',
						iconPath: '/static/tabber/interact.png',
						selectedIconPath: '/static/tabber/interact_use.png'
					},
					{
						name: '我',
						url: '/pages/user/index',
						iconPath: '/static/tabber/my.png',
						selectedIconPath: '/static/tabber/my_use.png'
					}
				]
			};
		},
		mounted(){
			let routes = getCurrentPages();
			let curRoute = routes[routes.length - 1].route
			this.tabbar.map((item, index) => {
				if (item.url.indexOf(curRoute) > -1) {
					this.current = index;
				}
			})
		},
		methods: {
			jumpTo(row, index) {
				if (this.current === index) return;
				// 点击中间按钮的时候不改变current，因为进入视频后返回应该是停留在进入前的页面
				if (index !== 2) {
					this.current = index;
				}
				if (row.midButton) {
					uni.navigateTo({
						url: row.url
					})
				} else {
					uni.reLaunch({
						url: row.url
					})	
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	$height: 98rpx;
	.nav-height{
		height: $height + 2rpx;
	}
	.nav{
		height: $height;
		display: flex;
		align-items: center;
		// justify-content: space-around;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		border-top: 2rpx solid #eee;
		background: white;
		&-item{
			// #ifndef APP-PLUS
			width: 25%;
			// #endif
			// #ifdef APP-PLUS
			width: 20%;
			// #endif
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.icon{
				display: block;
				margin-bottom: 6rpx;
				width: 44rpx;
				height: 44rpx;
			}
			.name{
				color: #a0a1a2;
				font-size: 24rpx;
				&.active{
					color: #3a2397;
				}
			}
		}
		.midButton{
			width: 120rpx;
			height: 120rpx;
			margin-top: -80rpx;
		}
	}
</style>