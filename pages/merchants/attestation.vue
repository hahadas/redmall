<template>
	<view class="main" v-if="isDone">
		<view class="list">
			<view class="list-item" v-if="infor.nameOfEnterprise">
				<text class="label">企业名称：</text>
				<input type="text" disabled v-model="infor.nameOfEnterprise" class="input"/>
			</view>
			<view class="list-item" v-if="infor.socialCreditCode">
				<text class="label">信用代码：</text>
				<input type="text" disabled class="input" v-model="infor.socialCreditCode" />
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.businessLicenseImg">
			<text>营业执照：</text>
			<view class="flex flex-center box" @click="viewPhoto('businessLicenseImg')">
				<image :src="infor.businessLicenseImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.foodBusinessLicenseImg">
			<text>食品经营许可证：</text>
			<view class="flex flex-center box" @click="viewPhoto('foodBusinessLicenseImg')">
				<image :src="infor.foodBusinessLicenseImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.legalIdNumberJustImg">
			<text>法人身份证正面照：</text>
			<view class="flex flex-center box" @click="viewPhoto('legalIdNumberJustImg')">
				<image :src="infor.legalIdNumberJustImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.legalIdNumberBackImg">
			<text>法人身份证反面照：</text>
			<view class="flex flex-center box" @click="viewPhoto('legalIdNumberBackImg')">
				<image :src="infor.legalIdNumberBackImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.legalHealthCertificateImg">
			<text>法人健康证：</text>
			<view class="flex flex-center box" @click="viewPhoto('legalHealthCertificateImg')">
				<image :src="infor.legalHealthCertificateImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.othreOneImg">
			<text>其他证照：</text>
			<view class="flex flex-center box" @click="viewPhoto('othreOneImg')">
				<image :src="infor.othreOneImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.othreTwoImg">
			<text>其他证照：</text>
			<view class="flex flex-center box" @click="viewPhoto('othreTwoImg')">
				<image :src="infor.othreTwoImg" mode="" class="image"></image>
			</view>
		</view>
		<view class="grid flex flex-between" v-if="infor.othreThreeImg">
			<text>其他证照：</text>
			<view class="flex flex-center box" @click="viewPhoto('othreThreeImg')">
				<image :src="infor.othreThreeImg" mode="" class="image"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	
	export default{
		data(){
			return {
				infor: {},
				isDone: false
			}
		},
		onLoad(){
			this.$http("GET", url.store.getStoreInfo).then(res=>{
				this.infor = res.data
				this.isDone = true
			})
		},
		methods:{
			viewPhoto(name){
				let _this = this
				uni.previewImage({
					current: _this.infor[name],
					urls:[_this.infor[name]]
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.list{
			border-radius: 10rpx;
			background-color: white;
			padding: 0 30rpx;
			margin-bottom: 10rpx;
			&-item{
				display: flex;
				align-items: center;
				height: 120rpx;
				border-bottom: 2rpx solid #f5f3f7;
				color: #555;
				font-size: 36rpx;
				.input{
					font-size: 36rpx;
				}
				.icon{
					font-size: 44rpx;
				}
			}
			.cell{
				height: auto;
				flex-direction: column;
				align-items: flex-start;
				padding: 30rpx 0;
				.textarea{
					height: 200rpx;
					width: 100%;
					margin-top: 20rpx;
				}
			}
		}
		.grid{
			padding: 20rpx 30rpx;
			font-size: 36rpx;
			color: #555;
			background-color: white;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			.box{
				width: 350rpx;
				height: 250rpx;
				border: 2rpx solid #EEEEEE;
				border-radius: 14rpx;
				.img{
					width: 187rpx;
					height: 111rpx;
				}
				.image{
					width: 100%;
					height: 100%;
				}
			}
			
		}
		.btn{
			margin: 50rpx 0;
			border-radius: 50rpx;
		}
	}
</style>