<template>
	<view class="main bg-w">
		<view :style="{'height': statusBarHeight + 'px'}"></view>
		<text class="title">编辑资料</text>
		<view class="flex cen flex-column flex-align-center">
			<view class="avatar flex flex-center" @tap="selectImg">
				<image :src="avatar" mode="" v-if="avatar"></image>
				<text class="iconfont color-b9 icon" v-else>&#xe62d;</text>
			</view>
			<text class="font28 color-b6">
				<!-- #ifdef APP-PLUS -->
				<text class="color-red">*</text>
				<!-- #endif -->
				请添加头像
			</text>
			<view class="form">
				<view class="form-item flex flex-align-center">
					<text class="label">昵称</text>
					<input type="text" placeholder="请输入您的昵称" :maxlength="12" placeholder-class="placeholder" v-model="form.nickname" />
				</view>
				<view class="form-item flex flex-align-center">
					<text class="label">性别</text>
					<radio-group class="flex flex-align-center flex-grow" @change="radioChange">
						<view class="flex flex-align-center" style="margin-right: 30rpx;" v-for="(item, index) in genderList" :key="index">
							<radio :value="item.value.toString()" style="transform:scale(0.8);" />
							<view class="color-b3 font36">{{item.name}}</view>
						</view>
					</radio-group>
				</view>
				<view class="form-item flex flex-align-center" @click="dateVisible = true">
					<text class="label">生日</text>
					<text class="color-b9 font36">{{born||"点击选择生日"}}</text>
				</view>
				<view class="form-item flex flex-align-center bor-no" @click="addrVisible = true">
					<text class="label">地区</text>
					<text class="color-b9 font36">{{addr||"点击选择地区"}}</text>
				</view>
				<view class="btn flex flex-center flex-column">
					<button type="primary" class="bg-base btn-item" :loading="loading" :disabled="loading" @tap="onSave">确定</button>
				</view>
			</view>
		</view>
		
		<!-- 出生年月 -->
		<w-picker
			:visible.sync="dateVisible"
			mode="date" 
			:value="born"
			:current="false"
			fields="day"
			@confirm="dateConfirm($event)"
			@cancel="dateVisible=false"
			:disabled-after="false"
			themeColor="#3a2397"
			ref="date"
		></w-picker>
		
		<!-- 地区 -->
		<w-picker
			:visible.sync="addrVisible"
			ref="region"
			mode="region"
			:value="addr"
			themeColor="#3a2397"
			@confirm="addrConfirm"
		></w-picker>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import selectOptions from "@/common/utils/selectOptions.js"
	import upload from "@/common/http/upload.js"
	export default{
		components: { wPicker, avatar },
		data(){
			return {
				loading: false,
				statusBarHeight: getApp().statusBarHeight,
				form: {},
				born: "",
				dateVisible: false,
				addrVisible: false,
				addr: "",
				genderList: selectOptions.genderList,
				avatar: ""
			}
		},
		onLoad() {
		},
		methods:{
			onSave(){
				// #ifdef APP-PLUS
				if (!this.avatar) return this.$msg("请上传头像")
				// #endif
				if (!this.form.nickname) return this.$msg("请输入昵称")
				if (!this.form.gender) return this.$msg("请选择性别")
				if (!this.born) return this.$msg("请选择生日")
				if (!this.addr) return this.$msg("请选择地区")
				this.loading = true
				this.$http("POST", url.user.editUserInfo, this.form).then(res => {
					uni.switchTab({
						url:"../home/index"
					})
				}).catch(()=>{
					this.loading = false
				})
			},
			dateConfirm(e) {
				let value = e.value
				let valueSplit = value.split("-")
				this.born = value
				this.form.birthDate = value
			},
			addrConfirm(e){
				let adcode = e.value[e.value.length - 1]
				this.addr = e.result
				this.form.adcode = adcode
			},
			radioChange(e){
				this.form.gender = e.detail.value
			},
			selectImg(){
				upload.showAvatarModal(this, 300, 300)
			},
			myUpload(rsp) {
				upload.getOssSignature(rsp.path, 0, 1).then(data=>{
					upload.uploadImageOss(data).then(list=>{
						this.avatar = list[0].url
						let successCallBackParamsList = [{
							resourceTemporaryUUID: list[0].resourceTemporaryUUID
						}]
						successCallBackParamsList = JSON.stringify(successCallBackParamsList)
						this.form.successCallBackParamList = successCallBackParamsList
					})
				})
				
			},
			// 随机生成6位数字
			randomNum(){
				let code = "";
				for(let i = 1;i <= 6;i++){
					let num = Math.floor(Math.random()*10);
					code += num;
				}
				return 'hjm'+code
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		min-height: 100vh;
		.title{
			padding: 80rpx 50rpx;
			display: block;
			font-size: 60rpx;
		}
		.cen{
			margin: 0 50rpx;
			.avatar{
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				background-color: #fefcff;
				border: 2rpx solid #ddd;
				margin-bottom: 20rpx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
				.icon{
					font-size: 90rpx;
				}
			}
			.form{
				width: 500rpx;
				margin-top: 50rpx;
				&-item{
					border-bottom: 2rpx solid #eee;
					height: 120rpx;
					.label{
						font-size: 36rpx;
						color: #333333;
						margin-right: 30rpx;
					}
					.placeholder{
						color: #999;
						font-size: 36rpx;
					}
				}
				.btn{
					margin-top: 80rpx;
					&-item{
						width: 100%;
						border-radius: 50rpx;
						margin-bottom: 50rpx;
					}
				}
				.btn::after{ border: none;}
			}
		}
	}
</style>
