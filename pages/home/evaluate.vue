<template>
	<view>
		<view class="tabs">
			<view class="flex flex-center tab" :class="{'active': current === i}" v-for="(tab, i) in tabs" :key="i" @click="tabChange(i)">
				<text class="font28">{{tab.name}}({{tab.total||0}})</text>
			</view>
		</view>
	
		<view class="list" v-if="list.length > 0">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="flex flex-align-center">
					<image :src="filterImg(item.evaluateUserInfo.headPortrait, 1)" mode="" class="avatar"></image>
					<view class="flex flex-column">
						<text class="font30">{{item.evaluateUserInfo.nickname}}</text>
						<uni-rate :size="15" :margin="4" :value="item.evaluateGoodsScore/2" readonly></uni-rate>
						<text class="font26 color-b9">{{item.createTime}}</text>
					</view>
				</view>
				<text class="font28">{{item.evaluateGoodsComment}}</text>
				<view class="imgs" v-if="item.evaluateGoodsImages && item.evaluateGoodsImages.length > 0">
					<image :src="filterImg(img, 5)" mode="" class="pic" v-for="(img, index) in item.evaluateGoodsImages" :key="index" @click="previewImg(index, item.evaluateGoodsImages)"></image>
				</view>
				<block v-if="item.evaluateDistribution">
					<view class="flex flex-align-center" style="margin-top: 20rpx;">
						<image :src="filterImg(item.evaluateDistribution.headPortrait, 1)" mode="" class="avatar"></image>
						<view class="flex flex-column">
							<text class="font30">(配送员){{item.evaluateDistribution.nickname}}</text>
							<uni-rate :size="15" :margin="4" :value="item.evaluateDistributionScore" readonly></uni-rate>
						</view>
					</view>
					<text class="font28">{{item.evaluateDistributionComment}}</text>
					<view class="imgs" v-if="item.evaluateDistributionImages && item.evaluateDistributionImages.length > 0">
						<image :src="filterImg(img, 5)" mode="" class="pic" v-for="(img, index) in item.evaluateDistributionImages" :key="index" @click="previewImg(index, item.evaluateDistributionImages)"></image>
					</view>
				</block>
			</view>
		</view>
		
		<uni-load-more :status="loadingType"></uni-load-more>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniRate from "@/components/uni-rate/uni-rate.vue"
	export default{
		components: {
			uniLoadMore, uniRate
		},
		data(){
			return {
				loadingType: "nomore",
				tabs: [
					{name: "全部", value: 0},
					{name: "有图", value: 4},
					{name: "好评", value: 3},
					{name: "中评", value: 2},
					{name: "差评", value: 1}
				],
				current: 0,
				id: "",
				list: []
			}
		},
		onLoad(opt) {
			if (opt.data) {
				let data = JSON.parse(opt.data)
				this.id = data.id
				this.tabs[0].total = data.all
				this.tabs[2].total = data.good
				this.tabs[3].total = data.secondary
				this.tabs[4].total = data.difference
				this.loadData()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.list = []
			this.loadData();
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods:{
			filterImg(img, type){
				return publics.filterImgUrl(img, type)
			},
			loadData(){
				let params = {
					goodsId: this.id,
					evaluateGoodsScore: this.tabs[this.current].value,
					pageNum: this.list.length
				}
				this.$http('GET', url.goods.getEvaluateList, params).then(res =>{
					this.tabs[1].total = res.data.imageCount
					let list = res.data.data
					list.map(v => {
						if (v.sysStaticResources) {
							v.evaluateGoodsImages = []
							v.evaluateDistributionImages = []
							v.sysStaticResources.forEach(k => {
								if (k.type === 20) {
									v.evaluateGoodsImages.push(k.ossUrl)
								}
								if (k.type === 21) {
									v.evaluateDistributionImages.push(k.ossUrl)
								}
							})
						}
					})
					
					this.list = this.list.concat(list)
					this.loadingType = list.length < 12 ? 'nomore' : 'more';
					uni.stopPullDownRefresh();
				})
			},
			previewImg(index,urls){
				uni.previewImage({
					current:urls[index],
					urls:urls
				})
			},
			tabChange(i){
				this.current = i
			}
		}
	}
</script>

<style scoped lang="scss">
	.tabs{
		background-color: white;
		padding: 20rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.tab{
			border-radius: 30rpx;
			padding: 6rpx 20rpx;
			border: 2rpx solid white;
			color: #333333;
			background-color: #F8F8F8;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
		}
		.active{
			border-color: #381895;
			color: #381895;
			background-color: rgba($color: #381895, $alpha: .3);
		}
	}
	.list{
		background-color: white;
		margin-top: 20rpx;
		padding: 30rpx;
		&-item{
			margin-bottom: 50rpx;
			padding-bottom: 30rpx;
			border-bottom: 2rpx solid #EEEEEE;
			.avatar{
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
				background-color: #007AFF;
				border-radius: 50%;
			}
			.imgs{
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 10rpx;
				.pic{
					width: 160rpx;
					height: 160rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
