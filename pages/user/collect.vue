<template>
	<view class="content">
		<view class="list flex" v-for="(item, i) in list" :key="i" @click="jumpTo(item.sourceId)">
			<view>
				<image :src="(item.goodsInfo ? item.goodsInfo.mainImage : item.paramOne) || item.icon" @error="imgError(i)" mode="aspectFill" class="logo"></image>
			</view>
			<view class="flex flex-column">
				<text class="line line-2 font32">{{item.goodsInfo ? item.goodsInfo.titleName : item.paramTwo}}</text>
				<text class="font28 color-b9 mar" v-if="item.goodsInfo">{{item.goodsInfo.visitCollection}}人收藏 | {{item.goodsInfo.visitBrowse}}人浏览</text>
				<text class="font36 color-red">¥{{item.goodsInfo ? item.goodsInfo.wholesalePrice : item.paramThree}}</text>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	var deeploop = function (arr) {
		if (arr.length === 0) return []
		let result = []
		arr.forEach(v => {
			let time = v.createTime.split(" ")[0]
			if (result.length === 0) {
				result.push({
					time: time,
					children: [v]
				})
			} else {
				let isHas = false
				result.forEach(k => {
					if (k.time === time) {
						isHas = true
						k.children.push(v)
						return
					}
				})
				if (!isHas) {
					result.push({
						time: time,
						children: [v]
					})
				}
			}
		})
		return result
	};
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [],
				loading: 'loading'
			};
		},
		onLoad(options) {
			this.getCollectionList();
		},
		onPullDownRefresh() {
			this.list = []
			this.getCollectionList()
		},
		onReachBottom() {
			this.getCollectionList();
		},
		methods: {
			//详情页
			jumpTo(id) {
				uni.navigateTo({
					url: `/pages/home/details?id=${id}`
				});
			},
			//获取收藏列表
			getCollectionList() {
				this.$http('GET', url.goods.collectionGoodsList, {type: 1, pageNum: this.list.length}).then(res =>{
					this.list = this.list.concat(res.data)
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh()
				})
			},
			imgError(index) {
				this.$set(this.list[index], 'icon', '/static/no-existent.png')
			}
		}
	};
</script>

<style scoped lang="scss">
	.list{
		margin: 20rpx 20rpx 0;
		.logo{
			width: 200rpx;
			height: 200rpx;
			border-radius: 20rpx;
			margin-right: 20rpx;
		}
		.mar{
			margin: 10rpx 0;
		}
	}
</style>
