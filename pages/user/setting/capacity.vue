<template>
	<view class="main">
		<view class="list">
			<text class="item" :class="{'active':alcoholConsumption === item.content}" v-for="(item, i) in labelList" @click="selectLabel(item)">{{item.content}}</text>
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
				labelList: [],
				selectId: "",
				alcoholConsumption: ""
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		onLoad(opt) {
			this.alcoholConsumption = this.userInfo.alcoholConsumption
			if (opt.labels) {
				let labels = JSON.parse(opt.labels)
				let list = []
				labels.forEach(v =>{
					if (v.type === 0) {
						list.push(v)
						if (v.text === this.alcoholConsumption){
							this.selectId = v.id
							return
						}
					}
				})
				this.labelList = list
			}
		},
		methods:{
			onConfirm(){
				this.loading = true
				this.$http("POST", url.user.editUserInfo, {alcoholConsumptionId: this.selectId}).then(res =>{
					this.$msg(res.data)
					this.$navigateBack(1, 500)
				}).catch(()=>{
					this.loading = false
				})
			},
			selectLabel(row){
				this.selectId = row.id
				this.alcoholConsumption = row.content
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 30rpx 0;
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
