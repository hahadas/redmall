<template>
	<view class="main">
		<view class="list">
			<view class="list-item" v-for="(order, i) in list" :key="i">
				<view class="user flex flex-align-center" @click="jumpTo(order.userInfo.imAccount)">
					<image :src="order.userInfo.headPortrait" mode="" class="logo"></image>
					<view class="flex flex-column color-b3 font30">
						<text>{{order.userInfo.nickname}}</text>
						<text class="color-b6">{{order.userInfo.username}}</text>
					</view>
				</view>
				<view class="flex flex-center flex-column" style="margin-bottom: 30rpx;">
					<text class="color-b9">收款金额</text>
					<text class="font60">¥ {{order.amount}}</text>
				</view>
				<view class="cell">
					<text class="label">付款方式</text>
					<text>{{filterWallet(order.paymentMethod)}}</text>
				</view>
				<view class="cell">
					<text class="label">实际到账</text>
					<text>¥{{order.actualArrivalAmount}}</text>
				</view>
				<view class="cell">
					<text class="label">赠送积分</text>
					<text>{{order.bonusPoints}}</text>
				</view>
				<view class="cell">
					<text class="label">收款时间</text>
					<text>{{order.paymentTime}}</text>
				</view>
				<view class="cell">
					<text class="label">收款单号</text>
					<text class="flex-grow" @click="$onCopy(order.orderNumber)">{{order.orderNumber}}</text>
				</view>
			</view>
		</view>	
		
		<uni-load-more :status="loading"></uni-load-more>
		
		<!-- 左侧菜单 -->
		<uni-drawer ref="drawer" mode="right" :width="320">
		    <scroll-view scroll-y :style="{height: swiperHeight+'px'}">
				<view class="drawer">
					<view class="title">付款单号</view>
					<view class="inputBox">
						<input type="number" v-model="orderNumber" class="input" placeholder="请输入付款单号">
						<text class="iconfont del" v-if="orderNumber" @click="orderNumber=''">&#xe7be;</text>
					</view>
					
					<view class="title">付款方式</view>
					<view class="grid">
						<view class="grid-item" :class="{'active':walletIndex === i}" v-for="(item, i) in walletList" :key="i" @click="tabsSelect(i)">
							<text>{{item.name}}</text>
						</view>
					</view>
					
					<view class="title">手机号查询</view>
					<view class="flex flex-between">
						<view class="inputBox">
							<input type="number" :maxlength="3" v-model="frontMobile" class="input" placeholder="手机号前三位">
							<text class="iconfont del" v-if="frontMobile" @click="frontMobile=''">&#xe7be;</text>
						</view>
						<text class="xian">——</text>
						<view class="inputBox">
							<input type="number" :maxlength="4" v-model="afterMobile" class="input" placeholder="手机号后四位">
							<text class="iconfont del" v-if="afterMobile" @click="afterMobile=''">&#xe7be;</text>
						</view>
					</view>
					
					<view class="flex flex-between btns">
					   <view class="btn" @click="onReset">重置</view>
					   <view class="btn right" @click="onSave">确定</view>
					</view>
				</view>
		    </scroll-view>
		</uni-drawer>
		
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import url from "@/common/http/url.js"
	export default{
		components: { uniLoadMore, uniDrawer },
		data(){
			return {
				swiperHeight: 0,
				list: [],
				loading: "loading",
				walletIndex: 0,
				walletList: [
					{name: "全部", value: -1},
					{name: "余额钱包", value: 1},
					{name: "微信", value: 2},
					{name: "支付宝", value: 3}
				],
				orderNumber: "",
				frontMobile: "",
				afterMobile: ""
			}
		},
		onNavigationBarButtonTap(){
			this.$refs.drawer.open()
		},
		onReachBottom() {
			this.loadData(false);
		},
		onPullDownRefresh() {
			this.loadData();
		},
		onLoad(opt) {
			this.swiperHeight = uni.getSystemInfoSync().windowHeight
			//获取订单信息
			this.loadData();
		},
		methods:{
			loadData(){
				this.loading = "loading"
				let params = {
					pageNum: this.list.length,
					paymentMethod: this.walletList[this.walletIndex].value,
					orderNumber: this.orderNumber,
					frontMobile: this.frontMobile,
					afterMobile: this.afterMobile
				}
				this.$http("GET", url.store.getCollectionRecordList, params).then(res => {
					this.list = this.list.concat(res.data)
					if (this.list.length < res.data.length) {
						this.loading = "more"
					} else {
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh()
				}).catch(()=>{
					this.loading = "nomore"
					uni.stopPullDownRefresh()
				})
				
			},
			filterWallet(val){
				let name = "其他"
				this.walletList.forEach(v => {
					if (v.value === val){
						name = v.name
						return
					}
				})
				return name
			},
			jumpTo(imAccount){
				this.$navigateTo("/pages/interaction/user?userId="+imAccount)
			},
			tabsSelect(i){
				this.walletIndex = i
			},
			onReset(){
				this.walletIndex = 0
				this.orderNumber = ""
				this.afterMobile = ""
				this.frontMobile = ""
			},
			onSave(){
				this.$refs.drawer.close()
				this.list = []
				this.loadData()
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 0 30rpx;
	}
	.list{
		&-item{
			background-color: white;
			border-radius: 10rpx;
			margin-bottom: 30rpx;
			padding: 30rpx;
			.user{
				margin-bottom: 50rpx;
				.logo{
					width: 90rpx;
					height: 90rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}
			.cell{
				font-size: 30rpx;
				margin-top: 30rpx;
				.label{
					width: 160rpx;
					color: #999999;
					margin-right: 20rpx;
				}
			}
		}
	}
	.drawer{
		padding: 0 30rpx;
		.title{
			font-size: 32rpx;
			margin-top: 50rpx;
			margin-bottom: 20rpx;
		}
		.xian{
			margin: 0 30rpx;
			color: #999999;
		}
		.inputBox{
			background-color: #F8F8F8;
			padding: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 10rpx;
			.input{
				height: 60rpx;
				line-height: 60rpx;
				font-size: 30rpx;
				flex: 1;
			}
			.del{
				color: #999999;
				font-size: 40rpx;
				margin-left: 10rpx;
			}
		}
		.grid{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 30rpx;
			&-item{
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 240rpx;
				height: 70rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				background-color: #f3f4f3;
				color: #87878b;
			}
			.active{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
		.btns{
			margin-top: 80rpx;
			padding-bottom: 40rpx;
			.btn{
				width: 45%;
				background-color: #f3f4f3;
				color: #87878b;
				font-size: 32rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
			.right{
				background-color: rgba($color: #381895, $alpha: .3);
				color: #381895;
			}
		}
	}
</style>

