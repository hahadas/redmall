<template>
	<view class="content">
		<v-tabs
			v-if="isDone"
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:fixed="true" 
			:scroll="tabs.length > 3 ? true : false"
			@change="changeTab">
		</v-tabs>
		<view class="search">
			<view class="left">
				<input type="number" :maxlength="3" v-model="frontMobile" placeholder="手机号前三位" />
				<text class="xian">—</text>
				<input type="number" :maxlength="4" v-model="afterMobile" placeholder="手机号后四位" />
			</view>
			<text class="btn bg-base" @click="onSearch">搜索</text>
		</view>
		<view v-for="(item, index) in list" :key="index" class="order-item">
			<!-- <view class="i-top b-b">
				<text class="time">入驻时间: {{item.createTime}}</text>
			</view> -->
			<view class="goods-box-single" @tap="jumpTo(item)">
				<image class="goods-img" :src="item.headPortrait||avatar" mode="aspectFill"></image>
				<view class="right">
					<view class="flex flex-align-center">
						<text class="iconfont font28" style="color: #1995fc; margin-bottom: 4rpx;" v-if="item.gender === 2">&#xe621;</text>
						<text class="iconfont font28" style="color: #ff4d94; margin-bottom: 4rpx;" v-if="item.gender === 3">&#xe622;</text>
						<text class="title" style="margin-left: 10rpx;">{{ item.nickname ? item.nickname : '昵称未设置' }}</text>
					</view>
					<text class="title">{{ item.mobile }}</text>
					<text class="title" v-if="type">等级: Lv.{{item.depositLevel}}</text>
					<view class="flex flex-between">
						<text class="title">推荐码: {{ item.recommendCode }}</text>
						<text class="color-purple font28" @tap.stop="$onCopy(item.recommendCode)">复制</text>
					</view>
					<text class="title" v-if="type">累计收益: {{ item.totalTeamDeposit }}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import { timestampToTime } from '@/common/utils/index.js';
	export default {
		components: {
			uniLoadMore, vTabs
		},
		data() {
			return {
				avatar: this.$staticUrl + 'user/avatar.png',
				isDone: false,
				current: 0,
				tabs: [],
				type: null,
				list: [],
				pageSize: 1,
				loading: "loading",
				frontMobile: "",
				afterMobile: ""
			};
		},
		onLoad(opt) {
			if (opt.type) this.type = opt.type
			this.init('add')
		},
		methods: {
			init(type){
				// 获取团队类型数量
				this.$http("GET", url.user.getTeamCount).then(res => {
					if (typeof res.data === "object") {
						let array = []
						for(let i in res.data) {
							if (res.data[i] > 0) {
								array.push(this.filterTabs(i, res.data[i]))
							}
						}
						// 把全部拿出来放到tabs的第一个
						let allObject = null
						array.forEach((v, i) => {
							if (v.value === "-1") {
								allObject = v
								array.splice(i, 1)
								return
							}
						})
						if (!allObject) {
							this.loading = 'nomore'
							return
						}
						array.unshift(allObject)
						this.tabs = array
						this.isDone = true
						this.loadData(type);
					}
				})
			},
			//获取订单列表
			loadData(type) {
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.list = []
					this.pageSize = 1
					this.loading = 'more';
				}
				let params = {
					pageSize: this.pageSize,
					frontMobile: this.frontMobile,
					afterMobile: this.afterMobile,
					type: this.tabs[this.current].value
				}
				console.log("....请求参数.....", params)
				let path = this.type ? url.deposit.getTeamList : url.user.getTeamList
				this.$http("GET", path, params).then(res =>{
					// uni.setNavigationBarTitle({
					// 	title: `我的团队(${res.data.total})`
					// })
					this.list = this.list.concat(res.data.records)
					if(this.list.length < res.data.total){
						this.pageSize++;
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh();
				}).catch(()=>{
					uni.stopPullDownRefresh();
					this.loading = "nomore"
				})
			},
			onSearch(){
				if (!this.frontMobile && !this.afterMobile) return
				this.init('refresh')
			},
			changeTab(e){
				this.current = e
				this.loadData("refresh")
			},
			filterTabs(key, total){
				let value = key.split("type")[1]
				let name = ""
				switch(value){
					case "-1":
						name = "全部";
						break;
					case "1":
						name = "普通用户";
						break;
					case "2":
						name = "配送员";
						break;
					case "3":
						name = "商家";
						break;
					case "4":
						name = "初级达人";
						break;
					case "5":
						name = "中级达人";
						break;
					case "6":
						name = "高级达人";
						break;
					case "7":
						name = "至尊达人";
						break;
					case "8":
						name = "普通掌柜";
						break;
					case "9":
						name = "中级掌柜";
						break;
					case "10":
						name = "高级掌柜";
						break;
					case "11":
						name = "区代理";
						break;
					case "12":
						name = "市代理";
						break;
					case "13":
						name = "省代理";
						break;
					default:
						name = "其他"
						break;
				}
				name = `${name}(${total})`
				return {name: name, value: value}
			},
			jumpTo(row){
				this.$navigateTo("/pages/interaction/user?userId="+row.imAccount)
			}
		},
		//加载更多
		onReachBottom() {
			this.loadData('add');
		},
		//下拉刷新
		onPullDownRefresh() {
			this.init('refresh')
		}
	};
