<template>
	<view class="bg-w main">
		<view class="con">
			<view class="flex flex-between title">
				<text class="font32 color-b3">头像照片</text>
				<text class="font30 color-b9">须为本人真实头像</text>
			</view>
			<view class="flex flex-align-center">
				<image :src="userInfo.headPortrait||avatar" mode="" class="avatar" @tap="selectImg"></image>
				<view class="examine avatar" style="margin-left: 20rpx;" v-if="examineAvatar.status === 2 || examineAvatar.status === 4" @tap="showPhoto(examineAvatar.ossUrl)">
					<image :src="examineAvatar.ossUrl" mode="" class="avatar"></image>
					<text class="status color-red" v-if="examineAvatar.status === 2">违规</text>
					<text class="status color-w" v-if="examineAvatar.status === 4">审核中</text>
					<text class="iconfont icon" v-if="examineAvatar.violationInformation" @tap.stop="showMsg(examineAvatar.violationInformation)">&#xe659;</text>
				</view>
			</view>
			<block>
				<view class="flex flex-between title">
					<text class="font32 color-b3">视频展示</text>
					<text class="font30 color-b9">让美丽动起来</text>
				</view>
				<view class="video-wrap flex flex-center" v-if="!videoResources.ossTailoringUrl" @tap="chooseVideo">
					<text class="iconfont icon">&#xe656;</text>
				</view>
				<view class="examine video-img" v-else @click="viewVideo">
					<image :src="videoResources.ossTailoringUrl" class="video-img" mode=""></image>
					<text class="status color-red" v-if="videoResources.status === 2">违规</text>
					<text class="status color-w" v-if="videoResources.status === 4">审核中</text>
					<text class="iconfont icon" v-if="videoResources.violationInformation">&#xe659;</text>
				</view>
				<view class="flex flex-between title">
					<text class="font32 color-b3">封面照片</text>
					<text class="font30 color-b9">本人照片 最多可添加五张</text>
				</view>
				<view class="flex flex-align-center" style="flex-wrap: wrap; width: 100%;">
					<view class="pic flex flex-center examine" v-for="(item, i) in imgList" @tap="viewPhoto(item, i)">
						<image :src="item.ossUrl" class="img" mode=""></image>
						<text class="status color-red" v-if="item.status === 2">违规</text>
						<text class="status color-w" v-if="item.status === 4">审核中</text>
						<text class="iconfont icon" v-if="item.violationInformation">&#xe659;</text>
						<text class="iconfont color-red del" @tap.stop="onDel(item, i)">&#xe638;</text>
					</view>
					<view class="pic flex flex-center" v-if="imgList.length < 5" @click="selectCoverPhoto">
						<text class="iconfont icon">&#xe62d;</text>
					</view>
				</view>
			</block>
			<view class="flex flex-between title">
				<text class="xian">———————————</text>
				<text class="font32 color-b6">基本信息</text>
				<text class="xian">———————————</text>
			</view>
			<view class="flex flex-between list" @tap="$navigateTo('updateMobile')">
				<text class="font32 color-b3">手机号</text>
				<view class="flex flex-align-center">
					<text class="font28 color-b9">{{userInfo.mobile}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">昵称</text>
				<view class="flex flex-align-center" @click="showPopup('popup')">
					<text class="font28 color-b9">{{userInfo.nickname}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">身高（cm）</text>
				<view class="flex flex-align-center" @click="showPopup('heightPopup')">
					<text class="font28 color-b9">{{userInfo.height||"请输入"}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">体重（kg）</text>
				<view class="flex flex-align-center" @click="showPopup('weightPopup')">
					<text class="font28 color-b9">{{userInfo.weight||"请输入"}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">性别</text>
				<picker class="flex flex-align-center" mode="selector" range-key="name" @change="bindGenderPickerChange" :value="genderIndex" :range="genderList">
					<text class="font28 color-b9">{{genderList[genderIndex].name||'请选择'}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</picker>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">生日</text>
				<view class="flex flex-align-center" @click="dateVisible = true">
					<text class="font28 color-b9">{{userInfo.birthDate||"请选择"}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">学历</text>
				<picker class="flex flex-align-center" mode="selector" range-key="name" @change="bindEducationPickerChange" :value="educationIndex" :range="educationList">
					<text class="font28 color-b9">{{educationTxt||'请选择'}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</picker>
			</view>
			<view class="flex flex-between list" @click="regionVisible = true">
				<text class="font32 color-b3">所在地区</text>
				<view class="flex flex-align-center">
					<text class="font28 color-b9">{{positionTxt||'请选择'}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between list">
				<text class="font32 color-b3">个性签名</text>
				<view class="flex flex-align-center" @click="$navigateTo('signature?personalizedSignature='+userInfo.personalSignature)">
					<text class="font28 color-b9 line" style="width: 450rpx; text-align: right;">{{userInfo.personalSignature||"未设置"}}</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="flex flex-between title">
				<text class="xian">———————————</text>
				<text class="font32 color-b6">我的标签</text>
				<text class="xian">———————————</text>
			</view>
			<view class="cell" v-if="labelPastOccupationList.length > 0">
				<view class="item" v-for="(item, i) in labelPastOccupationList" :key="i">{{item}}</view>
			</view>
			<view class="flex flex-between list" @click="$navigateTo('hobby?labels='+JSON.stringify(labels))">
				<text class="font32 color-b3">兴趣爱好</text>
				<view class="flex flex-align-center">
					<text class="font28 color-b9" v-if="!userInfo.labelHobby">请选择</text>
					<text class="iconfont font34 icon">&#xe770;</text>
				</view>
			</view>
			<view class="cell" v-if="labelHobbyList.length > 0">
				<view class="item" v-for="(item, i) in labelHobbyList" :key="i">{{item}}</view>
			</view>
		</view>
		<!-- 修改昵称 -->
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog 
				mode="input"
				title="修改昵称"
				placeholder="请输入昵称"
				:value="nickname"
				@close="close('popup')" 
				@confirm="confirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<!-- 修改身高 -->
		<uni-popup ref="heightPopup" type="dialog">
		    <uni-popup-dialog 
				mode="input"
				title="修改身高"
				placeholder="请输入身高"
				:value="height"
				@close="close('heightPopup')" 
				@confirm="heightConfirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<!-- 修改体重 -->
		<uni-popup ref="weightPopup" type="dialog">
		    <uni-popup-dialog 
				mode="input"
				title="修改体重"
				placeholder="请输入体重"
				:value="weight"
				@close="close('weightPopup')" 
				@confirm="weightConfirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<!-- 出生年月 -->
		<w-picker
			:visible.sync="dateVisible"
			mode="date" 
			:value="userInfo.birthDate"
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
			:visible.sync="regionVisible"
			ref="region"
			mode="region"
			:value="positionValue"
			themeColor="#3a2397"
			@confirm="regionConfirm"
		></w-picker>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import { mapMutations } from "vuex"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue"
	import url from "@/common/http/url.js"
	import selectOptions from "@/common/utils/selectOptions.js"
	import upload from "@/common/http/upload.js"
	import { getAstro, getAge, timestampToTime } from "@/common/utils/index.js"
	import publics from "@/common/utils/public.js"
	export default{
		components: { wPicker, avatar, uniPopup, uniPopupDialog },
		data(){
			return {
				avatar: this.$staticUrl + 'user/avatar.png',
				dateVisible: false,
				regionVisible: false,
				userInfo: {},
				examineAvatar: {},
				nickname: "",
				weight: "",
				height: "",
				positionTxt: "",
				positionValue: [],
				educationList: selectOptions.educationList,
				educationIndex: 0,
				educationTxt: "",
				genderList: [
					{name: "请设置", value: 1},
					...selectOptions.genderList
				],
				genderIndex: 0,
				imgList: [],
				applicationType: 0,
				videoObj: {},
				videoResources: {},
				labels: [],
				labelHobbyList: [],
				labelPastOccupationList: [],
			}
		},
		onBackPress(e) {
			// if (e.from !== 'navigateBack') {
			// 	if ((!this.userInfo.headPortrait && !this.examineAvatar.ossUrl) || !this.userInfo.birthDate || !this.userInfo.gender || !this.userInfo.nickname) {
			// 		this.$showModal("请检查您的头像、昵称、生日、性别信息是否已完善，未完善点击返回则退出登入，是否确认退出登入？", "提示", res =>{
			// 			if (res.confirm) {
			// 				// uni.navigateBack()
			// 			}
			// 		})
			// 	}
			// } else {
			// 	return false
			// }
			// return true
			
			if ((!this.userInfo.headPortrait && !this.examineAvatar.ossUrl) || !this.userInfo.birthDate || !this.userInfo.gender || !this.userInfo.nickname) {
				this.$showModal("请检查您的头像、昵称、生日、性别信息是否已完善，未完善点击返回则退出登入，是否确认退出登入？", "提示", res =>{
					if (res.confirm) {
						this.logout()
					}
				})
				return true
			} else {
				return false
			}
		},
		onShow() {
			this.getInfo()
			this.$http("GET", url.user.getLabels).then(res =>{
				this.labels = res.data
			})
		},
		methods:{
			...mapMutations(["logout"]),
			getInfo(){
				this.imgList = []
				this.$http("GET", url.user.getUserInfoBasic).then(res =>{
					this.userInfo = res.data
					if (this.userInfo.birthDate) {
						this.userInfo.birthDate = this.userInfo.birthDate.split(" ")[0]
					}
					if (res.data.userResources.length > 0){
						res.data.userResources.forEach(v=>{
							if (v.type === 0 && v.status === 4){
								this.examineAvatar = v
							}
							if (v.type === 1){
								this.imgList.push(v)
							}
							if (v.type === 2) {
								this.videoResources = v
							}
						})
					}
					if (res.data.education){
						this.educationIndex = res.data.education-1
						this.educationTxt = this.educationList[this.educationIndex].name
					}
					if (res.data.gender){
						// this.genderIndex = res.data.gender - 2
						this.genderList.forEach((v, i) => {
							if (v.value === res.data.gender){
								this.genderIndex = i
								return false
							}
						})
					}
					let addrObj = publics.getLngAndLatByCode(res.data.adcode)
					if (addrObj){
						this.positionTxt = ""
						addrObj.map(v=>{
							this.positionTxt = this.positionTxt + v.name
							this.positionValue.push(v.name)
						})
					}
					if (res.data.labelHobby) {
						this.labelHobbyList = res.data.labelHobby.split("-")
					}
					if (res.data.labelPastOccupation) {
						this.labelPastOccupationList = res.data.labelPastOccupation.split("-")
					}
				})
			},
			showPopup(name){
				this.nickname = this.userInfo.nickname
				this.weight = this.userInfo.weight
				this.height = this.userInfo.height
				this.$refs[name].open()
			},
			close(){
				this.$refs.popup.close()
			},
			// 修改昵称
			confirm(done,value){
				if (!value) return
				this.$http("POST", url.user.editUserInfo, {nickname: value}).then(res =>{
					this.userInfo.nickname = value
					done()
				})
			},
			// 修改身高
			heightConfirm(done,value){
				if (!value) return
				this.$http("POST", url.user.editUserInfo, {height: value}).then(res =>{
					this.userInfo.height = value
					done()
				})
			},
			// 修改体重
			weightConfirm(done,value){
				if (!value) return
				this.$http("POST", url.user.editUserInfo, {weight: value}).then(res =>{
					this.userInfo.weight = value
					done()
				})
			},
			// 修改地区
			regionConfirm(e){
				let adcode = e.value[e.value.length - 1]
				this.positionTxt = e.result
				this.$http("POST", url.user.editUserInfo, {adcode:adcode}).then(res =>{
					this.userInfo.birthDate = value
				})
			},
			// 修改出生年月
			dateConfirm(e) {
				let value = e.value
				let valueSplit = value.split("-")
				let params = {
					birthDate: value
				}
				this.$http("POST", url.user.editUserInfo, params).then(res =>{
					this.userInfo.birthDate = value
				})
			},
			// 修改性别
			bindGenderPickerChange(e){
				this.genderIndex = e.detail.value
				this.$http("POST", url.user.editUserInfo, {
					gender: this.genderList[e.detail.value].value
				})
			},
			// 修改学历
			bindEducationPickerChange(e){
				this.educationIndex = e.detail.value
				this.educationTxt = this.educationList[e.detail.value].name
				this.$http("POST", url.user.editUserInfo, {
					education: this.educationList[e.detail.value].value
				})
			},
			showPhoto(url){
				uni.previewImage({
					current: url,
					urls: [url]
				})
			},
			viewPhoto(row, i){
				let _this = this
				let urls = []
				this.imgList.map(v =>{
					urls.push(v.ossUrl)
				})
				uni.previewImage({
					current: i,
					urls: urls
				})
			},
			onDel(row, i){
				this.$http("POST", url.common.delResources, {id: row.id}).then(res =>{
					this.imgList.splice(i, 1)
					this.$forceUpdate()
				})
			},
			viewVideo(){
				let _this = this
				uni.showActionSheet({
					itemList: ["选择视频", "查看视频", "删除视频"],
					success(res) {
						if (res.tapIndex === 0) {
							_this.chooseVideo()
						} else if (res.tapIndex === 1) {
							_this.$navigateTo("video")
						} else {
							_this.$http("POST", url.common.delResources, {id: _this.videoResources.id}).then(res =>{
								_this.videoResources = {}
								_this.$forceUpdate()
							})
						}
					}
				})
			},
			showMsg(msg){
				this.$msg(msg)
			},
			// 选择头像
			selectImg(){
				this.applicationType = 0
				upload.showAvatarModal(this, 300, 300)
			},
			// 选择封面
			selectCoverPhoto(){
				this.applicationType = 1
				upload.showAvatarModal(this, 700, 600)
			},
			// 选择视频
			chooseVideo(){
				let _this = this
				this.applicationType = 2
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					compressed: false,
					success: function (res) {
						_this.videoObj = res
						let rsp = {path: res.tempFilePath}
						_this.myUpload(rsp)
					}
				});
			},
			myUpload(rsp) {
				let _this = this
				upload.getOssSignature(rsp.path, this.applicationType, 1).then(data=>{
					upload.uploadImageOss(data).then(list=>{
						let successCallBackParamsList = [{
							resourceTemporaryUUID: list[0].resourceTemporaryUUID
						}]
						if (this.applicationType===0){ // 头像
							this.examineAvatar = {
								ossUrl: list[0].url,
								status: 4
							}
						// } else if(this.applicationType===2) { // 视频
						// 	successCallBackParamsList[0].size = this.videoObj.size
						// 	successCallBackParamsList[0].ossWidth = this.videoObj.width
						// 	successCallBackParamsList[0].ossHeight = this.videoObj.height
						// 	successCallBackParamsList[0].ossTime = this.videoObj.duration
						// 	this.videoResources = {
						// 		ossUrl: list[0].url,
						// 		ossTailoringUrl: list[0].ossTailoringUrl,
						// 		status: 4
						// 	}
						}
						successCallBackParamsList = JSON.stringify(successCallBackParamsList)
						this.$http("POST", url.user.editUserInfo, {successCallBackParamList:successCallBackParamsList}).then(e =>{
							if (this.applicationType!==0){
								this.getInfo()
							}
						})
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		.con{
			padding: 50rpx 30rpx 0rpx 30rpx;
			.title{
				width: 100%;
				margin: 30rpx 0;
				.xian{
					font-size: 24rpx;
					color: #ebeaed;
					display: inline-block;
				}
			}
			.avatar{
				width: 140rpx;
				height: 140rpx;
				// border-radius: 50%;
				border-radius: 10rpx;
				overflow: hidden;
			}
			.examine{
				position: relative;
				display: block;
				.status{
					width: 100%;
					background-color: rgba($color: #000000, $alpha: .5);
					font-size: 24rpx;
					height: 34rpx;
					text-align: center;
					display: inline-block;
					line-height: 34rpx;
					position: absolute;
					left: 0;
					right: 0;
					bottom: 0;
				}
				.icon{
					color: #ddd;
					position: absolute;
					right: 0;
					top: 0;
					font-size: 34rpx;
				}
			}
			.video-wrap{
				border: 2rpx dotted #999999;
				width: 140rpx;
				height: 140rpx;
				border-radius: 10rpx;
				.icon{
					font-size: 70rpx;
					color: #b8b7b9;
				}
			}
			.video-img{
				border-radius: 10rpx;
				width: 250rpx;
				height: 320rpx;
				overflow: hidden;
			}
			.pic{
				border: 2rpx dotted #999999;
				width: 140rpx;
				height: 140rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				position: relative;
				.icon{
					font-size: 70rpx;
					color: #b8b7b9;
				}
				.img{
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
				.del{
					position: absolute;
					top: -20rpx;
					right: -20rpx;
					font-size: 40rpx;
				}
			}
			
			.list{
				margin-bottom: 50rpx;
				.icon{
					margin-left: 10rpx;
					color: #999999;
				}
			}
			.cell{
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				// margin-bottom: 20rpx;
				margin-top: -30rpx;
				.item{
					border-radius: 50rpx;
					font-size: 26rpx;
					background-color: rgba($color: #381895, $alpha: .3);
					color: #381895;
					margin-right: 30rpx;
					margin-bottom: 30rpx;
					padding: 16rpx 30rpx;
				}
			}
		}
	}
</style>
