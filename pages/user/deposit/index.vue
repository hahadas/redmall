<template>
	<view class="main">
		<!-- 轮播图 -->
		<uni-swiper-dot 
			class="swiper" 
			mode="dot" 
			:current="current" 
			:info="swiperList" 
			:dotsStyles="{
				width: 6,
				height: 6,
				bottom: 5,
				backgroundColor: '#8799a3',
				border: '#8799a3',
				selectedBackgroundColor: '#381895',
				selectedBorder: '#381895'
			}">
			<swiper :autoplay="true" class="swiper-wrap" @change="change">
				<swiper-item v-for="(item, i) in swiperList" :key="i">
					<view class="swiper-box">
						<image :src="item.pic" mode="" class="swiper-item" style="border-radius: 20rpx;"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<!-- 收益统计 -->
		<view class="grid">
			<view class="grid-item bor-right">
				<text class="font32">总资产</text>
				<text class="font30 color-b9">{{walletInfo.balance}}元</text>
			</view>
			<view class="grid-item">
				<text class="font32">累计销售提成</text>
				<text class="font30 color-b9">{{walletInfo.saleCumulativeEnter}}元</text>
			</view>
			<view class="grid-item">
				<text class="font32">累计收益</text>
				<text class="font30 color-b9">{{walletInfo.depositCumulativeEnter}}元</text>
			</view>
			<view class="grid-item bor-left" @click="jumpTo('depositDetail')">
				<text class="font32">累计总投入</text>
				<text class="font30 color-b9">{{walletInfo.balanceExpenditureDepositAmount}}元</text>
			</view>
			<view class="grid-item">
				<text class="font32">我的等级</text>
				<text class="font30 color-b9">Lv.{{info.level}}</text>
			</view>
			<view class="grid-item bor-left" @click="jumpTo('/pages/user/team?type=deposit')">
				<text class="font32">团队累计存托</text>
				<text class="font30 color-b9">{{info.totalTeamDeposit}}元</text>
			</view>
		</view>
		<!-- 公告 -->
		<view class="notice">
			<view class="title" @click="goNotice(false)">
				<text class="font32">公告</text>
				<view class="flex flex-align-center color-b9">
					<text class="font28">更多</text>
					<text class="iconfont">&#xe770;</text>
				</view>
			</view>
			<block v-for="(item, i) in noticeList" :key="i">
				<view class="con" v-if="i === 0" @click="goNotice(item)">
					<view><image :src="item.mainImage" mode="" class="img"></image></view>
					<view class="right">
						<text class="font28 color-b3 line line-2 flex-1">{{item.titleName}}</text>
						<text class="font26 color-b9">{{item.createTime}}</text>
					</view>
				</view>
			</block>
		</view>
		<!-- 存托计划 -->
		<view class="amount">
			<view class="amount-item">
				<text class="name">存托计划</text>
				<text class="value">{{depositPlanInfo.name}}</text>
			</view>
			<view class="amount-item">
				<text class="name">总量</text>
				<text class="value">{{depositPlanInfo.adminAmount | filterNumber}}</text>
			</view>
			<view class="amount-item bor-no">
				<text class="name">已完成</text>
				<view class="cell">
					<text class="cell-item">{{depositPlanInfo.completedAmount | filterNumber}}</text>
					<text class="cell-item bor-no">{{depositPlanInfo.completedPercentage}}%</text>
				</view>
			</view>
		</view>
		<!-- 资产 -->
		<view class="assets">
			<view class="title">资产</view>
			<view class="assets-cell" @tap="goDetail(0)">
				<view class="flex flex-between">
					<view class="flex flex-align-center">
						<view class="icon" style="background-color: #ff9912;">
							<text class="iconfont">&#xe626;</text>
						</view>
						<text class="font34">我的资产</text>
					</view>
					<text class="blod font28">{{walletInfo.balance}}</text>
				</view>
				<view class="flex flex-space-end btns">
					<button type="primary" size="mini" class="bg-base" @tap.stop="jumpTo('recharge')">充值</button>
					<button type="primary" size="mini" @tap.stop="jumpTo('/pages/user/wallet/withdrawal?type=4')">提现</button>
					<button type="warn" size="mini" @tap.stop="jumpTo('transactions')">理财</button>
					<button type="primary" size="mini" @tap.stop="jumpTo('transformToIntegral')">转换</button>
				</view>
			</view>
			<view class="assets-cell" @tap="goDetail(3)">
				<view class="flex flex-between">
					<view class="flex flex-align-center">
						<view class="icon" style="background-color: #ff3d55;">
							<text class="iconfont">&#xe726;</text>
						</view>
						<text class="font34">存托权益</text>
					</view>
					<text class="blod font28">{{walletInfo.deposit}}</text>
				</view>
				<view class="flex flex-space-end btns">
					<button type="primary" size="mini" class="bg-base" @tap.stop="jumpTo('depositDetail')">我的存托</button>
					<button type="primary" size="mini" @tap.stop="goTransForm(1)">转换</button>
				</view>
			</view>
			<view class="assets-cell" @tap="goDetail(2)">
				<view class="flex flex-between">
					<view class="flex flex-align-center">
						<view class="icon" style="background-color: #5d78f3;">
							<text class="iconfont">&#xe70c;</text>
						</view>
						<text class="font34">销售提成</text>
					</view>
					<text class="blod font28">{{walletInfo.sale}}</text>
				</view>
				<view class="flex flex-space-end btns">
					<button type="primary" size="mini" @tap.stop="goTransForm(2)">转换</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import { numberConversion } from "@/common/utils/index.js"
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default{
		components: { uniSwiperDot },
		data(){
			return {
				current: 0,
				swiperList: [
					{pic: "/static/swiper/5.jpg"},
					{pic: "/static/swiper/6.jpg"},
					{pic: "/static/swiper/7.jpg"},
				],
				walletInfo: {},
				info: {},
				noticeList: [],
				depositPlanInfo: {}
			}
		},
		filters:{
			filterNumber(val){
				return numberConversion(val)
			}
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods:{
			init(){
				// 获取存托发售统计数据
				this.$http("GET", url.deposit.depositPlanAdminAmount).then(res =>{
					this.depositPlanInfo = res.data
				})
				// 获取存托等级、团队累计金额信息
				this.$http("GET", url.deposit.getLevelAndTeamMoney).then(res =>{
					this.info = res.data
				})
				// 获取钱包信息
				this.$http("GET", url.deposit.getUserWallet).then(res =>{
					this.walletInfo = res.data
				})
				// 获取公告
				this.$http("GET", url.deposit.getNoticeList, {pageSize: 1}).then(res =>{
					this.noticeList = res.data.records
				})
				uni.stopPullDownRefresh()
			},
			change(e){
				this.current = e.detail.current
			},
			jumpTo(path){
				this.$navigateTo(path)
			},
			goDetail(current){
				this.$navigateTo("detail?current="+current)
			},
			goTransForm(type){
				this.$navigateTo("transform?type="+type)
			},
			goNotice(row){
				if (row){
					uni.setStorageSync("noticeDetail", row)
					this.$navigateTo("noticeDetail")
				} else {
					this.$navigateTo("notice")
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		background-color: #F8F8F8;
	}
	.swiper{
		width: 750rpx;
		height: 280rpx;
		margin: 20rpx 0;
		&-wrap{
			width: 100%;
			height: 100%;
		}
		&-box{
			width: 710rpx;
			height: 100%;
			margin-left: 20rpx;
			border-radius: 20rpx;
			overflow: hidden;
		}
		&-item{
			width: 100%;
			height: 100%;
		}
	}
	.grid{
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		display: flex;
		flex-wrap: wrap;
		width: 750rpx;
		&-item{
			width: 334rpx;
			height: 150rpx;
			padding-left: 40rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			border-bottom: 2rpx solid #EEEEEE;
		}
		&-item:nth-child(odd){
			border-right: 2rpx solid #EEEEEE;
		}
		&-item:nth-child(5){
			border-bottom: none;
		}
		&-item:nth-child(6){
			border-bottom: none;
		}
	}
	.notice{
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		padding-bottom: 20rpx;
		.title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #EEEEEE;
			padding: 20rpx;
		}
		.con{
			margin-top: 20rpx;
			padding: 0 20rpx;
			height: 140rpx;
			display: flex;
			.img{
				width: 200rpx;
				height: 140rpx;
				border-radius: 16rpx;
				margin-right: 20rpx;
				background-color: #007AFF;
			}
			.right{
				height: 140rpx;
				display: flex;
				flex-direction: column;
			}
		}
	}
	.amount{
		background-color: white;
		display: flex;
		margin-bottom: 20rpx;
		&-item{
			width: 33%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-right: 2rpx solid #EEEEEE;
			.name{
				border-bottom: 2rpx solid #EEEEEE;
				width: 100%;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
			.value{
				width: 100%;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
			}
			.cell{
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				&-item{
					width: 100%;
					height: 50%;
					line-height: 50rpx;
					text-align: center;
					border-bottom: 2rpx solid #EEEEEE;
				}
			}
		}
	}
	.assets{
		background-color: #FFFFFF;
		.title{
			padding: 20rpx;
			font-size: 32rpx;
		}
		&-cell{
			border-top: 2rpx solid #EEEEEE;
			margin: 0 20rpx;
			padding: 20rpx 0;
			.icon{
				border-radius: 50%;
				width: 70rpx;
				height: 70rpx;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				text{
					color: white;
					font-size: 40rpx;
				}
			}
			.btns{
				margin-top: 20rpx;
				button{
					width: 200rpx;
					margin: 0;
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
