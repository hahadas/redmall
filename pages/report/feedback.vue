<template>
	<view>
		<v-tabs
			v-model="current" 
			:tabs="tabs" 
			field="name" 
			height="90rpx" 
			fontSize="30rpx" 
			:fixed="true" 
			:scroll="false"
			@change="changeTab">
		</v-tabs>
		<view class="list">
			<view class="list-item" v-for="(item, i) in list" :key="i" @tap="goDetails(item)">
				<text class="title">{{item.titleName}}</text>
				<text class="txt">反馈状态：{{item.status === 1 ? '处理中' : '已处理'}}</text>
				<text class="txt">举报时间：{{item.createTime}}</text>
				<text class="txt">举报对象：{{item.complaintTitleName}}</text>
				<text class="txt">举报描述：{{item.complaintDetails}}</text>
				<view class="flex" v-if="item.complaintImageUrls">
					<image 
						:src="img" class="img" 
						mode="aspectFill" v-for="(img, index) in item.complaintImageUrls.split(',')"
						@click="viewImg(item.complaintImageUrls, index)"></image>
				</view>
				<block v-if="item.status === 2">
					<text class="txt">反馈详情：</text>
					<text class="txt">{{item.feedbackDetails}}</text>
					<text class="txt">反馈时间：{{item.feedbackTime}}</text>
				</block>
			</view>
		</view>
		<uni-load-more :status="loading"></uni-load-more>
	</view>
</template>

<script>
	import url from "@/common/http/url.js"
	import vTabs from "@/components/v-tabs/v-tabs.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components: { vTabs, uniLoadMore },
		data(){
			return {
				loading: "loading",
				current: 0,
				tabs: [
					{name: "处理中", status: 1},
					{name: "已处理", status: 2}
				],
				list: [],
				pageSize: 1,
			}
		},
		onLoad() {
			this.getList(false)
		},
		onPullDownRefresh() {
			this.getList(true)
		},
		onReachBottom() {
			this.getList(false)
		},
		methods:{
			getList(type){
				if (type) {
					this.list = []
					this.pageSize = 1
					this.loading = "loading"
				} else {
					if (this.loading === "nomore") return
					this.loading = "loading"
				}
				let params = {
					pageSize: this.pageSize,
					status: this.tabs[this.current].status
				}
				this.$http("GET", url.report.myComplaintList, params).then(res => {
					this.list = this.list.concat(res.data.records)
					if (this.list.length < res.data) {
						this.pageSize++
						this.loading = "more"
					} else {
						this.loading = "nomore"
					}
					uni.stopPullDownRefresh()
				})
			},
			changeTab(e){
				this.current = e
				this.getList(true)
			},
			viewImg(imgs, index) {
				let list = imgs.split(",")
				uni.previewImage({
					current: index,
					urls: list
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		margin: 20rpx;
		&-item{
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			background-color: white;
			display: flex;
			flex-direction: column;
			.title{
				font-size: 40rpx;
				margin-bottom: 20rpx;
			}
			.txt{
				font-size: 28rpx;
				color: #555555;
				margin-bottom: 10rpx;
			}
			.img{
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				margin-right: 20rpx;
			}
			.img:last-child{
				margin-right: 0
			}
		}
	}
</style>
