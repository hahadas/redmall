<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="tabs">
			<view class="tab" v-for="(tab, i) in tabs" :key="i" @click="tabsChange(i)">
				<text class="tab-name" :class="{'tab-name-active' : current === i}">{{tab}}</text>
			</view>
		</view>
		<!-- #endif -->
		
		<scroll-view scroll-y :style="{height: height + 'px'}">
			<you-scroll
				@onPullDown="refresh"
				@onLoadMore="loadData">
				<view class="cu-card" v-for="(item,index) in list" :key="index" @tap="jumpTo(item)">
					<view class="cu-item">
						<view class="cu-card-flex">
							<image :src="item.icon" mode="" class="cu-avatar" @tap.stop="goUser(item)"></image>
							<view class="content">
								<view class="content-flex">
									<text class="content-name">{{item.nickname}}</text>
									<text class="color-purple content-name" v-if="item.commentsType == 0 || item.commentsType == 1"> #评论我</text>
									<text class="color-purple content-name" v-if="item.commentsType == 2"> #回复我</text>
								</view>
								<text class="time">{{item.createTime}}</text>
							</view>
						</view>
						<text class="text-content">{{item.note}}</text>
						<view class="bom">
							<text class="bom-txt" v-if="item.commentsType == 0">评论我的{{current === 0 ? '动态' : '视频'}}: {{item.videoNode}}</text>
							<text class="bom-txt" v-if="item.commentsType == 1">我的评论: {{item.myOneNote}}</text>
							<text class="bom-txt" v-if="item.commentsType == 2">我的评论: {{item.myTwoNote}}</text>
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</you-scroll>
		</scroll-view>
	</view>
</template>

<script>
	import { sendRequest } from "@/common/http/api.js"
	import url from '@/common/http/url.js';
	import youScroll from '@/components/you-scroll' 
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: { uniLoadMore, youScroll },
		props: ['swiperHeight'],
		data(){
			return {
				height: 0,
				tabs: ["动态评论"],
				current: 0,
				list: [],
				loadingType: 'nomore'
			}
		},
		mounted(){
			// #ifdef APP-PLUS
			this.tabs = ["动态评论", "视频评论"]
			this.height = this.swiperHeight - 45
			// #endif
			// #ifndef APP-PLUS
			this.tabs = ["动态评论"]
			this.height = this.swiperHeight
			// #endif
		},
		methods:{
			loadData(done){
				let path = null
				if (this.current === 0) {
					path = url.interaction.getMyCommentList
				} else {
					path = url.interaction.commentsByMe
				}
				sendRequest('GET', path, {pageSize:this.list.length}).then(res => {
					let data = res.data
					this.list = this.list.concat(data.list);
					if (res.data.length < 12) {
						this.loading = "nomore"
					} else {
						this.loading = "more"
					}
					if (typeof done === "function") done()
				})
				
			},
			refresh(done){
				this.list = []
				this.loadData(done)
			},
			tabsChange(i) {
				this.current = i
				this.list = []
				this.loadData()
			},
			jumpTo(item){
				let path = null
				if (this.tabs[this.current] === "视频评论") {
					sendRequest('get', url.interaction.getVideoByCommentId, {videoId:item.videoId}).then(res => {
						let data = res.data
						if(data){
							uni.setStorageSync("VideoByUserCommentOneData",JSON.stringify(data));
							uni.navigateTo({
								url: "/pages/video/videoComment?commentId="+item.id
							})
						}
					})
				} else {
					uni.navigateTo({
						url: "./details?id="+item.videoId+"&commentId="+item.id
					})
				}
			},
			goUser(item){
				uni.navigateTo({
					url: "./user?userId="+item.imAccountOne
				})
			}
		}
	}
</script>

<style scoped>
	.tabs{
		width: 750rpx;
		height: 90rpx;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
	}
	.tab{
		width: 375rpx;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.tab-name{
		height: 90rpx;
		line-height: 90rpx;
		color: #333333;
		font-size: 30rpx;
		border-bottom-width: 8rpx;
		border-bottom-color: #FFFFFF;
		border-bottom-style: solid;
	}
	.tab-name-active{
		font-weight: bold;
		color: #381895;
		border-bottom-color: #381895;
	}
	.cu-card{
		/* overflow: hidden; */
		margin-bottom: 20rpx;
	}
	.cu-item{
		background-color: #ffffff;
		/* overflow: hidden; */
		border-radius: 10upx;
		margin: 30upx;
	}
	.cu-card-flex{
		flex-direction: row;
		align-items: center;
		border-bottom-width: 2rpx;
		border-bottom-color: #EEEEEE;
		padding: 20rpx;
	}
	.cu-avatar{
		width: 96upx;
		height: 96upx;
		border-radius: 5000upx;
		margin-right: 20rpx;
	}
	.content-flex{
		flex-direction: row;
		align-items: center;
	}
	.content-name{
		font-size: 30rpx;
	}
	.color-purple{
		color: #381895;
	}
	.time{
		color: #aaaaaa;
		font-size: 24rpx;
		margin-top: 10rpx;
	}
	.text-content {
		padding-top: 10rpx;
		margin-left: 20rpx;
		font-size: 32rpx;
	}
	.bom{
		background-color: #8799a3;
		padding: 20upx;
		border-radius: 10upx;
		margin-top: 20upx;
	}
	.bom-txt{
		color: #ffffff;
		font-weight: bold;
		font-size: 24rpx;
	}
</style>
