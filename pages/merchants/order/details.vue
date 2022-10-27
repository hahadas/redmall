<template>
	<view>
		<view class="bg-w">
			<view class="bg-base flex flex-center flex-column header">
				<block v-if="orderInfo.status === 10">
					<text class="font30">已退款</text>
					<text class="font24">{{refundObj.identityType === 1 ? '用户' : '您'}}已操作退款</text>
				</block>
				<text v-if="orderInfo.status === 1">待付款</text>
				<text v-if="orderInfo.status === 2">未支付完成</text>
				<text v-if="orderInfo.status === 3">{{deliveryStatus(orderInfo)}}</text>
				<text v-if="orderInfo.status === 4">待评价</text>
				<text v-if="orderInfo.status === 5">已完成</text>
				<text v-if="orderInfo.status === 11">已关闭</text>
			</view>
			<view class="address-section">
				<view class="order-content">
					<image src="/static/user/addr.png" mode="" class="img"></image>
					<view class="cen">
						<view class="flex flex-between">
							<view class="top">
								<text class="name">{{ orderInfo.userFullName }}</text>
								<text class="mobile">{{ orderInfo.userMobile }}</text>
							</view>
							<text class="color-purple font28" @click="onCopy">复制</text>
						</view>
						<text class="address">{{ orderInfo.userThreeAdcode | filterAddr}}{{ orderInfo.userAddressDetails }}{{ orderInfo.userAddressSupplement }}</text>
					</view>
				</view>
				<image class="a-bg" src="/static/user/addr_bg.png"></image>
			</view>
			<view class="goods bg-w">
				<view class="goods-item">
					<view class="flex cen" @click="jumpTo('details', orderInfo.goodsId)">
						<view><image :src="filterImg(orderInfo.skuImage || orderInfo.goodsImage)" mode="" class="pic"></image></view>
						<view class="flex flex-column flex-grow">
							<text class="color-b3 line line-2 font32">{{orderInfo.goodsName}}</text>
							<text class="spec">{{orderInfo.skuName}}</text>
						</view>
						<view class="flex flex-column flex-align-end" style="margin-left: 10rpx;">
							<text class="color-b3 font32">¥{{orderInfo.unitPrice}}</text>
							<text class="color-b9 font26">x{{orderInfo.number}}</text>
						</view>
					</view>
					<view class="grid">
						<text class="label">商品类型</text>
						<text class="color-b9">{{orderInfo.orderType | filterType}}</text>
					</view>
					<view class="grid" v-if="orderInfo.paymentCombination === 2">
						<text class="label">组合支付</text>
						<text class="color-b9">人民币{{orderInfo.paymentRmb}}%，积分{{orderInfo.paymentIntegral}}</text>
					</view>
					<view class="grid">
						<text class="label">配送方式</text>
						<text class="color-b9">{{orderInfo.deliveryMethod | filterDelivery}}</text>
					</view>
					<view class="grid" v-if="orderInfo.orderType === 1 && orderInfo.bonusIntegral">
						<text class="label">赠送积分</text>
						<text class="color-b9">{{orderInfo.bonusIntegral}}%-{{(orderInfo.bonusIntegral*orderInfo.totalPrice).toFixed(2)}}积分</text>
					</view>
				</view>
				<view class="flex flex-between cell font26 color-b9">
					<text>商品总价</text>
					<text>¥{{orderInfo.totalPrice}}</text>
				</view>
				<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.orderType === 3">
					<text>进价百分比</text>
					<text>{{orderInfo.boutiqueBuying}}%</text>
				</view>
				<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.payIntegralAmount">
					<text>积分</text>
					<text>{{orderInfo.payIntegralAmount}}</text>
				</view>
				<view class="flex flex-between cell font26 color-b9" v-if="orderInfo.couponStatus === 2">
					<text>优惠券</text>
					<text>¥{{orderInfo.couponAmount}}</text>
				</view>
				<view class="flex flex-between cell font32">
					<text>实付款</text>
					<text class="color-purple">¥{{orderInfo.payRmbAmount}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9">
					<text>支付方式</text>
					<text>{{orderInfo.rmbPayType | filterPayType}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9">
					<text>订单编号</text>
					<text>{{orderInfo.orderNumber}}-<text class="color-purple" @click="$onCopy(orderInfo.orderNumber)">复制</text></text>
				</view>
				<block v-if="orderInfo.deliveryMethod === 1">
					<view class="flex flex-between cell font28 color-b9">
						<text>物流快递</text>
						<text>{{orderInfo.deliveryLogisticsCompanyName}}</text>
					</view>
					<view class="flex flex-between cell font28 color-b9">
						<text>物流单号</text>
						<text>{{orderInfo.deliveryLogisticsOrderNumber}}-<text class="color-purple" @click="$onCopy(orderInfo.deliveryLogisticsOrderNumber)">复制</text></text>
					</view>
				</block>
				<view class="flex flex-between cell font28 color-b9" v-if="orderInfo.rmbPayOrderNumber">
					<text>商户单号</text>
					<text>{{orderInfo.rmbPayOrderNumber}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9">
					<text>创建时间</text>
					<text>{{orderInfo.createTime}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9" v-if="orderInfo.rmbPayTime">
					<text>支付时间</text>
					<text>{{orderInfo.rmbPayTime}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9" v-if="refundObj">
					<text>退款原因</text>
					<text>{{refundObj.reasonContent}}</text>
				</view>
				<view class="flex flex-between cell font28 color-b9" v-if="refundObj">
					<text>退款时间</text>
					<text>{{refundOb.createTime}}</text>
				</view>
			</view>
		</view>
		
		<view class="list" v-if="orderInfo.deliveryPlatformEvaluate">
			<text class="title">评价信息</text>
			<view class="flex flex-align-center cell">
				<text class="label">商品评分：</text>
				<uni-rate :size="15" :margin="4" :value="orderInfo.goodsEvaluate.evaluateGoodsScore / 2" readonly></uni-rate>
			</view>
			<view class="flex cell">
				<text><text class="label">评价商品：</text>{{orderInfo.goodsEvaluate.evaluateGoodsComment}}</text>
			</view>
			<view class="flex flex-align-center cell">
				<view class="imgs" v-if="orderInfo.goodsEvaluate.evaluateGoodsImages">
					<image :src="item" mode="" class="pic" v-for="(item, index) in orderInfo.goodsEvaluate.evaluateGoodsImages" :key="index" @click="viewImg(orderInfo.goodsEvaluate.evaluateGoodsImages, item)"></image>
				</view>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionScore">
				<text class="label">配送员评分：</text>
				<uni-rate :size="15" :margin="4" :value="orderInfo.goodsEvaluate.evaluateDistributionScore" readonly></uni-rate>
			</view>
			<view class="flex cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionComment">
				<text><text class="label">评价配送员：</text>{{orderInfo.goodsEvaluate.evaluateDistributionComment}}</text>
			</view>
			<view class="flex flex-align-center cell" v-if="orderInfo.goodsEvaluate.evaluateDistributionImages">
				<view class="imgs">
					<image :src="item" mode="" class="pic" v-for="(item, index) in orderInfo.goodsEvaluate.evaluateDistributionImages" :key="index" @click="viewImg(orderInfo.goodsEvaluate.evaluateDistributionImages, item)"></image>
				</view>
			</view>
			<view class="flex flex-align-center cell">
				<text class="label">评价时间：</text>
				<text>{{orderInfo.goodsEvaluate.createTime}}</text>
			</view>
		</view>
		
		<!-- <block v-if="!showMore">
			<view class="flex flex-center" style="margin-top: 20rpx;">
				<text class="color-b9 font28" @click="showMore = true">点击加载相同订单</text>
			</view>
		</block>
		<block v-else>
			<view class="bg-w" style="margin-top: 20rpx;" v-for="(item,i) in list" :key="i">
				<view class="bg-base flex flex-center flex-column header">
					<block v-if="item.status === 10">
						<text class="font30">已退款</text>
						<text class="font24" v-if="item.refundList">{{item.refundList[0].identityType === 1 ? '用户' : '您'}}已操作退款</text>
					</block>
					<text v-if="item.status === 1">待付款</text>
					<text v-if="item.status === 2">未支付完成</text>
					<text v-if="item.status === 3">{{deliveryStatus(item)}}</text>
					<text v-if="item.status === 4">待评价</text>
					<text v-if="item.status === 5">已完成</text>
					<text v-if="item.status === 11">已关闭</text>
				</view>
				<view class="address-section">
					<view class="order-content">
						<image src="/static/user/addr.png" mode="" class="img"></image>
						<view class="cen">
							<view class="top">
								<text class="name">{{ item.userFullName }}</text>
								<text class="mobile">{{ item.userMobile }}</text>
							</view>
							<text class="address">{{ item.userThreeAdcode | filterAddr}}{{ item.userAddressDetails }}{{ item.userAddressSupplement }}</text>
						</view>
					</view>
					<image class="a-bg" src="/static/user/addr_bg.png"></image>
				</view>
				<view class="goods bg-w">
					<view class="goods-item">
						<view class="flex cen" @click="jumpTo('details', item.goodsId)">
							<view><image :src="filterImg(item.skuImage || item.goodsImage)" mode="" class="pic"></image></view>
							<view class="flex flex-column flex-grow">
								<text class="color-b3 line line-2 font32">{{item.goodsName}}</text>
								<text class="spec">{{item.skuName}}</text>
							</view>
							<view class="flex flex-column flex-align-end" style="margin-left: 10rpx;">
								<text class="color-b3 font32">¥{{item.unitPrice}}</text>
								<text class="color-b9 font26">x{{item.number}}</text>
							</view>
						</view>
						<view class="grid">
							<text class="label">商品类型</text>
							<text class="color-b9" v-if="item.orderType === 1">普通商品</text>
							<text class="color-b9" v-if="item.orderType === 2">精品商品</text>
							<text class="color-b9" v-if="item.orderType === 3">进货商品</text>
						</view>
						<view class="grid" v-if="item.paymentCombination === 2">
							<text class="label">组合支付</text>
							<text class="color-b9">人民币{{item.paymentRmb}}%，积分{{item.paymentIntegral}}</text>
						</view>
						<view class="grid">
							<text class="label">配送方式</text>
							<text class="color-b9">{{item.deliveryMethod | filterDelivery}}</text>
						</view>
						<view class="grid" v-if="item.orderType === 1 && item.bonusIntegral">
							<text class="label">赠送积分</text>
							<text class="color-b9">{{item.bonusIntegral}}%-{{(item.bonusIntegral*item.totalPrice).toFixed(2)}}积分</text>
						</view>
					</view>
					<view class="flex flex-between cell font26 color-b9">
						<text>商品总价</text>
						<text>¥{{item.totalPrice}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.orderType === 3">
						<text>进价百分比</text>
						<text>{{item.boutiqueBuying}}%</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.payIntegralAmount">
						<text>积分</text>
						<text>{{item.payIntegralAmount}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.couponStatus === 2">
						<text>优惠券</text>
						<text>¥{{item.couponAmount}}</text>
					</view>
					<view class="flex flex-between cell font32">
						<text>实付款</text>
						<text class="color-purple">¥{{item.payRmbAmount}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9">
						<text>支付方式</text>
						<text>{{item.rmbPayType | filterPayType}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9">
						<text>订单编号</text>
						<text>{{item.orderNumber}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.rmbPayOrderNumber">
						<text>商户单号</text>
						<text>{{item.rmbPayOrderNumber}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9">
						<text>创建时间</text>
						<text>{{item.createTime}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.rmbPayTime">
						<text>支付时间</text>
						<text>{{item.rmbPayTime}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.refundList">
						<text>退款原因</text>
						<text>{{item.refundList[0].reasonContent}}</text>
					</view>
					<view class="flex flex-between cell font26 color-b9" v-if="item.refundList">
						<text>退款时间</text>
						<text>{{item.refundList[0].createTime}}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loading"></uni-load-more>
		</block> -->
		<view class="fixed flex flex-space-end">
			<!-- 申请退款/退货 -->
			<text class="btn" v-if="orderInfo.status === 3 && judgeRefund(orderInfo)" @click="afterSales(orderInfo)">退款</text>
			<!-- 物流配送 -->
			<text class="btn" v-if="orderInfo.deliveryMethod === 1 && orderInfo.deliveryLogisticsStatus === 1" @click="showModal(1)">确认发货</text>
			<text class="btn" v-if="orderInfo.deliveryMethod === 1 && orderInfo.deliveryLogisticsStatus === 2" @click="showModal(1)">修改发货</text>
			<!-- 商家配送 -->
			<text class="btn" v-if="orderInfo.deliveryMethod === 2 && orderInfo.deliveryBusinessStatus === 1" @tap="showModal(2)">开始配送</text>
			<text class="btn" v-if="orderInfo.deliveryMethod === 2 && orderInfo.deliveryBusinessStatus === 2" @tap="showModal(5)">确认送达</text>
			<!-- 用户自提 -->
			<text class="btn" v-if="orderInfo.deliveryMethod === 3 && orderInfo.deliveredRaisingStatus === 1" @click="showModal(3)">用户取货</text>
			<!-- 平台配送 -->
			<text class="btn" v-if="orderInfo.deliveryMethod === 4 && orderInfo.deliveryPlatformStatus === 3" @click="showModal(4)">配送员取货</text>
			<!-- 平台配送，普通商品，配送员已取货但想取消配送，可让商家操作，配送员需提供取货码 -->
			<text class="btn" 
				v-if="orderInfo.deliveryMethod === 4 && orderInfo.orderType === 1 && orderInfo.deliveryPlatformStatus === 4" 
				@click="showModal(6)">取消配送</text>
		</view>
		<!-- 确认发货/开始配送-->
		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<text class="title">{{modalType === 1 ? '确认发货' : '开始配送'}}</text>
				<view class="form" @click="selectAddr">
					<text>发货地址</text>
					<view class="flex-grow color-b6" style="width: 400rpx;text-align: right;">
						<text v-if="addressData.addressDetails">{{ addressData.threeAdcode | filterAddr }}{{addressData.addressDetails}}{{addressData.addressSupplement}}</text>
						<block v-else>
							<text>请选择</text>
							<text class="iconfont color-b9">&#xe770;</text>
						</block>
					</view>
				</view>
				<block v-if="modalType === 1">
					<view class="form">
						<text>物流快递</text>
						<picker class="flex-grow" style="text-align: right;" @change="bindPickerChange" mode="selector" range-key="comName" :range="pickerList">
							<text class="color-b6" v-if="expressInfo.comName">{{expressInfo.comName}}</text>
							<view v-else>
								<text class="color-b6">请选择</text>
								<text class="iconfont color-b9">&#xe770;</text>
							</view>
						</picker>
					</view>
					<view class="form" v-if="expressInfo.comName === '其他'">
						<text>其他快递</text>
						<input type="text" :maxlength="10" v-model="comName" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
					</view>
					<view class="form">
						<text>物流单号</text>
						<input type="text" :maxlength="30" v-model="expressNumber" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
					</view>
				</block>
				<view class="flex flex-align-center flex-space-around">
					<button type="default" class="btn" @click="closePopup">取消</button>
					<button type="primary" class="btn bg-base" @click="onConfirm">确认</button>
				</view>
			</view>
		</uni-popup>
		<!-- 用户自提/配送员取货/确认送达 -->
		<uni-popup ref="selfPopup" type="bottom">
			<view class="popup">
				<text class="title" v-if="modalType === 3">用户自提</text>
				<text class="title" v-if="modalType === 4">配送员取货</text>
				<text class="title" v-if="modalType === 5">确认送达</text>
				<text class="title" v-if="modalType === 6">取消配送</text>
				<view class="form">
					<text v-if="modalType === 5">送达码</text>
					<text v-if="modalType === 6">取消码</text>
					<text v-else>取货码</text>
					<input type="number" :maxlength="6" v-model="code" placeholder="请输入" class="flex-wrap color-b6 flex-1" style="margin-left: 20rpx;">
				</view>
				<view class="flex flex-align-center flex-space-around">
					<button type="default" class="btn" @click="closePopup">取消</button>
					<button type="primary" class="btn bg-base" @click="selfExtraction">确认</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import mix from "../../order/mix.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		mixins: [mix],
		components: { uniPopup, uniLoadMore },
		data(){
			return {
				id: "",
				orderInfo: {},
				pageSize: 1,
				list: [],
				loading: "loading",
				showMore: false,
				modalType: 1,
				comName: "",
				code: "", // 送达码/取货码
				addressData: {},
				expressInfo: {},
				pickerList: [],
				refundObj: null,
				expressNumber: ""
			}
		},
		filters: {
			filterType(val){
				let value = "其他"
				selectOptions.goodsTypeList.forEach(v => {
					if (v.value === val) {
						value = v.name
						return
					}
				})
				return value
			}
		},
		computed: {
			...mapState(["userInfo"])
		},
		onLoad(opt) {
			this.id = opt.id
		},
		onShow() {
			this.getOrderInfo('add')
		},
		onPullDownRefresh() {
			this.getOrderInfo('refresh')
		},
		methods:{
			getOrderInfo(type){
				if (type === 'add') {
					if (this.loading === 'nomore') {
						return;
					}
					this.loading = 'loading';
				} else {
					this.loading = 'more';
					this.pageSize = 1
					this.list = []
				}
				let params = {
					orderId: this.id,
					pageSize: this.pageSize
				}
				this.$http("GET", url.store.getOrderDetailById, params).then(res =>{
					this.orderInfo = res.data.order
					if (this.orderInfo.refundList) {
						this.refundObj = this.orderInfo.refundList[0]
					}
					let list = res.data.pageOrder
					this.list = this.list.concat(list.records)
					if(this.list.length < list.total){
						this.pageSize++
						this.loading = "more"
					} else{
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh()
				})
			},
			async showModal(type){
				this.modalType = type
				if (type === 3 || type === 4 || type === 5 || type === 6) {
					this.$refs.selfPopup.open()
				} else {
					this.comName = ""
					this.addressData = {
						id: 0,
						threeAdcode: this.orderInfo.storeThreeAdcode,
						addressDetails: this.orderInfo.storeAddressDetails,
						addressSupplement: this.orderInfo.storeAddressSupplement
					}
					this.expressInfo = {}
					if (type === 1) {
						this.pickerList = []
						let res = await this.$http("GET", url.juhe.getAllExpCom)
						this.pickerList = res.data
						this.pickerList.push({comName: "其他", noCode: null})
					}
					this.$refs.popup.open()
				}
			},
			closePopup(){
				this.$refs.popup.close()
				this.$refs.selfPopup.close()
			},
			selectAddr(){
				this.$navigateTo("/pages/user/address/index?type=2&&source=true")
			},
			bindPickerChange(e){
				this.expressInfo = this.pickerList[e.detail.value]
			},
			onConfirm(){
				if (this.modalType === 1 && !this.expressInfo.id) return this.$msg("请选择发货物流快递")
				if (this.modalType === 1 && !this.expressNumber) return this.$msg("请输入物流单号")
				this.closePopup()
				uni.showLoading({
					mask: true
				})
				let params = {
					orderId: this.id,
					expressNumber: this.expressNumber,
					shippingAddressId: this.addressData.id,
					noCode: this.expressInfo.noCode,
					comName: this.comName || this.expressInfo.comName
				}
				this.$http("POST", url.store.deliverGoods, params).then(res =>{
					uni.hideLoading()
					this.$msg(res.data)
					this.getOrderInfo('refresh')
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 3-用户自提/4-配送员取货/5-确认送达
			selfExtraction(){
				if (!this.code) {
					if (this.modalType !== 5) {
						return this.$msg("请输入取货码")
					} else {
						return this.$msg("请输入送达码")
					}
				}
				this.closePopup()
				uni.showLoading({
					mask: true
				})
				let path = null
				let params = {
					orderId: this.id
				}
				if (this.modalType === 5) {
					path = url.store.confirmationService
					params.deliveryBusinessCode = this.code
				} else if (this.modalType === 6){
					path = url.store.cancelDeliveredOrder
					params.deliveryBusinessCode = this.code
				} else {
					path = url.store.deliverGoods
					params.deliveredRaisingCode = this.code
				}
				this.$http("POST", path, params).then(res =>{
					uni.hideLoading()
					this.$msg(res.data)
					this.getOrderInfo('refresh')
				}).catch(()=>{
					uni.hideLoading()
				})
			},
			// 退货退款
			afterSales(row){
				let data = {
					orderId: this.id,
					userType: 2, // 1-用户退款 2-商家退款
					goodsId: row.goodsId,
					goodsName: row.goodsName,
					goodsImage: row.skuImage || row.goodsImage,
					skuName: row.skuName,
					price: row.totalPrice,
					number: row.number,
					toImAccount: row.userInfo.imAccount, // 用户的imAccount
					identity: this.userInfo.imAccount, // 身份标示
				}
				uni.setStorageSync("refundData", data)
				this.$navigateTo(`refund`)
			},
			jumpTo(path, id){
				this.$navigateTo(`/pages/home/${path}?id=${id}`)
			},
			onCopy(){
				let str = this.orderInfo.userFullName + "-" + this.orderInfo.userMobile + "-" + publics.getAddressByThreeCode(this.orderInfo.userThreeAdcode) + this.orderInfo.userAddressDetails
				if (this.orderInfo.userAddressSupplement) {
					str = str + this.orderInfo.userAddressSupplement
				}
				this.$onCopy(str)
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		height: 100rpx;
		border-radius: 0 0 30rpx 30rpx;
		margin-bottom: 20rpx;
		color: white;
	}
	.address-section {
		padding: 30upx;
		background: #fff;
		position: relative;
		.order-content {
			display: flex;
			align-items: center;
		}
		
		.img{
			width: 60rpx;
			height: 60rpx;
			border-radius: 8rpx;
		}
		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 32upx;
			color: #303133;
			margin-left: 20rpx;
		}
		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}
		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: #909399;
		}
		.icon-right {
			font-size: 44upx;
			color: #909399;
		}
		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}
	.goods{
		padding: 20rpx;
		.store{
			margin-bottom: 30rpx;
			.img{
				width: 50rpx;
				height: 50rpx;
				border-radius: 4rpx;
				margin-right: 10rpx;
			}
		}
		&-item{
			.cen{
				margin-bottom: 20rpx;
				.pic{
					width: 180rpx;
					height: 180rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}
				.spec{
					background-color: #F8F8F8;
					color: #bcbbbd;
					font-size: 24rpx;
					padding: 10rpx;
					margin-top: 4rpx;
					border-radius: 8rpx;
					align-self: flex-start;
				}
			}
			.grid{
				margin-bottom: 20rpx;
				font-size: 28rpx;
				.label{
					width: 180rpx;
					margin-right: 20rpx;
					text-align: right;
					display: inline-block;
				}
			}
		}
		.cell{
			margin-top: 10rpx;
		}
		.li{
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #666666;
			.label{
				width: 160rpx;
			}
			.note{
				width: 500rpx;
			}
		}
	}
	.list{
		background-color: white;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
		.title{
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
			border-left: 8rpx solid #381895;
			padding-left: 20rpx;
			margin-bottom: 20rpx;
			display: block;
		}
		.cell{
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666666;
			.label{
				width: 140rpx;
			}
			.imgs{
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 10rpx;
				.pic{
					width: 160rpx;
					height: 160rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
	.fixed{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background-color: #FFFFFF;
		border-top: 2rpx solid #f0f0f0;
		.btn{
			font-size: 26rpx;
			border: 2rpx solid #381895;
			padding: 10rpx 26rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			color: #381895;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}
	.popup{
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx;
		.title{
			display: block;
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		.form{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 40rpx;
			border-bottom: 2rpx solid #EEEEEE;
			padding-bottom: 20rpx;
			color: #333333;
		}
		.btn{
			width: 40%;
		}
	}
</style>
