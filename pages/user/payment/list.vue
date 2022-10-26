<template>
	<view class="main">
		<view
			class="list" 
			:class="{'wechat': type === 1, 'alipy': type === 0, 'bank': type === 3}"
			v-for="(item, i) in list" 
			:key="i" 
			@tap="jumpTo(null, item)">
			<view class="flex flex-between">
				<text class="iconfont color-w font60" v-if="type === 0">&#xe715;</text>
				<text class="iconfont color-w font60" v-if="type === 1">&#xe6b9;</text>
				<text class="iconfont color-w font60" v-if="type === 3">&#xe657;</text>
				<text class="iconfont color-w font60" @tap.stop="onDel(item, i)">&#xe65b;</text>
			</view>
			<!-- <view class="flex" @tap.stop="showImg(item.image)">
				<text class="iconfont color-w font48">&#xe642;</text>
				<text style="margin-left: 10rpx;">查看收款码</text>
			</view> -->
			<view class="flex flex-center flex-column" v-if="type === 3">
				<text>{{item.bankName | filterName}}</text>
				<text class="font48">**** **** **** {{item.account | filtersCard}}</text>
			</view>
			<view class="flex flex-column" v-else>
				<text>{{item.name}}</text>
				<text>{{item.account}}</text>
			</view>
		</view>
		<!-- 添加 -->
		<view class="list dashed flex flex-align-center" @tap="jumpTo('add', null)">
			<view class="flex flex-align-center color-b9">
				<text class="iconfont add">&#xe64d;</text>
				<text class="font40" v-if="type === 0">添加支付宝</text>
				<text class="font40" v-if="type === 1">添加微信</text>
				<text class="font40" v-if="type === 3">添加银行卡</text>
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	export default {
		data(){
			return {
				coupon: "",
				bank: "",
				imageUrl: "",
				list: []
			}
		},
		filters: {
			filtersCard(val) {
				if (!val) return
				return val.substring(val.length - 4, val.length)
			},
			filterName(val){
				if (val.indexOf("-") > -1) {
					return val.split("-")[0]
				} else {
					return val
				}
			}
		},
		onLoad(option) {
			this.type = parseInt(option.type)
			this.coupon = option.coupon === 'true' ? true : false
			this.bank = option.bank === 'true' ? true : false // 还信用卡专用
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList(){
				this.$http("GET", url.user.getCollectionsList, {type: this.type}).then(res => {
					this.list = res.data
				})
			},
			showImg(url){
				uni.previewImage({
					urls: [url],
					current: url
				});
			},
			onDel(row, i){
				let _this = this
				uni.showModal({
					title: "提示",
					content: "确定删除该收款信息？",
					success(res) {
						if (res.confirm) {
							_this.$http("POST", url.user.delCollectionsById, {collectionId: row.id, type: _this.type}).then(doc => {
								_this.$msg("删除成功")
								_this.list.splice(i, 1)
							})
						}
					}
				})
				
			},
			jumpTo(type, row) {
				let url = "alipay"
				if (this.type === 1) {
					url = "wechat"
				} else if (this.type === 3) {
					url = "bank"
				}
				if (type === 'add') {
					uni.navigateTo({
						url: url + "?type="+this.type
					})
				} else {
					if (!this.coupon && !this.bank) {
						uni.navigateTo({
							url: url + "?type="+this.type+"&&id="+row.id
						})
					} else {
						let pages = getCurrentPages();
						let prevPage = null
						let data = row
						data.type = this.type
						if (this.bank) {
							prevPage = pages[pages.length - 2];
						} else {
							prevPage = pages[pages.length - 3];
						}
						prevPage.$vm.paymentData = data
						uni.navigateBack({
							delta: this.bank ? 1 : 2
						});
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 30rpx;
		.alipy{
			background-color: #21b6fa;
			// border-radius: 20rpx;
		}
		.wechat{
			background-color: #51bd21;
			// border-radius: 20rpx;
		}
		.bank{
			background-color: #f1ca5c;
			
		}
		.list{
			border-radius: 20rpx;
			height: 184rpx;
			// width: 630rpx;
			padding: 20rpx 30rpx;
			margin-bottom: 20rpx;
			color: #FFFFFF;
			.no{
				height: 100%;
			}
			.add{
				font-size: 50rpx;
				margin-right: 20rpx;
			}
		}
		.dashed{
			border: 2rpx dashed #999999;
		}
		
		.popup{
			padding: 0 30rpx;
		}
	}
</style>
