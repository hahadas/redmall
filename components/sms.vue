<template>
	<view>
		<text class="sms" @tap="openPopup">{{smsTxt}}</text>
		<!-- <uni-popup ref="popup">
			<view class="flex flex-center">
				<view class="bg-w con">
					<text class="title color-b3 font32">发送验证码</text>
					<view class="image bg-f5 flex flex-column">
						<image :src="pic" mode="aspectFit" @tap="generationImg" class="pic bg-w"></image>
						<input type="number" :maxlength="6" placeholder="请输入图形验证码" class="input bg-w font34" v-model="code">
					</view>
					<view class="flex bom">
						<text class="btn green" @tap="closePopup">取消</text>
						<text class="btn" @tap="sendSMS">确定</text>
					</view>
				</view>
			</view>
		</uni-popup> -->
		<verify
			@success="onSuccess"
			mode="pop"     
			captchaType="blockPuzzle" 
			:imgSize="{ width: '330px', height: '155px' }"
			ref="verify"
		></verify>
	</view>
</template>

<script>
	import verify from "./verify/verify.vue"
	import uniPopup from "./uni-popup/uni-popup.vue"
	import { baseUrl } from "../common/http/index.js"
	import url from "@/common/http/url.js"
	export default{
		props: {
			phone: {
				type: String,
				default: ""
			},
			// 短信验证码类型：0=注册，1=找回密码，2=短信验证码登入，3=修改手机号, 4=修改支付密码
			typeCode: {
				type: String,
				default: "1"
			}
		},
		components: { uniPopup, verify },
		data(){
			return {
				imageCodeUrl: baseUrl + url.common.getImgCode,
				smsTxt: "发送验证码",
				disable: false,
				time: 60,
				pic: "",
				code: ""
			}
		},
		mounted() {
			let time = uni.getStorageSync('smsTime')||60
			time = parseInt(time)
			console.log("time...", time)
			if (time<60){
				this.time = time
				this.timer()
			}
		},
		methods:{
			openPopup(){
				if (!this.phone) {
					this.$msg("请输入手机号")
					return
				}
				if (this.disable) return
				// this.code = ""
				// this.generationImg()
				// this.$refs.popup.open()
				this.$refs.verify.show()
			},
			closePopup(){
				this.$refs.popup.close()
			},
			onSuccess(params){
				console.log("000000.....", params)
				this.sendSMS(params)
			},
			generationImg(){
				let time = new Date().getTime();
				this.pic = this.imageCodeUrl + '?telephone=' + this.phone + "&time=" + time;
			},
			sendSMS(params){
				this.$http("POST", url.common.getSmsCode, {phone:this.phone, captchaVerification:params, typeCode: this.typeCode}).then(res =>{
					this.$msg("发送成功，请注意查收")
					this.timer()
				})
			},
			timer(){
				this.disable = true
				let _this = this;
				let interval = setInterval(()=> {
					if ((_this.time <= 60 && _this.time > 0) && this.disable) {
						_this.time--
						_this.smsTxt = _this.time + 's'
						uni.setStorageSync("smsTime", _this.time)
					} else {
						_this.disable = false;
						_this.time = 60
						_this.smsTxt = "发送验证码"
						// uni.setStorageSync("smsTime", _this.time)
						uni.removeStorageSync('smsTime')
						clearInterval(interval);
					}
				}, 1000)
				this.closePopup()
			}
		}
	}
</script>

<style scoped lang="scss">
	.sms{
		font-size: 26rpx;
		color: #333;
		// border: 2rpx solid #0065cd;
		width: 165rpx;
		text-align: center;
		// height: 55rpx;
		// line-height: 55rpx;
		display: inline-block;
	}
	.con{
		width: 700rpx;
		border-radius: 10rpx;
		.title {
			width: 700rpx;
			padding: 30rpx 0;
			text-align: center;
			display: inline-block;
		}
		.image{
			padding: 50rpx;
			.pic{
				width: 600rpx;
				height: 180rpx;
				margin-bottom: 20rpx;
			}
			.input{
				width: 600rpx;
				height: 100rpx;
				text-align: center;
				border-radius: 50rpx;
				border: 2rpx solid #eee;
			}
		}
		.bom{
			height: 100rpx;
			.btn{
				display: inline-block;
				width: 350rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 100rpx;
			}
			.green{
				color: #32b748;
			}
		}
	}
</style>
