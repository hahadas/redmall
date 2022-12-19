<template>
	<view class="main">
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i" @click="jumpTo(item.goodsId)">
				<view><image :src="filterImg(item.goodsInfo.mainImage)" mode="" class="img"></image></view>
				<view class="flex flex-column" style="width: 100%;">
					<text class="font32 line"><text class="color-b9" v-if="item.status === 2">已冻结-</text>{{item.goodsInfo.titleName}}</text>
					<text class="line spec">{{item.goodsSku.skuName}}</text>
					<text class="font30 color-purple">¥{{item.goodsSku.skuPrice}}</text>
					<view class="flex flex-between font28 color-b6">
						<text class="">库存: {{item.stock}}</text>
						<text class="">已售: {{item.sales}}</text>
						<text class="">评价: {{item.evaluate}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: { vTabs, uniNumberBox, uniLoadMore },
		data() {
			return {
				loading: "nomore",
				current: 0,
				tabs: ["我的库存", "进货市场"],
				scrollHeight: 0,
				list:[],
			}
		},
		computed: {
			...mapState(["userInfo"])
		},
		onLoad() {
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			this.loadData();
		},
		onPullDownRefresh() {
			this.list = []
			this.loadData()
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			loadData() {
				let params = {
					toImAccount: this.userInfo.imAccount,
					pageNum: this.list.length
				}
				this.$http('get', url.agent.getStockList, params).then(res =>{
					uni.setNavigationBarTitle({
						title: "库存管理" + (res.data.stockAllCount ? `(${res.data.stockAllCount})` : '')
					})
					let list = res.data.stockList
					this.list = this.list.concat(list)
					this.loading = list.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh()
				})
			},
			filterImg(img) {
				return publics.filterImgUrl(img, 3)
			},
			jumpTo(id){
				this.$navigateTo("/pages/home/details?id="+id)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: white;
		min-height: 100vh;
	}
	.list{
		&-item{
			padding: 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			.img{
				width: 180rpx;
				height: 180rpx;
				margin-right: 20rpx;
			}
			.spec {
				background-color: #F8F8F8;
				color: #bcbbbd;
				font-size: 26rpx;
				padding: 10rpx;
				margin-top: 4rpx;
				border-radius: 8rpx;
				align-self: flex-start;
			}
		}
	}
</style>
