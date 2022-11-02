<template>
	<view style="height: 100%;">
		<HMfilterDropdown
			:menuTop="0"
			:filterData="oneFilter" 
			:defaultSelected ="oneDropdownIndex" 
			@confirm="oneFilterConfirm">
		</HMfilterDropdown>
		<you-scroll
			@onPullDown="refresh"
			@onLoadMore="loadData">
			<view class="dynamic">
				<view class="item" v-for="(item, i) in dynamicList" :key="i" @tap="goDetails(item)">
					<view class="top">
						<view><image :src="filterImg((item.icon||item.images), 1)" lazy-load mode="aspectFill" class="img" @tap.stop="viewUser(item)"></image></view>
						<view style="flex-grow: 1;">
							<view class="column">
								<text class="name" style="margin-right: 10rpx;">{{item.nickname}}</text>
							</view>
							<view class="column" style="justify-content: flex-start;">
								<view class="six" :class="{'woman':item.gender===3}">
									<text class="iconfont icon" v-if="item.gender === 2">&#xe621;</text>
									<text class="iconfont icon" v-else>&#xe622;</text>
									<text class="txt">{{item.age||0}}</text>
								</view>
								<text class="mark bg-base" v-if="item.distributorIsOpen">配送员</text>
							</view>
						</view>
					</view>
					<text class="con">{{item.comment}}</text>
					<view class="imgs" v-if="item.images && item.images.split(',').length > 1">
						<image :src="filterImg(url, 2)" lazy-load mode="aspectFill" class="image" v-for="(url, index) in item.images.split(',')" :key="index" @tap.stop="previewImg(item.images, index)"></image>
					</view>
					<view class="imgs" v-if="item.images && item.images.split(',').length === 1">
						<image :src="filterImg((item.images.split(',')[0]), 4)" lazy-load mode="aspectFill" class="imageMax" @tap.stop="previewImg(item.images, index)"></image>
					</view>
					<text style="font-size: 22rpx; color: #999999;">{{item.createTime}} · 距离我{{item.distance | distance}}<text v-if="!item.addStatus" style="margin-left: 6rpx; font-size: 22rpx; ">· {{item.address}}</text></text>
					<view class="option">
						<view class="option-item">
							<text class="iconfont icon">&#xe62e;</text>
							<text class="name">{{item.commentCount || 0}}条评论</text>
						</view>
						<view class="option-item" @tap.stop="onLike(item, i)">
							<text class="iconfont icon" style="margin-top: -6rpx;" :style="{color: item.isLike ?'#f5466f':''}">&#xe602;</text>
							<text class="name">{{item.likeCount || 0}}点赞</text>
						</view>
					</view>
				</view>
				<uni-load-more :status="loading"></uni-load-more>
			</view>
		</you-scroll>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import mix from "./mix.js"
	import filter from "./filter.js"
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';
	import youScroll from '@/components/you-scroll' 
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default{
		mixins:[mix],
		components:{
			HMfilterDropdown, youScroll, uniLoadMore
		},
		data(){
			return{
				oneFilter: filter.oneFilter,
				oneDropdownIndex: null,
				oneDropdownValue: null,
				dynamicList: [],
				loading: "loading"
			}
		},
		methods:{
			loadData(done) {
				this.loading = "loading"
				let params = {
					pageNum: this.dynamicList.length,
					lng: this.myAddressData.longitude,
					lat: this.myAddressData.latitude,
					gender: this.oneDropdownValue?(this.oneDropdownValue[0][0]||"-1"):"-1",
					// distance: this.oneDropdownValue?(this.oneDropdownValue[1][0]||0):"0",
					type: this.oneDropdownValue?this.oneDropdownValue[1][0]:"-1"
				}
				this.$http('get', url.interaction.dynamicAllList, params).then(res =>{
					let list = res.data
					this.dynamicList = [...this.dynamicList ,...list];
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					if (typeof done === "function") done()
				})
				
			},
			// 点赞
			onLike(item, index){
				let type = item.isLike ? 1 : 0
				this.$http('post', url.interaction.likeByComment, {type:type, commentId: item.id}).then(res => {
					this.dynamicList[index].isLike = !type
					if (!type) {
						this.dynamicList[index].likeCount += 1
					} else {
						this.dynamicList[index].likeCount -= 1
					}
					this.$forceUpdate()
				})
			},
			previewImg(imgs, index){
				let _this = this
				let imgList = imgs.split(",")
				uni.previewImage({
					urls: imgList,
					current: index
				});
			},
			oneFilterConfirm(e){
				this.oneDropdownIndex = e.index
				this.oneDropdownValue = e.value
				this.dynamicList = []
				this.loadData()
			},
			refresh(done){
				this.dynamicList = []
				this.loadData(done)
			}
		}
	}
</script>

<style scoped lang="scss">
	.woman{
		background-color: #ff4d94 !important;
	}
	.dynamic {
		padding: 0 30rpx;
		margin-top: 130rpx;
		.item{
			border-bottom: 2rpx solid #eee;
			padding-bottom: 50rpx;
			margin-bottom: 50rpx;
			.top{
				display: flex;
				align-items: center;
				.img{
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
					border-radius: 50%;
				}
				
				.six{
					min-width: 30rpx;
					max-width: 90rpx;
					border-radius: 20rpx;
					background-color: #1995fc;
					display: flex;
					align-items: center;
					padding: 0rpx 16rpx;
					margin: 10rpx 0;
					.icon{
						color: white;
						font-size: 24rpx;
						margin-top: 2rpx;
						margin-right: 10rpx;
						// transform: scale(0.9);
					}
					.txt{
						font-size: 24rpx;
						color: white;
					}
				}
				.column{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.mark{
						padding: 2rpx 16rpx;
						border-radius: 30rpx;
						color: white;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
					.name{
						color: #666;
						font-size: 30rpx;
						width: 550rpx;
						overflow: hidden;
						text-overflow: ellipsis; 
						display: -webkit-box; 
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
					.time{
						color: #999;
						font-size: 22rpx;
					}
					.chat {
						background-color: #f5466f;
						color: white;
						font-size: 20rpx;
						// padding: 0 10rpx;
						border-radius: 20rpx;
						display: block;
						height: 30rpx;
						width: 70rpx;
						text-align: center;
						float: right;
						
					}
				}
			}
			.con{
				margin: 20rpx 0;
				font-size: 30rpx;
				display: block;
			}
			.imgs{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				flex-wrap: wrap;
				.image{
					margin-right: 6rpx;
					width: 224rpx;
					height: 224rpx;
					margin-bottom: 6rpx;
					border-radius: 10rpx;
				}
				.imageMax{
					width: 400rpx;
					height: 400rpx;
					border-radius: 10rpx;
				}
			}
			.option{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 10rpx;
				&-item{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.icon{
						color: #999999;
						font-size: 40rpx;
						margin-right: 10rpx;
					}
					.name{
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
		}
	}
</style>
