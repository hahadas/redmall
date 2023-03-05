<template>
	<view>
		<view class="list">
			<view class="address-section">
				<view class="order-content" @click="selectAddress">
					<image src="/static/user/addr.png" mode="" class="img"></image>
					<view class="cen" v-if="form.shippingFullName">
						<view class="top">
							<text class="name">{{ form.shippingFullName }}</text>
							<text class="mobile">{{ form.shippingMobile }}</text>
						</view>
						<text class="address">{{ form.shippingAdcodeThree | filterAddr}}{{form.shippingDetailed}}{{form.shippingAddressSupplement}}</text>
					</view>
					<view class="cen" v-else>
						<text>请选择发货地址</text>
					</view>
					<text class="iconfont icon-right">&#xe770;</text>
				</view>
			</view>
			<!-- <view class="list-item">
				<text class="label">
					<text class="color-red">*</text>
					发货地址：
				</text>
				<view class="flex flex-align-center color-b9" @click="selectAddress">
					<text v-if="!form.shippingAdcodeThree">请选择</text>
					<text v-else>{{form.shippingAdcodeThree | filterAddr}}</text>
					<text class="iconfont font40">&#xe770;</text>
				</view>
			</view> -->
			<!-- <view class="list-item">
				<text class="color-w">*</text>
				<input type="text" placeholder="详细地址" disabled v-model="form.shippingDetailed" class="flex-grow input">
			</view> -->
			<!-- <view class="list-item">
				<text class="label">
					<text class="color-w">*</text>
					是否包邮：
				</text>
				<switch color="#381895" @change="switchChange($event, 'freeShipping')" class="switch" />
			</view>
			<view class="list-item" v-if="form.freeShipping === 2">
				<text class="label">
					<text class="color-red">*</text>
					邮费：
				</text>
				<input type="number" placeholder="邮费" v-model="form.postageTemplateId" class="flex-grow input">
			</view> -->
			<view class="list-item" v-if="form.goodsType !== 2">
				<text class="label">
					<text class="color-w">*</text>
					无需配送：
				</text>
				<switch color="#381895" :checked="form.deliveryNo === 1 ?true:false" @change="switchChange($event, 'deliveryNo')" class="switch" />
			</view>
			<block v-if="form.deliveryNo === 2">
				<view class="list-item">
					<text class="label">
						<text class="color-w">*</text>
						商家配送：
					</text>
					<switch color="#381895" :checked="form.deliveryBusiness === 1 ?true:false" @change="switchChange($event, 'deliveryBusiness')" class="switch" />
				</view>
				<view class="list-item">
					<text class="label">
						<text class="color-w">*</text>
						平台配送：
					</text>
					<switch color="#381895" :checked="form.deliveryPlatform === 1 ?true:false" :disabled="form.goodsType === 2" @change="switchChange($event, 'deliveryPlatform')" class="switch" />
				</view>
				<!-- 开启平台配送 并且 商品类型不是 精品商品 才显示 -->
				<view class="list-item" style="height: auto;" v-if="form.deliveryPlatform === 1 && form.goodsType != 2">
					<text class="font26 color-b9">
						配送员配送费：￥{{(parseFloat(form.wholesalePrice)*(parseFloat(form.bonusProfit)/100)*(parseFloat(distributionFee)/100)).toFixed(2)}} {{(parseFloat(form.wholesalePrice)*(parseFloat(form.bonusProfit)/100)*(parseFloat(distributionFee)/100))<1 ? ' ，配送费过低，可能导致无人接单配送，可去“商品信息”增加“商品分润比例”提高配送费。':''}}
						配送费计算方式：商品零售价(￥{{form.wholesalePrice}})*商品分润比例({{form.bonusProfit}}%)*配送员佣金比例({{distributionFee}}%)。
					</text>
				</view>
				<view class="list-item">
					<text class="label">
						<text class="color-w">*</text>
						用户自提：
					</text>
					<switch color="#381895" :checked="form.deliverySelfraising === 1 ?true:false" @change="switchChange($event, 'deliverySelfraising')" class="switch" />
				</view>
				<view class="list-item bor-no">
					<text class="label">
						<text class="color-w">*</text>
						快递邮寄：
					</text>
					<switch color="#381895" :checked="form.deliveryExpress === 1 ?true:false" @change="switchChange($event, 'deliveryExpress')" class="switch" />
				</view>
			</block>
			
			<!-- <view class="list-item ">
				<text class="label">
					<text class="color-red">*</text>
					支付方式：
				</text>
				<checkbox-group class="checkbox" @change="checkboxChange">
					<view v-for="(item, i) in payList" :key="i">
						<checkbox :value="item.value" :checked="item.check" color="#381895" style="transform:scale(0.7)" />
						<text class="color-b3 font32">{{item.name}}</text>
					</view>
				</checkbox-group>
			</view> -->
		</view>
		<view class="btn">
			<button type="primary" class="prev item" @click="prev">上一步，填写商品详情</button>
			<button type="primary" class="bg-base item" :loading="loading" :disabled="loading" @click="next">完成，提交商品</button>
		</view>
		
		<!-- <w-picker
			:visible.sync="visible"
			ref="mpvueCityPicker"
			mode="region"
			:value="pickerValue"
			@confirm="onConfirm"
			themeColor="#3a2397"
		></w-picker> -->
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue"
	import publics from "@/common/utils/public.js"
	import url from "@/common/http/url.js"
	export default{
		components: { wPicker },
		props: ["form", "loading"],
		data(){
			return {
				distributionFee: "",
				visible: false,
				pickerText: "",
				pickerValue: [],
				addrData: {},
				addressInfo: {},
				// payList: [
				// 	{name: "支付宝", value:"ali", check:false},
				// 	{name: "微信", value:"wechat", check:false},
				// 	{name: "银行卡", value:"bank", check:false},
				// 	{name: "余额", value:"balance", check:false}
				// ]
			}
		},
		filters: {
			filterAddr(code) {
				if (!code) return
				return publics.getAddressByThreeCode(code)
			},
		},
		watch:{
			addrData(val){
				console.log(".....val......", val)
				this.form.shippingAdcodeOne = val.oneAdcode
				this.form.shippingAdcodeTwo = val.twoAdcode
				this.form.shippingAdcodeThree = val.threeAdcode
				this.form.shippingDetailed = val.addressDetails
				this.form.shippingAddressSupplement = val.addressSupplement
				this.form.shippingFullName = val.fullName
				this.form.shippingMobile = val.mobile
				this.form.shippingLng = val.lng
				this.form.shippingLat = val.lat
				this.$forceUpdate()
			}
		},
		mounted() {
			// 获取配送员佣金比例
			this.$http("GET", url.common.distributionFee).then(res=>{
				this.distributionFee = res.data.unBoutique
			})
		},
		methods:{
			selectAddress(){
				this.$navigateTo("/pages/user/address/index?type=2&&source=true&&id="+this.addrData.id)
			},
			onConfirm(e) {
				let _this = this
				this.pickerText = e.result
				this.form.shippingAdcodeOne = e.obj.province.value
				this.form.shippingAdcodeTwo = e.obj.city.value
				this.form.shippingAdcodeThree = e.obj.area.value
				let addressInfo = e.obj.area
				this.addressInfo = addressInfo
				uni.chooseLocation({
					longitude: addressInfo.centerLng.toString(),
					latitude: addressInfo.centerLat.toString(),
					success(res) {
						if (res.address.startsWith(e.result)){
							_this.form.shippingDetailed = res.address.split(e.result)[1]
						} else if (res.name === '地图位置' || res.name === res.address){
							_this.form.shippingDetailed = res.address
						} else {
							_this.form.shippingDetailed = res.name + res.address
						}
						_this.$forceUpdate()
					}
				})
			},
			switchChange(e, name){
				let value = e.detail.value ? 1 : 2
				this.form[name] = value
				console.log("switchChange", name, this.form[name])
				this.$forceUpdate()
			},
			// checkboxChange(e){
			// 	let value = e.detail.value
			// 	this.form.paymentTypes = JSON.stringify(value)
			// },
			prev(){
				this.$emit("prev")
			},
			next(){
				this.$emit("next", this.form)
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		.address-section {
			padding: 30upx;
			background: #fff;
			position: relative;
			border-bottom: 2rpx solid #EEEEEE;
			.order-content {
				display: flex;
				align-items: center;
			}
			.img{
				width: 50rpx;
				height: 50rpx;
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
		}
		&-item{
			border-bottom: 2rpx solid #EEEEEE;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			.label{
				width: 230rpx;
			}
			.input{
				font-size: 34rpx;
			}
			.checkbox{
				display: flex;
				flex-wrap: wrap;
			}
		}
		.switch{
			transform: scale(0.8);
		}
	}
	.btn{
		margin-top: 80rpx;
		padding-bottom: 50rpx;
		.prev{
			background-color: #c0c1c2;
		}
		.item{
			border-radius: 50rpx;
			width: 80%;
			margin-top: 40rpx;
		}
	}
</style>
