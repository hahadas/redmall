<template>
	<view class="showTotal">
		<view class="over"></view>
		<view class="show">
			<slot></slot>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
	.show{
		width: 620rpx;
		position: fixed;
		left: 65rpx;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center
	}
	.over{
		width: 750rpx;
		background-color: #000;
		opacity: 0.6;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}
</style>
