<template>
	<view>
		<v-tabs 
			v-model="current" 
			:scroll="false" 
			:fixed="true" 
			field="name" 
			lineColor="#381895" 
			color="#999" 
			activeColor="#333"
			height="90rpx"
			:tabs="tabs" 
			@change="onClickItem">
		</v-tabs>
		<view v-for="(order, index) in list" :key="index" class="center-order" style="margin-bottom: 40upx;">
			<view class="order-list flex">
				<view class="order-left">
					<text class="order-time" v-if="order.flowingType === 1" style="color: #df0d0d;">¥ -{{order.amount}}</text>
					<text class="order-time" v-else style="color: #17ca03;">¥ +{{order.amount}}</text>
				</view>
				<view class="order-right">
					<text class="order-price" v-if="order.flowingType === 1">支出</text>
					<text class="order-price" v-else>收入</text>
				</view>
			</view>
			<view class="order-store">
				<view class="flex flex-between store-left">
					<text class="store-name">单号: {{order.orderNumber}}</text>
					<text class="font28 color-purple" @click="$onCopy(order.orderNumber)">复制</text>
				</view>
				<view class="store-address1">
					类型: {{filterOperation(order.operationType)}}
				</view>
				<view class="store-address1">
					钱包: {{order.walletType | filterWallet}}
				</view>
				<view class="store-address1">
					余额: {{order.beforeOperationAmount}}
				</view>
				<view class="store-address1">
					详情: {{order.details ? order.details:'无'}}
				</view>
				<view class="store-address1" style="padding: 20upx 0 20upx 0;text-align: right; margin-right: 30rpx;">
					{{order.createTime}}
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="flex flex-center more" @click="openMore">
			<text class="iconfont font40">&#xe60b;</text>
		</view>
		<!-- #endif -->
		
		<!-- 左侧菜单 -->
		<uni-drawer ref="drawer" mode="right" :width="320">
		    <scroll-view scroll-y :style="{height: swiperHeight+'px'}">
		       <view class="drawer">
				   <view class="title">操作类型(可多选)</view>
				   <view class="grid">
					   <block v-for="(item, i) in operationList" :key="i">
						   <view class="grid-item" :class="{'active':item.select}" v-if="item.isShow" @click="tabsSelect('operation', i)">
								<text>{{item.name}}</text>
						   </view>
					   </block>
				   </view>
				   <view class="title">钱包类型(单选)</view>
				   <view class="grid">
						<view class="grid-item" :class="{'active':walletIndex === i}" v-for="(item, i) in walletList" :key="i" @click="tabsSelect('wallet', i)">
						    <text>{{item.name}}</text>
						</view>
				   </view>
				   <view class="flex flex-between btns">
					   <view class="btn" @click="onCancel">取消</view>
					   <view class="btn right" @click="onSave">确定</view>
				   </view>
			   </view>
		    </scroll-view>
		</uni-drawer>
		
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import youScroll from '@/components/you-scroll'
	import url from "@/common/http/url.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	export default{
		components: { vTabs, uniLoadMore, uniDrawer, youScroll },
		data(){
			return {
				swiperHeight: 0,
				userType: 1, // 1=用户，2=配送员，3=商家
				current: 0,
				tabs: [
					{name: "全部", value: -1, pageSize: 1, loading: "loading", orderList: []},
					{name: "支出", value: 1, pageSize: 1, loading: "loading", orderList: []},
					{name: "收入", value: 2, pageSize: 1, loading: "loading", orderList: []}
				],
				list: [],
				pageSize: 1,
				loading: "loading",
				walletList: [
					{name: "全部", value: -1},
					...selectOptions.walletType
				],
				walletIndex: 0,
				operationList: [
					{name: "全部", value: "", isShow: true, select: true},
					{name: "支付商品抵扣积分", value: 1, isShow: true},
					{name: "支付商品", value: 2, isShow: true},
					{name: "商品退款", value: 3, isShow: true},
					{name: "积分充值话费", value: 11, isShow: true},
					{name: "积分充值油卡", value: 12, isShow: true},
					{name: "积分还信用卡", value: 13, isShow: true},
					{name: "消费卡奖励", value: 21, isShow: true},
					{name: "红包福利", value: 41, isShow: true},
					{name: "提现", value: 51, isShow: true},
					{name: "积分奖励", value: 70, isShow: true},
					{name: "一代奖励", value: 71, isShow: true},
					{name: "二代奖励", value: 72, isShow: true},
					{name: "配送员收入", value: 86, isShow: true},
					{name: "商家收入", value: 87, isShow: true},
					{name: "平台佣金", value: 89, isShow: true},
					{name: "未分配奖励收入", value: 90, isShow: true},
					{name: "平台操作", value: 99, isShow: true},
					{name: "配送员交纳押金", value: 200, isShow: true},
					{name: "扫码付款", value: 400, isShow: true},
					{name: "店铺收款", value: 401, isShow: true}
				]
			}
		},
		filters:{
			filterWallet(val){
				let walletType = selectOptions.walletType
				let value = "其他"
				walletType.forEach((v) =>{
					if (v.value === val) {
						value = v.name
						return value
					}
				})
				return value
			},
		},
		onNavigationBarButtonTap(){
			this.openMore()
		},
		onReachBottom() {
			this.loadData(false);
		},
		onPullDownRefresh() {
			this.loadData(true);
		},
		onLoad(opt) {
			if (opt.type){
				this.userType = parseInt(opt.type)
			}
			this.swiperHeight = uni.getSystemInfoSync().windowHeight
			//获取订单信息
			this.loadData(false);
		},
		methods:{
			async loadData(type){
				if (type) {
					this.pageSize = 1
					this.list = []
				} else {
					if (this.loading === "nomore") return
				}
				this.loading = "loading"
				let operationTypes = []
				this.operationList.map(v=>{
					if (v.select) {
						operationTypes.push(v.value)
					}
				})
				let params = {
					pageSize: this.pageSize,
					flowingType: this.tabs[this.current].value,
					walletType: this.walletList[this.walletIndex].value,
					operationTypes: operationTypes.join(","),
					userType: this.userType
				}
				let res = await this.$http("GET", url.user.walletFlowing, params)
				this.list = this.list.concat(res.data.records)
				if (this.list.length < res.data.total) {
					this.pageSize++
					this.loading = "more"
				} else {
					this.loading = "nomore"
				}
				uni.stopPullDownRefresh()
			},
			filterOperation(val){
				let value = "其他"
				this.operationList.forEach((v) => {
					if (v.value === val) {
						value = v.name
						return value
					}
				})
				return value
			},
			onClickItem(val) {
				this.current = val;
				this.loadData(true);
			},
			scollSwiper(e) {
				this.current = e.target.current;
				this.loadData(true);
			},
			tabsSelect(name,i){
				if (name === "operation"){
					if (i === 0) {
						this[name+"List"].map(v =>{
							v.select = false
						})
						this[name+"List"][i].select = true
					} else {
						this[name+"List"][0].select = false
						this[name+"List"][i].select = !this[name+"List"][i].select
					}
				} else {
					this[name+"Index"] = i
					this[name+"List"].map(v =>{
						v.select = false
					})
					this[name+"List"][i].select = true
				}
				this.$forceUpdate()
			},
			onReset(){
				this.walletIndex = 0
				this.operationList.map((v, i)=>{
					v.select = i === 0 ? true : false
				})
			},
			onCancel(){
				this.$refs.drawer.close()
			},
			onSave(){
				this.onCancel()
				this.loadData(true)
			},
			openMore(){
				this.$refs.drawer.open()
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	.center-order {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 10rpx 10rpx 0 0;
	}

	.order-list {
		margin: 10rpx 30rpx 0 30rpx;
		border-bottom: 1rpx dashed #e1e1f5;
		height: 80upx;
	}

	.order-left {
		height: 80upx;
		line-height: 80rpx;
		width: 50%;
	}

	.order-right {
		height: 80rpx;
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.order-price {
		color: #444;
		font-size: 38rpx;
		font-weight: 200;
	}
	.store-left {
		margin: 10rpx 30rpx 0;
	}
	.store-name {
		font-weight: 600;
		font-size: 28rpx;
	}
	.store-address1 {
		color: #999;
		margin-left: 30rpx;
		font-size: 28rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 10;
		overflow: hidden;
		padding-top: 10rpx;
	}
	
	.more{
		background-color: white;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.1);
		position: fixed;
		right: 20rpx;
		bottom: 20rpx;
	}
	
	.drawer{
		// height: 100%;
		padding: 0 30rpx;
		.title{
			font-size: 32rpx;
			margin-top: 50rpx;
			margin-bottom: 20rpx;
		}
		.grid{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 30rpx;
			&-item{
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 240rpx;
				height: 70rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				background-color: #f3f4f3;
				color: #87878b;
			}
			.active{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
		.btns{
			margin-top: 80rpx;
			padding-bottom: 40rpx;
			.btn{
				width: 45%;
				background-color: #f3f4f3;
				color: #87878b;
				font-size: 32rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
			.right{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
	}
</style>

