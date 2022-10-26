<template>
	<view class="main" v-if="isDone">
		<view v-if="list.length === 0" class="empty">
			<image src="/static/user/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">
				空空如也
				<navigator class="navigator" url="../home/index" open-type="switchTab">随便逛逛></navigator>
			</view>
		</view>
		<view class="list bg-w" v-for="(item, i) in list" :key="i">
			<view class="title flex flex-between">
				<view @tap.stop="selectStore(i)">
					<text class="iconfont color-b9 icon" v-if="!item.select">&#xe662;</text>
					<text class="iconfont color-purple icon" v-else>&#xe661;</text>
				</view>
				<view class="flex flex-align-center flex-grow">
					<image :src="item.storeInfo.logoImage" mode="" class="logo"></image>
					<text class="font34 color-b3">{{item.storeInfo.name}}</text>
					<text class="iconfont font38 color-b9" style="margin-top: 6rpx;">&#xe770;</text>
				</view>
				<!-- <view class="iconfont color-b9 font44">&#xe65b;</view> -->
			</view>
			<view class="list-item flex flex-align-center" v-for="(goods, index) in item.shoppingCartByGoodsList">
				<view @tap.stop="selectGoods(index, i)">
					<text class="iconfont color-b9 icon" v-if="!goods.select">&#xe662;</text>
					<text class="iconfont color-purple icon" v-else>&#xe661;</text>
				</view>
				<view class="flex flex-grow" style="width: 100%;">
					<view @tap="goDetails(goods)"><image :src="goods.goodsSku.mainImage || goods.goodsInfo.mainImage" mode="" class="img"></image></view>
					<view style="width: 100%;">
						<!-- <view class="flex line" @tap="goDetails(goods)">
							<text class="tips bg-base" v-if="goods.productSn === 'jp'">精品</text>
							<text class="tips bg-base" v-else-if="goods.productSn === 'dk'">订货</text>
							<text class="tips bg-base" 
								v-else-if="
									goods.productSn === 'new_gif_bag_product'||
									goods.productSn === 'new_gif_bag_vip'||
									goods.productSn === 'new_gif_bag_zhongji'||
									goods.productSn === 'new_gif_bag_putong'">礼包</text>
							<text class="tips bg-base" v-else-if="goods.productSn === 'all_wine_gold_coin_product'">积分兑</text>
							<text class="tips bg-base" v-else-if="goods.productSn === 'all_limited_time_product'">积分100%</text>
							<text class="tips" v-else-if="goods.productSn === 'all_limited_time_product'">(失效)</text>
							<text class="font34">{{goods.productName}}</text>
						</view> -->
						<text class="font32 line" @tap="goDetails(goods)">{{goods.goodsInfo.titleName}}</text>
						<text class="sku">{{goods.goodsSku.skuName | filterSkuName}}</text>
						<view class="flex flex-between" v-if="goods.status === 1">
							<text class="color-purple font38 blod">¥{{goods.goodsSku.skuPrice}}</text>
							<uni-number-box :min="1" :value="goods.goodsNumber" :max="goods.goodsSku.skuStock" @change="bindChange($event, index, i)"></uni-number-box>
						</view>
						<text class="color-b9 font26" style="display: block;" v-else>该商品已失效</text>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed bg-w flex flex-between">
			<view class="flex flex-align-center" @tap="selectAll">
				<text class="iconfont color-purple font38" v-if="isAll">&#xe661;</text>
				<text class="iconfont color-b9 font38" v-else>&#xe662;</text>
				<text class="font30 color-b6" style="margin-left: 20rpx;">全选</text>
			</view>
			<view class="flex flex-align-center" v-if="!isEdit">
				<view class="flex flex-column flex-align-end">
					<text class="font34">合计：<text class="color-purple">{{total}}元</text></text>
					<!-- <text class="color-b9 font26">已优惠{{promoteAmount}}元</text> -->
				</view>
				<button type="primary" class="bg-base btn" @click="createOrder"><text class="font34">结算</text></button>
			</view>
			<view class="flex flex-align-center del" v-else @tap="onDel">
				<text class="color-red font34">删除</text>
				<text class="color-red iconfont font44">&#xe65b;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import { sendRequestJson } from "@/common/http/api.js"
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default{
		components: { uniNumberBox },
		data(){
			return {
				isDone: false,
				list: [],
				isAll: false,
				promoteAmount: 0,
				total: 0,
				isEdit: false,
				initialize: true
			}
		},
		filters:{
			filterSkuName(name){
				if (name.length > 13) {
					name = name.substring(0,30)
				}
				return name
			}
		},
		onShow() {
			this.loadData()
		},
		onPullDownRefresh() {
			this.list = []
			this.loadData();
		},
		onNavigationBarButtonTap(e){
			this.isEdit = !this.isEdit
			// #ifdef APP-PLUS
			let currentWebview = this.$mp.page.$getAppWebview();
			let tn = currentWebview.getStyle().titleNView;
			if (this.isEdit) {
				tn.buttons[0].text = '完成';
				currentWebview.setStyle({
					titleNView: tn
				});
			} else {
				tn.buttons[0].text = '管理';
				currentWebview.setStyle({
					titleNView: tn
				});
			}
			// #endif
		},
		methods:{
			loadData() {
				this.$http('GET', url.goods.cartList, {pageNum: this.list.length}).then(res =>{
					uni.stopPullDownRefresh();
					this.list = this.list.concat(res.data)
					this.isDone = true
					this.initialize = false
				})
			},
			createOrder(){
				if (this.list.length === 0) return this.$msg("您的购物车空空如也，快去选购吧～")
				let commitOrderList = []
				let failStatus = false
				this.list.forEach(v =>{
					if (v.select) {
						v.shoppingCartByGoodsList.forEach(k=>{
							if (k.status === 2) {
								failStatus = true
							}
							if (k.select) {
								let obj = {
									cartGoodsId: k.id,
									goodsId: k.goodsId,
									number: k.goodsNumber,
									skuId: k.goodsSkuId
								}
								commitOrderList.push(obj)
							}
						})
					}
				})
				
				if (failStatus) return this.$msg("结算中存在失效商品,请删除该商品后重新结算")
				console.log("...........commitOrderList......", commitOrderList)
				sendRequestJson("POST", url.order.getOrderInfo, commitOrderList).then(res=>{
					uni.setStorageSync("commitOrderData", res.data)
					this.$navigateTo("/pages/order/createOrder")
				})
				
			},
			onDel(){
				let _this = this
				let delList = []
				this.list.forEach((v, i) =>{
					v.shoppingCartByGoodsList.forEach((item, index) => {
						if (item.select) {
							delList.push({
								parentId: v.id,
								childId: item.id
							})
						}
					})
				})
				if(delList.length === 0) return this.$msg("请选择要删除的商品")
				this.$showModal("确定将所选商品移出购物车吗", null, res=>{
					if (res.confirm){
						let ids = delList.map(v=>{return v.childId})
						sendRequestJson("POST", url.goods.deleteCart, ids).then(res =>{
							delList.map(k =>{
								this.list.map((v, i) => {
									if (k.parentId === v.id) {
										if (v.shoppingCartByGoodsList.length === 1) {
											this.list.splice(i, 1)
										} else {
											v.shoppingCartByGoodsList.forEach((item, index) =>{
												if (k.childId === item.id) {
													v.shoppingCartByGoodsList.splice(index, 1)
													return
												}
											})
										}
									}
								})
							})
							this.calcTotal()
						})
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.list;
				let total = 0;
				list.forEach(v =>{
					v.shoppingCartByGoodsList.forEach(item => {
						if (item.select === true && item.status === 1) {
							total += item.goodsSku.skuPrice * item.goodsNumber;
						}
					})
				})
				total = total - this.promoteAmount;
				this.total = Number(total.toFixed(2));
			},
			// 选择/取消 店铺下的商品
			selectStore(i){
				this.list[i].select = !this.list[i].select
				this.list[i].shoppingCartByGoodsList.map(v =>{
					v.select = this.list[i].select
				})
				this.calcTotal()
			},
			// 选择/取消 当前商品
			selectGoods(i, parenIndex){
				this.list[parenIndex].shoppingCartByGoodsList[i].select = !this.list[parenIndex].shoppingCartByGoodsList[i].select
				let num = 0
				let shoppingCartByGoodsList = this.list[parenIndex].shoppingCartByGoodsList
				shoppingCartByGoodsList.map(v =>{
					if (v.select) num++
				})
				if (num === this.list[parenIndex].shoppingCartByGoodsList.length) {
					this.list[parenIndex].select = true
				} else {
					this.list[parenIndex].select = false
				}
				this.$forceUpdate()
				this.calcTotal()
			},
			selectAll(){
				this.isAll = !this.isAll
				this.list.map(v =>{
					v.select = this.isAll
					v.shoppingCartByGoodsList.map(k=>{
						k.select = this.isAll
					})
				})
				this.calcTotal()
			},
			bindChange(e, i, parentIndex){
				if (this.initialize) return
				let oldNumber = this.list[parentIndex].shoppingCartByGoodsList[i].goodsNumber
				this.list[parentIndex].shoppingCartByGoodsList[i].goodsNumber = e
				let params = {
					cartStoreId: this.list[parentIndex].id,
					cartGoodsId: this.list[parentIndex].shoppingCartByGoodsList[i].id,
					number: e
				}
				this.$http("POST", url.goods.updateQuantity, params).catch(()=>{
					this.list[parentIndex].shoppingCartByGoodsList[i].goodsNumber = oldNumber
				})
			},
			goDetails(item){
				this.$navigateTo("/pages/home/details?id="+item.goodsId)
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		background-color: #f3f4f5;
		min-height: 94vh;
		.empty{
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			height: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;
			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}
			.empty-tips{
				display: flex;
				font-size: 26rpx;
				color: #C0C4CC;
				.navigator{
					margin-left: 16rpx;
					color: #381895;
				}
			}
		}
		.list{
			border-radius: 20rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			.icon{
				margin-right: 20rpx;
				font-size: 38rpx;
			}
			.title{
				margin-bottom: 30rpx;
				.logo{
					width: 40rpx;
					height: 40rpx;
					border-radius: 10rpx;
					margin-right: 10rpx;
				}
			}
			&-item{
				margin-bottom: 30rpx;
				.img{
					width: 160rpx;
					height: 160rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}
				.tips{
					color: white;
					padding: 0rpx 10rpx;
					border-radius: 6rpx;
					font-size: 26rpx;
					margin-right: 10rpx;
					display: inline-block;
				}
				.sku{
					background-color: #F8F8F8;
					color: #bcbbbd;
					font-size: 26rpx;
					padding: 10rpx;
					margin: 10rpx 0;
					border-radius: 8rpx;
					display: inline-flex;
				}
			}
		}
		.fixed{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 0 20rpx;
			height: 110rpx;
			.btn{
				width: 240rpx;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 50rpx;
				margin-left: 20rpx;
			}
			.del{
				margin-right: 30rpx;
			}
		}
	}
	
</style>
