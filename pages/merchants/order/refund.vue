<template>
	<view class="main">
		<radio-group @change="radioChange">
			<view class="cell" v-for="(item, index) in list" :key="index">
				<radio :value="item" color="#381895"/>
				<text class="name">{{item}}</text>
			</view>
		</radio-group>
		<textarea v-model="content" v-if="showOther" :maxlength="50" placeholder="其他原因" class="textarea" />
		<button type="primary" class="btn bg-base" :loading="loading" :disabled="loading" @click="onSumbit">确定</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import imMix from "../../order/imMix.js"
	export default{
		mixins: [imMix],
		data(){
			return {
				id: "",
				type: "",
				loading: false,
				userList: [
					"太贵了",
					"拍错了",
					"不想要了",
					"其他"
				],
				businessList: [
					"库存不足",
					"价格有浮动，重新下单",
					"当前物流无法发货",
					"其他"
				],
				list: [],
				content: "",
				showOther: false,
				refundData: {},
			}
		},
		onLoad(opt){
			let refundData = uni.getStorageSync("refundData") 
			if (refundData) {
				this.refundData = refundData
				this.id = refundData.orderId
				this.type = refundData.userType
				if (this.type === 1) {
					this.list = this.userList
				} else {
					this.list = this.businessList
				}
				uni.removeStorageSync("refundData")
			}
		},
		methods:{
			onSumbit(){
				if (!this.content) return this.$msg("请选择或填写退款原因")
				this.loading = true
				let params = {
					orderId: this.id,
					reason: this.content
				}
				let path = url.store.refundOrder	// 默认商家退款
				if (this.type === 1) { // 用户退款
					path = url.order.refundOrder
				}
				// 发送消息判断对方是否在线
				let toImAccount = this.refundData.toImAccount
				this.isOtherOnline(toImAccount, 'refund')
				this.$http("POST", path, params).then(res =>{
					this.$msg(res.data)
					
					// #ifdef APP-PLUS
					// 获取会话信息并且发送消息给对方
					let type = this.type === 1 ? 3 : 1
					this.sessionOperation(toImAccount, type, ()=>{
						let goodsInfo = {
							...this.refundData,
							reason: this.content
						}
						this.sendMsgToOther(toImAccount, goodsInfo, 7, type)
					})
					// #endif
					
					try{
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.$vm.getOrderInfo()
					}catch(err){}
					this.$navigateBack()
				}).catch(()=>{
					this.loading = false
				})
			},
			radioChange(e){
				if (e.detail.value === "其他"){
					this.content = ""
					this.showOther = true
				} else {
					this.showOther = false
					this.content = e.detail.value
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		background-color: white;
	}
	.cell{
		height: 100rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #EEEEEE;
		padding: 0 20rpx;
		.name{
			margin-left: 20rpx;
			font-size: 32rpx;
			color: #333333;
		}
	}
	.textarea{
		margin: 20rpx;
		border-radius: 10rpx;
		width: 686rpx;
		border: 2rpx solid #e6e5ed;
		padding: 10rpx;
	}
	.btn{
		width: 90%;
		margin-top: 80rpx;
	}
</style>
