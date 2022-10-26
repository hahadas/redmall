<template>
	<view class="main">
		<view class="box">
			<text class="color-purple amount">¥{{amount}}</text>
			<button type="primary" class="bg-base btn" @click="$navigateBack()">返回</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				amount: ""
			}
		},
		onLoad(opt){
			this.amount = opt.amount
		},
	}
</script>

<style scoped lang="scss">
	.box{
		margin-top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.amount{
		margin-top: 50rpx;
		margin-bottom: 150rpx;
		font-size: 60rpx;
		font-weight: bold;
	}
	.btn{
		width: 80%;
	}
</style>
