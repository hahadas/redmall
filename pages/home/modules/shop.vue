<template>
	<view>
		<view class="shopItem bg-w" v-for="(item, i) in list" :key="i">
			<view class="flex flex-between">
				<view>
					<image :src="filterImg(item.logoImage)" mode="" class="img"></image>
				</view>
				<view class="flex flex-column" style="width: 380rpx;">
					<view class="flex flex-align-center">
						<text class="blod font34">{{item.name}}</text>
						<!-- <text class="tips bg-base" v-if="item.goodsType==2">精选</text> -->
					</view>
					<text class="font26 color-b6 line">{{item.introduce}}</text>
					<text class="font26 color-b9">距离{{item.distance | distance}}</text>
				</view>
				<text class="color-purple btn font32" @click="goStore(item)">进店</text>
			</view>
			<view class="flex flex-align-center b-b" v-if="item.cupboardGoodsJSONArray">
				<view class="imgs" v-for="(cupboard, index) in item.cupboardGoodsJSONArray" :key="index" @tap="jumpGoodsDetail(cupboard)">
					<image :src="filterImg(cupboard.mainImage)" mode="aspectFill" class="pic"></image>
					<text class="name line">{{cupboard.titleName}}</text>
					<text class="price color-red">¥{{cupboard.wholesalePrice}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { distanceTransform } from "@/common/utils/index.js"
	import publics from "@/common/utils/public.js"
	export default{
		props:{
			list: {
				type: Array,
				default: []
			}
		},
		filters:{
			distance(distance){
				return distanceTransform(distance)
			}
		},
		methods:{
			filterImg(img){
				return publics.filterImgUrl(img, 3)
			},
			goStore(item){
				this.$navigateTo("store?id="+item.id)
			},
			jumpGoodsDetail(row){
				console.log(row)
			}
		}
	}
</script>

<style scoped lang="scss">
	.shopItem{
		margin-top: 10rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		.img{
			width: 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
			display: block;
		}
		.tips{
			color: white;
			font-size: 24rpx;
			border-radius: 30rpx;
			padding: 0 10rpx;
			font-weight: normal;
			margin-left: 10rpx;
			transform: scale(0.9);
			display: inline-block;
		}
		.btn{
			border: 2rpx solid #381895;
			border-radius: 30rpx;
			padding: 0 20rpx;
			margin-left: 20rpx;
		}
		.b-b{
			margin-top: 30rpx;
			border-top: 2rpx solid #f8f6f9;
		}
		.imgs{
			width: 32%;
			margin-top: 30rpx;
			margin-right: 1.5%;
			border-radius: 20rpx;
			overflow: hidden;
			background-color: #fcfcfc;
			display: flex;
			flex-direction: column;
			font-size: 28rpx;
			.pic{
				width: 100%;
				height: 180rpx;
				display: block;
				border-radius: 20rpx 20rpx 0 0;
			}
			.name{
				margin: 6rpx 10rpx;
			}
			.price{
				margin: 0 10rpx 10rpx;
			}
		}
		.imgs:last-child{
			margin-left: 0;
		}
	}
</style>
