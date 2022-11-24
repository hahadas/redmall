<template>
	<view class="main">
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="title flex flex-space-end">
					<text class="iconfont icon color-red" @click="onDel(i)">&#xe65b;</text>
				</view>
				<view class="flex">
					<view><image :src="item.mainImage" mode="" class="img"></image></view>
					<view>
						<text class="line font34">{{item.titleName}}</text>
						<text class="line font30 color-b9" v-if="item.goodsNumber">商品编号：{{item.goodsNumber}}</text>
						<text class="font30 color-red mar">¥{{item.wholesalePrice}}</text>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" class="bg-base btn" @click="onAdd" v-if="list.length < 3">添加</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return {
				list: []
			}
		},
		onLoad() {
			this.$http("GET", url.store.getStoreInfo).then(res => {
				this.list = res.data.cupboardGoodsList || []
			})
		},
		onShow() {
		},
		methods:{
			onAdd(){
				this.$navigateTo("goods/list?cupboard=true")
			},
			onDel(i){
				this.list.splice(i, 1)
				let ids = this.list.map(v =>{
					return v.id
				})
				this.$http("POST", url.store.updateCupboardIds, {cupboardIds: ids.join(",")})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 0 20rpx;
	}
	.btn{
		margin-top: 50rpx;
		border-radius: 50rpx;
	}
	.list{
		margin-top: 20rpx;
		&-item{
			margin-bottom: 20rpx;
			background-color: white;
			padding: 30rpx;
			border-radius: 16rpx;
			.title{
				border-bottom: 2rpx solid #EEEEEE;
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				.icon{
					font-size: 50rpx;
				}
			}
			.img{
				width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
			}
			.mar{
				margin: 8rpx 0;
				display: block;
			}
			
		}
	}
</style>
