<template>
	<view>
		<v-tabs :value="current" :tabs="tabs" fontSize="30rpx" :scroll="false" height="90rpx" :fixed="true" @change="tabsChange"></v-tabs>
		<swiper class="swiper-item" :current="current" @change="swiperChange">
			<!-- 关注 -->
			<swiper-item class="swiper-item">
				<you-scroll
					@onPullDown="refresh"
					@onLoadMore="getFollowList('add')">
					<view class="list">
						<view class="list-item" v-for="(item, i) in followList" :key="i">
							<image :src="item.icon" mode="aspectFill" class="avatar" @click="goUser(item)"></image>
							<view class="flex flex-column flex-grow">
								<text class="font32 color-b3 line">{{item.nickname}}</text>
								<text class="color-9 font24">关注时间：{{item.createTime}}</text>
							</view>
							<text class="btn bg-base" v-if="id === userInfo.id" @click="guanZu(item, i, 1)">取关</text>
						</view>
					</view>
					<uni-load-more :status="followLoad"></uni-load-more>
				</you-scroll>
			</swiper-item>
			<!-- 喜欢 -->
			<swiper-item class="swiper-item">
				<you-scroll
					@onPullDown="refresh"
					@onLoadMore="getLikeList('add')">
					<view class="grid">
						<view class="grid-item" v-for="(item, i) in likeList" :key="i" @click="showVideo(item, i)">
							<image :src="item.image" mode="aspectFill" class="grid-item-img"></image>
							<view class="grid-item-bom">
								<image src="/static/video/video_love.png" mode="" class="grid-item-bom-icon"></image>
								<text class="grid-item-bom-txt">{{item.likes}}</text>
							</view>
						</view>
					</view>
					<uni-load-more :status="likeLoad"></uni-load-more>
				</you-scroll>
			</swiper-item>
			<!-- 粉丝 -->
			<swiper-item class="swiper-item">
				<you-scroll
					@onPullDown="refresh"
					@onLoadMore="getFenSiList('add')">
					<view class="list">
						<view class="list-item" v-for="(item, i) in fenSiList" :key="i">
							<image :src="item.icon" mode="aspectFill" class="avatar" @click="goUser(item)"></image>
							<view class="flex flex-column flex-grow">
								<text class="font32 color-b3 line">{{item.nickname}}</text>
								<text class="color-9 font24">关注时间：{{item.createTime}}</text>
							</view>
							<blcok v-if="id === userInfo.id">
								<text class="btn" v-if="item.myIsGuanZhu" style="border: 2rpx solid #EEEEEE; color: #999999;" @click="guanZu(item, i, 1)">互相关注</text>
								<text class="btn bg-base" v-else @click="guanZu(item, i, 0)">关注</text>
							</blcok>
							
						</view>
					</view>
					<uni-load-more :status="followLoad"></uni-load-more>
				</you-scroll>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import youScroll from '@/components/you-scroll'
	export default{
		components: { vTabs, uniLoadMore, youScroll },
		data(){
			return {
				id: "",
				current: 0,
				tabs: ["关注", "喜欢", "粉丝"],
				followList: [],
				followLoad: "loading",
				followPageSize: 0,
				followTotal: 0,
				likeList: [],
				likeLoad: "loading",
				likePageSize: 0,
				likeTotal: 0,
				fenSiList: [],
				fenSiLoad: "loading",
				fenSiPageSize: 0,
				fenSiTotal: 0,
				refresherTriggered: false,
				_freshing: false
			}
		},
		computed: {
			...mapState(["userInfo"])
		},
		onLoad(opt) {
			if (opt.data) {
				let data = JSON.parse(opt.data)
				this.id = data.id
				if (data.nickname) {
					uni.setNavigationBarTitle({
						title: data.nickname
					})
				}
				this.init()
				this.getFollowList('add')
			}
		},
		methods:{
			init(){
				this.$http('get', url.interaction.userVideoInit, {userId:this.id}).then(res =>{
					this.followTotal = res.data.guanZhu
					this.$set(this.tabs, 0, this.followTotal ? `关注 ${this.followTotal}` : '关注')
					this.likeTotal = res.data.xiHuan
					this.$set(this.tabs, 1, this.likeTotal ? `喜欢 ${this.likeTotal}` : '喜欢')
					this.fenSiTotal = res.data.fenSi
					this.$set(this.tabs, 2, this.fenSiTotal ? `粉丝 ${this.fenSiTotal}` : '粉丝')
				})
			},
			getFollowList(type, done){
				if (type === 'add') {
					if (this.followLoad === 'nomore') {
						return;
					}
					this.followLoad = 'loading';
				} else {
					this.followLoad = 'more';
					this.followPageSize = 0
					this.followList = []
				}
				let params = {
					userId: this.id,
					type: 1,
					pageSize: this.followPageSize
				}
				this.$http('get', url.interaction.userVideoType, params).then(res =>{
					this.followList = [...this.followList, ...res.data]
					if (this.followList.length < this.followTotal) {
						this.followPageSize++
						this.followLoad = "more"
					} else {
						this.followLoad = "nomore"
					}
					if (typeof done === "function") done()
				})
			},
			getLikeList(type, done){
				if (type === 'add') {
					if (this.likeLoad === 'nomore') {
						return;
					}
					this.likeLoad = 'loading';
				} else {
					this.likeLoad = 'more';
					this.likePageSize = 0;
					this.likeList = []
				}
				let params = {
					userId: this.id,
					type: 2,
					pageSize: this.likePageSize
				}
				this.$http('get', url.interaction.userVideoType, params).then(res =>{
					this.likeList = [...this.likeList, ...res.data]
					if (this.likeList.length < parseInt(this.likeTotal)) {
						this.likePageSize++
						this.likeLoad = "more"
					} else {
						this.likeLoad = "nomore"
					}
					if (typeof done === "function") done()
				})
			},
			getFenSiList(type, done){
				if (type === 'add') {
					if (this.fenSiLoad === 'nomore') {
						return;
					}
					this.fenSiLoad = 'loading';
				} else {
					this.fenSiLoad = 'more';
					this.fenSiPageSize = 0;
					this.fenSiList = []
				}
				let params = {
					userId: this.id,
					type: 11,
					pageSize: this.fenSiPageSize
				}
				this.$http('get', url.interaction.userVideoType, params).then(res =>{
					this.fenSiList = [...this.fenSiList, ...res.data]
					if (this.fenSiList.length < parseInt(this.fenSiTotal)) {
						this.fenSiPageSize++
						this.fenSiLoad = "more"
					} else {
						this.fenSiLoad = "nomore"
					}
					if (typeof done === "function") done()
				})
			},
			//浏览视频
			showVideo(row, index){
				uni.navigateTo({
					url: "/pages/video/indexByUser?pages=like&id="+row.id
				})
			},
			// 取消关注 1-取消关注 0-关注
			guanZu(item, i, type){
				let params = {
					userId: this.current === 0 ? item.videoUserId : item.userId,  // 关注列表的关注传videoUserId，粉丝列表的关注传userId
					type: type
				}
				this.$http("POST", url.interaction.followByUserId, params).then(res =>{
					this.refresh()
					if (this.current === 2) {
						this.getFollowList('refresh')
					}
				})
			},
			refresh(done){
				this.init()
				if (this.current === 0) {
					this.getFollowList('refresh', done)
				} else if (this.current === 1) {
					this.getLikeList('refresh', done)
				} else {
					this.getFenSiList("refresh", done)
				}
			},
			tabsChange(i){
				this.current = i
			},
			swiperChange(e){
				let i = e.detail.current
				this.current = i
				if (i===0){
					this.getFollowList('add')
				} else if (i === 1) {
					this.getLikeList('add')
				} else {
					this.getFenSiList("add")
				}
			},
			goUser(item) {
				this.$navigateTo("/pages/interaction/user?userId="+item.imAccount)
			}
		}
	}
</script>

<style scoped lang="scss">
	.swiper-item{
		height: 94vh;
		background-color: #FFFFFF;
		&-content{
			height: 100%;
		}
		.list{
			padding: 20rpx;
			&-item{
				padding: 20rpx 0;
				margin-bottom: 20rpx;
				border-bottom: 2rpx solid #f6f6f6;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.avatar{
					border-radius: 50%;
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
				}
				.btn{
					border-radius: 10rpx;
					font-size: 28rpx;
					color: white;
					padding: 6rpx 20rpx;
					margin-left: 10rpx;
				}
			}
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
	}
</style>
