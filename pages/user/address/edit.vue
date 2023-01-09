<template>
	<view class="content">
		<view class="wrap bg-w">
			<view class="box">
				<view class="box_left">联系人:</view>
				<view class="box_right"><input type="text" v-model="user.fullName" placeholder-class="placeholder" placeholder="请输入联系人" /></view>
			</view>
			<view class="box">
				<view class="box_left">手机号:</view>
				<view class="box_right"><input type="number" maxlength="11" v-model="user.mobile" placeholder-class="placeholder" placeholder="请输入手机号" /></view>
			</view>
			<view class="box" @click="visible = true">
				<view class="box_left">选择地区:</view>
				<view class="box_right font32" :style="{color: pickerText ?'#676769' : '#c3c1c4'}">{{ pickerText || "选择省/市/区" }}</view>
			</view>
			<view class="box" v-if="user.addressDetails" @click="selectDetail">
				<view class="box_left">详细地址:</view>
				<view class="box_right_right">
					<input type="text" v-model="user.addressDetails" placeholder-class="placeholder" :maxlength="150" disabled="true"/>
				</view>
			</view>
			<view class="box">
				<view class="box_left">补充地址:</view>
				<view class="box_right_right">
					<input type="text" v-model="user.addressSupplement" :maxlength="50" placeholder-class="placeholder" placeholder="补充具体地址最多50个字"/>
				</view>
			</view>
			
			<view class="box bor-no">
				<view class="box_left_two">设为默认地址</view>
				<view class="box_right_two"><switch color="#381895" :checked="user.defaultAd === 1" style="transform:scale(0.8)" @change="switchBtn" /></view>
			</view>
		</view>
		<button class="btn bg-base" :loading="loading" :disabled="loading" @click="submit">保存</button>
		<w-picker
			:visible.sync="visible"
			ref="mpvueCityPicker"
			mode="region"
			:value="positionValue"
			@confirm="onConfirm"
			themeColor="#3a2397"
		></w-picker>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import publics from "@/common/utils/public.js"
	import wPicker from "@/components/w-picker/w-picker.vue"
	export default{
		components:{ wPicker },
		data(){
			return {
				loading: false,
				visible: false,
				user: {},
				pickerText: "",
				positionValue: [],
				noAddr: false,
				addressInfo: {}
			}
		},
		onLoad(option) {
			let title = '新增地址';
			let data = JSON.parse(option.data)
			this.user.type = data.type
			if (data.name === 'edit') {
				title = '编辑地址';
				this.$http("GET", url.address.getAddressInfoByIdAndType, {type: data.type, id: data.id}).then(res =>{
					this.user = res.data
					delete this.user.updateTime
					let addrObj = publics.getLngAndLatByCode(this.user.threeAdcode)
					if (addrObj){
						addrObj.map(v=>{
							this.pickerText = this.pickerText + v.name
							this.positionValue.push(v.name)
						})
					}
				})
			}
			uni.setNavigationBarTitle({
				title: title
			});
			if (option.noAddr) {
				this.noAddr = true
			}
		},
		methods:{
			async submit() {
				let _this = this
				let info = this.user
				if (!info.fullName||!info.mobile||!this.pickerText) {
					return this.$msg("请将信息填写完整");
				}
				this.loading = true
				let path = this.user.id ? url.address.updateAddress : url.address.addAddress
				this.$http('POST', path, this.user).then(res =>{
					this.$msg(res.data);
					setTimeout(() => {
						if (_this.noAddr){
							uni.navigateBack({
								delta: 2
							})
						} else {
							uni.navigateBack()
						}
					}, 500);
				}).catch(()=>{
					this.loading = false
				})
			},
			onConfirm(e) {
				console.log(e)
				let _this = this
				this.pickerText = e.result
				this.user.oneAdcode = e.obj.province.value
				this.user.twoAdcode = e.obj.city.value
				this.user.threeAdcode = e.obj.area.value
				let addressInfo = e.obj.area
				this.addressInfo = addressInfo
				uni.chooseLocation({
					longitude: addressInfo.centerLng.toString(),
					latitude: addressInfo.centerLat.toString(),
					success(res) {
						console.log(res.name, res.address, res.address.startsWith(e.result), res.address.split(e.result))
						if (res.address.startsWith(e.result)){
							let addrSplit = res.address.split(e.result)
							_this.user.addressDetails = addrSplit[1]
						} else if (res.name === '地图位置' || res.name === res.address){
							_this.user.addressDetails = res.address
						} else {
							_this.user.addressDetails = (res.name || "") + res.address || ""
						}
						_this.user.lng = res.longitude
						_this.user.lat = res.latitude
						_this.$forceUpdate()
					}
				})
			},
			selectDetail(){
				let _this = this
				uni.chooseLocation({
					longitude: _this.addressInfo.centerLng.toString(),
					latitude: _this.addressInfo.centerLat.toString(),
					success(res) {
						if (res.address.startsWith(_this.pickerText)){
							let addrSplit = res.address.split(_this.pickerText)
							_this.user.addressDetails = addrSplit[1]
						} else if (res.name === '地图位置' || res.name === res.address){
							_this.user.addressDetails = res.address
						} else {
							_this.user.addressDetails = res.name + res.address || ""
						}
						_this.user.lng = res.longitude
						_this.user.lat = res.latitude
						_this.$forceUpdate()
					}
				})
			},
			switchBtn(e) {
				this.user.defaultAd = e.detail.value ? 1 : 0
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		font-size: 28upx;
		color: #676769;
		min-height: 100vh;
		padding: 20rpx;
	}
	.wrap{
		padding: 20rpx;
		border-radius: 20rpx;
	}
	.box {
		height: 100upx;
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #EEEEEE;
	}
	.placeholder{
		font-size: 32rpx;
		color: #c3c1c4;
	}
	.box_left {
		width: 25%;
		display: flex;
		align-items: center;
		font-size: 32rpx;
	}
	.box_left_two {
		width: 550upx;
		font-size: 32rpx;
	}
	.box_right {
		// width: 70%;
		display: flex;
		flex-grow: 1;
	}
	.box_right_right {
		width: 70%;
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-grow: 1;
		// padding-left: 3%;
	}
	.box_right_right input {
		width: 87%;
		height: 70upx;
		line-height: 70upx;
	}
	.box_right_right image {
		width: 60upx;
		height: 60upx;
		margin-left: 20rpx;
	}
	.box_right_two {
		width: 160upx;
		text-align: right;
	}
	
	.box_right input {
		width: 97%;
		height: 80upx;
		// padding-left: 3%;
		background-color: #ffffff;
	}
	.btn {
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		color: #ffffff;
		font-size: 32upx;
		margin-top: 120upx;
		border-radius: 50rpx;
	}
	.citybtn {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		overflow: hidden;
	}
</style>
