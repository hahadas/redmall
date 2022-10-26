<template>
	<view class="main">
		<view class="bor" v-for="(item, i) in list" :key="i">
			<text class="title">{{item.titleName}}</text>
			<view class="cell" v-for="(child, i) in item.children" :key="i" @click="jumpTo(child)">
				<text class="label">{{child.titleName}}</text>
				<text class="iconfont icon">&#xe770;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import url from "@/common/http/url.js";
	export default{
		data(){
			return {
				configType: 1, // 1=酒音/动态，2=聊天举报，3=商品举报
				type: 1, // 1=酒音, 2-动态，3=聊天举报，4=商品举报
				id: "", // 要举报的id
				list: []
			}
		},
		onLoad(opt) {
			if (opt.type) {
				this.type = opt.type
			}
			if (opt.configType) {
				this.configType = opt.configType
			}
			if (opt.id) {
				this.id = opt.id
			}
			this.getList()
		},
		onNavigationBarButtonTap() {
			this.$navigateTo("feedback")
		},
		methods: {
			getList(){
				this.$http("GET", url.report.platformComplaintType, {type: this.configType}).then(res => {
					this.list = res.data
				})
			},
			jumpTo(row){
				let data = {
					type: this.type,
					id: this.id,
					name: row.titleName,
					complaintId: row.id
				}
				this.$navigateTo("add?data="+JSON.stringify(data))
			}
		}
	}
</script>

<style scoped lang="scss">
	.main{
		min-height: 100vh;
		background-color: white;
		padding: 30rpx;
	}
	.bor{
		border-bottom: 2rpx solid #EEEEEE;
		margin-bottom: 30rpx;
	}
	.title{
		font-size: 26rpx;
		color: #999999;
		border-left: 6rpx solid #999999;
		padding-left: 10rpx;
	}
	.cell{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		.label{
			font-size: 30rpx;
		}
		.icon{
			color: #666666;
		}
	}
</style>
