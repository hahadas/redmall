<template>
	<view>
		<view class="list">
			<view>
				<block v-for="(item, i) in skuList" :key="i">
					<view class="list-item">
						<text class="label">
							商品规格{{i+1}}：
						</text>
						<text class="color-red" @tap="onDel(i)">删除</text>
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-red">*</text>
							名称：
						</text>
						<input type="text" placeholder="必填" v-model="item.skuName" class="flex-grow input">
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-w">*</text>
							编号：
						</text>
						<input type="text" placeholder="选填" v-model="item.skuNumber" class="flex-grow input">
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-red">*</text>
							库存：
						</text>
						<input type="number" placeholder="0" v-model="item.skuStock" class="flex-grow input">
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-red">*</text>
							售价：
						</text>
						<input type="number" placeholder="0" v-model="item.skuPrice" class="flex-grow input">
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-red">*</text>
							状态：
						</text>
						<picker class="flex-grow" mode="selector" range-key="name" :range="statusPicket" @change="statusChange($event, i)">
							<view class="flex flex-align-center flex-space-end color-b9">
								<block v-for="(status, index) in statusPicket" :key="index">
									<text v-if="status.value === item.status">{{status.name}}</text>
								</block>
								<text class="iconfont font40">&#xe770;</text>
							</view>
						</picker>
					</view>
					<view class="list-item">
						<text class="label">
							<text class="color-red">*</text>
							图片：
						</text>
						<view class="flex flex-align-center color-b9" v-if="!item.url && !item.mainImage" @click="selectSkuUrl(i)">
							<text>请选择</text>
							<text class="iconfont font40">&#xe770;</text>
						</view>
						<image :src="item.url || item.mainImage" v-else mode="" class="pic" @tap="showAction(item, i)"></image>
					</view>
				</block>
			</view>
			<view class="list-item bor-no" style="justify-content: center;" @click="onAdd">
				<text class="iconfont color-purple font42">&#xe618;</text>
				<text class="color-purple font32">添加商品规格</text>
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="prev item" @click="prev">上一步，填写商品信息</button>
			<button type="primary" class="bg-base item" @click="next">下一步，填写商品详情</button>
		</view>
		
		<!-- <avatar @upload="myUpload" ref="avatar"></avatar> -->
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import upload from "@/common/http/upload.js"
	// import avatar from "@/components/yq-avatar/yq-avatar.vue";
	export default{
		// components: { avatar },
		props:{
			form: {
				default: {}
			}
		},
		data(){
			return {
				// 商品状态
				statusPicket: [
					{name: "上架", value: 1},
					{name: "下架", value: 2}
				], 
				skuList: [],
				skuIndex: 0,
			}
		},
		methods:{
			onAdd(){
				this.skuList.push({
					status: 1,
					skuName: "",
					skuPrice: "",
					skuStock: "",
					url: ""
				})
			},
			onDel(i){
				this.skuList.splice(i, 1)
			},
			showAction(row, i){
				let _this = this
				uni.showActionSheet({
				    itemList: ['查看图片', '重新选择'],
				    success: function (res) {
				        if (res.tapIndex === 0) {
							_this.viewImg(row)
						} else {
							_this.selectSkuUrl(i)
						}
				    }
				});
			},
			selectSkuUrl(i){
				this.skuIndex = i
				this.$parent.selectImg("two")
				// upload.showAvatarModal(this, 500, 500)
			},
			// myUpload(rsp){
			// 	let _this = this
			// 	uni.getImageInfo({
			// 		src: rsp.path,
			// 		success: function (image) {
			// 			_this.skuList[_this.skuIndex].url = rsp.path
			// 			_this.skuList[_this.skuIndex].ossType = 16
			// 			_this.skuList[_this.skuIndex].ossWidth = image.width
			// 			_this.skuList[_this.skuIndex].ossHeight = image.height
			// 			_this.skuList[_this.skuIndex].skuIndex = _this.skuIndex
			// 			_this.$forceUpdate()
			// 		}
			// 	});
			// },
			viewImg(row){
				let url = row.url || row.mainImage
				uni.previewImage({
					current: url,
					urls: [url]
				});
			},
			selectClass(){
				this.$navigateTo("/pages/merchants/class?select=true")
			},
			statusChange(e, i){
				this.skuList[i].status = this.statusPicket[e.detail.value].value
			},
			prev(){
				this.$emit("prev")
			},
			next(){
				this.$emit("next", this.form)
			}
		}
	}
	
</script>

<style scoped lang="scss">
	.list{
		border-radius: 10rpx;
		background-color: #FFFFFF;
		padding: 0rpx 30rpx;
		&-item{
			border-bottom: 2rpx solid #EEEEEE;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			.label{
				width: 200rpx;
			}
			.input{
				font-size: 34rpx;
			}
			.pic{
				width: 110rpx;
				height: 110rpx;
				border-radius: 10rpx;
			}
		}
		.tips{
			align-items: flex-start;
			flex-direction: column;
			height: auto;
			border: none;
			padding: 36rpx 0;
			.name{
				font-size: 26rpx;
				margin-left: 20rpx;
				line-height: 40rpx;
				color: #999999;
				margin-top: 20rpx;
			}
		}
	}
	.btn{
		margin-top: 80rpx;
		padding-bottom: 50rpx;
		.prev{
			background-color: #c0c1c2;
		}
		.item{
			border-radius: 50rpx;
			width: 80%;
			margin-top: 30rpx;
		}
	}
</style>
