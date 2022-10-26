<template>
	<view>
		<view class="navbar" :style="{'top': windowTop+'px'}">
			<view class="nav-item" :class="{ current: tabsIndex === i }" v-for="(item, i) in tabs" :key="i" @click="tabClick(i)">
				<text>{{item.name}}</text>
				<view class="p-box" v-if="i !== 0">
					<text :class="{ active: item.value === 1}" class="iconfont yticon">&#xe62c;</text>
					<text :class="{ active: item.value === 2}" class="iconfont yticon xia">&#xe62c;</text>
				</view>
			</view>
		</view>
		<view :style="{height: windowTop+40+'px'}"></view>
		<view class="list">
			<product :list="goodsList"></product>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import product from "./modules/product.vue"
	export default{
		components: { uniLoadMore, product },
		data(){
			return {
				loadingType: "loading",
				windowTop: 0,
				tabs:[
					{name: "综合排序", value: 1},
					{name: "销量优先", value: -1, key: 'sortSales'},
					{name: "价格", value: -1, key: 'sortPrice'}
				],
				tabsIndex: 0,
				goodsList: [],
				serchParemes: {
					pageSize: 1,
					sortComprehensive: 1
				}
			}
		},
		onLoad(options) {
			this.windowTop = uni.getSystemInfoSync().windowTop
			if(options.storeId){
				this.serchParemes.storeId = options.storeId;
			}
			if(options.storeCategoryId){ // 商家内部商品分类ID
				this.serchParemes.storeCategoryId = options.storeCategoryId;
			}
			if(options.categoryThreeId){ // 平台分类
				this.serchParemes.categoryThreeId = options.categoryThreeId;
			}
			if (options.categoryTwoId){
				this.serchParemes.categoryTwoId = options.categoryTwoId;
				uni.setNavigationBarTitle({
					title: options.pTitle + "-" + options.title
				});
			} else {
				uni.setNavigationBarTitle({
					title: options.title
				});
			}
			this.loadData()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.serchParemes.pageSize = 1
			this.goodsList = []
			this.loadData();
		},
		//加载更多
		onReachBottom() {
			this.serchParemes.pageSize += 1;
			this.loadData();
		},
		methods:{
			loadData() {
				let path = null
				this.$http('GET', url.goods.getGoodsList, this.serchParemes).then(res =>{
					let goodsList = res.data.records;
					this.goodsList = this.goodsList.concat(goodsList);
					this.loadingType = this.goodsList.length >= res.data.total ? 'nomore' : 'more';
					uni.stopPullDownRefresh();
				})
			},
			tabClick(index) {
				this.tabsIndex = index
				if (index === 0) {
					this.serchParemes.sortComprehensive = 1
				} else {
					this.serchParemes.sortComprehensive = -1
					let value = -1
					if (this.tabs[index].value === -1) {
						value = 1
					} else if (this.tabs[index].value === 1){
						value = 2
					} else {
						value = -1
					}
					this.serchParemes[this.tabs[index].key] = value
					this.tabs[index].value = value
				}
				this.serchParemes.pageSize = 1
				this.goodsList = []
				this.loadData();
			}
		}
	}
</script>

<style scoped lang="scss">
	.navbar {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
		z-index: 10;
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&.current {
				color: #381895;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid #381895;
				}
			}
		}
		.p-box {
			display: flex;
			flex-direction: column;
			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 24upx;
				color: #888;
				margin-bottom: 2rpx;
				&.active {
					color: #381895;
				}
			}
			.xia {
				transform: scaleY(-1);
			}
		}
	}
	.list{
		padding: 20rpx;
	}
</style>
