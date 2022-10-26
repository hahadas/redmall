import { mapMutations } from "vuex"
import url from "@/common/http/url.js"
import publics from "@/common/utils/public.js"
// #ifdef APP-PLUS
import { getMacAddress, checkOpenGPSService } from "@/common/utils/index.js"
import { 
		isOpenDB, 
		openDB, 
		createSessionListSQL,
		createChatListSQL
	} from "@/common/im/db.js"
// #endif
var QQMapWX = require('@/libs/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
	key: 'BJVBZ-UWBR6-DCZSL-E6DJE-AXQGZ-O5BMI'
})

export default{
	data(){
		return {
			loading:false,
			statusBarHeight: getApp().statusBarHeight,
			password: "",
			showPassword: false,
			confirmPwd: false,
			form: {},
			addressInfo: {},
			rsaKey: "",
			iosUrl: "",
			androidUrl: "",
			noticeId: ""
		}
	},
	mounted(){
		let _this = this
		// 获取下载信息
		// #ifdef H5
		this.$http("GET", url.common.getAppVersion).then(res =>{
			let iosList = res.data["IOS"].children
			let androidList = res.data["Android"].children
			iosList.forEach(v=>{
				if (v.keyCode === "app_version_ios_liu_url"){
					this.iosUrl = v.keyValue
					return false
				}
			})
			androidList.forEach(v=>{
				if (v.keyCode === "app_version_android_liu_url"){
					this.androidUrl = v.keyValue
					return false
				}
			})
		})
		// #endif
		
		// #ifdef APP-PLUS
		let address = publics.getMyaddressLngLat();
		if (address) {
			this.addressInfo = JSON.parse(address);
		} else {
			checkOpenGPSService(result => {
				if (result) {
					uni.getLocation({
					    type: 'wgs84',
						geocode: true,
					    success: function (res) {
							_this.addressInfo = res
							publics.setMyaddressLngLat(JSON.stringify(res));
					    },fail(err) {
							console.log(".......获取位置失败。。。。", err)
							// uni.chooseLocation({
							// 	success: function(res) {
							// 		publics.setMyaddressLngLat(JSON.stringify(res));
							// 		_this.addressInfo = res;
							// 	}
							// });
						}
					});
				}
			})
		}
		// #endif
		
		this.$http("GET", url.login.getPublicKey).then(res => {
			this.rsaKey = res.data
		})
		
		// 获取隐私协议
		this.$http("GET", url.common.privacyAgreement).then(res =>{
			if (res.data && res.data.length > 0) {
				res.data.forEach(v => {
					if (v.keyCode === "platform_privacy_agreement_user"){
						this.noticeId = v.keyValue
						return
					}
				})
			}
		})
	},
	methods: {
		...mapMutations(["setToken", "setUserInfo", "logout"]),
		async onLogin(params){
			params.password = await this.passwordEncryption(this.rsaKey, this.password)
			let systemInfo = uni.getSystemInfoSync()
			let data = {
				// #ifdef APP-PLUS
				deviceId: plus.device.uuid,	// 设备id
				deviceMac: getMacAddress(),	// 设备mac地址
				// #endif
				deviceChannel: systemInfo.platform || "", // 客户端类型
				deviceName: systemInfo.brand || "",		// 设备名称
				deviceVersion: systemInfo.model || "",	// 设备型号
				lng: this.addressInfo.longitude || "",
				lag: this.addressInfo.latitude || "",
			}
			// 用户未给定位权限时this.addressInfo为{}
			let address = ""
			if (this.addressInfo.address) {
				for(let i in this.addressInfo.address) {
					if (i !== 'cityCode') {
						address = address + this.addressInfo.address[i]
					}
				}
			} else {
				// #ifdef APP-PLUS
				if (this.addressInfo.longitude && this.addressInfo.latitude) {
					let r = await publics.getPositionToLngAndLat(this.addressInfo.longitude, this.addressInfo.latitude)
					address = r.result.address
				}
				// #endif
			}
			data.address = address
			data = Object.assign({}, params, data)
			this.loginReq(data)
		},
		loginReq(data){
			console.log("登入参数。。。。。", data)
			this.loading = true
			this.$http("POST", url.login.login, data).then(res =>{
				this.setToken(res.data)
				// #ifdef APP-PLUS
				checkOpenGPSService(result=>{
					if (result) {
						getApp().openMap()
					}
				})
				getApp().updateDeviceInfo()
				getApp().initIMClientText()
				// #endif
				this.$http("GET", url.user.getUserInfoBasic).then(res =>{
					this.setUserInfo(res.data)
					// #ifdef APP-PLUS
					getApp().globalData.socket.initSocket()
					// 打开数据库,并创建表
					openDB(()=>{
						createSessionListSQL()
						createChatListSQL()
					})
					// #endif
					let userInfo = res.data
					if (!userInfo.gender || !userInfo.birthDate || !userInfo.nickname){
						this.$navigateTo("/pages/login/set")
					} else {
						uni.switchTab({
							url: "/pages/interaction/index"
						})
					}
					this.loading = false
				})
			}).catch(()=>{
				this.loading = false
			})
		},
		passwordEncryption(rsaKey, password){
			return publics.passwordEncryption(rsaKey, password)
		},
		jumpTo(path){
			this.$navigateTo(path)
		},
		onBack(){
			this.$navigateBack()
		},
		// #ifdef H5
		download(url){
			if (!url) return
			window.open(url)
		}
		// #endif
	}
}