<template>
	<view class="content">
		<view v-for="(item, i) in list" :key="i">
			<text class="time">{{item.time}}</text>
			<view class="flex grid">
				<view class="grid-item" v-for="(goods, index) in item.children" :key="index" @click="jumpTo(goods.sourceId)">
					<image :src="(goods.goodsInfo ? goods.goodsInfo.mainImage : goods.paramOne) || goods.icon" @error="imgError(index)" mode="aspectFill" class="img"></image>
					<view class="txt">
						<text class="color-b3 font30">{{goods.goodsInfo ? goods.goodsInfo.titleName : goods.paramTwo}}</text>
						<text class="color-red font32">¥{{goods.goodsInfo ? goods.goodsInfo.wholesalePrice : goods.paramThree}}</text>
					</view>
				</view>
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
				oldList: [],
				loading: 'loading'
			};
		},
		onLoad(options) {
			this.getFootprintList();
		},
		onPullDownRefresh() {
			this.list = []
			this.oldList = []
			this.getFootprintList()
		},
		onReachBottom() {
			this.getFootprintList();
		},
		methods: {
			//详情页
			jumpTo(id) {
				uni.navigateTo({
					url: `/pages/home/details?id=${id}`
				});
			},
			// 获取足迹列表
			getFootprintList(){
				this.$http('GET', url.goods.collectionGoodsList, {type: 2, pageNum: this.oldList.length}).then(res =>{
					let list = res.data
					this.oldList = [...this.oldList, ...list]
					let goodsList = deeploop(list)
					this.list = this.list.concat(goodsList)
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
	.time{
		padding: 20rpx;
		font-size: 26rpx;
		display: block;
		color: #999999;
	}
	.grid{
		flex-wrap: wrap;
		padding-right: 6rpx;
		&-item{
			margin-left: 10rpx;
			background-color: white;
			width: 236rpx;
			height: 300rpx;
			overflow: hidden;
			.img{
				width: 100%;
				height: 200rpx;
				display: block;
			}
			.txt{
				display: flex;
				flex-direction: column;
				padding: 10rpx 20rpx 0;
			}
		}
	}
</style>
