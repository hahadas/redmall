<template>
	<view>
		<view class="header bg-base">
			<view class="header-item">
				<text class="name">积分</text>
				<text class="money">{{info.blanceIntegration}}</text>
			</view>
			<view class="header-item">
				<text class="name">消费券</text>
				<text class="money">{{info.blanceXiaoFei}}</text>
			</view>
		</view>
		<view class="list">
			<view class="list-item">
				<text class="label">转换数量：</text>
				<input type="number" class="input grow" :maxlength="11" v-model="amount" placeholder="请输入转换数量">
				<text class="all color-purple" @tap="amount = info.blanceIntegration">全部</text>
			</view>
			<view class="list-item" v-if="proportion">
				<text class="label">转换比例：</text>
				<text class="grow">1:{{proportion}}</text>
			</view>
			<view class="list-item">
				<text class="label">实际到账：</text>
				<text class="grow" v-if="amount && proportion">{{amount*proportion}}</text>
				<text class="tip">消费券</text>
			</view>
		</view>
		<button type="warn" class="btn bg-base" :loading="loading" :disabled="loading" @tap="onConfirm">确定</button>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	export default{
		data(){
			return {
				loading: false,
				proportion: "",
				info: {},
				amount: ""
			}
		},
		onShow() {
			this.$http('GET', url.common.transformProportion).then(res => {
				this.proportion = res.data
			})
			this.loadData()
		},
		methods: {
			async loadData(){
				let res = await this.$http('GET', url.user.getUserInfoBasic);
				this.info = res.data
			},
			onConfirm(){
				if (!this.amount) return this.$api.msg("请输入转换数量")
				this.loading = true
				this.$http('POST', url.user.convertPointsToCoupons, {amount: this.amount}).then(res => {
					if (res) {
						this.$msg("转换成功")
						this.navigateBack(1, 500)
					}
				}).catch(()=>{
					this.loading = false
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		display: flex;
		padding: 50rpx 0 30rpx;
		&-item{
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: white;
			.name{
				font-size: 28rpx;
				margin-bottom: 10rpx;
			}
			.money{
				font-size: 56rpx;
				font-weight: bold;
			}
		}
	}
	.list{
		margin-top: 30rpx;
		background-color: white;
		padding: 0 30rpx;
		&-item{
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30rpx;
			color: #333333;
			border-bottom: 2rpx solid #EEEEEE;
			.grow{
				flex-grow: 1;
			}
			.input{
				font-size: 30rpx;
			}
			.all{
				font-size: 28rpx;
			}
			.tip{
				color: #666666;
				font-size: 28rpx;
			}
		}
	}
	.btn{
		margin: 50rpx 30rpx 30rpx;
	}
</style>
