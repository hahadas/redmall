<template>
	<view>
		<view class="top bg-base">
			<view class="cell">
				<text class="num">{{type === 1 ? info.deposit : info.sale}}</text>
				<text class="name">{{type === 1 ? '存托权益':'销售提成'}}</text>
			</view>
			<text class="iconfont font60 color-w">&#xe713;</text>
			<view class="cell">
				<text class="num">{{info.balance}}</text>
				<text class="name">我的资产</text>
			</view>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">转换数额</text>
			<input type="number" class="flex-grow" v-model="number" placeholder-style="fontSize:32rpx" placeholder="请输入转换数额" />
			<text class="font28 color-b9">{{type === 1 ? '存托权益':'销售提成'}}</text>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">转换费用</text>
			<text class="flex-grow">{{cost}}</text>
			<text class="font28 color-b9">%</text>
		</view>
		<view class="flex flex-align-center form">
			<text class="label">实际到账</text>
			<text class="flex-grow">{{number?(Number(number)*scale):0}}</text>
			<text class="font28 color-b9">我的资产</text>
		</view>
		<view class="flex flex-between form bor-no" v-if="week">
			<text class="label">开放时间</text>
			<text class="font28 color-b9">每周{{week}}</text>
		</view>
		<button type="primary" class="bg-base btn" v-if="isOpen" :loading="loading" :disabled="loading" @click="onSave">确定</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default{
		data(){
			return{
				loading: false,
				type: 1, // 1-存托权益 2-销售提成
				info:{},
				number: "",
				scale: 1,
				cost: 0,
				isOpen: false,
				week: ""
			}
		},
		onLoad(opt) {
			if (opt.type){
				this.type = parseInt(opt.type)
			}
			// 获取钱包信息
			this.$http("GET", url.deposit.getUserWallet).then(res =>{
				this.info = res.data
			})
			// 获取转换参数
			this.getConfigData()
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("transformList?type="+this.type)
		},
		methods:{
			getConfigData(){
				let path = url.deposit.getDepositToBanlanceConfig
				if (this.type === 2) {
					path = url.deposit.getSaleToBanlanceConfig
				}
				this.$http("GET", path).then(res =>{
					let list = res.data
					this.isOpen = res.data.keyValue === "1" ? true : false
					list.children.forEach(v => {
						if ((this.type === 1 && v.keyCode === "deposit_transformation_balance_week_time")||
							(this.type === 2 && v.keyCode === "deposit_sale_transformation_balance_week_time")) { // 开放时间
							this.week = v.keyValue
						}
						if ((this.type === 1 && v.keyCode === "deposit_transformation_balance_service_percentage")||
							(this.type === 2 && v.keyCode === "deposit_sale_transformation_balance_service_percentage")){ // 手续费
							this.cost = Number(v.keyValue)
							this.scale = (100 - Number(v.keyValue)) / 100
						}
					})
				})
			},
			onSave(){
				if (!this.number || Number(this.number) === 0) return this.$msg("请输入要转换的数量")
				this.loading = true
				let path = url.deposit.depositToBanlance
				if (this.type === 2) {
					path = url.deposit.saleToBanlance
				}
				this.$http("POST", path, {amount: this.number}).then(res =>{
					this.$msg(res.data)
					this.$navigateBack()
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 50rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 20rpx;
		.cell{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: white;
			.num{
				font-size: 44rpx;
			}
			.unit{
				font-size: 24rpx;
				margin-left: 4rpx;
				margin-bottom: 6rpx;
			}
			.name{
				font-size: 26rpx;
				margin-top: 20rpx;
			}
		}
	}
	.form{
		background-color: #FFFFFF;
		padding: 26rpx 20rpx;
		font-size: 32rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.label{
			margin-right: 20rpx;
		}
	}
	.btn{
		width: 90%;
		margin-top: 80rpx;
	}
</style>
