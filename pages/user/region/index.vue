<template>
	<view class="main" v-if="isDone">
		<view class="header bg-base">
			<text class="font30">{{info.agentInfo.adcode | filterCode}}代理</text>
			<view class="flex flex-center mar">
				<text class="font40">{{info.profitSharingRatio || 0}}%分润</text>
			</view>
			<view class="bom flex flex-between" v-if="info.agentInfo.type === 3">
				<text class="font28">区域代理补贴{{info.areaSubsidyAmount || 0}}%</text>
				<view class="flex flex-align-center">
					<switch :checked="checked" :disabled="disabled" color="#381895" @change="onChange" class="switch" />
					<text class="font26">{{checked?'已开启':'已关闭'}}</text>
				</view>
			</view>
		</view>
		<view class="cell">
			<text class="label">累计收益</text>
			<text class="number">{{info.accumulatedIncome}}</text>
		</view>
		<block v-if="info.agentInfo.type === 2">
			<view class="cell" @click="$navigateTo('list?adCode='+info.agentInfo.adcode)">
				<text class="label">所有区代理</text>
				<text class="number iconfont">{{info.numberOfDistrictAgents}} &#xe770;</text>
			</view>
			<view class="cell">
				<text class="label">空缺区域数量</text>
				<text class="number">{{info.NumberOfAgentsInVacantArea}}</text>
			</view>
		</block>
		<view class="cell">
			<text class="label">代理区域用户量</text>
			<text class="number">{{info.numberOfRegionalUsers}}</text>
		</view>
		<view class="cell" v-if="info.agentInfo.type === 3">
			<text class="label">区域直属用户量</text>
			<text class="number">{{info.regionalDirectUsers}}</text>
		</view>
		
		<view class="cell">
			<text class="label">订单累计成交量</text>
			<text class="number">{{info.cumulativeOrderVolume}}</text>
		</view>
		<view class="cell" @click="$navigateTo('order')">
			<text class="label">查看所有订单</text>
			<text class="number iconfont">&#xe770;</text>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				isDone: false,
				checked: false,
				disabled: false,
				info: {}
			}
		},
		filters: {
			filterType(val) {
				switch(val){
					case 1:
						return "省";
					case 2:
						return "市";
					case 3:
						return "区";
					default:
						return "其他"
				}
			},
			filterCode(val){
				if (!val) return
				let list = publics.getLngAndLatByCode(val)
				let name = list[list.length - 1].name
				return name
			}
		},
		onLoad() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			async init(){
				// 获取统计数据
				try{
					let res1 = await this.$http("GET", url.user.accumulatedRevenue)
					let res2 = await this.$http("GET", url.user.statisticalInfo)
					this.info = Object.assign({}, res1.data, res2.data)
					let areaSubsidyStatus = res1.data.agentInfo.areaSubsidyStatus
					if (areaSubsidyStatus === 2) {
						this.checked = true
					} else if (areaSubsidyStatus === 3) {
						this.checked = true
						this.disabled = true
					} else if (areaSubsidyStatus === 4) {
						this.disabled = true
					}
				}catch(err){}
				this.isDone = true
				uni.stopPullDownRefresh()
			},
			onChange(e){
				let status = e.detail.value ? 2 : 1
				this.$http("POST", url.user.updateSubsidyStatus, {status: status})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.header{
			color: white;
			padding: 30rpx;
			border-radius: 16rpx;
			.mar{
				margin-top: 30rpx;
			}
			.bom{
				border-top: 2rpx solid #FFFFFF;
				padding-top: 20rpx;
				margin-top: 30rpx;
				.switch{
					transform: scale(0.8);
				}
			}
		}
		.cell{
			margin-top: 20rpx;
			background-color: white;
			padding: 30rpx;
			font-size: 28rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.number{
				color: #999999;
			}
		}
	}
</style>
