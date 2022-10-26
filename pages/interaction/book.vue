<template>
	<view>
		<scroll-view scroll-y="true" :style="{height: swiperHeight+'px;'}">
			<view style="height: 100%;">
				<view class="address-main">
					<uni-swipe-action>
						<block v-for="(item,index) in listData" :key="index">
							<!-- <view class="title">{{index}}</view> -->
							<view class="cu-list">
								<uni-swipe-action-item class="swiper-item" :options="options">
									<view class="cu-item" @click.stop="skipToSingleTongXunLuChat(item)" @longpress="touchLongByTX(item, index)">
										<view class="cu-avatar">
											<image :src="item.icon" mode="widthFix"></image>
										</view>
										<view class="cu-info">
											<view class="username">
												<text class="font24 bg-base color-w"
												style="padding: 5upx 8upx;border-radius: 6rpx;margin-right: 5upx;">
													慈善天使
												</text>
												{{item.channelName}}
											</view>
											<view style="font-size: 26rpx; color: #666666;">备注：{{item.noteName}}发撒范德萨</view>
											<view style="font-size: 26rpx; color: #666666;" class="uni-text-gray">签名：{{item.signature}}发撒范德萨发的</view>
										</view>
									</view>
								</uni-swipe-action-item>
							</view>
						</block>
					</uni-swipe-action>
				</view>
			</view>
			<view style="width:100%; display: flex; align-items: center; justify-content: center;">
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog 
				type="info"
				mode="input"
				title="备注"
				placeholder="请输入"
				:value="mark"
				@confirm="confirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	// import publics from "@/common/utils/public.js"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

	export default {
		components: { uniSwipeAction, uniSwipeActionItem, uniLoadMore, uniPopup, uniPopupDialog },
		data(){
			return {
				swiperHeight: 0,
				listData: [],
				options: [{
					text: '备注'
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				currentItem: {}, // 当前选择
				currentIndex: 0,
				currentIndex2: 0,
				mark: "",
				loadingType: 'loading', //加载更多状态
			}
		},
		onShow() {
			let swiperHeight = uni.getSystemInfoSync().windowHeight
			this.swiperHeight = swiperHeight - 20
		},
		methods: {
			touchLongByTX(item, index, index2){
				let that = this;
				uni.showActionSheet({
				    itemList: ["这里放到是用户名","设置备注","删除好友"],
				    success: function (resSheet) {
						if(resSheet.tapIndex == 1){//备注
							that.mark = item.noteName; // 赋值备注
							that.$refs.popup.open()
						}else if(resSheet.tapIndex == 2){//删除
							uni.showModal({
								title: '提示',
								content: '是否确认删除好友',
								success: (res) => {
									if (res.confirm) {
										// ....
									}
								}
							});
						}
				    }
				});
			},
			skipToSingleTongXunLuChat: function(item) {
				this.$navigateTo('im-chat?channelId='+item.channelId+'&creatorId='+item.creatorId)
			},
			close(){
				that.$refs.popup.close()
			},
			confirm(done,value){
				// 输入框的值
				console.log(value)
				done()
			}
		}
	}
</script>

<style scoped lang="scss">
	.cu-list {
		display: flex;
		flex-direction: column;
		.cu-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			transition: all .6s ease-in-out 0s;
			transform: translateX(0upx);
			background-color: #FFFFFF;
			width: 100%;
			&:after {
				position: absolute;
				top: 0;
				left: 0;
				box-sizing: border-box;
				width: 200%;
				height: 200%;
				border-bottom: 1px solid #ddd;
				border-radius: inherit;
				content: " ";
				transform: scale(.5);
				transform-origin: 0 0;
				pointer-events: none
			}
	
			&:last-child::after {
				border-bottom: none;
			}
		}
	
		// &.menu {
		// 	margin-top: 30rpx;
		// 	.cu-item {
		// 		padding: 30rpx;
		// 		.icon{
		// 			img,image{
		// 				width: 50rpx;
		// 			}
		// 		}
		// 		.content {
		// 			margin-left: 20rpx;
		// 			font-size: 32rpx;
		// 		}
		// 	}
		// }
	}
	.address-main {
		.title {
			padding: 30rpx;
			font-size: 32rpx;
		}
		.swiper-item {
			border-bottom: 1px solid rgba(221, 221, 221, 0.4);
			&:last-child::after {
				border-bottom: none;
			}
			.cu-item,
			.cu-info {
				padding: 10rpx 10rpx 10rpx 0;
				.username{
					font-size: 30rpx;
				}
			}
			.cu-avatar {
				align-items: center;
				background-color: #ccc;
				color: #ffffff;
				white-space: nowrap;
				vertical-align: middle;
				border-radius: 96rpx;
				width: 96rpx;
				height: 96rpx;
				font-size: 2em;
				text-align: center;
				overflow: hidden;
				margin: 20rpx 20rpx 20rpx 30rpx;
		
				img,
				image {
					width: 96rpx;
					height: 96rpx;
				}
			}
		}
	}
	.dialog-btns {
		display: flex;
		width: 100%;
		padding: 10px 0;
		flex-wrap: nowrap;
	}
	
	.dialog-btns view {
		width: 100%;
		border-right: 1px solid #F5F6F8;
	}
	
	.dialog-btns view:last-child {
		border: 0;
	}
	
	.dialog-btns button {
		width: 100%;
		padding: 0;
		text-align: center;
		background: none;
		border: none;
		box-shadow: none;
		height: 25px;
		font-size: 14px;
		color: #888888;
		line-height: 25px;
		border-radius: 0;
	}
	
	.dialog-btns button:after {
		width: 0;
		height: 0;
		border: 0;
	}
	
	.dialog-btns .button-hover {
		background: none;
		color: #3688FF;
	}
	.dialog-content1 {
		padding: 15upx;
		background: #F8F8F8;
	}
	
	.dialog-content1 .uni-input {
		margin-bottom: 15upx;
	}
</style>
