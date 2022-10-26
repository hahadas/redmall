<template>
	<view>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="flex flex-between title">
					<text class="font28">订单号：{{item.orderNumber}}</text>
				</view>
				<view class="goods flex">
					<view class="goods-img" @click="jumpTo(item.goodsId)">
						<image :src="filterImg(item.skuImage || item.goodsImage)" mode="" class="img"></image>
						<text class="tips">精品</text>
					</view>
					<view class="flex flex-column" style="width: 100%;">
						<text class="line font28 color-b3">{{item.goodsName}}</text>
						<text class="spec">{{item.skuName}}</text>
						<view class="flex flex-between" style="width: 100%;">
							<view class="flex">
								<text class="color-red font30">¥{{item.unitPrice}}</text>
							</view>
							<text class="color-b9 font26">x{{item.number}}</text>
						</view>
					</view>
				</view>
				<view class="flex flex-between total font30">
					<text class="color-b9">{{item.confirmReceiptTime}}</text>
					<text class="color-b3">实付款¥{{item.payRmbAmount}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return{
				loadingType: "loading",
				list: [],
				pageSize: 1
			}
		},
		onLoad() {
			this.getList(false)
		},
		onPullDownRefresh() {
			this.getList(true)
		},
		onReachBottom() {
			this.getList(false)
		},
		methods: {
			getList(type){
				if (type) {
					this.pageSize = 1
					this.list = []
				} else {
					if (this.loadingType === "nomore") return
					this.loadingType = "loading"
				}
				this.$http("GET", url.user.agentOrderList, {pageSize: this.pageSize}).then(res => {
					this.list = this.list.concat(res.data.records)
					if (this.list.length < res.data.total) {
						this.pageSize++
						this.loadingType = "more"
					} else {
						this.loadingType = "nomore"
					}
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

<style lang="scss" scoped>
	.list{
		margin: 20rpx;
		&-item{
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: white;
			.title{
				border-bottom: 2rpx solid #EEEEEE;
				padding-bottom: 20rpx;
			}
			.goods{
				margin-top: 20rpx;
				&-img{
					position: relative;
					margin-right: 20rpx;
					width: 140upx;
					height: 140upx;
					overflow: hidden;
					border-radius: 10upx;
					.img{
						flex-shrink: 0;
						display: block;
						width: 140upx;
						height: 140upx;
					}
					.tips{
						color: #CA0400;
						background-color: white;
						font-size: 24rpx;
						position: absolute;
						right: -32rpx;
						top: -16rpx;
						width: 100rpx;
						text-align: center;
						height: 60rpx;
						line-height: 80rpx;
						transform: rotate(45deg);
					}
				}
				.spec{
					background-color: #F8F8F8;
					color: #bcbbbd;
					font-size: 24rpx;
					padding: 10rpx;
					margin-top: 4rpx;
					border-radius: 8rpx;
					align-self: flex-start;
				}
			}
			.total{
				margin: 20rpx 0;
			}
		}
	}
</style>
