<template>
	<view class="main">
		<v-tabs 
			v-model="current" 
			:tabs="tabs" 
			color="#666" 
			height="90rpx" 
			fontSize="30rpx" 
			:fixed="true" 
			:scroll="false"
			field="name"
			@change="changeTab">
		</v-tabs>
		<swiper :current="current" @change="swiperChange" :style="{height: swiperHeight + 'px'}">
			<swiper-item style="height: 100%;" v-for="(item, i) in tabs" :key="i">
				<scroll-view scroll-y style="height: 100%;">
					<view class="list" v-for="(store, i) in list" :key="i" @tap="jumpTo(store.id)">
						<view class="flex flex-align-center store">
							<image :src="store.logoImage" class="logo" mode=""></image>
							<text class="font34 blod">{{store.name}}</text>
						</view>
						<view class="list-item" v-for="(item, index) in store.discountUserList">
							<view class="left">
								<text class="font26 tip">¥</text>
								<text class="font46 blod">{{item.discountAmount}}</text>
							</view>
							<view class="right flex flex-column flex-grow">
								<text class="font28">{{item.titleName}}</text>
								<text class="font30 blod">满{{item.useStandardAmount}}可用</text>
								<text class="font26">{{item.expireTime ? ('有效期至'+item.expireTime) :'永久有效'}}</text>
							</view>
							<text class="btn bg-base">去使用</text>
						</view>
					</view>
					<uni-load-more :status="loading"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	export default{
		components: { uniLoadMore, vTabs },
		data(){
			return {
				swiperHeight: 0,
				list: [],
				loading: "loading",
				current: 0,
				tabs: [
					{name: "未使用", value: 1},
					{name: "已使用", value: 3},
					{name: "已过期", value: 4}
				]
			}
		},
		onShow() {
			this.swiperHeight = uni.getSystemInfoSync().screenHeight
			this.$http("GET", url.user.getDiscountNumber).then(res =>{
				if (res.data.couponUnused) this.tabs[0].name = `未使用(${res.data.couponUnused})`
				if (res.data.couponUsed) this.tabs[1].name = `已使用(${res.data.couponUsed})`
				if (res.data.couponExpired) this.tabs[2].name = `已过期(${res.data.couponExpired})`
			})
			this.getList()
		},
		onPullDownRefresh() {
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				let params = {
					pageNum: this.list.length, 
					status: this.tabs[this.current].value
				}
				this.$http("GET", url.user.getDiscountList, params).then(res =>{
					this.list = this.list.concat(res.data)
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh()
				})
			},
			changeTab(i){
				this.current = i
			},
			swiperChange(e){
				this.current = e.detail.current
				this.list = []
				this.getList()
			},
			jumpTo(id){
				this.$navigateTo("/pages/home/store?id="+id)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		// padding: 20rpx;
		.list{
			background-color: white;
			padding: 20rpx;
			border-radius: 20rpx;
			margin: 20rpx;
			.store{
				// margin-bottom: 20rpx;
				.logo{
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}
			&-item{
				width: 620rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				border-radius: 20rpx;
				color: #381895;
				background-color: rgba($color: #381895, $alpha: .3);
				.left{
					width: 10%;
					display: flex;
					justify-content: center;
					align-items: flex-end;
					margin-right: 20rpx;
					.tip{
						margin-bottom: 10rpx;
						margin-right: 6rpx;
						display: inline-block;
					}
				}
				.btn{
					margin-right: 10rpx;
					font-size: 26rpx;
					color: white;
					padding: 10rpx 20rpx;
					border-radius: 30rpx;
					
				}
			}
		}
	}
</style>
