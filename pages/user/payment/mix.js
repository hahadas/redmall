import url from "@/common/http/url.js"
import upload from "@/common/http/upload.js"
import publics from "@/common/utils/public.js"
export default{
	data(){
		return {
			loading: false,
			type: 0,
			paymentInfo: {},
			imgUrl: "",
			password: "",
			isView: false,
			rsaKey: ""
		}
	},
	onLoad(option){
		this.type = parseInt(option.type)
		if (option.id) {
			this.isView = true
			this.$http("GET", url.user.getCollectionsDetailById, {type: this.type, collectionId: option.id}).then(res =>{
				this.paymentInfo = res.data
				this.imgUrl = res.data.collectionImage
				this.bankName = res.data.bankName
				if (this.type === 3 && res.data.bankName.indexOf("-") > -1) {
					let nameSplit = this.paymentInfo.bankName.split("-")
					this.bankName = nameSplit[0]
					this.paymentInfo.bankName = nameSplit[0]
					this.branch = nameSplit[1]
					this.paymentInfo.branch = nameSplit[1]
				}
			})
		} else {
			this.$http("GET", url.login.getPublicKey).then(res =>{
				this.rsaKey = res.data
			})
			
		}
	},
	onShow() {
	},
	methods: {
		async onSubmit() {
			if (!this.password) return this.$msg("请输入登录密码")
			this.loading = true
			this.paymentInfo.loginPwd = await publics.passwordEncryption(this.rsaKey, this.password)
			if (this.imgUrl) {
				let data = await upload.getOssSignature(this.imgUrl, 18, 1)
				let list = await upload.uploadImageOss(data)
				this.paymentInfo.collectionImage = JSON.stringify({
					resourceTemporaryUUID: list[0].resourceTemporaryUUID
				})
			}
			if (this.type === 3) {
				this.paymentInfo.bankName = this.bankName + "-" + this.branch
			}
			this.$http("POST", url.user.addCollections, {type: this.type, ...this.paymentInfo}).then(res =>{
				this.$msg(res.data)
				this.$navigateBack()
			}).catch(()=>{
				this.loading = false
			})
		},
		selectImg(){
			let _this = this
			if (this.isView) {
				uni.previewImage({
					current: _this.paymentInfo.collectionImage,
					urls: [_this.paymentInfo.collectionImage]
				})
			} else {
				uni.chooseImage({
					count: 1,
					sourceType: ["album"],
					success:function(res){
						_this.imgUrl = res.tempFilePaths[0]
					}
				})
			}
		}
	}
}