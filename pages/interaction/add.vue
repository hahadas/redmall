<template>
	<view class="main">
		<textarea v-model="textarea" placeholder="这一刻的想法..." class="textarea" />
		<view class="list">
			<image :src="item" mode="" class="img" v-for="(item, i) in list" :key="i" @tap="previewImg(item, i)"></image>
			<view class="add" v-if="list.length < 9" @tap="onAdd">
				<text class="iconfont icon">&#xe64d;</text>
			</view>
		</view>
		<view class="position">
			<text class="name">是否显示位置</text>
			<switch :checked="position" @change="switchChange" style="transform:scale(0.9)"/>
		</view>
		
		<button class="btn bg-base" type="primary" :loading="loading" :disabled="loading" @tap="onSave">发表</button>
	</view>
</template>

<script>
	import url from '@/common/http/url.js';
	import publics from "@/common/utils/public.js"
	import upload from "@/common/http/upload.js"
	export default{
		data(){
			return {
				textarea: "",
				position: true,
				list: [],
				showButton: false,
				imgList: [],
				loading: false
			}
		},
		onLoad() {
		},
		methods: {
			switchChange(e) {
				this.position = e.detail.value
			},
			onSave(){
				let that = this
				if (!this.textarea) return this.$msg('输入不能为空');
				this.loading = true
				if (this.list.length > 0) {
					this.imgList = []
					this.list.map(v => {
						upload.oldOssUpload(v, res=>{
							that.imgList.push(res.fileUrl)
							if (that.imgList.length === that.list.length) {
								that.onConfirm(that.imgList)
							}
						})
					})
				} else {
					that.onConfirm()
				}
			},
			async onConfirm(imgList){
				let params = {
					comment: this.textarea,
					addStatus: this.position ? 0 : 1,
					images: imgList ? imgList.join(","): ""
				}
				console.log("-----参数----", params)
				let res = await this.$http('post', url.interaction.addDynamic, params);
				this.loading = false
				let data = res.data
				if (data) {
					this.$msg('发布成功');
					this.list = []
					this.textarea = ""
				}
			},
			onAdd(){
				let _this = this
				uni.chooseImage({
				    count: 9 - _this.list.length, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success: function (res) {
				        _this.list = _this.list.concat(res.tempFilePaths)
				    }
				});
			},
			previewImg(img, index){
				let _this = this
				uni.previewImage({
					urls: _this.list,
					current: index,
					longPressActions: {
						itemList: ['删除'],
						success: function(data) {
							if (data.tapIndex === 0) {
								_this.list.splice(1, index)
								_this.$api.msg('删除成功');
							}
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.main{
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		background-color: white;
		height: 100vh;
		.textarea{
			width: 690rpx;
			height: 200rpx;
			max-height: 400rpx;
		}
		.list{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.img{
				width: 220rpx;
				height: 220rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
			}
			.add{
				background-color: #F8F8F8;
				height: 220rpx;
				width: 220rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon{
					font-size: 48rpx;
				}
			}
		}
		.position{
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 2rpx solid #EEEEEE;
			padding: 20rpx 0;
			.name{
				font-size: 32rpx;
			}
		}
		.btn {
			width: 690rpx;
			margin-top: 50rpx;
		}
	}
</style>
