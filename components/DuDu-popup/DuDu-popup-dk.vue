<template name="popup">
	<view v-if="showPopup">
		<view class="popup_mask" @touchmove.stop.prevent="clear"></view>
		<view class="popup_content">
			<view class="title" style="height: 70upx;line-height: 70upx;font-weight: 500;">{{title?title:titleN}}</view>
			<view style="height: 500upx;overflow-y: scroll;">
				<view class="explain_text">
					<rich-text :nodes="textNode?textNode:textNodeN"></rich-text>
				</view>
			</view>
			<view class="button">
				<view class="back" @tap="back">取消</view>
				<view class="consent" @tap="consent">同意</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "popup",
		props: {
			title: {
				type: String,
				default: "服务协议和隐私政策"
			},
			textNode: {
				type: String,
				default: "<p>服务协议和隐私政策内容</p>"
			},
			// 协议路径
			protocolPath: {
				type: String,
				default: ""
			},
			// 政策路径
			policyPath: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				showPopup: true,
				titleN: "服务协议和隐私政策",
				textNodeN: "<p>服务协议和隐私政策内容</p>"
			};
		},
		methods: {
			// 禁止滚动
			clear() {
				return;
			},
			back() {
				//this.showPopup = false;
				this.$emit('popupState', false)
				// // #ifdef APP-PLUS  
				// plus.runtime.quit();
				// // #endif
			},
			// 关闭弹框
			consent() {
				//this.showPopup = false;
				this.$emit('popupState', true)
			}
		}
	};
</script>

<style lang="scss">
	.popup_mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		z-index: 98;
		
	}

	.popup_mask {
		opacity: 1;
	}
	
	.popup_content {
		box-sizing: border-box;
		padding: 20upx 20upx 0 20upx;
		position: fixed;
		top: 15%;
		border-radius: 8px;
		left: 50%;
		margin-left: -40%;
		right: 0;
		min-height: 400upx;
		background: #ffffff;
		width: 80%;
		z-index: 9999999;
		.popup_center{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.title {
			text-align: center;
			font-size: 34upx;
			padding: 10upx 0 0 0;
		}

		.explain_text {
			font-size: 30upx;
			padding: 30upx 30upx 40upx 30upx;
			line-height: 38upx;

			.line {
				display: block;

				.path {
					color: #007aff;
					display: inline-block;
					text-align: center;
				}
			}
		}

		.button {
			display: flex;
			padding: 0 20upx;
			align-items: center;
			font-size: 34upx;
			justify-content: space-around;
			border-top: 1upx solid #f2f2f2;
			height: 100rpx;
			view {
				text-align: center;
			}
		}
	}
</style>
