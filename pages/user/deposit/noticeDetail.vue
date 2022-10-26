<template>
	<view>
		<view class="introduce-section">
			<text class="title">{{ detailData.titleName }}</text>
			<view class="bot-row">
				<text>{{detailData.createTime}}</text>
			</view>
		</view> 
		<view class="detail-desc">
			<view class="d-header"><text>详情</text></view>
			<view class="content" v-html="detailData.content">
				<!-- <text v-html="detailData.content"></text> -->
				<!-- <rich-text :nodes="detailData.content"></rich-text> -->
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				detailData: {}
			}
		},
		onLoad(option) {
			let noticeDetail = uni.getStorageSync("noticeDetail")
			if (noticeDetail){
				uni.removeStorageSync("noticeDetail")
				this.detailData = noticeDetail
			}
		}
	}
</script>

<style scoped lang="scss">
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;
		.title {
			color: #303133;
			height: 50upx;
			line-height: 50upx;
			font-weight: bold;
			font-size: 40upx;
		}
		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: 24rpx;
			color: #909399;
			text {
				flex: 1;
			}
		}
	}
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		padding-bottom: 30rpx;
		width: 100%;
		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: 30rpx;
			color: #303133;
			position: relative;
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
		.content{
			margin: 0 10rpx;
		}
	}
</style>
