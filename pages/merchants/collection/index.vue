<template>
	<view>
		<view class="list">
			<view class="list-item">
				<text class="label">收款金额：</text>
				<input type="number" class="input grow" v-model="amount" @input="onInput($event, 'amount')" placeholder="请输入收款金额">
				<text class="tip">元</text>
			</view>
			<view class="list-item">
				<text class="label">赠送方式：</text>
				<radio-group class="grow flex" @change="radioChange">
					<label class="flex flex-align-center" style="margin-right: 20rpx;">
						<radio value="1" checked color="#381895" /><text>百分比</text>
					</label>
					<label class="flex flex-align-center">
						<radio value="2" color="#381895"/><text>数量</text>
					</label>
				</radio-group>
				<text class="tip">积分</text>
			</view>
			<block v-if="type === '1'">
				<view class="list-item">
					<text class="label">积分比例：</text>
					<input type="number" class="input grow" v-model="proportion" @input="onInput($event, 'proportion')" placeholder="请输入积分比例">
				</view>
				<view class="list-item">
					<text class="label">实际赠送：</text>
					<text class="grow" v-if="bonusPoints">{{bonusPoints}}</text>
					<text class="tip">积分</text>
				</view>
			</block>
			<view class="list-item" v-else>
				<text class="label">积分数量：</text>
				<input type="number" class="input grow" v-model="number" placeholder="请输入积分数量">
			</view>
		</view>
		<button type="warn" class="btn bg-base" :loading="loading" :disabled="loading" @tap="onConfirm">生成收款二维码</button>
	</view>
</template>

<script>
	
	import url from '@/common/http/url.js';
	export default{
		data(){
			return {
				loading: false,
				type: "1",
				amount: "",
				proportion: "",
				number: "",
				bonusPoints: ""
			}
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("list")
		},
		methods: {
			onConfirm(){
				if (!this.amount) return this.$msg("请输入收款金额或收款金额格式不对")
				this.loading = true
				let bonusPoints = this.number
				if (this.type === "1") {
					bonusPoints = this.bonusPoints
				}
				let params = {
					amount: this.amount,
					bonusPoints: bonusPoints
				}
				this.$http('GET', url.store.collectionCode, params).then(res => {
					let data = {
						amount: this.amount,
						bonusPoints: bonusPoints,
						data: res.data
					}
					uni.setStorageSync("collectionData", data)
					this.$navigateTo("code")
					this.loading = false
				}).catch(()=>{
					this.loading = false
				})
			},
			radioChange(e){
				this.type = e.detail.value
			},
			onInput(e, type){
				let value = e.detail.value
				let reg = /^\d+(?=\.{0,1}\d+$|$)/
				if(!reg.test(value)) {
					this.$msg("请输入正数")
				} else {
					if (type === "amount") {
						this.bonusPoints = this.proportion/100*value
					} else {
						this.bonusPoints = value/100*this.amount
					}
					this.bonusPoints = Math.round(this.bonusPoints*100)/100 // 保留两位小数
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
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
