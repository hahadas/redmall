<template>
	<view class="main">
		<view class="list" :class="{'flex-align-center': !item.storeInfo}" v-for="(item, i) in list" :key="i" @click="goStore(item.sourceId)">
			<view>
				<image :src="(item.goodsInfo ? item.goodsInfo.mainImage : item.paramOne) || item.icon" @error="imgError(i)" mode="" class="logo"></image>
			</view>
			<view class="flex flex-column">
				<text class="line font32">{{item.storeInfo ? item.storeInfo.name : item.paramTwo}}</text>
				<text class="color-b6 font28 line mar" v-if="item.storeInfo">{{item.storeInfo.introduce}}</text>
				<text class="color-b9 font28" v-if="item.storeInfo">{{item.storeInfo.followAmount||0}}人关注</text>
				<view class="flex imgs" v-if="item.storeInfo && item.storeInfo.cupboardGoodsJSONArray">
					<image :src="goods.mainImage" mode="" class="pic" v-for="(goods, index) in item.storeInfo.cupboardGoodsJSONArray" :key="index"></image>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components: { uniLoadMore },
		data(){
			return {
				loading: "loading",
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh(){
			this.list = []
			this.getList()
		},
		onReachBottom() {
			this.currentLoadData()
		},
		methods:{
			getList(){
				this.$http("GET", url.store.followStoreList, {pageNum: this.list.length}).then(res =>{
					this.list = this.list.concat(res.data)
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh();
				})
			},
			goStore(id){
				this.$navigateTo("../home/store?id="+id)
			},
			imgError(index) {
				this.$set(this.list[index], 'icon', '/static/no-existent.png')
			}
		}
	}
</script>

<style scoped lang="scss">
	.main {
		padding: 20rpx;
		.list{
			margin-bottom: 20rpx;
			background-color: white;
			border-radius: 16rpx;
			padding: 20rpx;
			display: flex;
			.logo{
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
			}
			.mar{
				margin: 6rpx 0;
			}
			.imgs{
				margin-top: 10rpx;
				.pic{
					width: 160rpx;
					height: 160rpx;
					margin-right: 20rpx;
					border-radius: 16rpx;
				}
			}
		}
	}
</style>
