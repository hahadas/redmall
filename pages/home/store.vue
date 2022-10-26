<template>
	<view>
		<view class="top" :style="{paddingTop: statusBarHeight + 'px'}">
			<image :src="info.backgroundImage" mode="aspectFill" class="bj"></image>
			<view class="mask bj"></view>
			<view class="header">
				<view class="flex flex-between" @tap="showPopup('popup')">
					<view><image :src="info.logoImage" mode="aspectFill" class="img"></image></view>
					<view class="flex flex-column flex-grow">
						<text class="line font34">{{info.name}}</text>
						<text class="line font26 color-b6">{{info.introduce}}</text>
						<text class="font26 color-b9">{{info.followAmount}}人关注</text>
					</view>
					<view class="flex flex-column color-purple">
						<text class="btn" @tap.stop="toFavorite()">{{info.isCollection?'已关注':'关注'}}</text>
						<text class="btn" @tap.stop="customerService(info.imAccount)">客服</text>
					</view>
				</view>
				<view class="header-coupons flex flex-between" @click="showPopup('discountPopup')" v-if="info.discountList && info.discountList.length > 0">
					<text class="font28 color-b3" style="margin-right: 20rpx;">优惠券</text>
					<view class="flex flex-align-center flex-grow">
						<block v-for="(d, i) in info.discountList" :key="i">
							<text class="c-item" v-if="i<3">满{{d.useStandardAmount}}减{{d.discountAmount}}</text>
						</block>
					</view>
					<view class="flex flex-align-center color-purple">
						<text class="font28">领券</text>
						<text class="iconfont font34" style="margin-top: 4rpx;">&#xe770;</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<view id="tabs" :class="{'fixed':fixed}" :style="{top:statusBarHeight+44 + 'px'}">
			<view class="tabs">
				<view class="tab" v-for="(item, i) in tabs" @click="tabsChange(i)">
					<text class="name" :class="[i === current ? 'color-purple' : 'color-b3']">{{item}}</text>
					<text class="active" v-if="i === current"></text>
					<text class="noActive" v-else></text>
				</view>
			</view>
		</view>
		<view>
			<block v-if="current === 0">
				<product :list="allList"></product>
				<uni-load-more :status="loadingType"></uni-load-more>
			</block>
			<block v-if="current === 1">
				<product :list="allList"></product>
				<uni-load-more :status="loadingType"></uni-load-more>
			</block>
			<view class="cate-section" v-if="current === 2 && classList.length > 0">
				<view class="cate-item" @click="navToTabPageList(item)" v-for="(item, index) in classList" :key="index">
					<image :src="item.mainImage"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view style="height: 1100upx; position: relative;">
				<view class="goods-list-vertical" style="height: 1100upx;overflow: scroll;">
					<!-- 商铺主要信息 -->
					<view class="goods-item-vertical">
						<view class="image-wrapper-vertical">
							<image :src="info.logoImage" mode="aspectFill"></image>
						</view>
						<view class="goods-list-right" style="width: 520upx;">
							<view class="goods-right-top">
								<text class="">{{ info.name }}</text>
							</view>
							<view class="goods-right-bottom">
								<text class="detailsText" style="font-size: 28upx;">{{info.introduce}}</text>
							</view>
							<view class="goods-right-bottom">
								<text class="detailsText" style="font-size: 28upx;">联系电话：{{info.mobile}}</text>
							</view>
						</view>
					</view>
					<!-- 隔离线 -->
					<view class="p-b-btn" style="height: 12upx;width: 100%;background: #bdbdbd21;"></view>
					
					<!-- 公告栏 -->
					<view class="goods-item-vertical" style="width: 100%;">
						<view class="goods-list-right" style="padding: 20upx 20upx;width: 100%;">
							<view class="goods-right-top">
								<text class="" style="font-size: 32upx;">公告</text>
							</view>
							<view class="goods-right-bottom">
								<text style="font-size: 28upx;color: #000000;">{{info.notice?info.notice:'未发布任何信息'}}</text>
							</view>
						</view>
					</view>
					<!-- 隔离线 -->
					<view class="p-b-btn" style="height: 12upx;width: 100%;background: #bdbdbd21;"></view>
					
					<!-- 店铺地址信息 -->
					<view class="goods-item-vertical" style="width: 100%;">
						<view class="goods-list-right" style="padding: 20upx 20upx;width: 100%;">
							<view class="goods-right-top">
								<text class="" style="font-size: 32upx;">店铺地址</text>
							</view>
							<view class="goods-right-bottom">
								<text style="font-size: 28upx;color: #000000;">{{addressName}}</text>
							</view>
						</view>
					</view>
					<!-- 隔离线 -->
					<view class="p-b-btn" style="height: 12upx;width: 100%;background: #bdbdbd21;"></view>
					
					<!-- 店铺营业执照 -->
					<view class="goods-item-vertical" style="width: 100%;">
						<view class="goods-list-right" style="padding: 20upx 20upx;width: 100%;">
							<view class="goods-right-top">
								<text class="" style="font-size: 32upx;">营业执照</text>
							</view>
							<view class="goods-right-bottom">
								<image :src="info.businessLicenseImg"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<button type="primary" class="bg-base" @tap="closePopup('popup')">关闭</button>
			</view>
		</uni-popup>
		<!-- 优惠明细 -->
		<uni-popup ref="discountPopup" type="bottom">
			<view class="discount">
				<text class="font32 color-purple">优惠明细</text>
				<view class="d-list">
					<block v-for="(item, i) in info.discountList" :key="i">
						<view class="d-list-item" v-if="item.status === 1">
							<view class="left">
								<text class="font26 tip">¥</text>
								<text class="font46 blod">{{item.discountAmount}}</text>
							</view>
							<view class="right flex flex-column flex-grow">
								<text class="font28">{{item.titleName}}</text>
								<text class="font30">满{{item.useStandardAmount}}可用</text>
								<text class="font26">{{item.expireTimeDay > 0 ? `有效期${item.expireTimeDay}天`:'永久有效'}}</text>
							</view>
							<text class="btn" v-if="item.number === 0">已领完</text>
							<text class="btn" v-else @tap.stop="onReceive(i)">{{item.userReceiveFlag ? '立即领取' : '已领取'}}</text>
						</view>
					</block>
				</view>
				<button type="primary" class="bg-base close" @click="closePopup('discountPopup')">关闭</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import product from "./modules/product.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default{
		components: { product, uniLoadMore, uniPopup },
		data(){
			return {
				id: "",
				current: 0,
				tabs: ["商品推荐", "全部商品", "所有分类"],
				tabsTop: 0,
				statusBarHeight: getApp().statusBarHeight,
				allList: [],
				info: {},
				classList: [],
				fixed: false,
				loadingType: "nomore",
				pageNum: 1,
				storeRecommendStatus: 2,
				addressName: ""
			}
		},
		onLoad(opt) {
			this.id = opt.id
			this.getDetailInfo()
			this.getAllGoods();
			this.getClassList()
			this.$getRect("#tabs").then(res =>{
				this.tabsTop = res.top
			})
		},
		onPageScroll(e) {
			if (e.scrollTop>this.tabsTop){
				this.fixed = true
			} else {
				this.fixed = false
			}
		},
		//加载更多
		onReachBottom() {
			this.pageNum = this.pageNum + 1;
			this.getAllGoods();
		},
		// 上拉刷新
		onPullDownRefresh(){
			this.getDetailInfo()
			this.getClassList()
			this.pageNum = 1
			this.allList = []
			if (this.current === 1) {
				this.storeRecommendStatus = -1
			}
			this.getAllGoods()
		},
		methods:{
			getClassList(){
				this.$http("GET", url.store.getStoreCategoryById, {storeId: this.id}).then(res =>{
					this.classList = res.data
				})
			},
			getAllGoods(){
				let params = {
					storeId: this.id,
					storeRecommendStatus: this.storeRecommendStatus,
					pageSize: this.pageNum
				}
				this.$http("GET", url.goods.getGoodsList, params).then(res =>{
					uni.stopPullDownRefresh();
					this.allList = this.allList.concat(res.data.records)
					this.loadingType = this.allList.length === res.data.total ? 'nomore' : 'more';
				})
			},
			getDetailInfo(){
				this.$http("GET", url.store.getStoreInfoById, {storeId: this.id}).then(res =>{
					this.info = res.data
					let city = this.filterAddr(res.data.threeAdcode)
					if (res.data.addressDetails.indexOf(city) > -1){
						this.addressName = res.data.addressDetails + res.data.addressSupplement
					} else {
						this.addressName = city + res.data.addressDetails + res.data.addressSupplement
					}
					uni.setNavigationBarTitle({
						title: res.data.name
					});
				})
			},
			customerService(imAccount){
				this.$navigateTo("../interaction/im-chat?type=3&&id="+imAccount)
			},
			//收藏
			toFavorite() {
				this.$http('post', url.store.followStore, {storeId: this.id}).then(res =>{
					this.info.isCollection = res.data
				})
			},
			tabsChange(e){
				this.current = e
				if (e !== 2) {
					this.pageNum = 1
					this.storeRecommendStatus = 2
					this.allList = []
					if (e === 1) {
						this.storeRecommendStatus = -1
					}
					this.getAllGoods()
				}
				
			},
			navToTabPageList(item) {
				uni.navigateTo({
					url: 'productClassList?storeId='+this.id+'&storeCategoryId='+item.id+"&title="+item.name
				});
			},
			showPopup(name){
				this.$refs[name].open()
			},
			closePopup(name){
				this.$refs[name].close()
			},
			onReceive(index){
				let userReceiveFlag = this.info.discountList[index].userReceiveFlag
				if (!userReceiveFlag) return
				let discountId = this.info.discountList[index].id
				this.$http("POST", url.user.receiveDiscount, {discountId: discountId}).then(res =>{
					this.$msg("恭喜，抢到了")
					this.info.discountList[index].userReceiveFlag = false
					if (this.info.discountList[index].number !== -1) {
						this.info.discountList[index].number--
					}
				})
			},
			filterAddr(code) {
				if (!code) return
				let addrObj = publics.getLngAndLatByCode(code)
				let addrName = ""
				if (addrObj){
					console.log(".....", addrObj)
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
	.top{
		background-color: white;
		position: relative;
		width: 750rpx;
		height: 250rpx;
		margin-bottom: 20rpx;
		.bj{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
		.mask{
			background: linear-gradient(to top, #ffffff 0%, rgba($color: #ffffff, $alpha: .3) 100%);
		}
	}
	.header{
		padding: 0rpx 30rpx;
		width: 690rpx;
		position: absolute;
		bottom: 0rpx;
		.img{
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			box-shadow: 0 10rpx 30rpx rgba($color: #000000, $alpha: .1);
		}
		.btn{
			border-radius: 8rpx;
			width: 100rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			margin-bottom: 10rpx;
			display: block;
			border:2rpx solid #381895;
			font-size: 26rpx;
		}
		&-coupons{
			padding: 10rpx 0 20rpx;
			.c-item{
				font-size: 24rpx;
				color: #381895;
				background-color: rgba($color: #381895, $alpha: .3);
				border-radius: 6rpx;
				margin-right: 10rpx;
				padding: 4rpx 10rpx;
			}
		}
	}
	.tabs{
		background-color: white;
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 2rpx solid #f6f6f6;
		.tab{
			font-size: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.name{
				margin-bottom: 16rpx;
			}
			.active{
				width: 60rpx;
				height: 6rpx;
				background-color: #381895;
				border-radius: 8rpx;
			}
			.noActive{
				width: 40rpx;
				height: 6rpx;
			}
		}
		
	}
	.fixed{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
	}
	.cate-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;
	
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26upx;
			color: #666;
			width: 25%;
			margin-top: 30rpx;
		}
		image {
			width: 120upx;
			height: 120upx;
			margin-bottom: 14upx;
			border-radius: 10rpx;
		}
	}
	.goods-list-vertical {
		display: flex;
		flex-wrap: wrap;
		background: #fff;
		.goods-item-vertical {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			.image-wrapper-vertical {
				width: 150upx;
				height: 150upx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10rpx 20rpx;
				image {
					border-radius: 5%;
					display: block;
					width: 150upx;
					height: 150upx;
				}
			}
			.goods-list-right {
				width: 470upx;
				.goods-right-top {
					height: 48upx;
					text {
						font-size: 36upx;
						font-weight: bolder;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}
				.goods-right-bottom {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.detailsText {
						font-size: 15upx;
						color: #909399;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.price {
						font-size: 32rpx;
						color: #381895;
						line-height: 1;
						&:before {
							content: '￥';
							font-size: 26upx;
						}
					}
					.sale {
						color: #909399;
						font-size: 28upx;
					}
				}
			}
		}
	}
	.p-b-btn {
		display: unset;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #606266;
		width: 96upx;
		height: 80upx;
		.yticon {
			font-size: 40upx;
			line-height: 48upx;
			color: #909399;
		}
		&.active,
		&.active .yticon {
			color: #381895;
		}
		.icon-fenxiang2 {
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang {
			font-size: 46upx;
		}
	}
	.discount{
		padding: 20rpx;
		border-radius: 20rpx 20rpx 0 0;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.d-list{
			margin-top: 50rpx;
			&-item{
				width: 650rpx;
				background-color: rgba($color: #381895, $alpha: .3);
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				color: #381895;
				.left{
					display: flex;
					align-items: flex-end;
					margin-right: 20rpx;
					.tip{
						margin-bottom: 10rpx;
						margin-right: 6rpx;
						display: inline-block;
					}
				}
				.btn{
					margin-right: 10rpx;
					font-size: 34rpx;
				}
			}
		}
		.close{
			width: 710rpx;
			margin-top: 50rpx;
			border-radius: 50rpx;
		}
	}
</style>
