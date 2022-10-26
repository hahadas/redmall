<template>
	<view class="main">
		<text class="title">请选择如下中的平台收款账号进行汇款</text>
		<block v-for="(item, i) in list" :key="i">
			<view class="cell" v-if="item.status === 1">
				<view class="cell-item" @click="onSelect(i)">
					<text class="iconfont color-b9 icon" v-if="!item.check">&#xe662;</text>
					<text class="iconfont color-purple icon" v-else>&#xe661;</text>
					<text class="name">{{item.bankName}}</text>
					<text class="color-b9 font30">点击{{item.check?'收起':'展开'}}</text>
				</view>
				<block v-if="item.check">
					<view class="cell-item">
						<text class="label">所属银行</text>
						<text class="name">{{item.bankName}}</text>
						<text class="copy" @click="$onCopy(item.bankName)">复制</text>
					</view>
					<view class="cell-item" v-if="item.bankBranch">
						<text class="label">开户支行</text>
						<text class="name">{{item.bankBranch}}</text>
						<text class="copy" @click="$onCopy(item.bankBranch)">复制</text>
					</view>
					<view class="cell-item">
						<text class="label">持卡人</text>
						<text class="name">{{item.name}}</text>
						<text class="copy" @click="$onCopy(item.name)">复制</text>
					</view>
					<view class="cell-item">
						<text class="label">银行卡号</text>
						<text class="name">{{item.account}}</text>
						<text class="copy" @click="$onCopy(item.account)">复制</text>
					</view>
					<view class="cell-item other" v-if="item.remarksPublic">
						<text class="label">其他信息</text>
						<text class="name">{{item.remarksPublic}}</text>
					</view>
				</block>
			</view>
		</block>
		<text class="title">提交汇款凭证信息</text>
		<view class="cell">
			<view class="cell-item">
				<text class="label">汇款账号</text>
				<input type="text" v-model="form.account" :maxlength="30" placeholder="汇款账号" placeholder-class="placeholder" class="flex-grow">
			</view>
			<view class="cell-item">
				<text class="label">真实姓名</text>
				<input type="text" v-model="form.name" :maxlength="50" placeholder="真实姓名" class="flex-grow">
			</view>
			<view class="cell-item">
				<text class="label">汇款名称</text>
				<input type="text" v-model="form.bankName" :maxlength="50" placeholder="银行名称,如果是支付宝/微信,则填写支付宝/微信" placeholder-class="placeholder"  class="flex-grow">
			</view>
			<view class="cell-item">
				<text class="label">汇款金额</text>
				<input type="number" v-model="form.amount" placeholder="汇款金额" placeholder-class="placeholder" class="flex-grow">
			</view>
			<view class="cell-item" >
				<text class="label">汇款时间</text>
				<text class="color-b6 flex-grow" @click="visible=true">{{form.remittanceTime || "请选择"}}</text>
				<!-- <input type="text" v-model="form.remittanceTime" placeholder="如2020-01-03 12:30" placeholder-class="placeholder" class="flex-grow"> -->
			</view>
			<view class="cell-item">
				<text class="label">备注</text>
				<input type="text" v-model="form.remarks" :maxlength="20" placeholder="备注" placeholder-class="placeholder" class="flex-grow">
			</view>
			<view class="cell-item flex-column" style="align-items: flex-start;justify-content: flex-start;">
				<text class="label">转账凭证</text>
				<view class="imgs">
					<view class="img-box" v-for="(item, i) in imgList" :key="i" @tap="viewImg(i)">
						<image :src="item" mode="" class="img"></image>
						<text class="iconfont del" @tap.stop="onDel(i)">&#xe638;</text>
					</view>
					<view class="img-box" v-if="imgList.length < 3" @click="selectImg()">
						<text class="iconfont icon">&#xe64d;</text>
					</view>
				</view>
			</view>
		</view>
		
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onSave">确定</button>
		<w-picker
			:visible.sync="visible"
			mode="date" 
			:current="true"
			fields="minute"
			@confirm="onConfirm($event)"
			:disabled-after="true"
			ref="date" 
			themeColor="#3a2397"
		></w-picker>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import { sendRequestJson } from "@/common/http/api.js"
	import upload from "@/common/http/upload.js"
	import wPicker from "@/components/w-picker/w-picker.vue";

	export default{
		components: { wPicker },
		data(){
			return {
				visible: false,
				loading: false,
				list: [],
				form: {},
				imgList: []
			}
		},
		onLoad() {
			this.$http("GET", url.deposit.getBankPlatformInfo).then(res =>{
				this.list = res.data
			})
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("rechargeList")
		},
		methods:{
			async onSave(){
				if (!this.form.platformCollectionId) return this.$msg("请选择转账账户")
				if (this.imgList.length === 0) return this.$msg("请上传汇款凭证")
				this.loading = true
				uni.showLoading({
					mask:true
				})
				let voucherImgList = []
				for(let i = 0; i<this.imgList.length; i++){
					let obj = this.imgList[i]
					let ossData = await upload.getOssSignature(obj, 19, 1)
					let uploadData = await upload.uploadImageOss(ossData, false)
					voucherImgList.push(JSON.stringify({resourceTemporaryUUID: uploadData[0].resourceTemporaryUUID}))
				}
				this.form.voucherImgList = voucherImgList
				sendRequestJson("POST", url.deposit.commitVoucher, this.form).then(res => {
					this.$msg(res.data)
					uni.redirectTo({
						url: "rechargeList"
					})
					uni.hideLoading()
					this.loading = false
				}).catch(()=>{
					uni.hideLoading()
					this.loading = false
				})
			},
			onConfirm(e){
				this.form.remittanceTime = e.result
				this.$forceUpdate()
			},
			selectImg(){
				let _this = this
				uni.chooseImage({
					count: 3-_this.imgList.length,
					success(res) {
						_this.imgList = _this.imgList.concat(res.tempFilePaths)
					}
				})
			},
			onDel(i){
				this.imgList.splice(i, 1)
			},
			viewImg(i){
				let _this = this
				uni.previewImage({
					current: i,
					urls: _this.imgList
				});
			},
			onSelect(index){
				this.form.platformCollectionId = this.list[index].id
				this.list.map(v =>{
					v.check = false
				})
				this.list[index].check = true
				this.$forceUpdate()
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding-bottom: 50rpx;
	}
	.title{
		display: block;
		margin: 20rpx;
		color: #999999;
		font-size: 26rpx;
	}
	.cell{
		margin-bottom: 10rpx;
		&-item{
			background-color: white;
			padding: 30rpx 20rpx;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30rpx;
			.label{
				width: 160rpx;
				display: inline-block;
				color: #666666;
			}
			.icon{
				margin-right: 20rpx;
				font-size: 38rpx;
			}
			.name{
				flex-grow: 1;
				width: 300rpx;
			}
			.copy{
				color: #381895;
				margin-left: 10rpx;
			}
			.placeholder{
				font-size: 30rpx;
			}
			.imgs{
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.img-box{
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					border-radius: 10rpx;
					width: 180rpx;
					height: 180rpx;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2rpx dotted #EEEEEE;
					background-color: #f3f4f5;
					.img{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
					.icon{
						font-size: 100rpx;
						color: #999999;
					}
					.del{
						position: absolute;
						right: -20rpx;
						top: -20rpx;
						color: #CA0400;
						font-size: 40rpx;
					}
				}
			}
		}
	}
	.btn{
		width: 90%;
		margin-top: 80rpx;
	}
</style>
