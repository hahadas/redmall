<template>
	<view class="main">
		<HMfilterDropdown
			:filterData="filterData" 
			:defaultSelected ="defaultSelected" 
			@confirm="confirm">
		</HMfilterDropdown>
		<view style="height: 100rpx;"></view>
		<view class="flex flex-align-center search">
			<text class="iconfont icon">&#xe627;</text>
			<input type="text" v-model="keyName" @confirm="getList" confirm-type="done" placeholder="昵称/推荐码" class="flex-grow input" />
			<text class="iconfont del" v-if="keyName" @click="keyName=''">&#xe638;</text>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="flex">
					<view class="img-box">
						<image :src="item.headPortrait" mode="" class="avatar"></image>
						<text class="status" style="background-color: #0488a9;" v-if="item.distributorWorkStatus === 2">已开工</text>
						<text class="status" style="background-color: #ffa800;" v-else-if="item.distributorWorkStatus === 3">工作中</text>
						<text class="status" v-else>休息中</text>
					</view>
					<view class="flex-grow">
						<view class="flex flex-align-center">
							<view class="six" :class="{'woman':item.gender === 3}">
								<text class="iconfont icon" v-if="item.gender === 2">&#xe621;</text>
								<text class="iconfont icon" v-if="item.gender === 3">&#xe622;</text>
								<text>{{item.age}}</text>
							</view>
							<text class="line font32">{{item.nickname}}</text>
						</view>
						<text class="font30" style="margin: 6rpx 0;display: block;">Ta的酒量：{{item.alcoholConsumption}}</text>
						<view class="flex flex-between font28 color-b6">
							<text>评分：{{item.distributorScore}}</text>
							<text>接单：{{item.distributorTurnover}}</text>
							<text>距离：{{item.distance}}</text>
						</view>
					</view>
				</view>
				<view class="flex flex-center" style="margin-top: 20rpx;">
					<button type="primary" class="bg-base" size="mini" @click="onSelect(item)">为我配送</button>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import imMix from "./imMix.js"
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		mixins: [imMix],
		components:{
			HMfilterDropdown, uniLoadMore
		},
		data(){
			return {
				filterData: [
					{
						name: "状态", 
						type: "hierarchy",
						submenu: [
							{name: "全部", value: 0},
							{name: "休息中", value: 1},
							{name: "已开工", value: 2},
							{name: "工作中", value: 3}
						]
					},
					{
						name: "性别", 
						type: "hierarchy",
						submenu: [
							{name: "性别不限", value: 0},
							{name: "男", value: 2},
							{name: "女", value: 3}
						]
					},
					{
						name: "年龄", 
						type: "hierarchy",
						submenu: [
							{name: "年龄不限", value: 0},
							{name: "18-25", value: "18-25"},
							{name: "25-30", value: "25-30"},
							{name: "30以上", value: "30-999"}
							
						]
					},
				],
				defaultSelected: null,
				selectedValue: null,
				id: "",
				list: [],
				loading: "nomore",
				keyName: "",
				optData: {}
			}
		},
		onLoad(opt) {
			let data = uni.getStorageSync("agentData")
			if (data){
				this.optData = data
				this.id = data.orderId
				this.getList()
				uni.removeStorageSync("agentData")
			}
		},
		onPullDownRefresh() {
			this.list = []
			this.defaultSelected = null
			this.selectedValue = null
			this.keyName = ""
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				let params = {
					orderId: this.id,
					pageNum: this.list.length,
					status: this.selectedValue?(this.selectedValue[0][0]||0):0,
					gender: this.selectedValue?(this.selectedValue[1][0]||0):0,
					ageRange: this.selectedValue?(this.selectedValue[2][0]||0):0,
					wordKey: this.keyName
				}
				this.$http("GET", url.distributor.choiceDistributorList, params).then(res =>{
					this.list = this.list.concat(res.data)
					this.loading = res.data.length < 12 ? 'nomore' : 'more'
					uni.stopPullDownRefresh()
				})
			},
			onSelect(item){
				let _this = this
				this.sessionOperation(item.imAccount, 2)
				this.$showModal("是否选择该天使为我配送", "提示", res=>{
					if (res.confirm) {
						_this.$http("POST", url.distributor.choiceDistributor, {orderId: _this.id, distributorUserId: item.id}).then(res =>{
							_this.$msg(res.data)
							
							// #ifdef APP-PLUS
							// 发送一条消息，判断对方是否在线
							this.isOtherOnline(item.imAccount, "selectAgent")
							// 发送消息给对方，邀请对方接单
							let goodsInfo = {
								orderId: _this.id,
								goodsId: _this.optData.goodsId,
								goodsImage: _this.optData.goodsImage,
								goodsName: _this.optData.goodsName,
								skuName: _this.optData.skuName,
								price: _this.optData.price,
								number: _this.optData.number,
								status: 1 ,// 1-邀请对方接单，用户和天使都可操作取消 2-用户取消配送 3-天使取消接单 4-天使接单
								identity: item.imAccount, // 配送天使的imAccount
							}
							_this.sendMsgToOther(item.imAccount, goodsInfo, 6, 2, ()=>{
								_this.editDBData(goodsInfo.orderId, goodsInfo.status)
							})
							// #endif
							
							_this.$navigateBack()
						})
					}
				})
			},
			confirm(e){
				this.defaultSelected = e.index
				this.selectedValue = e.value
				this.list = []
				this.getList()
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		.search{
			width: 600rpx;
			background-color: #eff1f8;
			height: 80rpx;
			border-radius: 50rpx;
			padding: 0rpx 20rpx;
			margin-left: 55rpx;
			.icon{
				font-size: 48rpx;
				margin-right: 10rpx;
				color: #b2b6bb;
			}
			.del{
				margin-left: 10rpx;
				color: #999999;
			}
		}
		.list{
			background-color: white;
			padding: 0 30rpx;
			margin-top: 20rpx;
			&-item{
				margin-bottom: 20rpx;
				border-bottom: 2rpx solid #EEEEEE;
				padding: 20rpx 0;
				.img-box{
					width: 140rpx;
					height: 140rpx;
					margin-right: 10rpx;
					position: relative;
					border-radius: 10rpx;
					overflow: hidden;
					.avatar{
						width: 100%;
						height: 100%;
					}
					.status{
						position: absolute;
						right: 0;
						top: 0;
						color: #FFFFFF;
						background-color: #7c7d7e;
						font-size: 26rpx;
						padding: 4rpx 16rpx;
						border-radius: 26rpx 0rpx 0rpx 26rpx;
					}
				}
				
				.six{
					background-color: #1995fc;
					border-radius: 20rpx;
					padding: 0rpx 10rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					margin-right: 6rpx;
					color: white;
					.icon{
						margin-right: 6rpx;
						font-size: 24rpx;
					}
				}
				.woman{
					background-color: #ff4d94;
				}
				.btn{
					// border-radius: 50rpx;
					// border: 2rpx solid #381895;
					// color: #381895;
					// font-size: 24rpx;
					// padding: 4rpx 20rpx;
				}
			}
		}
	}
</style>
