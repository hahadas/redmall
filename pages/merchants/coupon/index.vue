<template>
	<view class="main">
		<empty v-if="list.length === 0" textTitle="优惠券空空如也～"></empty>
		<view class="list" v-for="(item, i) in list" :key="i" @tap="jumpTo(item)">
			<view class="left color-purple">
				<text class="font24 tip">¥</text>
				<text class="font46 blod">{{item.discountAmount}}</text>
			</view>
			<view class="right flex flex-column flex-grow">
				<text class="font28">{{item.titleName}}</text>
				<text class="color-purple font30">满{{item.useStandardAmount}}可用</text>
				<text class="font26 color-b9">{{item.expireTimeDay > 0 ? `有效期${item.expireTimeDay}天`:'永久有效'}}</text>
			</view>
			<text class="del color-red" @tap.stop="onDel(item, i)">删除</text>
		</view>
		<view style="height: 120rpx;"></view>
		<button class="add-btn bg-base" v-if="list.length < 10" @click="jumpTo(false)">添加优惠券</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import empty from "@/components/empty.vue"
	export default{
		components: { empty },
		data(){
			return {
				list: []
			}
		},
		onShow() {
			this.getList()
		},
		onPullDownRefresh() {
			this.getList()
		},
		methods:{
			getList(){
				this.$http("GET", url.store.getDiscountList).then(res =>{
					this.list = res.data
				})
			},
			onDel(item, index){
				let _this = this
				this.$showModal('是否删除该优惠券', '提示', res =>{
					if (res.confirm) {
						_this.$http("POST", url.store.delDiscount, {discountId: item.id}).then(res =>{
							this.list.splice(index, 1)
						})
					}
				})
				
			},
			jumpTo(item){
				let url = "edit"
				if (item){
					url = url+"?id="+item.id
				}
				this.$navigateTo(url)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.list{
			width: 650rpx;
			background-color: white;
			border-radius: 20rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			.left{
				display: flex;
				align-items: flex-end;
				margin-right: 20rpx;
				.tip{
					margin-bottom: 10rpx;
					margin-right: 6rpx;
					display: inline-block;
				}
			}
			.del{
				margin-right: 10rpx;
				font-size: 28rpx;
			}
		}
		.add-btn {
			position: fixed;
			left: 30upx;
			right: 30upx;
			bottom: 16upx;
			z-index: 95;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 690upx;
			height: 90upx;
			font-size: 32upx;
			color: #fff;
			border-radius: 50upx;
			box-shadow: 1px 2px 5px rgba(136, 62, 210, 0.4);
		}
	}
</style>
