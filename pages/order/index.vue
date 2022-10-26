<template>
	<view>
		<v-tabs 
			v-if="isDone"
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:fixed="true" 
			:scroll="true"
			@change="changeTab">
		</v-tabs>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i" @tap="goDetails(item)">
				<view class="flex flex-between store">
					<view class="flex flex-align-center">
						<image :src="filterImg(item.storeInfo.logoImage)" mode="" class="logo"></image>
						<text class="font34 color-b3">{{item.storeInfo.name}}</text>
						<text class="iconfont color-b9 font36">&#xe770;</text>
					</view>
					<text class="color-purple font28" v-if="item.status === 1">待付款</text>
					<text class="color-purple font28" v-if="item.status === 2">未支付完成</text>
					<text class="color-purple font28" v-if="item.status === 3">{{deliveryStatus(item)}}</text>
					<text class="color-purple font28" v-if="item.status === 4">待评价</text>
					<text class="color-b9 font28" v-if="item.status === 5">已完成</text>
					<text class="color-b9 font28" v-if="item.status === 10">已退款</text>
					<text class="color-b9 font28" v-if="item.status === 11">已关闭</text>
				</view>
				<view class="goods flex">
					<view class="goods-img">
						<image :src="filterImg(item.skuImage || item.goodsImage)" mode="" class="img"></image>
						<text class="tips">{{item.orderType | filterType}}</text>
					</view>
					<view class="flex flex-column" style="width: 100%;">
						<text class="line font28 color-b3">{{item.goodsName}}</text>
						<text class="spec">{{item.skuName}}</text>
						<view class="flex flex-between" style="width: 100%;">
							<view class="flex">
								<text class="color-red font30">¥{{item.unitPrice}}</text>
								<text class="color-red font30" v-if="item.payIntegralAmount">，积分{{item.payIntegralAmount}}</text>
							</view>
							<text class="color-b9 font26">x{{item.number}}</text>
						</view>
					</view>
				</view>
				<view class="flex flex-align-end flex-space-end total font30">
					<text class="color-b9 font28">总价¥{{item.totalPrice}}，</text>
					<text class="color-b9" v-if="item.couponStatus === 2">优惠¥{{item.couponAmount}}，</text>
					<text class="color-b3">实付款¥{{item.payRmbAmount}}<text v-if="item.payIntegralAmount">，积分{{item.payIntegralAmount}}</text> </text>
				</view>
				<view class="btns">
					<text class="btn base" v-if="item.status === 1 || item.status === 2" @tap.stop="payOrder(item)">立即支付</text>
					<text class="btn base" v-if="item.status === 4" @tap.stop="toEvaluate(item.id)">立即评价</text>
					<text class="btn base" v-if="item.status === 3 && judgeReceiv(item)" @tap.stop="confimDelivery(item.id, 'getStatusNum')">确认收货</text>
					<block v-if="item.orderType !== 3 && item.status === 3 && judgeRefund(item)">
						<text class="btn base" @tap.stop="onRefund(item)">申请退款</text>
					</block>
					<text class="btn base" v-if="item.status === 1 || item.status === 5 || item.status === 10 || item.status === 11" @tap.stop="delOrder(item.id, false)">删除订单</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import mix from "./mix.js"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	
	export default{
		components: { vTabs, uniLoadMore },
		mixins: [mix],
		data(){
			return {
				isDone: false,
				loadingType: "loading",
				current: 0,
				tabs: [
					{name: "全部", status: 1},
					{name: "待付款", status: 2},
					{name: "待收货", status: 3},
					{name: "待评价", status: 4},
					{name: "已完成", status: 5},
					{name: "退款", status: 6}
				],
				list: [],
			}
		},
		filters: {
			filterType(val){
				switch(val){
					case 1:
						return "普通";
					case 2:
						return "精品";
					case 3:
						return "进货";
					case 11: 
						return "新人";
					case 12:
						return "秒杀";
					case 13:
						return "特价";
					case 14:
						return "拼团";
					case 15:
						return "积分";
					default:
						return "其他";
				}
			}
		},
		onPullDownRefresh() {
			this.getStatusNum()
		},
		onReachBottom(){
			this.loadData();
		},
		onLoad(option) {
			let status = option.status || 1
			if (option.status) {
				this.tabs.map((v, i) =>{
					if (parseInt(option.status) === v.status) {
						this.current = i
					}
				})
			}
		},
		onShow() {
			this.getStatusNum()
		},
		methods:{
			loadData(){
				this.loadingType = "loading"
				let params = {
					pageNum: this.list.length,
					type: this.tabs[this.current].status
				}
				this.$http("GET", url.order.orderList, params).then(res =>{
					this.list = this.list.concat(res.data)
					this.loadingType = res.data < 12 ? 'nomore' : 'more';
					uni.stopPullDownRefresh();
				})
			},
			getStatusNum(){
				this.$http("GET", url.order.getOrderAmount).then(res =>{
					if (res.data.whole) {
						this.tabs[0].name = `全部(${res.data.whole})`
					}
					if (res.data.unpaid){
						this.tabs[1].name = `待付款(${res.data.unpaid})`
					}
					if (res.data.ongoing){
						this.tabs[2].name = `待收货(${res.data.ongoing})`
					}
					if (res.data.evaluated){
						this.tabs[3].name = `待评价(${res.data.evaluated})`
					}
					if (res.data.completed){
						this.tabs[4].name = `已完成(${res.data.completed})`
					}
					if (res.data.refund){
						this.tabs[5].name = `退款/售后(${res.data.refund})`
					}
					this.isDone = true
					this.list = []
					this.loadData();
				})
			},
			// 取消订单
			cancelOrder(){
				let _this = this;
				this.$showModal("是否确定取消该笔订单？", null, res=>{
					if (res.confirm) {
						_this.$http("POST", url.order.closeOrder, {orderId: item.id}).then(res =>{
							_this.$msg(res.data)
							_this.list = []
							_this.loadData()
						})
					}
				})
			},
			// 订单详情
			goDetails(item){
				this.$navigateTo('details?id=' + item.id)
			},
			changeTab(i) {
				this.current = i
				this.list = []
				this.loadData()
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		margin: 20rpx;
		&-item{
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: white;
			.store{
				.logo{
					width: 50rpx;
					height: 50rpx;
					display: block;
					margin-right: 20rpx;
					border-radius: 8rpx;
				}
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
			.btns{
				display: flex;
				justify-content: flex-end;
				.btn{
					margin-left: 10rpx;
					width: 160rpx;
					height: 60rpx;
					text-align: center;
					line-height: 60rpx;
					display: inline-block;
					border-radius: 50rpx;
					color: #666666;
					border: 2rpx solid #e9eae9;
					font-size: 26rpx;
				}
				.base{
					color: #381895;
					border: 2rpx solid #381895;
				}
			}
		}
	}
</style>
