<template>
	<view class="main">
		<view class="list">
			<view class="list-item">
				<text class="label">分类排序：</text>
				<uni-number-box :min="0" :value="infor.thisSort" @change="numberChange"></uni-number-box>
			</view>
			<view class="list-item">
				<text class="label">分类名称：</text>
				<input type="text" placeholder="请输入分类名称" v-model="infor.name" class="input"/>
			</view>
			<view class="list-item">
				<text class="label">分类状态：</text>
				<picker mode="selector" range-key="name" class="flex-grow" @change="bindPickerChange" :value="pickerIndex" :range="pickerArr">
					<view class="uni-input">{{pickerArr[pickerIndex].name}}</view>
				</picker>
			</view>
			<view class="list-item bor-no cell">
				<text class="name">分类描述：</text>
				<textarea type="text" placeholder="请输入您的分类描述(100字以内)" :maxlength="100" v-model="infor.details" class="flex-grow textarea"/>
			</view>
		</view>
		<view class="grid flex flex-between" @click="uploadImg()">
			<text>分类图片：</text>
			<view class="flex flex-center box">
				<text class="iconfont font60" v-if="!classImg">&#xe64d;</text>
				<image :src="classImg" mode="" class="image" v-else></image>
				<!-- <text class="iconfont color-red del" v-if="classImg" @tap.stop="onDel()">&#xe638;</text> -->
			</view>
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="commit()">确定</button>
		
		<avatar @upload="myUpload" ref="avatar"></avatar>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import upload from "@/common/http/upload.js"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default{
		components: { avatar, uniNumberBox },
		data(){
			return {
				loading: false,
				isEdit: false,
				classImg: "",
				infor: {},
				pickerArr: [
					{name: "正常", value: 1},
					{name: "隐藏", value: 2}
				],
				pickerIndex: 0,
			}
		},
		onLoad(opt){
			if (opt.isEdit) {
				this.isEdit = true
				uni.setNavigationBarTitle({
					title: "编辑分类"
				})
				let detail = uni.getStorageSync("classDetail")
				uni.removeStorageSync("classDetail")
				this.infor = detail
				console.log(this.infor)
				delete this.infor.resourcesList
				this.pickerIndex = detail.status - 1
				this.classImg = detail.mainImage
			}
		},
		methods: {
			commit(){
				this.loading = true
				let path = url.store.addCategory
				if (this.isEdit) path = url.store.updateCategory
				this.$http("POST", path, this.infor).then(res=>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			},
			uploadImg(){
				upload.showAvatarModal(this, 500, 500)
			},
			myUpload(rsp){
				this.classImg = rsp.path
				upload.getOssSignature(rsp.path, 12, 1).then(data=>{
					upload.uploadImageOss(data).then(list=>{
						this.infor.mainImage = JSON.stringify({
							resourceTemporaryUUID: list[0].resourceTemporaryUUID
						})
					})
				})
			},
			bindPickerChange(e){
				this.infor.status = this.pickerArr[e.detail.value].value
			},
			numberChange(e){
				this.infor.thisSort = e
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
				width: 250rpx;
				height: 250rpx;
				border: 2rpx solid #EEEEEE;
				border-radius: 14rpx;
				position: relative;
				.img{
					width: 187rpx;
					height: 187rpx;
				}
				.image{
					width: 100%;
					height: 100%;
				}
				.del{
					position: absolute;
					top: -20rpx;
					right: -20rpx;
					font-size: 40rpx;
				}
			}
			
		}
		.btn{
			margin: 50rpx 0;
			border-radius: 50rpx;
		}
	}
</style>