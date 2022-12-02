<template>
	<view>
		<v-tabs 
			v-if="showTabs"
			:tabs="tabs" 
			:value="current" 
			:scroll="tabsScroll" 
			:fixed="true" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			@change="tabsChange">
		</v-tabs>
		<view class="list">
			<view class="list-item bg-w" v-for="(item, i) in list" :key="i" @tap="goDetails(item)">
				<view class="flex flex-between font30 color-b6 title">
					<text>{{item.createTime}}</text>
					<view class="flex flex-align-center">
						<text class="color-purple font28" v-if="item.status === 1">待付款</text>
						<text class="color-purple font28" v-if="item.status === 2">未支付完成</text>
						<text class="color-purple font28" v-if="item.status === 3">{{deliveryStatus(item)}}</text>
						<text class="color-purple font28" v-if="item.status === 4">待评价</text>
						<text class="color-b9 font28" v-if="item.status === 5">已完成</text>
						<text class="color-b9 font28" v-if="item.status === 10">已退款</text>
						<text class="color-b9 font28" v-if="item.status === 11">已关闭</text>
						<text class="color-purple font28" v-if="item.orderType === 14">
							-{{item.groupStatus === 2 ? '拼团中' :'拼团成功'}}{{item.groupTrueNumber}}/{{item.groupNumber}}
						</text>
					</view>
				</view>
				<view class="flex">
					<view><image :src="filterImg(item.skuImage || item.goodsImage)" mode="aspectFit" class="img"></image></view>
					<view class="flex flex-column flex-grow">
						<text class="color-b3 line line-2 font32">{{item.goodsName}}</text>
						<text class="color-b9 line line-2 font26">{{item.skuName}}</text>
					</view>
					<view class="flex flex-column flex-align-end">
						<text class="color-b3 font32">¥{{item.unitPrice}}</text>
						<text class="color-b9 font26">x{{item.number}}</text>
					</view>
				</view>
				<text class="font28 color-b6">订单号：{{item.orderNumber}}</text>
				<!-- <view class="flex flex-space-end">
					<text class="color-b9 font28">共{{item.orderItemList.length}}件商品 实付款¥{{item.totalAmount}}</text>
				</view> -->
				
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import mix from "../../order/mix.js"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	
	let filterTabName = (name, total) => {
		let s = ""
		if (name.indexOf("(") > -1){
			s = name.split("(")[0]
		} else {
			s = name
		}
		if (!total) {
			return s
		} else {
			return `${s}(${total})`
		}
	}
	
	let options = null
	export default{
		mixins: [mix],
		components: { vTabs, uniLoadMore },
		data(){
			return {
				showTabs: false,
				tabs: selectOptions.merchantsOrderList,
				tabsScroll: true,
				current: 0,
				deliveryMethod: "",
				dStatus: "",
				loadingType: "loading",
				list: [],
				pageSize: 1
			}
		},
		onPullDownRefresh() {
			this.getList('refresh')
			this.getOrderTotal(this.deliveryMethod)
		},
		onReachBottom() {
			this.getList('add')
		},
		onLoad(opt) {
			options = JSON.parse(JSON.stringify(selectOptions))
			this.tabs = options.merchantsOrderList
			
			if (opt.deliveryStatus){
				this.dStatus = opt.deliveryStatus
			}
			if (opt.deliveryMethod){
				this.tabsScroll = false
				this.deliveryMethod = parseInt(opt.deliveryMethod)
				let title = ""
				if (this.deliveryMethod === 1) {
					title = "物流配送订单"
					this.tabs = options.logisticsList
				} else if (this.deliveryMethod === 2){
					title = "商家配送订单"
					this.tabs = options.businessList
				} else if (this.deliveryMethod === 3){
					title = "用户自提订单"
					this.tabs = options.extractionList
				} else if (this.deliveryMethod === 4){
					title = "平台配送订单"
					this.tabs = options.platformList
				} else if (this.deliveryMethod === 6) {
					title = "拼团订单"
					this.tabs = options.collateList
				}
				uni.setNavigationBarTitle({
					title: title
				})
			}
			if (opt.status || opt.deliveryStatus){
				let status = opt.status || opt.deliveryStatus
				this.tabs.forEach((v, i) => {
					if (v.value === parseInt(status)) {
						this.current = i
						return false
					}
				})
			}
			this.getList()
			this.getOrderTotal(this.deliveryMethod)
		},
		methods:{
			getOrderTotal(type){
				this.$http("GET", url.store.getOrderAmount).then(res =>{
					uni.stopPullDownRefresh()
					let data = res.data
					if (type === 1) {// 物流
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.logisticsToBeDelivered)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.logisticsDelivered)
						this.tabs[2].name = filterTabName(this.tabs[2].name, data.logisticsConfirmed)
					} else if (type === 2) {// 商家
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.businessToBeDelivered)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.businessDelivery)
						this.tabs[2].name = filterTabName(this.tabs[2].name, data.businessDelivered)
					} else if (type === 3) { // 自提
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.raisingToBePickedUp)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.raisingPickedUp)
					} else if (type === 4) {// 平台
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.platformWaitingForDelivery)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.platformPickingUp)
						this.tabs[2].name = filterTabName(this.tabs[2].name, data.platformPickedUp)
						this.tabs[3].name = filterTabName(this.tabs[3].name, data.platformDelivered)
					} else if (type === 6) { //拼团
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.inAGroupOrder)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.successAGroupOrder)
					} else { // 订单
						this.tabs[0].name = filterTabName(this.tabs[0].name, data.waitingForPayment)
						this.tabs[1].name = filterTabName(this.tabs[1].name, data.toBeEvaluated)
						this.tabs[2].name = filterTabName(this.tabs[2].name, data.completed)
						this.tabs[3].name = filterTabName(this.tabs[3].name, data.refunded)
						this.tabs[4].name = filterTabName(this.tabs[4].name, data.overtimeClosing)
					}
					if (this.deliveryMethod === 5) {
						this.showTabs = false
						uni.setNavigationBarTitle({
							title: data.noDeliveryRequired ? `无需配送订单(${data.noDeliveryRequired})` : "无需配送订单"
						})
					} else {
						this.showTabs = true
					}
				})
			},
			getList(type){
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
					this.pageSize = 1
					this.list = []
				}
				let params = {
					pageSize: this.pageSize,
					deliveryMethod: this.deliveryMethod
				}
				if (this.deliveryMethod === 6){ // 拼团
					params.groupOrderStatus = this.tabs[this.current].value
				} else {
					// params.deliveryMethod = this.deliveryMethod
					if (this.dStatus){
						params.deliveryStatus = this.tabs[this.current].value
					} else {
						params.status = this.tabs[this.current].value
					}	
				}
				this.$http("GET", url.store.getOrderList, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loadingType = "more"
					} else{
						this.loadingType = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			},
			tabsChange(val){
				this.current = val
				this.getList('refresh')
			},
			goDetails(row){
				this.$navigateTo("details?id="+row.id)
			},
			filterImg(img) {
				return publics.filterImgUrl(img, 3)
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
			.title{
				margin-bottom: 30rpx;
			}
			.img{
				width: 180rpx;
				height: 180rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}
			.bom{
				margin-top: 30rpx;
				.btn{
					font-size: 26rpx;
					border: 2rpx solid #aeadaf;
					padding: 10rpx 26rpx;
					border-radius: 50rpx;
					margin-left: 20rpx;
					color: #666;
				}
				.base{
					color: #381895;
					border: 2rpx solid #381895;
				}
			}
		}
	}
</style>
