<template>
	<view>
		<v-tabs
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:scroll="true"
			@change="changeTab">
		</v-tabs>
		<view class="list bg-w" v-for="(item, i) in list" :key="i">
			<view class="title flex flex-between">
				<text :class="[item.flowingType === 1 ? 'color-red' : 'color-purple']" class="blod font44">{{item.flowingType === 1 ? '-' : '+'}}{{item.amount}}</text>
				<text :class="[item.flowingType === 1 ? 'color-red' : 'color-purple']" class="blod font40">{{item.flowingType === 1 ? '支出' : '收入'}}</text>
			</view>
			<view class="flex flex-between">
				<text class="blod font32">单号：{{item.orderNumber}}</text>
				<text class="color-purple font32" @tap="$onCopy(item.orderNumber)">复制</text>
			</view>
			<text class="color-b6 font30 margin">操作类型：{{item.operationType | filterOperationType}}</text>
			<text class="color-b6 font30 margin">钱包类型：{{item.walletType | filterType}}</text>
			<text class="color-b6 font30 margin">详情：{{item.details}}</text>
			<view class="flex flex-space-end">
				<text class="color-b9 font30">{{item.createTime | filterTime}}</text>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
		<!-- 左侧菜单 -->
		<uni-drawer ref="drawer" mode="right" :width="260">
		    <scroll-view scroll-y :style="{height: scrollHeight+'px'}">
		       <view class="drawer">
				   <view class="title">商品状态</view>
				   <view class="grid">
						<view class="grid-item" :class="{'active':flowingTypeIndex === i}" v-for="(item, i) in flowingTypeList" :key="i" @click="tabsSelect(i)">
						    <text>{{item.name}}</text>
						</view>
				   </view>
				   <view class="flex flex-between btns">
					   <view class="btn" @click="onReset">重置</view>
					   <view class="btn right" @click="onSave">确定</view>
				   </view>
			   </view>
		    </scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import { timestampToTime } from "@/common/utils/index.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	export default{
		components: { vTabs, uniLoadMore, uniDrawer },
		data(){
			return {
				scrollHeight: 0,
				current: 0,
				tabs: selectOptions.depositOperationList,
				type: "",
				loading: "loading",
				consumerId: "",
				pageSize: 1,
				list: [],
				flowingTypeList: [
					{name: "全部", value: -1},
					{name: "支出", value: 1},
					{name: "收入", value: 2}
				],
				flowingTypeIndex: 0
			}
		},
		filters: {
			filterTime(val){
				return timestampToTime(val)
			},
			filterType(val){
				let depositWalletList = selectOptions.depositWalletList
				let value = "其他钱包"
				depositWalletList.forEach(v => {
					if (v.value === val) {
						value = v.name
						return false
					}
				})
				return value
			},
			filterOperationType(val){
				let value = "其他类型"
				let list = selectOptions.depositOperationList
				list.forEach(v=>{
					if (v.value === val) {
						value = v.name
						return false
					}
				})
				return value
			}
		},
		onLoad(opt){
			this.scrollHeight = uni.getSystemInfoSync().windowHeight
			if (opt.current) {
				this.current = parseInt(opt.current)
			}
			if (opt.id) {
				this.consumerId = opt.id
			}
			this.getList('add')
		},
		onPullDownRefresh() {
			this.pageSize = 1
			this.list = []
			this.current = 0
			this.flowingTypeIndex = 0
			this.getList('refresh')
		},
		onReachBottom() {
			this.getList('add')
		},
		onNavigationBarButtonTap(){
			this.$refs.drawer.open()
		},
		methods:{
			getList(type){
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.loading = 'more';
				}
				let params = {
					consumerId: this.consumerId,
					operationType: this.tabs[this.current].value,
					flowingType: this.flowingTypeList[this.flowingTypeIndex].value,
					pageSize: this.pageSize
				}
				this.$http("GET", url.deposit.getflowList, params).then(res =>{
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh();
				})
			},
			changeTab(index){
				this.current = index
				this.pageSize = 1
				this.list = []
				this.loading = "loading"
				this.getList("add")
			},
			tabsSelect(i){
				this.flowingTypeIndex = i
				this.flowingTypeList.map(v =>{
					v.select = false
				})
				this.flowingTypeList[this.flowingTypeIndex].select = true
				this.$forceUpdate()
			},
			onReset(){
				this.list = []
				this.pageSize = 1
				this.flowingTypeIndex = 0
				this.loading = "loading"
				this.getList("add")
			},
			onSave(){
				this.$refs.drawer.close()
				this.list = []
				this.pageSize = 1
				this.loading = "loading"
				this.getList("add")
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		.title{
			border-bottom: 2rpx solid #eeeeee;
			padding-bottom: 10rpx;
			margin-bottom: 10rpx;
		}
		.margin{
			margin: 10rpx 0;
			line-height: 50rpx;
			display: block;
		}
	}
	.drawer{
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
				width: 200rpx;
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
