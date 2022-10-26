<template>
	<view class="main">
		<view class="notice-item" v-for="(item, index) in list" :key="index" @click="navToDetailPage(item, index)">
			<text class="time">{{ item.createTime }}</text>
			<view class="content">
				<view class="title blod">
					<text class="tips" v-if="!item.readStatus"></text>
					<text class="line">{{ item.titleName }}</text>
				</view>
				<view class="img-wrapper">
					<image :src="item.mainImage" mode="aspectFill" class="pic"></image>
				</view>
				<text class="introduce">{{ item.textDescribe }}</text>
				<view class="bot">
					<text>查看详情</text>
					<text class="more-icon iconfont">&#xe770;</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		props:["type"],
		components: { uniLoadMore },
		data() {
			return {
				loadingType: "loading",
				list: []
			};
		},
		methods: {
			loadData() {
				this.$http('GET', url.cms.getNoticeList, {pageNum: this.list.length, type: this.type}).then(res =>{
					this.list = this.list.concat(res.data);
					this.loadingType = this.list.length < 12 ? 'nomore' : 'more';
						uni.stopPullDownRefresh();
				})
			},
			refresh(){
				this.list = []
				this.loadData()
			},
			//详情
			navToDetailPage(item, index) {
				this.$navigateTo(`details?id=${item.id}`)
				if (!item.readStatus){
					this.list[index].readStatus = 1
					this.$forceUpdate()
				}
			}
		}
	};
</script>

<style lang="scss">
page {
	background-color: #f7f7f7;
	padding-bottom: 30upx;
}
.main{
	width: 750rpx;
	overflow: hidden;
}
.notice-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.time {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80upx;
	padding-top: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
}

.content {
	width: 710upx;
	padding: 0 24upx;
	background-color: #fff;
	border-radius: 4upx;
}

.title {
	display: flex;
	align-items: center;
	height: 90upx;
	font-size: 32upx;
	color: #303133;
	.tips{
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		margin-right: 8rpx;
		background-color: #CA0400;
		display: block;
	}
}

.img-wrapper {
	width: 100%;
	height: 260upx;
	position: relative;
}

.pic {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 6upx;
}

.cover {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	font-size: 36upx;
	color: #fff;
}

.introduce {
	display: inline-block;
	padding: 16upx 0;
	font-size: 28upx;
	color: #606266;
	line-height: 38upx;
}

.bot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80upx;
	font-size: 24upx;
	color: #707070;
	position: relative;
	border-top: 2rpx solid #eee;
}

.more-icon {
	font-size: 32upx;
	color: #707070;
}
</style>
