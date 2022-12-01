<template>
	<view class="main">
		<view class="flex flex-between input">
			<input type="text" placeholder="如下棋、看书" :maxlength="6" v-model="txt" />
			<text class="right bg-base" @click="onAdd">添加</text>
		</view>
		<text class="title" v-if="selectList.length > 0">我的兴趣爱好</text>
		<view class="list">
			<text class="item active" v-for="(item, i) in selectList" @click="selectLabel(i, false)">—{{item}}</text>
		</view>
		<text class="title">职业选择</text>
		<view class="list">
			<text class="item" :class="{'active':item.select}" v-for="(item, i) in labelList" @click="selectLabel(i, true)">+{{item.content}}</text>
		</view>
		<button type="primary" class="bg-base btn" :loading="loading" :disabled="loading" @click="onConfirm">确定</button>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import url from "@/common/http/url.js"
	export default{
		data(){
			return{
				loading: false,
				selectList: [],
				labelList: [],
				txt: ""
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		onLoad(opt) {
			let labelHobby = this.userInfo.labelHobby
			if (labelHobby) {
				labelHobby = labelHobby.split("-")
				this.selectList = labelHobby
			}
			if (opt.labels) {
				let labels = JSON.parse(opt.labels)
				let list = []
				labels.forEach((v, i) =>{
					if (v.type === 2) {
						if (labelHobby && labelHobby.includes(v.text)){
							v.select = true
						}
						list.push(v)
					}
					
				})
				this.labelList = list
			}
		},
		methods:{
			onConfirm(){
				this.loading = true
				this.$http("POST", url.user.editUserInfo, {labelHobby: this.selectList.join("-")}).then(res =>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			},
			onAdd(){
				if (!this.txt) return
				this.selectList.unshift(this.txt)
				this.txt = ""
			},
			selectLabel(index, type){
				if (type){
					if (this.labelList[index].select) return
					this.labelList[index].select = true
					this.selectList.unshift(this.labelList[index].content)
				} else {
					if (this.selectList.length === 1) return
					let text = this.selectList[index]
					this.selectList.splice(index, 1)
					this.labelList.forEach((v, i) =>{
						if (v.content === text) {
							this.labelList[i].select = false
						}
					})
				}
				this.$forceUpdate()
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 30rpx 0;
		.input{
			margin: 0 30rpx 30rpx;
			input{
				background-color: #f3f4f5;
				padding: 10rpx;
				font-size: 28rpx;
				height: 70rpx;
				border-radius: 10rpx;
				flex-grow: 1;
			}
			.right{
				padding: 10rpx 30rpx;
				font-size: 30rpx;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 10rpx;
				color: white;
				margin-left: 20rpx;
			}
		}
		.title{
			margin-left: 30rpx;
			margin-bottom: 30rpx;
			display: block;
		}
		.list{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.item{
				border-radius: 50rpx;
				font-size: 26rpx;
				color: #444444;
				background-color: #ebebeb;
				margin-left: 30rpx;
				margin-bottom: 30rpx;
				padding: 20rpx 40rpx;
			}
			.active{
				background-color: rgba($color: #381895, $alpha: .2);
				color: #381895;
			}
		}
		.btn{
			margin: 80rpx 50rpx 50rpx;
			border-radius: 50rpx;
		}
	}
</style>