</script>

<style lang="scss" scoped>
page, .content {
	background: #f8f8f8;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 750rpx;
	overflow: hidden;
}
.search{
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	.left{
		background-color: #eeeff3;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		width: 600rpx;
		border-radius: 10rpx;
		input{
			width: 200rpx;
			text-align: center;
		}
		.xian{
			color: #999999;
			margin: 0 20rpx;
		}
	}
	.btn{
		margin-left: 20rpx;
		height: 90rpx;
		border-radius: 10rpx;
		width: 100rpx;
		line-height: 90rpx;
		color: white;
		text-align: center;
		font-size: 32rpx;
	}
}
.order-item {
	display: flex;
	flex-direction: column;
	padding-left: 30upx;
	background: #fff;
	margin-top: 16upx;
	width: 750rpx;
	.i-top {
		display: flex;
		align-items: center;
		height: 80upx;
		padding-right: 30upx;
		font-size: 28rpx;
		color: #303133;
		position: relative;
		.time {
			flex: 1;
		}
		.state {
			color: #fa436a;
		}
		.del-btn {
			padding: 10upx 0 10upx 36upx;
			font-size: 32rpx;
			color: #909399;
			position: relative;
			&:after {
				content: '';
				width: 0;
				height: 30upx;
				border-left: 1px solid #303133;
				position: absolute;
				left: 20upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	/* 单条商品 */
	.goods-box-single {
		display: flex;
		padding: 20upx 0;
		.goods-img {
			display: block;
			width: 120upx;
			height: 120upx;
			border-radius: 10rpx;
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;
			.title {
				font-size: 30rpx;
				color: #303133;
				line-height: 1;
				margin-bottom: 8rpx;
			}
			.attr-box {
				font-size: 26rpx;
				color: #909399;
				padding: 10upx 12upx;
			}
			.price {
				font-size: 30rpx;
				color: #303133;
				&:before {
					content: '￥';
					font-size: 24rpx;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}

	.price-box {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		padding: 20upx 30upx;
		font-size: 26upx;
		color: #909399;
		.num {
			margin: 0 8upx;
			color: #303133;
		}
		.price {
			font-size: 32rpx;
			color: #303133;
			&:before {
				content: '￥';
				font-size: 24rpx;
				margin: 0 2upx 0 8upx;
			}
		}
	}
	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100upx;
		position: relative;
		padding-right: 30upx;
	}
	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: 26rpx;
		color: #303133;
		background: #fff;
		border-radius: 100px;
		&:after {
			border-radius: 100px;
		}
		&.recom {
			background: #fff9f9;
			color: #fa436a;
			&:after {
				border-color: #f7bcc8;
			}
		}
	}
}

</style>
