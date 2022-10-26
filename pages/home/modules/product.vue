<template>
	<view class="box">
		<view class="goods" v-for="(item, i) in list" :key="i" @tap="jumpTo(item)">
			<image :src="filterImg(item.mainImage)" mode="aspectFill" class="goods-img" lazy-load></image>
			<view class="goods-wrap">
				<view class="goods-wrap-title">
					<text class="goods-wrap-title-name">
						<text class="goods-wrap-title-name-txt" v-if="item.isNewProducts == 2">新品</text>
						<text class="goods-wrap-title-name-txt" v-else-if="item.goodsType == 2">精品</text>
						{{item.titleName}}
					</text>
				</view>
				<view class="goods-wrap-tip">
					<!-- <text class="color-b9 font24 text-del">¥{{item.wholesalePrice}}</text> -->
					<text class="goods-wrap-tip-left">{{(parseInt((item.bonusIntegral/100*item.wholesalePrice)*100)/100).toFixed(2)}}积分</text>
					<text class="goods-wrap-tip-right">月售{{item.totalSales}}件</text>
				</view>
				<view class="goods-wrap-price">
					<text class="goods-wrap-price-txt">¥{{item.wholesalePrice}}</text>
					<!-- <text class="font26 color-red">{{(parseInt((item.giftPoint/100*item.price)*100)/100).toFixed(2)}}积分</text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import publics from "@/common/utils/public.js"
	export default{
		props:{
			list: {
				type: Array,
				default: []
			}
		},
		methods:{
			jumpTo(item) {
				this.$navigateTo('details?id='+item.id)
			},
			filterImg(img){
				return publics.filterImgUrl(img, 3)
			}
		}
	}
</script>

<style scoped lang="scss">
	.box{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
	}
	.goods{
		width: 49%;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 2%;
		box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: .1);
	}
	.goods-img{
		width: 100%;
		max-height: 350rpx;
		display: block;
		will-change: transform;
	}
	.goods-wrap{
		margin: 10rpx 20rpx 20rpx;
	}
	.goods-wrap-title{
		display: flex;
		align-items: center;
		flex-direction: row;
	}
	.goods-wrap-title-name{
		overflow: hidden;
		text-overflow:ellipsis; 
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		color: #333333;
	}
	.goods-wrap-title-name-txt{
		background: linear-gradient(to bottom, #381895 0%, #865afd 100%);
		font-size: 24rpx;
		padding: 0 6rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
		color: white;
		font-size: 24rpx;
	}
	.goods-wrap-tip{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	.goods-wrap-tip-left{
		font-size: 26rpx;
		color: #fa2d43;
	}
	.goods-wrap-tip-right{
		font-size: 28rpx;
		color: #666;
	}
	.goods-wrap-price{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between
	}
	.goods-wrap-price-txt{
		font-weight: bold;
		color: #381895;
	}
</style>
