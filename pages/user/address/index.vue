<template>
	<view class="content">
		<view class="list" v-for="(item, index) in addressList" :key="index" @tap="checkAddress(item)">
			<view class="wrapper">
				<view class="u-box font34">
					<text class="name">{{ item.fullName }}</text>
					<text class="mobile">{{ item.mobile }}</text>
				</view>
				<view class="address-box">
					<text class="address">
						<text class="mark" v-if="item.defaultAd">默认</text>
						{{ filterAddr(item.threeAdcode) }}{{item.addressDetails}}{{item.addressSupplement}}
					</text>
				</view>
			</view>
			<view class="flex flex-between bom">
				<view class="flex flex-align-center" v-if="source">
					<radio :checked="isSelectId === item.id ? true : false" color="#381895" style="transform: scale(0.7);" />
					<text class="color-b9 font30">{{isSelectId === item.id ? '已选' : '选择地址'}}</text>
				</view>
				<view v-else></view>
				<view class="flex flex-align-center flex-space-end color-b9">
					<view class="flex flex-align-center" @tap.stop="addAddress('edit', item)">
						<text class="iconfont font40">&#xe60d;</text>
						<text class="font30" style="margin-left: 6rpx;">编辑</text>
					</view>
					<view class="flex flex-align-center" style="margin-left: 30rpx;" @tap.stop="delAddress(item, index)">
						<text class="iconfont font44">&#xe65b;</text>
						<text class="font30">删除</text>
					</view>
				</view>
			</view>
		</view>
		<button class="add-btn bg-base" @click="addAddress('add')">+新增地址</button>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	export default{
		data(){
			return {
				source: false,
				addressList: [],
				pageSize: 0,
				pages: 0,
				type: 1 ,// 1=用户收货地址，2=商家发货地址
				isSelectId: null,
				editAddr: false,
				orderId: "",
			}
		},
		onLoad(option) {
			if (option.type){
				this.type = option.type
			}
			if (option.id) { // 已选择的地址id
				this.isSelectId = parseInt(option.id)
			}
			if (option.source) { // 选择地址
				this.source = true
			}
			if (option.editAddr) { // 用户订单修改地址
				this.editAddr = true
			}
			if (option.orderId) {	// 需要修改收货地址的订单id
				this.orderId = option.orderId
			}
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			if (this.pages && this.pageSize+1 < this.pages) {
				this.pageSize++
				this.getList()
			}
		},
		onPullDownRefresh(){
			this.init()
		},
		methods:{
			init(){
				this.pageSize = 0
				this.addressList = []
				this.getList()
			},
			getList(){
				let params = {
					pageSize: this.pageSize,
					type: this.type
				}
				this.$http("GET", url.address.getAddressList, params).then(res =>{
					this.addressList = this.addressList.concat(res.data.records)
					this.pages = res.data.pages
					uni.stopPullDownRefresh();
				})
			},
			delAddress(item, index){
				this.$http("POST", url.address.deleteAddress, {id: item.id, type: this.type}).then(res =>{
					this.$msg("删除成功")
					this.addressList.splice(index, 1)
				})
			},
			addAddress(name, item){
				let data = {
					name: name,
					type: this.type
				}
				if (item) data.id = item.id
				this.$navigateTo(`/pages/user/address/edit?data=${JSON.stringify(data)}`)
			},
			//选择地址
			checkAddress(item) {
				if (this.source) {
					let pages = getCurrentPages(); 
					let beforePage = pages[pages.length - 2];
					beforePage.$vm.addressData = item;
					uni.navigateBack();
				}
				if (this.editAddr) {
					this.$http("POST", url.order.orderUpdateRecAddress, {orderId: this.orderId, receivingAddressId: item.id}).then(res => {
						this.$msg(res.data)
						this.$navigateBack()
					})
				}
			},
			filterAddr(code) {
				if (!code) return
				let addrObj = publics.getLngAndLatByCode(code);
				let addrName = ""
				if (addrObj){
					addrObj.map(v=>{
						addrName = addrName + v.name
					})
				}
				return addrName
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		position: relative;
		min-height: 100vh;
		padding: 20rpx;
	}
	.list {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 20upx;
		background: #fff;
		position: relative;
		// border-bottom: 2rpx solid #eee;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
	}
	.wrapper {
		width: 100%;
		min-height: 180rpx;
		display: flex;
		flex-direction: column;
		// flex: 1;
	}
	.address-box {
		display: flex;
		align-items: center;
		margin: 10upx 0;
		.address {
			font-size: 30upx;
			color: #666;
			line-height: 44rpx;
		}
		.mark{
			color: #381895;
			background-color: rgba($color: #381895, $alpha: .3);
			padding: 0 10rpx;
			margin-right: 10rpx;
			font-size: 24rpx;
			border-radius: 8rpx;
		}
	}
	.u-box {
		color: #000000;
		.name {
			margin-right: 30upx;
		}
	}
	.bom{
		width: 100%;
		border-top: 2rpx solid #eee;
		padding-top: 20rpx;
	}
	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 90upx;
		font-size: 32upx;
		color: #fff;
		border-radius: 50upx;
		box-shadow: 1px 2px 5px rgba(136, 62, 210, 0.4);
	}
</style>
