<template>
	<view v-if="done">
		<view class="detail-desc">
			<view class="content">
				<rich-text :nodes="info.textDescribe" v-if="info.textDescribe"></rich-text>
				<image :src="item.ossUrl" mode="widthFix" class="img" v-for="(item, i) in info.resources" @click="jumpTo(item)"></image>
			</view>
			
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	
	export default{
		data(){
			return {
				done: false,
				info: {}
			}
		},
		onLoad(option) {
			uni.showLoading({
				title:""
			})
			if (option.id) {
				this.$http("GET", url.cms.getNoticeDetailById, {id: option.id}).then(res =>{
					this.info = res.data
					uni.setNavigationBarTitle({
						title: res.data.titleName
					});
					this.done = true
					uni.hideLoading()
				}).catch(()=>{
					this.$navigateBack()
				})
			}
		},
		methods:{
			jumpTo(item) {
				publics.advertOption(item.operationCode, item.operationValue);
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
			justify-content: space-between;
			height: 50upx;
			font-size: 24rpx;
			color: #909399;
			
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
			.img{
				width: 100%;
				display: block;
			}
		}
	}
</style>
